import { Injectable } from "@nestjs/common";

import { AuditLog } from "@/core/domain/entities/audit-log.entity";
import { AuditLoggerPort } from "@/core/domain/ports/audit-logger.port";
import { PrismaService } from "@/infra/database/prisma.service";

@Injectable()
export class PrismaAuditLoggerService implements AuditLoggerPort {
  constructor(private prisma: PrismaService) {}

  async log(auditLog: AuditLog): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call
    await (this.prisma as any).auditLog.create({
      data: {
        userId: auditLog.userId,
        action: auditLog.action,
        resource: auditLog.resource,
        resourceId: auditLog.resourceId,
        ipAddress: auditLog.ipAddress,
        createdAt: auditLog.createdAt,
      },
    });
  }
}
