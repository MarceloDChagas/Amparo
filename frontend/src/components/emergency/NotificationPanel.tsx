"use client";

import { Bell, X } from "lucide-react";

import { AppNotification } from "@/data/services/notification-service";
import { colors } from "@/styles/colors";

interface NotificationPanelProps {
  notifications: AppNotification[] | undefined;
  onClose: () => void;
}

function NotificationItem({ n }: { n: AppNotification }) {
  return (
    <div
      className="px-4 py-3"
      style={{
        backgroundColor: n.read ? "transparent" : colors.overlay.light,
        borderBottom: `1px solid ${colors.functional.border.light}`,
      }}
    >
      <div className="flex items-start gap-2">
        {!n.read && (
          <div
            className="w-2 h-2 rounded-full mt-1.5 shrink-0"
            style={{ backgroundColor: colors.secondary[400] }}
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{n.title}</p>
          <p
            className="text-xs mt-0.5 leading-snug"
            style={{ color: colors.functional.text.secondary }}
          >
            {n.body}
          </p>
          <p
            className="text-xs mt-1"
            style={{ color: colors.functional.text.tertiary }}
          >
            {new Date(n.createdAt).toLocaleString("pt-BR", {
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

export function NotificationPanel({
  notifications,
  onClose,
}: NotificationPanelProps) {
  return (
    <div
      className="absolute right-0 top-10 w-72 rounded-2xl shadow-2xl z-50 overflow-hidden"
      style={{
        backgroundColor: colors.functional.background.secondary,
        border: `1px solid ${colors.functional.border.light}`,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: `1px solid ${colors.functional.border.light}` }}
      >
        <div className="flex items-center gap-2">
          <Bell size={14} color={colors.secondary[300]} />
          <span className="text-white font-semibold text-sm">Notificações</span>
        </div>
        <button onClick={onClose} aria-label="Fechar notificações">
          <X size={16} color={colors.functional.text.tertiary} />
        </button>
      </div>

      {/* List */}
      <div className="max-h-72 overflow-y-auto">
        {!notifications || notifications.length === 0 ? (
          <div className="px-4 py-8 flex flex-col items-center gap-2">
            <Bell size={28} color={colors.functional.text.tertiary} />
            <p
              className="text-sm text-center"
              style={{ color: colors.functional.text.tertiary }}
            >
              Nenhuma notificação
            </p>
          </div>
        ) : (
          notifications.map((n) => <NotificationItem key={n.id} n={n} />)
        )}
      </div>
    </div>
  );
}
