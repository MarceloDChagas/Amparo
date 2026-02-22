import { apiClient } from "./api-client";

export type NotificationCategory =
  | "ALERT"
  | "SUCCESS"
  | "WARNING"
  | "INFO"
  | "MAINTENANCE";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  category: NotificationCategory;
  targetId: string | null;
  read: boolean;
  createdAt: string;
}

export interface SendNotificationData {
  title: string;
  body: string;
  category?: NotificationCategory;
  targetId?: string | null;
}

export const notificationService = {
  getForUser: (userId: string): Promise<AppNotification[]> =>
    apiClient<AppNotification[]>(`/notifications/user/${userId}`),

  countUnread: (userId: string): Promise<{ count: number }> =>
    apiClient<{ count: number }>(`/notifications/user/${userId}/unread-count`),

  markAllRead: (userId: string): Promise<void> =>
    apiClient<void>(`/notifications/user/${userId}/read-all`, {
      method: "PATCH",
    }),

  send: (data: SendNotificationData): Promise<AppNotification> =>
    apiClient<AppNotification>(`/notifications`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
