import { Activity, AlertCircle, ShieldAlert, Users } from "lucide-react";
import React from "react";

import { colors } from "@/styles/colors";

export const DashboardMockup: React.FC = () => {
  return (
    <div
      className="relative rounded-3xl overflow-hidden border transform transition-transform duration-700 hover:rotate-0 hover:scale-[1.02] shadow-2xl"
      style={{
        backgroundColor: `${colors.functional.background.card}cc`,
        borderColor: colors.functional.border.light,
        transform: "rotateY(-10deg) rotateX(5deg)",
        transformStyle: "preserve-3d",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Mockup Header/Toolbar */}
      <div
        className="h-12 border-b flex items-center px-4 gap-2"
        style={{
          borderColor: colors.functional.border.dark,
          backgroundColor: "rgba(0,0,0,0.2)",
        }}
      >
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <div
          className="mx-auto text-xs font-semibold px-4 py-1 rounded-full"
          style={{
            backgroundColor: colors.functional.background.tertiary,
            color: colors.functional.text.tertiary,
          }}
        >
          amparo.gov.br / dashboard
        </div>
      </div>

      {/* Mockup Body */}
      <div className="p-6 grid gap-4">
        {/* Top Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Casos Ativos",
              value: "142",
              icon: Activity,
              color: colors.status.info.DEFAULT,
            },
            {
              label: "Alertas Hoje",
              value: "3",
              icon: AlertCircle,
              color: colors.status.error.DEFAULT,
            },
            {
              label: "Rede",
              value: "89",
              icon: Users,
              color: colors.status.success.DEFAULT,
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border flex flex-col justify-between"
              style={{
                backgroundColor: colors.functional.background.tertiary,
                borderColor: colors.functional.border.dark,
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <stat.icon size={18} color={stat.color} />
              </div>
              <div
                className="text-2xl font-bold"
                style={{ color: colors.functional.text.primary }}
              >
                {stat.value}
              </div>
              <div
                className="text-xs"
                style={{ color: colors.functional.text.tertiary }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Main Action Area Alert */}
        <div
          className="p-4 rounded-xl border flex items-center justify-between"
          style={{
            backgroundColor: `${colors.status.error.dark}22`,
            borderColor: `${colors.status.error.DEFAULT}66`,
          }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-red-500/20 text-red-400">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h4 className="font-bold text-red-400 text-sm">
                Alerta de Proximidade
              </h4>
              <p className="text-xs text-red-200/70">
                Violação de perímetro detectada na Zona Sul.
              </p>
            </div>
          </div>
          <button className="px-4 py-2 rounded-lg text-xs font-bold bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
            Despachar Viatura
          </button>
        </div>

        {/* Recent Activity List Mockup */}
        <div className="mt-2 space-y-3">
          <div
            className="text-sm font-semibold mb-2"
            style={{ color: colors.functional.text.secondary }}
          >
            Atividade Recente
          </div>
          {[1, 2].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-lg border"
              style={{
                backgroundColor: "rgba(255,255,255,0.02)",
                borderColor: colors.functional.border.dark,
              }}
            >
              <div className="w-8 h-8 rounded-full bg-slate-700 animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-2 w-3/4 rounded bg-slate-700 animate-pulse"></div>
                <div className="h-2 w-1/2 rounded bg-slate-700 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
