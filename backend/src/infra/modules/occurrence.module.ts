import { Module } from "@nestjs/common";

import { CreateOccurrenceUseCase } from "@/core/use-cases/occurrence/create-occurrence.use-case";
import { GetOccurrenceUseCase } from "@/core/use-cases/occurrence/get-occurrence.use-case";
import { PrismaService } from "@/infra/database/prisma.service";
import { PrismaOccurrenceRepository } from "@/infra/database/repositories/prisma-occurrence.repository";
import { OccurrenceController } from "@/infra/http/controllers/occurrence.controller";

@Module({
  controllers: [OccurrenceController],
  providers: [
    PrismaService,
    CreateOccurrenceUseCase,
    GetOccurrenceUseCase,
    {
      provide: "IOccurrenceRepository",
      useClass: PrismaOccurrenceRepository,
    },
  ],
  exports: [CreateOccurrenceUseCase, GetOccurrenceUseCase],
})
export class OccurrenceModule {}
