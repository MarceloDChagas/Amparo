import { Injectable } from "@nestjs/common";

import { Notification } from "@/core/domain/entities/notification.entity";
import { INotificationRepository } from "@/core/domain/repositories/notification-repository.interface";
import { PrismaService } from "@/infra/database/prisma.service";

@Injectable()
export class PrismaNotificationRepository implements INotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(notification: Notification): Promise<Notification> {
    const created = await this.prisma.notification.create({
      data: {
        title: notification.title,
        body: notification.body,
        targetId: notification.targetId ?? null,
        read: notification.read,
      },
    });
    return new Notification({
      id: created.id,
      title: created.title,
      body: created.body,
      targetId: created.targetId,
      read: created.read,
      createdAt: created.createdAt,
    });
  }

  /**
   * Returns notifications for a specific user:
   * - Targeted specifically at them (targetId = userId)
   * - Broadcast notifications (targetId = null)
   */
  async findForUser(userId: string): Promise<Notification[]> {
    const rows = await this.prisma.notification.findMany({
      where: {
        OR: [{ targetId: userId }, { targetId: null }],
      },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(
      (r) =>
        new Notification({
          id: r.id,
          title: r.title,
          body: r.body,
          targetId: r.targetId,
          read: r.read,
          createdAt: r.createdAt,
        }),
    );
  }

  async countUnreadForUser(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: {
        read: false,
        OR: [{ targetId: userId }, { targetId: null }],
      },
    });
  }

  async markAllReadForUser(userId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: {
        read: false,
        OR: [{ targetId: userId }, { targetId: null }],
      },
      data: { read: true },
    });
  }

  async markReadById(id: string): Promise<void> {
    await this.prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }
}
