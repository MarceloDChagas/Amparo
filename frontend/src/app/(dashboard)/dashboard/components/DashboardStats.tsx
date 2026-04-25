// ⑮ — KPIs com delta vs. ontem: numerador sem denominador é perigoso em política pública
import {
  Activity,
  AlertCircle,
  MapPin,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import React from "react";

interface StatsSnapshot {
  occurrences: number;
  aggressors: number;
  users: number;
  activeCheckIns: number;
}

interface DashboardStatsProps {
  stats: StatsSnapshot;
  previous?: StatsSnapshot | null;
}

function Delta({
  current,
  prev,
}: {
  current: number;
  prev: number | undefined;
}) {
  if (prev === undefined) return null;
  const diff = current - prev;
  if (diff === 0)
    return <span className="text-[10px] text-muted-foreground">= ontem</span>;
  const positive = diff > 0;
  const Icon = positive ? TrendingUp : TrendingDown;
  return (
    <span
      className="inline-flex items-center gap-0.5 text-[10px] font-medium"
      style={{ color: positive ? "var(--warning)" : "var(--success)" }}
    >
      <Icon size={10} aria-hidden="true" />
      {positive ? "+" : ""}
      {diff} vs. ontem
    </span>
  );
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  stats,
  previous,
}) => {
  const cards = [
    {
      label: "Ocorrências",
      value: stats.occurrences,
      prev: previous?.occurrences,
      icon: Activity,
      accentRaw: "#244b7a",
      highlight: false,
    },
    {
      label: "Agressores",
      value: stats.aggressors,
      prev: previous?.aggressors,
      icon: AlertCircle,
      accentRaw: "#a63c3c",
      highlight: stats.aggressors > 0,
    },
    {
      label: "Usuários",
      value: stats.users,
      prev: previous?.users,
      icon: Users,
      accentRaw: "#64748b",
      highlight: false,
    },
    {
      label: "Em Deslocamento",
      value: stats.activeCheckIns,
      prev: previous?.activeCheckIns,
      icon: MapPin,
      accentRaw: "#0d9488",
      highlight: stats.activeCheckIns > 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((stat, i) => (
        <div
          key={i}
          role="status"
          aria-label={`${stat.label}: ${stat.value}`}
          className="p-5 rounded-2xl border bg-card shadow-sm flex flex-col gap-2"
          style={{
            borderColor: stat.highlight ? `${stat.accentRaw}50` : undefined,
            borderLeftWidth: stat.highlight ? "3px" : undefined,
            borderLeftColor: stat.highlight ? stat.accentRaw : undefined,
          }}
        >
          <div
            className="text-4xl font-black tabular-nums leading-none"
            style={{
              color: stat.highlight ? stat.accentRaw : "var(--foreground)",
            }}
          >
            {stat.value}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              {stat.label}
            </span>
            <stat.icon
              size={14}
              aria-hidden="true"
              style={{
                color: stat.highlight
                  ? stat.accentRaw
                  : "var(--muted-foreground)",
                opacity: 0.6,
              }}
            />
          </div>

          <Delta current={stat.value} prev={stat.prev} />
        </div>
      ))}
    </div>
  );
};
