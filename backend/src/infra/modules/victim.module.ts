import { Module } from "@nestjs/common";

import { CreateVictimUseCase } from "@/core/use-cases/victim/create-victim.use-case";
import { DeleteVictimUseCase } from "@/core/use-cases/victim/delete-victim.use-case";
import { GetVictimUseCase } from "@/core/use-cases/victim/get-victim.use-case";
import { UpdateVictimUseCase } from "@/core/use-cases/victim/update-victim.use-case";
import { PrismaVictimRepository } from "@/infra/database/repositories/prisma-victim.repository";
import { VictimController } from "@/infra/http/controllers/victim.controller";

@Module({
  controllers: [VictimController],
  providers: [
    CreateVictimUseCase,
    GetVictimUseCase,
    UpdateVictimUseCase,
    DeleteVictimUseCase,
    {
      provide: "IVictimRepository",
      useClass: PrismaVictimRepository,
    },
  ],
  exports: ["IVictimRepository"],
})
export class VictimModule {}
