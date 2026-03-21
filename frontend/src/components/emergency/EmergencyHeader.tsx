"use client";

/**
 * Cabeçalho do app da vítima.
 *
 * NRF09 — Usabilidade Sob Estresse: botão de notificações com min-w/h 44px.
 * NRF10 — Acessibilidade:
 *   - aria-label dinâmico no botão com contagem de não-lidas
 *   - aria-live="polite" no badge para anunciar novos valores
 *   - Badge usa cor + número (nunca só cor)
 */
import { Bell } from "lucide-react";
import { useState } from "react";

import { QuickExitButton } from "@/components/layout/QuickExitButton";
import {
  useMarkAllRead,
  useUnreadCount,
  useUserNotifications,
} from "@/data/hooks/use-notifications";
import { useAuth } from "@/presentation/hooks/useAuth";

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
    <header className="flex items-center justify-between gap-3 px-4 py-3">
      <h1
        className="text-white font-bold text-xl tracking-wider"
        aria-label="Amparo — Aplicativo de proteção"
      >
        AMPARO
      </h1>

      <div className="flex items-center gap-2 ml-auto">
        <QuickExitButton />

        <div className="relative">
          <button
            onClick={open ? () => setOpen(false) : handleOpen}
            // NRF09 — área de toque mínima de 44px
            className="relative flex items-center justify-center min-w-11 min-h-11 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            // NRF10 — label descreve o estado completo do botão
            aria-label={
              unreadCount > 0
                ? `Notificações — ${unreadCount} não lida${unreadCount !== 1 ? "s" : ""}`
                : "Notificações"
            }
            aria-expanded={open}
            aria-haspopup="dialog"
          >
            <Bell size={24} color="white" aria-hidden="true" />

            {unreadCount > 0 && (
              // NRF10 — aria-live anuncia novos badges sem roubar o foco
              <div
                aria-live="polite"
                aria-atomic="true"
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  // var(--primary) no contexto victim = violeta (não vermelho — reservado RF01)
                  backgroundColor: "var(--primary)",
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
      </div>
    </header>
  );
}
