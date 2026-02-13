import { Module } from "@nestjs/common";

import { SendEmergencyNotificationUseCase } from "@/core/use-cases/notification/send-emergency-notification.use-case";
import { CreateOccurrenceUseCase } from "@/core/use-cases/occurrence/create-occurrence.use-case";
import { GetOccurrenceUseCase } from "@/core/use-cases/occurrence/get-occurrence.use-case";
import { PrismaOccurrenceRepository } from "@/infra/database/repositories/prisma-occurrence.repository";
import { OccurrenceController } from "@/infra/http/controllers/occurrence.controller";
import { EmailModule } from "@/infra/modules/email.module";
import { EmergencyContactModule } from "@/infra/modules/emergency-contact.module";

@Module({
  imports: [EmailModule, EmergencyContactModule],
  controllers: [OccurrenceController],
  providers: [
    CreateOccurrenceUseCase,
    GetOccurrenceUseCase,
    SendEmergencyNotificationUseCase,
    {
      provide: "IOccurrenceRepository",
      useClass: PrismaOccurrenceRepository,
    },
  ],
  exports: [CreateOccurrenceUseCase, GetOccurrenceUseCase],
})
export class OccurrenceModule {}
