import { Module } from "@nestjs/common";

import { CreateAggressorUseCase } from "@/core/use-cases/aggressor/create-aggressor.use-case";
import { DeleteAggressorUseCase } from "@/core/use-cases/aggressor/delete-aggressor.use-case";
import { GetAggressorUseCase } from "@/core/use-cases/aggressor/get-aggressor.use-case";
import { UpdateAggressorUseCase } from "@/core/use-cases/aggressor/update-aggressor.use-case";
import { PrismaAggressorRepository } from "@/infra/database/repositories/prisma-aggressor.repository";
import { AggressorController } from "@/infra/http/controllers/aggressor.controller";

@Module({
  controllers: [AggressorController],
  providers: [
    CreateAggressorUseCase,
    GetAggressorUseCase,
    UpdateAggressorUseCase,
    DeleteAggressorUseCase,
    {
      provide: "AggressorRepository",
      useClass: PrismaAggressorRepository,
    },
  ],
})
export class AggressorModule {}
