import { Notification } from "@/core/domain/entities/notification.entity";

export interface INotificationRepository {
  create(notification: Notification): Promise<Notification>;
  findForUser(userId: string): Promise<Notification[]>;
  countUnreadForUser(userId: string): Promise<number>;
  markAllReadForUser(userId: string): Promise<void>;
  markReadById(id: string): Promise<void>;
}
