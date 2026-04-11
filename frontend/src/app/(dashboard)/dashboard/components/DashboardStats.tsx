import { Activity, AlertCircle, MapPin, Users } from "lucide-react";
import React from "react";

interface DashboardStatsProps {
  stats: {
    occurrences: number;
    aggressors: number;
    users: number;
    activeCheckIns: number;
  };
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const cards = [
    {
      label: "Ocorrências",
      value: stats.occurrences,
      icon: Activity,
      accent: "var(--primary)",
      accentRaw: "#244b7a",
      highlight: false,
    },
    {
      label: "Agressores",
      value: stats.aggressors,
      icon: AlertCircle,
      accent: "var(--destructive)",
      accentRaw: "#a63c3c",
      // destaque quando há agressores cadastrados (dado sensível — RN04)
      highlight: stats.aggressors > 0,
    },
    {
      label: "Usuários",
      value: stats.users,
      icon: Users,
      accent: "var(--chart-2)",
      accentRaw: "#64748b",
      highlight: false,
    },
    {
      label: "Em Deslocamento",
      value: stats.activeCheckIns,
      icon: MapPin,
      accent: "#0d9488",
      accentRaw: "#0d9488",
      // destaque quando há monitoramento ativo
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
          className="p-5 rounded-2xl border bg-card shadow-sm flex flex-col gap-3"
          style={{
            borderColor: stat.highlight ? `${stat.accentRaw}50` : undefined,
            borderLeftWidth: stat.highlight ? "3px" : undefined,
            borderLeftColor: stat.highlight ? stat.accentRaw : undefined,
          }}
        >
          {/* Número é o herói — sem icon-box */}
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
        </div>
      ))}
    </div>
  );
};
