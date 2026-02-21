import { ShieldAlert } from "lucide-react";
import React from "react";

import { colors } from "@/styles/colors";

export const ProximityAlert: React.FC = () => {
  return (
    <div
      className="p-6 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden group"
      style={{
        backgroundColor: `${colors.status.error.dark}40`,
        borderColor: `${colors.status.error.DEFAULT}40`,
      }}
    >
      <div
        className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity blur-2xl"
        style={{ backgroundColor: colors.status.error.DEFAULT }}
      />

      <div className="flex items-center gap-5 relative z-10">
        <div
          className="p-4 rounded-xl flex items-center justify-center animate-pulse"
          style={{
            backgroundColor: `${colors.status.error.DEFAULT}20`,
            color: colors.status.error.DEFAULT,
          }}
        >
          <ShieldAlert size={32} />
        </div>
        <div>
          <h4
            className="font-bold text-lg mb-1"
            style={{ color: colors.status.error.DEFAULT }}
          >
            Alerta de Proximidade Imediata
          </h4>
          <p
            className="text-sm"
            style={{ color: colors.functional.text.secondary }}
          >
            Violação de perímetro detectada. Vítima ID #8922 está em risco
            potencial na Zona Sul.
          </p>
        </div>
      </div>
      <button
        className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold shadow-lg transition-transform hover:scale-105 relative z-10 whitespace-nowrap"
        style={{
          backgroundColor: colors.status.error.DEFAULT,
          color: "white",
        }}
      >
        Despachar Viaturas
      </button>
    </div>
  );
};
