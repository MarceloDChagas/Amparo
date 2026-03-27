import { Inject, Injectable, Logger } from "@nestjs/common";

import { HeatMapCell } from "@/core/domain/entities/heat-map-cell.entity";
import type { IHeatMapRepository } from "@/core/domain/repositories/heat-map-repository.interface";
import type { Occurrence } from "@/core/domain/entities/occurrence.entity";

/**
 * AM-148 / AM-149 — CalculateHeatMap
 *
 * Algoritmo de grade 1km² × 1km²:
 * - Divide o mapa em células de ~0,01° × 0,01° (≈ 1,1 km × 1,1 km no equador).
 * - Para cada célula, soma as incidências e pondera por tipo:
 *   +1,5 se há agressor identificado (violência com autor conhecido é mais grave)
 *   +1,0 caso contrário
 * - riskScore = soma dos pesos de todas as ocorrências na célula.
 */
@Injectable()
export class CalculateHeatMapUseCase {
  private readonly logger = new Logger(CalculateHeatMapUseCase.name);

  constructor(
    @Inject("IHeatMapRepository")
    private readonly heatMapRepository: IHeatMapRepository,
  ) {}

  async execute(occurrences: Occurrence[]): Promise<void> {
    if (occurrences.length === 0) {
      await this.heatMapRepository.replaceAll([]);
      return;
    }

    const cellMap = new Map<string, HeatMapCell>();

    for (const occ of occurrences) {
      if (occ.latitude == null || occ.longitude == null) continue;

      const cellLat = Math.floor(occ.latitude * 100) / 100;
      const cellLng = Math.floor(occ.longitude * 100) / 100;
      const cellKey = `${cellLat.toFixed(2)}_${cellLng.toFixed(2)}`;

      const weight = occ.aggressorId ? 1.5 : 1.0;

      if (cellMap.has(cellKey)) {
        const cell = cellMap.get(cellKey)!;
        cell.intensity += 1;
        cell.riskScore += weight;
        if (occ.createdAt && occ.createdAt > cell.lastOccurrence) {
          cell.lastOccurrence = occ.createdAt;
        }
      } else {
        cellMap.set(
          cellKey,
          new HeatMapCell({
            cellKey,
            latitude: cellLat + 0.005,
            longitude: cellLng + 0.005,
            intensity: 1,
            riskScore: weight,
            lastOccurrence: occ.createdAt ?? new Date(),
          }),
        );
      }
    }

    const cells = Array.from(cellMap.values());
    await this.heatMapRepository.replaceAll(cells);

    this.logger.log(
      `Heat map recalculado: ${cells.length} células a partir de ${occurrences.length} ocorrências`,
    );
  }
}
