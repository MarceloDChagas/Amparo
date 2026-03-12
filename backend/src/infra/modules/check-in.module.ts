import { forwardRef, Module } from "@nestjs/common";

import { CHECK_IN_REPOSITORY } from "@/core/ports/check-in-repository.ports";

import { CheckInValidationService } from "../../core/domain/services/check-in-validation.service";
import { CompleteCheckInUseCase } from "../../core/use-cases/complete-check-in.use-case";
import { GetActiveCheckInUseCase } from "../../core/use-cases/get-active-check-in.use-case";
import { GetAllActiveCheckInsUseCase } from "../../core/use-cases/get-all-active-check-ins.use-case";
import { GetCheckInByIdUseCase } from "../../core/use-cases/get-check-in-by-id.use-case";
import { StartCheckInUseCase } from "../../core/use-cases/start-check-in.use-case";
import { PrismaCheckInRepository } from "../database/repositories/prisma-check-in.repository";
import { CheckInController } from "../http/controllers/check-in.controller";
import { OverdueCheckInCron } from "../services/overdue-check-in.cron";
import { AuditModule } from "./audit.module";
import { DatabaseModule } from "./database.module";
import { EmergencyAlertModule } from "./emergency-alert.module";

@Module({
  imports: [
    DatabaseModule,
    AuditModule,
    forwardRef(() => EmergencyAlertModule),
  ],
  controllers: [CheckInController],
  providers: [
    StartCheckInUseCase,
    CompleteCheckInUseCase,
    GetActiveCheckInUseCase,
    GetAllActiveCheckInsUseCase,
    GetCheckInByIdUseCase,
    CheckInValidationService,
    OverdueCheckInCron,
    {
      provide: CHECK_IN_REPOSITORY,
      useClass: PrismaCheckInRepository,
    },
  ],
})
export class CheckInModule {}
