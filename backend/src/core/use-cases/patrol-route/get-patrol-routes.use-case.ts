import { Inject, Injectable } from "@nestjs/common";

import type { PatrolRoute } from "@/core/domain/entities/patrol-route.entity";
import type { IPatrolRouteRepository } from "@/core/domain/repositories/patrol-route-repository.interface";

@Injectable()
export class GetPatrolRoutesUseCase {
  constructor(
    @Inject("IPatrolRouteRepository")
    private readonly patrolRouteRepository: IPatrolRouteRepository,
  ) {}

  async execute(): Promise<PatrolRoute[]> {
    return this.patrolRouteRepository.findAll();
  }
}
