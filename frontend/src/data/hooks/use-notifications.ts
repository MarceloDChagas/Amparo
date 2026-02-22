import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  AppNotification,
  notificationService,
  SendNotificationData,
} from "@/data/services/notification-service";

export function useUserNotifications(userId: string | undefined) {
  return useQuery<AppNotification[]>({
    queryKey: ["notifications", userId],
    queryFn: () => notificationService.getForUser(userId!),
    enabled: !!userId,
    refetchInterval: 30_000, // poll every 30s
  });
}

export function useUnreadCount(userId: string | undefined) {
  return useQuery<{ count: number }>({
    queryKey: ["notifications-unread", userId],
    queryFn: () => notificationService.countUnread(userId!),
    enabled: !!userId,
    refetchInterval: 30_000,
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (userId: string) => notificationService.markAllRead(userId),
    onSuccess: (_data, userId) => {
      void queryClient.invalidateQueries({
        queryKey: ["notifications", userId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["notifications-unread", userId],
      });
    },
  });
}

export function useSendNotification() {
  return useMutation<AppNotification, Error, SendNotificationData>({
    mutationFn: (data) => notificationService.send(data),
  });
}
