import React from "react";

import { AuditLog } from "@/services/audit-log-service";

interface RecentActivityProps {
  activities?: AuditLog[];
}

// Dot color por tipo de ação — verde=criação, vermelho=remoção, amber=edição, azul=leitura
function actionAccent(action: string): string {
  const a = action.toUpperCase();
  if (a.includes("CREATE") || a.includes("POST")) return "#16a34a";
  if (a.includes("DELETE")) return "#dc2626";
  if (a.includes("UPDATE") || a.includes("PUT") || a.includes("PATCH"))
    return "#d97706";
  return "var(--primary)";
}

function relativeTime(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "agora";
  if (m < 60) return `há ${m}min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `há ${h}h`;
  return `há ${Math.floor(h / 24)}d`;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  activities = [],
}) => {
  return (
    <div className="p-6 rounded-2xl border border-border h-fit bg-card shadow-sm">
      <div className="text-sm font-semibold uppercase tracking-wider mb-5 text-muted-foreground">
        Atividade Recente
      </div>

      {activities.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhuma atividade registrada.
        </p>
      ) : (
        <ol className="relative" aria-label="Histórico de atividades">
          {/* linha vertical da timeline */}
          <div
            aria-hidden="true"
            className="absolute left-[7px] top-2 bottom-2 w-px bg-border"
          />

          {activities.map((activity, i) => {
            const accent = actionAccent(activity.action);
            return (
              <li key={activity.id || i} className="flex gap-4 pb-5 last:pb-0">
                {/* dot colorido */}
                <div
                  aria-hidden="true"
                  className="relative z-10 mt-1 w-3.5 h-3.5 shrink-0 rounded-full ring-2 ring-white dark:ring-gray-900"
                  style={{ backgroundColor: accent }}
                />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-foreground">
                    {activity.action}
                    <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                      {activity.resource}
                    </span>
                  </p>
                  <p className="text-xs mt-0.5 text-muted-foreground">
                    {relativeTime(activity.createdAt)}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};
