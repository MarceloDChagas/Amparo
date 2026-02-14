import { Module } from "@nestjs/common";

import { EmergencyAlertRepository } from "@/core/repositories/emergency-alert-repository";

import { CreateEmergencyAlert } from "../../core/use-cases/create-emergency-alert";
import { PrismaService } from "../database/prisma.service";
import { PrismaEmergencyAlertRepository } from "../database/prisma/repositories/prisma-emergency-alert-repository";
import { EmergencyAlertController } from "../http/controllers/emergency-alert.controller";
import { DatabaseModule } from "./database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [EmergencyAlertController],
  providers: [
    PrismaService,
    CreateEmergencyAlert,
    {
      provide: EmergencyAlertRepository,
      useClass: PrismaEmergencyAlertRepository,
    },
  ],
})
export class EmergencyAlertModule {}
