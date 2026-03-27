import { Inject, Injectable, Logger } from "@nestjs/common";

import type { Waypoint } from "@/core/domain/entities/patrol-route.entity";
import type { PatrolRoute } from "@/core/domain/entities/patrol-route.entity";
import type { IHeatMapRepository } from "@/core/domain/repositories/heat-map-repository.interface";
import type { IPatrolRouteRepository } from "@/core/domain/repositories/patrol-route-repository.interface";

interface GeneratePatrolRouteRequest {
  name: string;
  generatedBy: string;
  assignedTo?: string;
  scheduledAt?: Date;
  maxWaypoints?: number;
  /** AM-82 — posição inicial da viatura (opcional) */
  vehicleLatitude?: number;
  vehicleLongitude?: number;
}

/**
 * AM-83 — Coleta e processa dados do mapa de calor
 * AM-85 — Algoritmo de cálculo de rotas baseado em densidade
 * AM-82 — Integra com localização das viaturas (origem opcional)
 * AM-84 — Registra log de geração
 */
@Injectable()
export class GeneratePatrolRouteUseCase {
  private readonly logger = new Logger(GeneratePatrolRouteUseCase.name);
  private static readonly DEFAULT_MAX_WAYPOINTS = 10;

  constructor(
    @Inject("IPatrolRouteRepository")
    private readonly patrolRouteRepository: IPatrolRouteRepository,
    @Inject("IHeatMapRepository")
    private readonly heatMapRepository: IHeatMapRepository,
  ) {}

  async execute(request: GeneratePatrolRouteRequest): Promise<PatrolRoute> {
    const maxWaypoints =
      request.maxWaypoints ?? GeneratePatrolRouteUseCase.DEFAULT_MAX_WAYPOINTS;

    // AM-83 — Coleta os dados do mapa de calor
    const cells = await this.heatMapRepository.findAll();

    if (cells.length === 0) {
      throw new Error(
        "Nenhuma célula de mapa de calor disponível para gerar rota.",
      );
    }

    // AM-85 — Algoritmo: seleciona top N células por riskScore e aplica Nearest Neighbor TSP
    const topCells = [...cells]
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, maxWaypoints);

    const waypoints = this.nearestNeighborRoute(topCells, {
      latitude: request.vehicleLatitude,
      longitude: request.vehicleLongitude,
    });

    this.logger.log(
      `Rota "${request.name}" gerada com ${waypoints.length} waypoints (max riskScore: ${waypoints[0]?.riskScore ?? 0})`,
    );

    // Persiste a rota
    const route = await this.patrolRouteRepository.create({
      name: request.name,
      waypoints,
      generatedBy: request.generatedBy,
      assignedTo: request.assignedTo,
      scheduledAt: request.scheduledAt,
    });

    // AM-84 — Registra log de geração
    await this.patrolRouteRepository.addLog(route.id, "GENERATED", {
      performedBy: request.generatedBy,
      metadata: {
        totalCells: cells.length,
        selectedCells: topCells.length,
        vehicleOrigin:
          request.vehicleLatitude != null
            ? { lat: request.vehicleLatitude, lng: request.vehicleLongitude }
            : null,
        assignedTo: request.assignedTo ?? null,
      },
    });

    if (request.assignedTo) {
      await this.patrolRouteRepository.addLog(route.id, "ASSIGNED", {
        performedBy: request.generatedBy,
        metadata: { agentId: request.assignedTo },
      });
    }

    return route;
  }

  /**
   * AM-85 — Nearest Neighbor (greedy TSP)
   * Ordena os waypoints minimizando a distância total percorrida,
   * partindo da localização da viatura (se informada) ou da célula de maior risco.
   */
  private nearestNeighborRoute(
    cells: { latitude: number; longitude: number; riskScore: number }[],
    origin: { latitude?: number; longitude?: number },
  ): Waypoint[] {
    if (cells.length === 0) return [];

    const unvisited = [...cells];
    const route: Waypoint[] = [];

    // Ponto de partida: posição da viatura (AM-82) ou célula de maior risco
    let currentLat: number;
    let currentLng: number;

    if (origin.latitude != null && origin.longitude != null) {
      currentLat = origin.latitude;
      currentLng = origin.longitude;
    } else {
      // Começa pela célula de maior risco
      const first = unvisited.splice(0, 1)[0];
      route.push({
        order: 1,
        latitude: first.latitude,
        longitude: first.longitude,
        riskScore: first.riskScore,
      });
      currentLat = first.latitude;
      currentLng = first.longitude;
    }

    while (unvisited.length > 0) {
      let nearestIdx = 0;
      let nearestDist = Infinity;

      for (let i = 0; i < unvisited.length; i++) {
        const dist = this.haversineKm(
          currentLat,
          currentLng,
          unvisited[i].latitude,
          unvisited[i].longitude,
        );
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestIdx = i;
        }
      }

      const next = unvisited.splice(nearestIdx, 1)[0];
      route.push({
        order: route.length + 1,
        latitude: next.latitude,
        longitude: next.longitude,
        riskScore: next.riskScore,
      });
      currentLat = next.latitude;
      currentLng = next.longitude;
    }

    return route;
  }

  /** Fórmula de Haversine — distância em km entre dois pontos geográficos */
  private haversineKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
}
