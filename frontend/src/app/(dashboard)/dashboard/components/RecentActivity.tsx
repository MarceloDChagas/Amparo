"use client";

import {
  AlertTriangle,
  FilePlus,
  FileText,
  MapPin,
  Route,
  Shield,
  Trash2,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { AuditLog, auditLogService } from "@/services/audit-log-service";

interface RecentActivityProps {
  activities?: AuditLog[];
  userNames?: Record<string, string>;
}

// ── Ícone por recurso ────────────────────────────────────────────────────────
const RESOURCE_ICON: Record<string, React.ElementType> = {
  "emergency-alerts": AlertTriangle,
  occurrences: FileText,
  aggressors: Shield,
  "check-ins": MapPin,
  users: UserPlus,
  "patrol-routes": Route,
  notifications: FilePlus,
  documents: FilePlus,
  notes: FilePlus,
};

// ── Cor semântica por recurso ─────────────────────────────────────────────────
const RESOURCE_COLOR: Record<string, string> = {
  "emergency-alerts": "#dc2626",
  occurrences: "#ea580c",
  aggressors: "#b91c1c",
  "check-ins": "#0891b2",
  users: "#2563eb",
  "patrol-routes": "#16a34a",
  "emergency-contacts": "#7c3aed",
  notifications: "#d97706",
  documents: "#64748b",
  notes: "#64748b",
};

// ── Rota de listagem ─────────────────────────────────────────────────────────
const RESOURCE_ROUTES: Record<string, string> = {
  occurrences: "/occurrences",
  users: "/users",
  aggressors: "/aggressors",
  "emergency-alerts": "/alerts",
  "check-ins": "/check-ins",
  notifications: "/notifications",
  "patrol-routes": "/patrol-routes",
};

const DETAIL_ROUTES = new Set(["users", "emergency-alerts", "check-ins"]);

// ── Helpers ──────────────────────────────────────────────────────────────────
function parseResource(resource: string): { segment: string; id?: string } {
  const parts = resource.split("?")[0].split("/").filter(Boolean);
  return { segment: parts[0] ?? resource, id: parts[1] };
}

function buildLink(segment: string, id?: string): string | null {
  const base = RESOURCE_ROUTES[segment];
  if (!base) return null;
  if (id && DETAIL_ROUTES.has(segment)) {
    const detailBase = segment === "emergency-alerts" ? "/alerts" : base;
    return `${detailBase}/${id}`;
  }
  return base;
}

const RESOURCE_LABELS: Record<string, string> = {
  occurrences: "ocorrência",
  users: "usuário",
  aggressors: "agressor",
  "emergency-alerts": "alerta de emergência",
  "emergency-contacts": "contato de emergência",
  "check-ins": "deslocamento",
  notes: "anotação",
  documents: "documento",
  notifications: "notificações",
  "patrol-routes": "rota de patrulha",
};

function describeActivity(action: string, segment: string): string {
  const method = action.toUpperCase();
  // leitura de notificações é o caso mais ruidoso — tratar separadamente
  if (segment === "notifications" && (method === "PATCH" || method === "PUT")) {
    return "Marcou notificações como lidas";
  }
  const label = RESOURCE_LABELS[segment] ?? segment.replace(/-/g, " ");
  if (method === "POST")
    return `${label.charAt(0).toUpperCase() + label.slice(1)} criado(a)`;
  if (method === "DELETE")
    return `${label.charAt(0).toUpperCase() + label.slice(1)} removido(a)`;
  if (method === "PUT" || method === "PATCH")
    return `${label.charAt(0).toUpperCase() + label.slice(1)} atualizado(a)`;
  return label;
}

// Exibe apenas o primeiro nome para economizar espaço
function shortName(full: string): string {
  return full.split(" ")[0];
}

function relativeTime(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "agora";
  if (m < 60) return `${m}min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

// ── Agrupamento de eventos consecutivos idênticos ───────────────────────────
interface GroupedLog {
  representative: AuditLog;
  count: number;
}

function groupConsecutive(logs: AuditLog[]): GroupedLog[] {
  const groups: GroupedLog[] = [];
  for (const log of logs) {
    const { segment } = parseResource(log.resource);
    const prev = groups[groups.length - 1];
    if (
      prev &&
      parseResource(prev.representative.resource).segment === segment &&
      prev.representative.action === log.action &&
      prev.representative.userId === log.userId
    ) {
      prev.count++;
    } else {
      groups.push({ representative: log, count: 1 });
    }
  }
  return groups;
}

// ── Componente ───────────────────────────────────────────────────────────────
export const RecentActivity: React.FC<RecentActivityProps> = ({
  activities = [],
  userNames = {},
}) => {
  const [expanded, setExpanded] = useState(false);
  const [allActivities, setAllActivities] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
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

  const raw = expanded ? allActivities : activities;
  const displayed = groupConsecutive(raw);

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm h-fit">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border">
        <span className="text-sm font-semibold text-foreground">
          Atividade recente
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
        <p className="px-5 py-6 text-sm text-muted-foreground">
          Nenhuma atividade ainda.
        </p>
      ) : (
        <ol
          className={`divide-y divide-border ${expanded ? "max-h-[32rem] overflow-y-auto" : ""}`}
          aria-label="Histórico de atividades"
        >
          {displayed.map(({ representative: activity, count }, i) => {
            const { segment, id } = parseResource(activity.resource);
            const accent = RESOURCE_COLOR[segment] ?? "var(--primary)";
            const href = buildLink(
              segment,
              id ?? activity.resourceId ?? undefined,
            );
            const description = describeActivity(activity.action, segment);
            const userName = activity.userId
              ? (userNames[activity.userId] ?? null)
              : null;
            const time = relativeTime(activity.createdAt);
            const Icon = RESOURCE_ICON[segment] ?? FileText;

            const inner = (
              <div className="flex items-start gap-3 px-5 py-3.5 group">
                {/* Ícone colorido */}
                <div
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${accent}18`, color: accent }}
                  aria-hidden="true"
                >
                  <Icon size={13} />
                </div>

                {/* Texto */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                      {description}
                      {count > 1 && (
                        <span
                          className="ml-1.5 inline-flex items-center rounded-full px-1.5 py-px text-[10px] font-semibold"
                          style={{
                            backgroundColor: `${accent}18`,
                            color: accent,
                          }}
                        >
                          ×{count}
                        </span>
                      )}
                    </p>
                    <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                      {time}
                    </span>
                  </div>
                  {userName && (
                    <p className="mt-0.5 text-xs text-muted-foreground truncate">
                      {shortName(userName)}
                    </p>
                  )}
                </div>
              </div>
            );

            return (
              <li key={activity.id || i}>
                {href ? (
                  <Link
                    href={href}
                    className="block hover:bg-accent/40 transition-colors"
                  >
                    {inner}
                  </Link>
                ) : (
                  <div className="hover:bg-accent/40 transition-colors">
                    {inner}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};
