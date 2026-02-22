import { Activity, AlertCircle, Users } from "lucide-react";
import React from "react";

import { colors } from "@/styles/colors";

interface DashboardStatsProps {
  stats: {
    occurrences: number;
    aggressors: number;
    victims: number;
  };
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        {
          label: "Ocorrências",
          value: stats.occurrences,
          icon: Activity,
          color: colors.status.info.DEFAULT,
        },
        {
          label: "Agressores",
          value: stats.aggressors,
          icon: AlertCircle,
          color: colors.status.error.DEFAULT,
        },
        {
          label: "Usuários Ativos",
          value: stats.victims,
          icon: Users,
          color: colors.status.success.DEFAULT,
        },
      ].map((stat, i) => (
        <div
          key={i}
          className="p-6 rounded-2xl border flex flex-col justify-between transition-transform hover:scale-[1.02]"
          style={{
            backgroundColor: colors.functional.background.card,
            borderColor: colors.functional.border.light,
            boxShadow: `0 10px 30px ${colors.special.shadow.dark}`,
          }}
        >
          <div className="flex justify-between items-start mb-4">
            <div
              className="p-3 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${stat.color}15` }}
            >
              <stat.icon size={24} color={stat.color} />
            </div>
          </div>
          <div
            className="text-4xl font-extrabold mb-1"
            style={{ color: colors.functional.text.primary }}
          >
            {stat.value}
          </div>
          <div
            className="text-sm font-medium"
            style={{ color: colors.functional.text.secondary }}
          >
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};
