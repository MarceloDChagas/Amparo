import { Inject, Injectable } from "@nestjs/common";

import { Notification } from "@/core/domain/entities/notification.entity";
import { INotificationRepository } from "@/core/domain/repositories/notification-repository.interface";

interface SendNotificationRequest {
  title: string;
  body: string;
  targetId?: string | null; // null = broadcast to all VICTIM users
}

@Injectable()
export class SendNotificationUseCase {
  constructor(
    @Inject("INotificationRepository")
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(request: SendNotificationRequest): Promise<Notification> {
    const notification = new Notification({
      title: request.title,
      body: request.body,
      targetId: request.targetId ?? null,
    });
    return this.notificationRepository.create(notification);
  }
}
