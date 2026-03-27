import { Inject, Injectable } from "@nestjs/common";

import type { PatrolRoute } from "@/core/domain/entities/patrol-route.entity";
import type { IPatrolRouteRepository } from "@/core/domain/repositories/patrol-route-repository.interface";
import { PatrolRouteNotFoundError } from "@/core/use-cases/patrol-route/get-patrol-route-by-id.use-case";

interface AssignPatrolRouteRequest {
  id: string;
  agentId: string;
  performedBy: string;
}

/**
 * AM-82 — Integração com sistema de localização das viaturas:
 * associa a rota gerada a uma viatura/agente específico.
 * AM-84 — Registra log de atribuição.
 */
@Injectable()
export class AssignPatrolRouteUseCase {
  constructor(
    @Inject("IPatrolRouteRepository")
    private readonly patrolRouteRepository: IPatrolRouteRepository,
  ) {}

  async execute(request: AssignPatrolRouteRequest): Promise<PatrolRoute> {
    const existing = await this.patrolRouteRepository.findById(request.id);
    if (!existing) throw new PatrolRouteNotFoundError();

    const updated = await this.patrolRouteRepository.assignTo(
      request.id,
      request.agentId,
    );

    // AM-84 — Log de atribuição
    await this.patrolRouteRepository.addLog(request.id, "ASSIGNED", {
      performedBy: request.performedBy,
      metadata: {
        previousAgent: existing.assignedTo ?? null,
        newAgent: request.agentId,
      },
    });

    return updated;
  }
}
