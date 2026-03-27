import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ScheduleModule } from "@nestjs/schedule";

import { AuditLoggerPort } from "@/core/domain/ports/audit-logger.port";
import { AuditInterceptor } from "@/infra/http/interceptors/audit.interceptor";
import { AggressorModule } from "@/infra/modules/aggressor.module";
import { AuditModule } from "@/infra/modules/audit.module";
import { AuthModule } from "@/infra/modules/auth.module";
import { CheckInModule } from "@/infra/modules/check-in.module";
import { DatabaseModule } from "@/infra/modules/database.module";
import { DocumentsModule } from "@/infra/modules/documents.module";
import { EmailModule } from "@/infra/modules/email.module";
import { EmergencyAlertModule } from "@/infra/modules/emergency-alert.module";
import { EmergencyContactModule } from "@/infra/modules/emergency-contact.module";
import { HeatMapModule } from "@/infra/modules/heat-map.module";
import { NotesModule } from "@/infra/modules/notes.module";
import { NotificationModule } from "@/infra/modules/notification.module";
import { OccurrenceModule } from "@/infra/modules/occurrence.module";
import { StorageModule } from "@/infra/modules/storage.module";
import { UserModule } from "@/infra/modules/user.module";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    EmailModule,
    AuthModule,
    AggressorModule,
    UserModule,
    OccurrenceModule,
    EmergencyContactModule,
    EmergencyAlertModule,
    AuditModule,
    NotificationModule,
    CheckInModule,
    NotesModule,
    StorageModule,
    DocumentsModule,
    HeatMapModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useFactory: (auditLogger: AuditLoggerPort) =>
        new AuditInterceptor(auditLogger),
      inject: [AuditLoggerPort],
    },
  ],
})
export class AppModule {}
