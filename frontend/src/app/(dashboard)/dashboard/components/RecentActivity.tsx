import React, { useEffect, useState } from "react";

import { AuditLog } from "@/services/audit-log-service";

interface RecentActivityProps {
  activities?: AuditLog[];
}

// Cor semântica por tipo de recurso — reflete a gravidade/natureza, não o método HTTP
function actionAccent(action: string, resource: string): string {
  const segment = resource.split("/").filter(Boolean)[0] ?? resource;

  const byResource: Record<string, string> = {
    "emergency-alerts": "#dc2626", // vermelho — urgência máxima
    occurrences: "#ea580c", // laranja — situação grave
    aggressors: "#b91c1c", // vermelho escuro — risco
    "emergency-contacts": "#7c3aed", // violeta — rede de apoio
    "check-ins": "#0891b2", // ciano — monitoramento
    users: "#2563eb", // azul — gestão de conta
    documents: "#64748b", // slate — arquivos
    notes: "#64748b", // slate — anotações
    notifications: "#d97706", // âmbar — avisos
  };

  if (byResource[segment]) return byResource[segment];

  // Fallback por método
  const a = action.toUpperCase();
  if (a === "DELETE") return "#dc2626";
  if (a === "PUT" || a === "PATCH") return "#d97706";
  return "var(--primary)";
}

// Traduz método HTTP + resource para uma frase legível ao usuário
function describeActivity(action: string, resource: string): string {
  const method = action.toUpperCase();

  // Extrai o recurso principal do path (ex: /occurrences/123 → ocorrência)
  const segment = resource.split("/").filter(Boolean)[0] ?? resource;
  const labels: Record<string, string> = {
    occurrences: "ocorrência",
    users: "usuário",
    aggressors: "agressor",
    "emergency-alerts": "alerta de emergência",
    "emergency-contacts": "contato de emergência",
    "check-ins": "check-in",
    notes: "anotação",
    documents: "documento",
    notifications: "notificação",
  };
  const label = labels[segment] ?? segment;

  if (method === "POST") return `Novo(a) ${label} registrado(a)`;
  if (method === "DELETE") return `${label} removido(a)`;
  if (method === "PUT" || method === "PATCH") return `${label} atualizado(a)`;
  return `${method} ${label}`;
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
  // Força re-render a cada 30s para atualizar os tempos relativos
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

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
            const accent = actionAccent(activity.action, activity.resource);
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
                    {describeActivity(activity.action, activity.resource)}
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
