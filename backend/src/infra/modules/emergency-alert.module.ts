import { Module } from "@nestjs/common";

import { EmergencyAlertRepository } from "@/core/repositories/emergency-alert-repository";
import { PrismaNotificationLogRepository } from "@/infra/database/repositories/prisma-notification-log.repository";

import { CreateEmergencyAlert } from "../../core/use-cases/create-emergency-alert";
import { GetActiveEmergencyAlertUseCase } from "../../core/use-cases/get-active-emergency-alert.use-case";
import { GetEmergencyAlertByIdUseCase } from "../../core/use-cases/get-emergency-alert-by-id.use-case";
import { PrismaService } from "../database/prisma.service";
import { PrismaEmergencyAlertRepository } from "../database/repositories/prisma-emergency-alert.repository";
import { EmergencyAlertController } from "../http/controllers/emergency-alert.controller";
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
    {
      provide: EmergencyAlertRepository,
      useClass: PrismaEmergencyAlertRepository,
    },
    PrismaNotificationLogRepository,
    {
      provide: "INotificationLogRepository",
      useClass: PrismaNotificationLogRepository,
    },
  ],
})
export class EmergencyAlertModule {}
