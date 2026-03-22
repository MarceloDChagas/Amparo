"use client";

import { Bell, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  BottomNavigation,
  EmergencyHeader,
  MainTabType,
} from "@/components/emergency";
import { CATEGORY_CONFIG } from "@/data/constants/notification-config";
import {
  useMarkAllRead,
  useUserNotifications,
} from "@/data/hooks/use-notifications";
import { NotificationCategory } from "@/data/services/notification-service";
import { useAuth } from "@/presentation/hooks/useAuth";

type FilterValue = NotificationCategory | "ALL";

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "ALL", label: "Todas" },
  { value: "ALERT", label: "Alertas" },
  { value: "WARNING", label: "Prevenção" },
  { value: "INFO", label: "Utilidade" },
  { value: "SUCCESS", label: "Sucesso" },
];

export default function UserMessagesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: notifications = [], isLoading } = useUserNotifications(
    user?.id,
  );
  const { mutate: markAllRead } = useMarkAllRead();
  const [activeFilter, setActiveFilter] = useState<FilterValue>("ALL");

  const filtered =
    activeFilter === "ALL"
      ? notifications
      : notifications.filter((n) => n.category === activeFilter);

  useEffect(() => {
    if (user?.id) {
      markAllRead(user.id);
    }
  }, [markAllRead, user?.id]);

  const handleTabChange = (tab: MainTabType) => {
    if (tab === "HOME") {
      router.push("/app");
      return;
    }

    if (tab === "REGISTERS") {
      router.push("/app?tab=REGISTERS");
      return;
    }

    if (tab === "SUPPORT") {
      router.push("/app/contacts");
      return;
    }

    if (tab === "MESSAGES") {
      router.push("/app/messages");
      return;
    }

    router.push("/app/security");
  };

  if (!user) {
    return null;
  }

  return (
    <div
      className="relative flex min-h-screen flex-col overflow-hidden"
      style={{
        backgroundColor: "#f4f7fb",
        backgroundImage:
          "radial-gradient(circle at top left, rgba(36, 75, 122, 0.13), transparent 34%), radial-gradient(circle at 85% 18%, rgba(31, 58, 95, 0.08), transparent 26%), linear-gradient(180deg, #f8fbfd 0%, #eef3f8 100%)",
      }}
    >
      <EmergencyHeader variant="light" />

      <main className="relative flex flex-1 flex-col gap-6 overflow-y-auto px-4 pb-28 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-245 space-y-6">
          <div>
            <h2 className="text-xl font-bold leading-tight sm:text-2xl text-foreground">
              Mensagens
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Acompanhe avisos, orientações e comunicações importantes da sua
              rede de proteção.
            </p>
          </div>

          <div
            className="flex items-start gap-3 rounded-4xl border px-4 py-4 shadow-sm"
            style={{
              backgroundColor: "rgba(255,255,255,0.9)",
              borderColor: "rgba(168, 184, 203, 0.65)",
            }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent">
              <MessageCircle size={18} className="text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              Todas as mensagens desta área ficam registradas para você retomar
              orientações e comunicados quando precisar.
            </p>
          </div>

          {/* Filtros por categoria */}
          <div
            className="flex gap-2 overflow-x-auto pb-1 scrollbar-none"
            role="tablist"
            aria-label="Filtrar mensagens por categoria"
          >
            {FILTERS.map((f) => (
              <button
                key={f.value}
                role="tab"
                aria-selected={activeFilter === f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  activeFilter === f.value
                    ? "bg-foreground text-background"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="rounded-[24px] border border-border p-6 text-sm bg-card shadow-sm text-muted-foreground">
                Carregando mensagens...
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-[24px] border border-border p-8 text-center bg-card shadow-sm">
                <Bell
                  size={24}
                  className="mx-auto mb-3 text-muted-foreground"
                />
                <p className="text-muted-foreground">
                  {activeFilter === "ALL"
                    ? "Nenhuma mensagem por enquanto."
                    : "Nenhuma mensagem nesta categoria."}
                </p>
              </div>
            ) : (
              filtered.map((notification) => {
                const category =
                  CATEGORY_CONFIG[notification.category ?? "INFO"];

                return (
                  <div
                    key={notification.id}
                    className="rounded-[24px] border border-border p-5 bg-card shadow-sm"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span
                        className="rounded-full px-3 py-1 text-xs font-semibold"
                        style={{
                          backgroundColor: category.bg,
                          color: category.color,
                        }}
                      >
                        {category.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleString(
                          "pt-BR",
                        )}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-foreground">
                      {notification.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {notification.body}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      <BottomNavigation
        activeMainTab="MESSAGES"
        onTabChange={handleTabChange}
      />
    </div>
  );
}
