"use client";

import { Bell } from "lucide-react";
import { useState } from "react";

import {
  useMarkAllRead,
  useUnreadCount,
  useUserNotifications,
} from "@/data/hooks/use-notifications";
import { useAuth } from "@/presentation/hooks/useAuth";
import { colors } from "@/styles/colors";

import { NotificationPanel } from "./NotificationPanel";

export function EmergencyHeader() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const { data: unreadData } = useUnreadCount(user?.id);
  const { data: notifications } = useUserNotifications(
    open ? user?.id : undefined,
  );
  const { mutate: markAllRead } = useMarkAllRead();

  const unreadCount = unreadData?.count ?? 0;

  const handleOpen = () => {
    setOpen(true);
    if (user?.id && unreadCount > 0) {
      markAllRead(user.id);
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 relative">
      <h1 className="text-white font-bold text-xl tracking-wider">AMPARO</h1>

      <div className="relative">
        <button
          onClick={open ? () => setOpen(false) : handleOpen}
          className="relative p-1 focus:outline-none"
          aria-label="Notificações"
        >
          <Bell size={24} color="white" />
          {unreadCount > 0 && (
            <div
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                backgroundColor: colors.accent[600],
                color: "white",
              }}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </div>
          )}
        </button>

        {open && (
          <NotificationPanel
            notifications={notifications}
            onClose={() => setOpen(false)}
          />
        )}
      </div>
    </header>
  );
}
