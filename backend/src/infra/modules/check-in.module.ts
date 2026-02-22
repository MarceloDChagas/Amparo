import { Module } from "@nestjs/common";

import { CheckInValidationService } from "../../core/domain/services/check-in-validation.service";
import { CompleteCheckInUseCase } from "../../core/use-cases/complete-check-in.use-case";
import { StartCheckInUseCase } from "../../core/use-cases/start-check-in.use-case";
import { CheckInController } from "../http/controllers/check-in.controller";
import { AuditModule } from "./audit.module";
import { DatabaseModule } from "./database.module";

@Module({
  imports: [DatabaseModule, AuditModule],
  controllers: [CheckInController],
  providers: [
    StartCheckInUseCase,
    CompleteCheckInUseCase,
    CheckInValidationService,
  ],
})
export class CheckInModule {}
