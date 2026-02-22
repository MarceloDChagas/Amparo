import { Inject, Injectable } from "@nestjs/common";

import { Notification } from "@/core/domain/entities/notification.entity";
import { INotificationRepository } from "@/core/domain/repositories/notification-repository.interface";

@Injectable()
export class GetUserNotificationsUseCase {
  constructor(
    @Inject("INotificationRepository")
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(userId: string): Promise<Notification[]> {
    return this.notificationRepository.findForUser(userId);
  }

  async countUnread(userId: string): Promise<number> {
    return this.notificationRepository.countUnreadForUser(userId);
  }

  async markAllRead(userId: string): Promise<void> {
    return this.notificationRepository.markAllReadForUser(userId);
  }
}
