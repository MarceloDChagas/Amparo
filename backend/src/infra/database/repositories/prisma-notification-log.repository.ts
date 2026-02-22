import { Injectable } from "@nestjs/common";

import {
  NotificationLog,
  NotificationStatus,
} from "@/core/domain/entities/notification-log.entity";
import { INotificationLogRepository } from "@/core/domain/repositories/notification-log-repository.interface";
import { PrismaService } from "@/infra/database/prisma.service";

@Injectable()
export class PrismaNotificationLogRepository implements INotificationLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(log: NotificationLog): Promise<NotificationLog> {
    const created = await this.prisma.notificationLog.create({
      data: {
        alertId: log.alertId,
        contactEmail: log.contactEmail ?? null,
        contactName: log.contactName,
        channel: log.channel,
        status: log.status,
        errorMessage: log.errorMessage ?? null,
        attempt: log.attempt,
      },
    });
    return new NotificationLog({
      id: created.id,
      alertId: created.alertId,
      contactEmail: created.contactEmail ?? undefined,
      contactName: created.contactName,
      channel: created.channel as "EMAIL" | "PUSH",
      status: created.status as NotificationStatus,
      errorMessage: created.errorMessage ?? undefined,
      attempt: created.attempt,
      createdAt: created.createdAt,
    });
  }

  async findByAlertId(alertId: string): Promise<NotificationLog[]> {
    const logs = await this.prisma.notificationLog.findMany({
      where: { alertId },
      orderBy: { createdAt: "desc" },
    });
    return logs.map(
      (l) =>
        new NotificationLog({
          id: l.id,
          alertId: l.alertId,
          contactEmail: l.contactEmail ?? undefined,
          contactName: l.contactName,
          channel: l.channel as "EMAIL" | "PUSH",
          status: l.status as NotificationStatus,
          errorMessage: l.errorMessage ?? undefined,
          attempt: l.attempt,
          createdAt: l.createdAt,
        }),
    );
  }

  async findFailedByAlertId(alertId: string): Promise<NotificationLog[]> {
    const logs = await this.prisma.notificationLog.findMany({
      where: { alertId, status: "FAILED" },
      orderBy: { createdAt: "desc" },
    });
    return logs.map(
      (l) =>
        new NotificationLog({
          id: l.id,
          alertId: l.alertId,
          contactEmail: l.contactEmail ?? undefined,
          contactName: l.contactName,
          channel: l.channel as "EMAIL" | "PUSH",
          status: l.status as NotificationStatus,
          errorMessage: l.errorMessage ?? undefined,
          attempt: l.attempt,
          createdAt: l.createdAt,
        }),
    );
  }
}
