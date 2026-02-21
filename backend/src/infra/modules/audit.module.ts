import { Module } from "@nestjs/common";

import { AuditLoggerPort } from "@/core/domain/ports/audit-logger.port";
import { AuditController } from "@/infra/http/controllers/audit.controller";
import { PrismaAuditLoggerService } from "@/infra/services/prisma-audit-logger.service";

import { DatabaseModule } from "./database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [AuditController],
  providers: [
    {
      provide: AuditLoggerPort,
      useClass: PrismaAuditLoggerService,
    },
  ],
  exports: [AuditLoggerPort],
})
export class AuditModule {}
