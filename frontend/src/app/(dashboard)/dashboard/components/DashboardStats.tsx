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
      highlight: false,
    },
    {
      label: "Agressores",
      value: stats.aggressors,
      icon: AlertCircle,
      accent: "var(--destructive)",
      // destaque quando há agressores cadastrados (dado sensível — RN04)
      highlight: stats.aggressors > 0,
    },
    {
      label: "Usuários Ativos",
      value: stats.users,
      icon: Users,
      accent: "var(--chart-2)",
      highlight: false,
    },
    {
      label: "Em Deslocamento",
      value: stats.activeCheckIns,
      icon: MapPin,
      // teal — mesmo token de identidade da tela de deslocamento no app da vítima
      accent: "#0d9488",
      // destaque quando há monitoramento ativo — dado operacional vivo
      highlight: stats.activeCheckIns > 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((stat, i) => (
        <div
          key={i}
          role="status"
          aria-label={`${stat.label}: ${stat.value}`}
          className="p-5 rounded-2xl border flex flex-col justify-between transition-all hover:scale-[1.02] hover:shadow-md bg-card shadow-sm"
          style={{
            borderColor: stat.highlight ? stat.accent : undefined,
            borderLeft: stat.highlight ? `3px solid ${stat.accent}` : undefined,
            boxShadow: stat.highlight
              ? `0 0 0 1px ${stat.accent}40`
              : undefined,
          }}
        >
          <div className="flex justify-between items-start mb-3">
            <div
              className="p-2.5 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${stat.accent}18` }}
            >
              <stat.icon size={20} color={stat.accent} aria-hidden="true" />
            </div>
            {stat.highlight && (
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: `${stat.accent}18`,
                  color: stat.accent,
                }}
              >
                Ativo
              </span>
            )}
          </div>
          <div className="text-3xl font-extrabold mb-0.5 tabular-nums text-foreground">
            {stat.value}
          </div>
          <div className="text-xs font-medium text-muted-foreground">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};
