"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

import { AuditLog, auditLogService } from "@/services/audit-log-service";

interface RecentActivityProps {
  activities?: AuditLog[];
  userNames?: Record<string, string>;
}

// Rótulos humanos para cada recurso da API
const RESOURCE_LABELS: Record<string, string> = {
  occurrences: "ocorrência",
  users: "usuário",
  aggressors: "agressor",
  "emergency-alerts": "alerta de emergência",
  "emergency-contacts": "contato de emergência",
  "check-ins": "deslocamento",
  notes: "anotação",
  documents: "documento",
  notifications: "notificação",
  "patrol-routes": "rota de patrulha",
  "safe-locations": "local seguro",
};

// Rota de listagem no dashboard para cada recurso
const RESOURCE_ROUTES: Record<string, string> = {
  occurrences: "/occurrences",
  users: "/users",
  aggressors: "/aggressors",
  "emergency-alerts": "/alerts",
  "check-ins": "/check-ins",
  notifications: "/notifications",
  "patrol-routes": "/patrol-routes",
};

// Recursos com página de detalhe (/rota/[id])
const DETAIL_ROUTES = new Set(["users", "emergency-alerts", "check-ins"]);

// Cor semântica por recurso
function actionAccent(segment: string, action: string): string {
  const byResource: Record<string, string> = {
    "emergency-alerts": "#dc2626",
    occurrences: "#ea580c",
    aggressors: "#b91c1c",
    "emergency-contacts": "#7c3aed",
    "check-ins": "#0891b2",
    users: "#2563eb",
    documents: "#64748b",
    notes: "#64748b",
    notifications: "#d97706",
    "patrol-routes": "#16a34a",
    "safe-locations": "#0d9488",
  };
  if (byResource[segment]) return byResource[segment];
  const a = action.toUpperCase();
  if (a === "DELETE") return "#dc2626";
  if (a === "PUT" || a === "PATCH") return "#d97706";
  return "var(--primary)";
}

// Extrai segmento e id do path da URL (ex: /check-ins/abc → { segment: "check-ins", id: "abc" })
function parseResource(resource: string): { segment: string; id?: string } {
  const path = resource.split("?")[0];
  const parts = path.split("/").filter(Boolean);
  return { segment: parts[0] ?? resource, id: parts[1] };
}

// Monta href para o item (listagem ou detalhe quando disponível)
function buildLink(segment: string, id?: string): string | null {
  const base = RESOURCE_ROUTES[segment];
  if (!base) return null;
  if (id && DETAIL_ROUTES.has(segment)) {
    const detailBase = segment === "emergency-alerts" ? "/alerts" : base;
    return `${detailBase}/${id}`;
  }
  return base;
}

function describeActivity(action: string, segment: string): string {
  const method = action.toUpperCase();
  const label = RESOURCE_LABELS[segment] ?? segment.replace(/-/g, " ");
  if (method === "POST") return `Novo(a) ${label} registrado(a)`;
  if (method === "DELETE") return `${label} removido(a)`;
  if (method === "PUT" || method === "PATCH") return `${label} atualizado(a)`;
  return label;
}

function relativeTime(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "agora";
  if (m < 60) return `há ${m}min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `há ${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `há ${d}d`;
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  activities = [],
  userNames = {},
}) => {
  const [expanded, setExpanded] = useState(false);
  const [allActivities, setAllActivities] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);

  // Força re-render a cada 30s para atualizar os tempos relativos
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  async function handleToggleExpand() {
    if (!expanded) {
      setLoading(true);
      try {
        const more = await auditLogService.getRecent(30);
        setAllActivities(more);
      } finally {
        setLoading(false);
      }
    }
    setExpanded((v) => !v);
  }

  const displayed = expanded ? allActivities : activities;

  return (
    <div className="p-6 rounded-2xl border border-border h-fit bg-card shadow-sm">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Atividade Recente
        </span>
        {activities.length > 0 && (
          <button
            onClick={handleToggleExpand}
            disabled={loading}
            className="text-xs font-medium text-primary hover:underline disabled:opacity-50 transition-opacity"
          >
            {loading ? "Carregando…" : expanded ? "Ver menos" : "Ver todos"}
          </button>
        )}
      </div>

      {activities.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhuma atividade ainda. Ações dos usuários aparecerão aqui em tempo
          real.
        </p>
      ) : (
        <div className={expanded ? "max-h-[30rem] overflow-y-auto pr-1" : ""}>
          <ol className="relative" aria-label="Histórico de atividades">
            {/* Linha vertical da timeline */}
            <div
              aria-hidden="true"
              className="absolute left-[7px] top-2 bottom-2 w-px bg-border"
            />

            {displayed.map((activity, i) => {
              const { segment, id } = parseResource(activity.resource);
              const accent = actionAccent(segment, activity.action);
              const href = buildLink(
                segment,
                id ?? activity.resourceId ?? undefined,
              );
              const description = describeActivity(activity.action, segment);
              const userName = activity.userId
                ? (userNames[activity.userId] ?? null)
                : null;
              const time = relativeTime(activity.createdAt);

              const content = (
                <>
                  <p className="text-sm font-medium truncate text-foreground group-hover:text-primary transition-colors">
                    {description}
                  </p>
                  <p className="text-xs mt-0.5 text-muted-foreground">
                    {userName ? `${userName} · ` : ""}
                    {time}
                  </p>
                </>
              );

              return (
                <li
                  key={activity.id || i}
                  className="flex gap-4 pb-5 last:pb-0 group"
                >
                  {/* Dot colorido */}
                  <div
                    aria-hidden="true"
                    className="relative z-10 mt-1 w-3.5 h-3.5 shrink-0 rounded-full ring-2 ring-white dark:ring-gray-900 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: accent }}
                  />

                  {href ? (
                    <Link href={href} className="flex-1 min-w-0">
                      {content}
                    </Link>
                  ) : (
                    <div className="flex-1 min-w-0">{content}</div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
};
