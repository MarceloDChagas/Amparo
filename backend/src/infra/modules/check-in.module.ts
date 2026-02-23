import { forwardRef, Module } from "@nestjs/common";

import { CheckInValidationService } from "../../core/domain/services/check-in-validation.service";
import { CompleteCheckInUseCase } from "../../core/use-cases/complete-check-in.use-case";
import { StartCheckInUseCase } from "../../core/use-cases/start-check-in.use-case";
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
    CheckInValidationService,
    OverdueCheckInCron,
  ],
})
export class CheckInModule {}
