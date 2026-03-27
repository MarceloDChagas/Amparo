import { Inject, Injectable } from "@nestjs/common";

import type {
  PatrolRoute,
  PatrolRouteStatus,
} from "@/core/domain/entities/patrol-route.entity";
import type { IPatrolRouteRepository } from "@/core/domain/repositories/patrol-route-repository.interface";
import { PatrolRouteNotFoundError } from "@/core/use-cases/patrol-route/get-patrol-route-by-id.use-case";

interface UpdateStatusRequest {
  id: string;
  status: PatrolRouteStatus;
  performedBy?: string;
}

/**
 * AM-82 — Integra com sistema de viaturas: atualiza status da rota
 * AM-84 — Registra log de atualização
 */
@Injectable()
export class UpdatePatrolRouteStatusUseCase {
  constructor(
    @Inject("IPatrolRouteRepository")
    private readonly patrolRouteRepository: IPatrolRouteRepository,
  ) {}

  async execute(request: UpdateStatusRequest): Promise<PatrolRoute> {
    const existing = await this.patrolRouteRepository.findById(request.id);
    if (!existing) throw new PatrolRouteNotFoundError();

    const now = new Date();
    const data = {
      status: request.status,
      startedAt: request.status === "IN_PROGRESS" ? now : undefined,
      completedAt:
        request.status === "COMPLETED" || request.status === "CANCELLED"
          ? now
          : undefined,
    };

    const updated = await this.patrolRouteRepository.updateStatus(
      request.id,
      data,
    );

    // AM-84 — Log do evento de atualização
    const event =
      request.status === "IN_PROGRESS"
        ? "STARTED"
        : request.status === "COMPLETED"
          ? "COMPLETED"
          : request.status === "CANCELLED"
            ? "CANCELLED"
            : "UPDATED";

    await this.patrolRouteRepository.addLog(request.id, event, {
      performedBy: request.performedBy,
      metadata: { previousStatus: existing.status, newStatus: request.status },
    });

    return updated;
  }
}
