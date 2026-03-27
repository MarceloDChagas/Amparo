import { Inject, Injectable } from "@nestjs/common";

import type { PatrolRoute } from "@/core/domain/entities/patrol-route.entity";
import type { IPatrolRouteRepository } from "@/core/domain/repositories/patrol-route-repository.interface";

export class PatrolRouteNotFoundError extends Error {
  constructor() {
    super("Rota de patrulha não encontrada");
    this.name = "PatrolRouteNotFoundError";
  }
}

@Injectable()
export class GetPatrolRouteByIdUseCase {
  constructor(
    @Inject("IPatrolRouteRepository")
    private readonly patrolRouteRepository: IPatrolRouteRepository,
  ) {}

  async execute(id: string): Promise<PatrolRoute> {
    const route = await this.patrolRouteRepository.findById(id);
    if (!route) throw new PatrolRouteNotFoundError();
    return route;
  }
}
