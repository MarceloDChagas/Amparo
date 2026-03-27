import { Module } from "@nestjs/common";

import { AssignPatrolRouteUseCase } from "@/core/use-cases/patrol-route/assign-patrol-route.use-case";
import { GeneratePatrolRouteUseCase } from "@/core/use-cases/patrol-route/generate-patrol-route.use-case";
import { GetPatrolRouteByIdUseCase } from "@/core/use-cases/patrol-route/get-patrol-route-by-id.use-case";
import { GetPatrolRoutesUseCase } from "@/core/use-cases/patrol-route/get-patrol-routes.use-case";
import { UpdatePatrolRouteStatusUseCase } from "@/core/use-cases/patrol-route/update-patrol-route-status.use-case";
import { PrismaPatrolRouteRepository } from "@/infra/database/repositories/prisma-patrol-route.repository";
import { PatrolRouteController } from "@/infra/http/controllers/patrol-route.controller";

import { DatabaseModule } from "./database.module";
import { HeatMapModule } from "./heat-map.module";

@Module({
  imports: [
    DatabaseModule,
    HeatMapModule, // AM-83: acesso ao IHeatMapRepository via export
  ],
  controllers: [PatrolRouteController],
  providers: [
    GeneratePatrolRouteUseCase,
    GetPatrolRoutesUseCase,
    GetPatrolRouteByIdUseCase,
    UpdatePatrolRouteStatusUseCase,
    AssignPatrolRouteUseCase,
    {
      provide: "IPatrolRouteRepository",
      useClass: PrismaPatrolRouteRepository,
    },
  ],
})
export class PatrolRouteModule {}
