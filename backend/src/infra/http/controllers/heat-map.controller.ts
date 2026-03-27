import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { HeatMapCell } from "@/core/domain/entities/heat-map-cell.entity";
import { Role } from "@/core/domain/enums/role.enum";
import { GetHeatMapUseCase } from "@/core/use-cases/heat-map/get-heat-map.use-case";
import { Roles } from "@/infra/http/decorators/roles.decorator";
import { RolesGuard } from "@/infra/http/guards/roles.guard";

/**
 * AM-151 — GET /heat-map retorna todas as células com riskScore.
 */
@Controller("heat-map")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class HeatMapController {
  constructor(private readonly getHeatMapUseCase: GetHeatMapUseCase) {}

  @Get()
  @Roles(Role.ADMIN)
  async findAll(): Promise<HeatMapCell[]> {
    return this.getHeatMapUseCase.execute();
  }
}
