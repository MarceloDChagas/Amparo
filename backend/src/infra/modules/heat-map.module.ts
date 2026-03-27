import { Module } from "@nestjs/common";

import { CalculateHeatMapUseCase } from "@/core/use-cases/heat-map/calculate-heat-map.use-case";
import { GetHeatMapUseCase } from "@/core/use-cases/heat-map/get-heat-map.use-case";
import { PrismaHeatMapRepository } from "@/infra/database/repositories/prisma-heat-map.repository";
import { HeatMapController } from "@/infra/http/controllers/heat-map.controller";
import { HeatMapRefreshCron } from "@/infra/services/heat-map-refresh.cron";

@Module({
  controllers: [HeatMapController],
  providers: [
    CalculateHeatMapUseCase,
    GetHeatMapUseCase,
    HeatMapRefreshCron,
    {
      provide: "IHeatMapRepository",
      useClass: PrismaHeatMapRepository,
    },
  ],
  exports: [
    CalculateHeatMapUseCase,
    {
      provide: "IHeatMapRepository",
      useClass: PrismaHeatMapRepository,
    },
  ],
})
export class HeatMapModule {}
