"use client";

import { Bell } from "lucide-react";
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
  const { data: notifications = [], isLoading } = useUserNotifications(user?.id);
  const { mutate: markAllRead } = useMarkAllRead();
  const [activeFilter, setActiveFilter] = useState<FilterValue>("ALL");

  const filtered =
    activeFilter === "ALL"
      ? notifications
      : notifications.filter((n) => n.category === activeFilter);

  useEffect(() => {
    if (user?.id) markAllRead(user.id);
  }, [markAllRead, user?.id]);

  const handleTabChange = (tab: MainTabType) => {
    if (tab === "HOME") { router.push("/app"); return; }
    if (tab === "REGISTERS") { router.push("/app?tab=REGISTERS"); return; }
    if (tab === "SUPPORT") { router.push("/app/contacts"); return; }
    if (tab === "MESSAGES") { router.push("/app/messages"); return; }
    router.push("/app/security");
  };

  if (!user) return null;

  return (
    <div
      className="relative flex min-h-screen flex-col overflow-hidden"
      style={{
        backgroundColor: "#f4f7fb",
        backgroundImage:
          "radial-gradient(circle at top left, rgba(36,75,122,0.13), transparent 34%), radial-gradient(circle at 85% 18%, rgba(31,58,95,0.08), transparent 26%), linear-gradient(180deg, #f8fbfd 0%, #eef3f8 100%)",
      }}
    >
      <EmergencyHeader variant="light" />

      <main className="relative flex flex-1 flex-col gap-6 overflow-y-auto px-4 pb-28 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-245 space-y-6">
          <div>
            <h2
              className="text-xl font-bold leading-tight sm:text-2xl"
              style={{ color: "#1f2937" }}
            >
              Mensagens
            </h2>
            <p className="mt-1 text-sm" style={{ color: "#6b7280" }}>
              Avisos e comunicações da sua rede de apoio.
            </p>
          </div>

          {/* Filtros por categoria */}
          <div
            className="flex gap-2 overflow-x-auto pb-1"
            role="tablist"
            aria-label="Filtrar mensagens por categoria"
          >
            {FILTERS.map((f) => (
              <button
                key={f.value}
                role="tab"
                aria-selected={activeFilter === f.value}
                onClick={() => setActiveFilter(f.value)}
                className="shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors"
                style={
                  activeFilter === f.value
                    ? { backgroundColor: "#1f2937", color: "#f8fbfd" }
                    : {
                        backgroundColor: "#ffffff",
                        border: "1px solid #d8e1ea",
                        color: "#6b7280",
                      }
                }
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div
                className="rounded-[24px] border p-6 text-sm"
                style={{
                  borderColor: "#d8e1ea",
                  backgroundColor: "#ffffff",
                  color: "#6b7280",
                }}
              >
                Carregando mensagens...
              </div>
            ) : filtered.length === 0 ? (
              <div
                className="rounded-[24px] border p-8 text-center"
                style={{ borderColor: "#d8e1ea", backgroundColor: "#ffffff" }}
              >
                <Bell
                  size={24}
                  className="mx-auto mb-3"
                  style={{ color: "#9ca3af" }}
                />
                <p
                  className="text-sm font-medium"
                  style={{ color: "#6b7280" }}
                >
                  {activeFilter === "ALL"
                    ? "Nenhuma mensagem ainda"
                    : "Nenhuma mensagem nesta categoria"}
                </p>
                {activeFilter === "ALL" && (
                  <p className="text-xs mt-1" style={{ color: "#9ca3af" }}>
                    Avisos da sua rede de apoio aparecerão aqui.
                  </p>
                )}
              </div>
            ) : (
              filtered.map((notification) => {
                const category =
                  CATEGORY_CONFIG[notification.category ?? "INFO"];
                return (
                  <div
                    key={notification.id}
                    className="rounded-[24px] border p-5"
                    style={{
                      borderColor: "#d8e1ea",
                      backgroundColor: "#ffffff",
                      boxShadow: "0 2px 8px rgba(15,23,42,0.05)",
                    }}
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
                      <span className="text-xs" style={{ color: "#9ca3af" }}>
                        {new Date(notification.createdAt).toLocaleString("pt-BR")}
                      </span>
                    </div>
                    <h3
                      className="text-base font-semibold"
                      style={{ color: "#1f2937" }}
                    >
                      {notification.title}
                    </h3>
                    <p className="mt-2 text-sm" style={{ color: "#6b7280" }}>
                      {notification.body}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      <BottomNavigation activeMainTab="MESSAGES" onTabChange={handleTabChange} />
    </div>
  );
}
