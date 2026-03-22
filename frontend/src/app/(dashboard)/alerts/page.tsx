"use client";

import { AlertTriangle, CheckCircle2, Clock, Eye, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  EmergencyAlert,
  emergencyAlertService,
} from "@/services/emergency-alert-service";

function StatusBadge({ status }: { status: string }) {
  const s = status.toUpperCase();

  if (s === "ACTIVE" || s === "ATIVO" || s === "PENDING") {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold animate-pulse text-destructive bg-destructive/10"
        style={{
          border:
            "1px solid color-mix(in srgb, var(--destructive) 25%, transparent)",
        }}
        aria-label="Status: Ativo"
      >
        <AlertTriangle size={11} aria-hidden="true" />
        Ativo
      </span>
    );
  }

  if (s === "RESOLVED" || s === "RESOLVIDO" || s === "CLOSED") {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
        style={{
          backgroundColor: "#16a34a18",
          color: "#16a34a",
          border: "1px solid #16a34a40",
        }}
        aria-label="Status: Resolvido"
      >
        <CheckCircle2 size={11} aria-hidden="true" />
        Resolvido
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{
        backgroundColor: "#d9770618",
        color: "#d97706",
        border: "1px solid #d9770640",
      }}
      aria-label="Status: Pendente"
    >
      <Clock size={11} aria-hidden="true" />
      Pendente
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

function isActiveStatus(status: string) {
  const s = status.toUpperCase();
  return s === "ACTIVE" || s === "ATIVO" || s === "PENDING";
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState<string | null>(null);

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
  }, []);

  async function handleResolve(id: string) {
    setResolving(id);
    try {
      const updated = await emergencyAlertService.resolve(id);
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: updated.status } : a)),
      );
    } catch (error) {
      console.error("Falha ao resolver alerta", error);
    } finally {
      setResolving(null);
    }
  }

  const activeCount = alerts.filter((a) => isActiveStatus(a.status)).length;
  const resolvedCount = alerts.length - activeCount;

  return (
    <div className="min-h-screen p-6 md:p-10 bg-background">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Alertas de Emergência
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Acionamentos gerados pelas vítimas via botão de pânico.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Total",
              value: alerts.length,
              accent: "var(--primary)",
              highlight: false,
            },
            {
              label: "Ativos",
              value: activeCount,
              accent: "var(--destructive)",
              highlight: activeCount > 0,
            },
            {
              label: "Resolvidos",
              value: resolvedCount,
              accent: "#16a34a",
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
                style={{ color: s.highlight ? s.accent : "var(--foreground)" }}
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
              Carregando alertas de emergência...
            </div>
          ) : alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-2 text-muted-foreground">
              <CheckCircle2 size={32} style={{ color: "#16a34a" }} />
              <p className="text-sm font-medium">
                Nenhum alerta de emergência registrado.
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
                {alerts.map((alert, i) => {
                  const active = isActiveStatus(alert.status);
                  const isResolving = resolving === alert.id;
                  return (
                    <tr
                      key={alert.id}
                      className="transition-colors hover:bg-muted/30"
                      style={{
                        borderBottom:
                          i < alerts.length - 1
                            ? "1px solid var(--border)"
                            : undefined,
                        backgroundColor: active
                          ? "color-mix(in srgb, var(--destructive) 3%, transparent)"
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
                            {alert.address ||
                              `${alert.latitude.toFixed(4)}, ${alert.longitude.toFixed(4)}`}
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">
                        {relativeTime(alert.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/alerts/${alert.id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all hover:scale-105 text-primary-foreground"
                            style={{
                              backgroundColor: active
                                ? "var(--destructive)"
                                : "var(--primary)",
                            }}
                            aria-label={`Ver alerta de emergência #${alert.id.substring(0, 8)}`}
                          >
                            <Eye size={12} aria-hidden="true" />
                            Ver
                          </Link>
                          {active && (
                            <button
                              onClick={() => void handleResolve(alert.id)}
                              disabled={isResolving}
                              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                              style={{
                                backgroundColor: "#16a34a18",
                                color: "#16a34a",
                                border: "1px solid #16a34a40",
                              }}
                              aria-label={`Marcar alerta #${alert.id.substring(0, 8)} como resolvido`}
                            >
                              <CheckCircle2 size={12} aria-hidden="true" />
                              {isResolving ? "Resolvendo…" : "Resolver"}
                            </button>
                          )}
                        </div>
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
