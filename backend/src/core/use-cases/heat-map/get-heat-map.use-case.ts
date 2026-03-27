import { Inject, Injectable } from "@nestjs/common";

import { HeatMapCell } from "@/core/domain/entities/heat-map-cell.entity";
import type { IHeatMapRepository } from "@/core/domain/repositories/heat-map-repository.interface";

/**
 * AM-151 — Retorna células do heat map com riskScore para o frontend.
 */
@Injectable()
export class GetHeatMapUseCase {
  constructor(
    @Inject("IHeatMapRepository")
    private readonly heatMapRepository: IHeatMapRepository,
  ) {}

  async execute(): Promise<HeatMapCell[]> {
    return this.heatMapRepository.findAll();
  }
}
