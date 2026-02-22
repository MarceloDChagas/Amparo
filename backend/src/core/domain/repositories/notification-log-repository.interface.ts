import { NotificationLog } from "@/core/domain/entities/notification-log.entity";

export interface INotificationLogRepository {
  create(log: NotificationLog): Promise<NotificationLog>;
  findByAlertId(alertId: string): Promise<NotificationLog[]>;
  findFailedByAlertId(alertId: string): Promise<NotificationLog[]>;
}
