import { Module } from "@nestjs/common";

import { AlertEventRepository } from "@/core/repositories/alert-event-repository";
import { EmergencyAlertRepository } from "@/core/repositories/emergency-alert-repository";
import { CreateEmergencyAlert } from "@/core/use-cases/create-emergency-alert";
import { GetActiveEmergencyAlertUseCase } from "@/core/use-cases/get-active-emergency-alert.use-case";
import { GetAlertHistoryUseCase } from "@/core/use-cases/get-alert-history.use-case";
import { GetEmergencyAlertByIdUseCase } from "@/core/use-cases/get-emergency-alert-by-id.use-case";
import { RecordAlertEventUseCase } from "@/core/use-cases/record-alert-event.use-case";
import { PrismaService } from "@/infra/database/prisma.service";
import { PrismaAlertEventRepository } from "@/infra/database/repositories/prisma-alert-event.repository";
import { PrismaEmergencyAlertRepository } from "@/infra/database/repositories/prisma-emergency-alert.repository";
import { PrismaNotificationLogRepository } from "@/infra/database/repositories/prisma-notification-log.repository";
import { EmergencyAlertController } from "@/infra/http/controllers/emergency-alert.controller";

import { DatabaseModule } from "./database.module";
import { EmailModule } from "./email.module";
import { EmergencyContactModule } from "./emergency-contact.module";
import { UserModule } from "./user.module";

@Module({
  imports: [DatabaseModule, EmailModule, EmergencyContactModule, UserModule],
  controllers: [EmergencyAlertController],
  providers: [
    PrismaService,
    CreateEmergencyAlert,
    GetActiveEmergencyAlertUseCase,
    GetEmergencyAlertByIdUseCase,
    RecordAlertEventUseCase,
    GetAlertHistoryUseCase,
    {
      provide: EmergencyAlertRepository,
      useClass: PrismaEmergencyAlertRepository,
    },
    {
      provide: AlertEventRepository,
      useClass: PrismaAlertEventRepository,
    },
    PrismaNotificationLogRepository,
    {
      provide: "INotificationLogRepository",
      useClass: PrismaNotificationLogRepository,
    },
  ],
  exports: [CreateEmergencyAlert],
})
export class EmergencyAlertModule {}
