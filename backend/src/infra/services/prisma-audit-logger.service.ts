import { Injectable, Logger } from "@nestjs/common";

import { AuditLog } from "@/core/domain/entities/audit-log.entity";
import { AuditLoggerPort } from "@/core/domain/ports/audit-logger.port";
import { PrismaService } from "@/infra/database/prisma.service";

@Injectable()
export class PrismaAuditLoggerService implements AuditLoggerPort {
  private readonly logger = new Logger(PrismaAuditLoggerService.name);

  constructor(private prisma: PrismaService) {}

  async log(auditLog: AuditLog): Promise<void> {
    this.logger.debug(
      `Salvando audit log: ${auditLog.action} ${auditLog.resource}`,
    );
    await this.prisma.auditLog.create({
      data: {
        userId: auditLog.userId,
        action: auditLog.action,
        resource: auditLog.resource,
        resourceId: auditLog.resourceId,
        ipAddress: auditLog.ipAddress,
        createdAt: auditLog.createdAt,
      },
    });
    this.logger.debug("Audit log salvo com sucesso.");
  }
}
