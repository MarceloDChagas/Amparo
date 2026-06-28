"use client";

import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  Clock,
  Eye,
  MapPin,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { usePersistedFilters } from "@/hooks/use-persisted-filters";
import {
  AlertStatusType,
  EmergencyAlert,
  emergencyAlertService,
} from "@/services/emergency-alert-service";

function StatusBadge({ status }: { status: AlertStatusType }) {
  const s = status.toUpperCase() as AlertStatusType;

  const config: Record<
    string,
    {
      label: string;
      icon: React.ReactNode;
      bg: string;
      color: string;
      border: string;
      pulse?: boolean;
    }
  > = {
    PENDING: {
      label: "Recebido",
      icon: <Clock size={11} aria-hidden="true" />,
      bg: "#d9770618",
      color: "#d97706",
      border: "#d9770640",
      pulse: true,
    },
    DISPATCHED: {
      label: "Viatura Despachada",
      icon: <Truck size={11} aria-hidden="true" />,
      bg: "#2563eb18",
      color: "#2563eb",
      border: "#2563eb40",
      pulse: true,
    },
    COMPLETED: {
      label: "Concluído",
      icon: <CheckCircle2 size={11} aria-hidden="true" />,
      bg: "#16a34a18",
      color: "#16a34a",
      border: "#16a34a40",
    },
    CANCELLED: {
      label: "Cancelado",
      icon: <Ban size={11} aria-hidden="true" />,
      bg: "var(--muted)",
      color: "var(--muted-foreground)",
      border: "var(--border)",
    },
    ACTIVE: {
      label: "Ativo",
      icon: <AlertTriangle size={11} aria-hidden="true" />,
      bg: "color-mix(in srgb, var(--destructive) 12%, transparent)",
      color: "var(--destructive)",
      border: "color-mix(in srgb, var(--destructive) 35%, transparent)",
      pulse: true,
    },
    RESOLVED: {
      label: "Resolvido",
      icon: <CheckCircle2 size={11} aria-hidden="true" />,
      bg: "#16a34a18",
      color: "#16a34a",
      border: "#16a34a40",
    },
  };

  const c = config[s] ?? config.PENDING;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${c.pulse ? "animate-pulse" : ""}`}
      style={{
        backgroundColor: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
      }}
      aria-label={`Status: ${c.label}`}
    >
      {c.icon}
      {c.label}
    </span>
  );
}

function relativeTime(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "agora";
  if (m < 60) return `há ${m}min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `há ${h}h`;
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [loading, setLoading] = useState(true);
  // ⑰ — filtros persistidos: plantão não refaz filtro a cada login
  const { filters, setFilters } = usePersistedFilters("amparo:filters:alerts", {
    period: "24h",
    status: "all",
  });

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const result = await emergencyAlertService.getAll();
        setAlerts(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    void loadAlerts();
    // Poll so newly triggered alerts appear without a manual reload.
    const interval = setInterval(() => void loadAlerts(), 10_000);
    return () => clearInterval(interval);
  }, []);

  const filteredAlerts = useMemo(() => {
    const now = Date.now();
    const cutoff =
      filters.period === "24h"
        ? now - 24 * 60 * 60 * 1000
        : filters.period === "7d"
          ? now - 7 * 24 * 60 * 60 * 1000
          : 0;

    return alerts.filter((a) => {
      const withinPeriod =
        cutoff === 0 || new Date(a.createdAt ?? "").getTime() >= cutoff;
      const matchStatus =
        filters.status === "all" ||
        a.status.toUpperCase() === filters.status.toUpperCase();
      return withinPeriod && matchStatus;
    });
  }, [alerts, filters]);

  const counts = filteredAlerts.reduce(
    (acc, a) => {
      const s = a.status.toUpperCase();
      if (s === "PENDING") acc.pending++;
      else if (s === "DISPATCHED") acc.dispatched++;
      else if (s === "COMPLETED") acc.completed++;
      else if (s === "CANCELLED") acc.cancelled++;
      return acc;
    },
    { pending: 0, dispatched: 0, completed: 0, cancelled: 0 },
  );

  const activeCount = counts.pending + counts.dispatched;

  const periodOptions = [
    { value: "24h", label: "Últimas 24h" },
    { value: "7d", label: "7 dias" },
    { value: "all", label: "Todos" },
  ] as const;

  const statusOptions = [
    { value: "all", label: "Qualquer status" },
    { value: "PENDING", label: "Recebido" },
    { value: "DISPATCHED", label: "Em atendimento" },
    { value: "COMPLETED", label: "Concluído" },
    { value: "CANCELLED", label: "Cancelado" },
  ] as const;

  return (
    <div className="min-h-screen p-6 md:p-10 bg-background">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ⑰ — Filtros persistidos como pílulas */}
        <div className="flex flex-wrap items-center gap-2">
          {periodOptions.map((o) => (
            <button
              key={o.value}
              onClick={() => setFilters({ period: o.value })}
              className="rounded-full border px-3 py-1 text-xs font-medium transition-colors"
              style={{
                borderColor:
                  filters.period === o.value
                    ? "var(--primary)"
                    : "var(--border)",
                backgroundColor:
                  filters.period === o.value ? "var(--primary)" : "transparent",
                color:
                  filters.period === o.value
                    ? "white"
                    : "var(--muted-foreground)",
              }}
            >
              {o.label}
            </button>
          ))}
          <span className="mx-1 h-4 w-px bg-border" />
          {statusOptions.map((o) => (
            <button
              key={o.value}
              onClick={() => setFilters({ status: o.value })}
              className="rounded-full border px-3 py-1 text-xs font-medium transition-colors"
              style={{
                borderColor:
                  filters.status === o.value
                    ? "var(--primary)"
                    : "var(--border)",
                backgroundColor:
                  filters.status === o.value ? "var(--primary)" : "transparent",
                color:
                  filters.status === o.value
                    ? "white"
                    : "var(--muted-foreground)",
              }}
            >
              {o.label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Recebidos",
              value: counts.pending,
              accent: "#d97706",
              highlight: counts.pending > 0,
            },
            {
              label: "Em atendimento",
              value: counts.dispatched,
              accent: "#2563eb",
              highlight: counts.dispatched > 0,
            },
            {
              label: "Concluídos",
              value: counts.completed,
              accent: "#16a34a",
              highlight: false,
            },
            {
              label: "Cancelados",
              value: counts.cancelled,
              accent: "var(--muted-foreground)",
              highlight: false,
            },
          ].map((s, i) => (
            <div
              key={i}
              role="status"
              aria-label={`${s.label}: ${s.value}`}
              className="p-4 rounded-xl border flex items-center gap-4 bg-card shadow-sm"
              style={{
                borderColor: s.highlight ? s.accent : undefined,
                borderLeft: s.highlight ? `3px solid ${s.accent}` : undefined,
              }}
            >
              <span
                className="text-2xl font-extrabold tabular-nums"
                style={{
                  color: s.highlight ? s.accent : "var(--foreground)",
                }}
              >
                {loading ? "—" : s.value}
              </span>
              <span className="text-sm text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Tabela */}
        <div className="rounded-2xl border border-border overflow-hidden bg-card shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-sm animate-pulse text-muted-foreground">
              Carregando alertas...
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-2 text-muted-foreground">
              <CheckCircle2 size={32} style={{ color: "#16a34a" }} />
              <p className="text-sm font-medium">
                Nenhum alerta com este filtro.
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary border-b border-border">
                  {["Status", "ID", "Usuário", "Endereço", "Quando", ""].map(
                    (h) => (
                      <th
                        key={h}
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.map((alert, i) => {
                  const s = alert.status.toUpperCase();
                  const isActive = s === "PENDING" || s === "DISPATCHED";
                  return (
                    <tr
                      key={alert.id}
                      className="transition-colors hover:bg-muted/30"
                      style={{
                        borderBottom:
                          i < filteredAlerts.length - 1
                            ? "1px solid var(--border)"
                            : undefined,
                        backgroundColor: isActive
                          ? s === "DISPATCHED"
                            ? "color-mix(in srgb, #2563eb 3%, transparent)"
                            : "color-mix(in srgb, var(--destructive) 3%, transparent)"
                          : undefined,
                      }}
                    >
                      <td className="px-4 py-3">
                        <StatusBadge status={alert.status} />
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        #{alert.id.substring(0, 8)}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {alert.userId
                          ? `#${alert.userId.substring(0, 8)}`
                          : "—"}
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <span className="flex items-center gap-1.5 truncate text-muted-foreground">
                          <MapPin
                            size={12}
                            aria-hidden="true"
                            className="text-muted-foreground shrink-0"
                          />
                          <span className="truncate">
                            {(() => {
                              const isRealAddr =
                                alert.address?.trim() &&
                                !alert.address.startsWith("ALERTA");
                              if (isRealAddr) return alert.address;
                              if (alert.latitude !== 0 || alert.longitude !== 0)
                                return `${alert.latitude.toFixed(4)}, ${alert.longitude.toFixed(4)}`;
                              return "Localização não capturada";
                            })()}
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">
                        {relativeTime(alert.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/alerts/${alert.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all hover:scale-105 text-primary-foreground"
                          style={{
                            backgroundColor: isActive
                              ? s === "DISPATCHED"
                                ? "#2563eb"
                                : "var(--destructive)"
                              : "var(--primary)",
                          }}
                          aria-label={`Ver detalhes do alerta #${alert.id.substring(0, 8)}`}
                        >
                          <Eye size={12} aria-hidden="true" />
                          Ver
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
