import { forwardRef, Module } from "@nestjs/common";

import { CheckInValidationService } from "@/core/domain/services/check-in-validation.service";
import { CHECK_IN_REPOSITORY } from "@/core/ports/check-in-repository.ports";
import { CloseCheckInUseCase } from "@/core/use-cases/close-check-in.use-case";
import { CompleteCheckInUseCase } from "@/core/use-cases/complete-check-in.use-case";
import { ConfirmCheckInArrivalUseCase } from "@/core/use-cases/confirm-check-in-arrival.use-case";
import { DefineCheckInSafeLocationUseCase } from "@/core/use-cases/define-check-in-safe-location.use-case";
import { EscalateCheckInUseCase } from "@/core/use-cases/escalate-check-in.use-case";
import { GetActiveCheckInUseCase } from "@/core/use-cases/get-active-check-in.use-case";
import { GetAllActiveCheckInsUseCase } from "@/core/use-cases/get-all-active-check-ins.use-case";
import { GetCheckInByIdUseCase } from "@/core/use-cases/get-check-in-by-id.use-case";
import { GetCheckInSchedulesUseCase } from "@/core/use-cases/get-check-in-schedules.use-case";
import { GetLateCheckInsUseCase } from "@/core/use-cases/get-late-check-ins.use-case";
import { MonitorCheckInUseCase } from "@/core/use-cases/monitor-check-in.use-case";
import { PurgeLocationDataUseCase } from "@/core/use-cases/purge-location-data.use-case";
import { StartCheckInUseCase } from "@/core/use-cases/start-check-in.use-case";
import { PrismaCheckInRepository } from "@/infra/database/repositories/prisma-check-in.repository";
import { PrismaCheckInScheduleRepository } from "@/infra/database/repositories/prisma-check-in-schedule.repository";
import { CheckInController } from "@/infra/http/controllers/check-in.controller";
import { LocationDataRetentionCron } from "@/infra/services/location-data-retention.cron";
import { MonitorCheckInCron } from "@/infra/services/monitor-check-in.cron";
import { OverdueCheckInCron } from "@/infra/services/overdue-check-in.cron";

import { AuditModule } from "./audit.module";
import { DatabaseModule } from "./database.module";
import { EmailModule } from "./email.module";
import { EmergencyAlertModule } from "./emergency-alert.module";
import { EmergencyContactModule } from "./emergency-contact.module";
import { NotificationModule } from "./notification.module";

@Module({
  imports: [
    DatabaseModule,
    AuditModule,
    EmailModule,
    NotificationModule,
    EmergencyContactModule,
    forwardRef(() => EmergencyAlertModule),
  ],
  controllers: [CheckInController],
  providers: [
    // Check-in manual (existente)
    StartCheckInUseCase,
    CompleteCheckInUseCase,
    GetActiveCheckInUseCase,
    GetAllActiveCheckInsUseCase,
    GetCheckInByIdUseCase,
    GetLateCheckInsUseCase,
    CloseCheckInUseCase,
    EscalateCheckInUseCase,
    CheckInValidationService,
    OverdueCheckInCron,
    {
      provide: CHECK_IN_REPOSITORY,
      useClass: PrismaCheckInRepository,
    },
    // AM-154 — Check-in Inteligente
    DefineCheckInSafeLocationUseCase,
    GetCheckInSchedulesUseCase,
    ConfirmCheckInArrivalUseCase,
    MonitorCheckInUseCase,
    MonitorCheckInCron,
    // RN10 — Retenção de Dados de Localização
    PurgeLocationDataUseCase,
    LocationDataRetentionCron,
    {
      provide: "ICheckInScheduleRepository",
      useClass: PrismaCheckInScheduleRepository,
    },
  ],
})
export class CheckInModule {}
