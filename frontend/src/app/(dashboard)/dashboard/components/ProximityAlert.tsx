import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import React from "react";

import { govTheme } from "@/components/landing/gov-theme";
import { EmergencyAlert } from "@/services/emergency-alert-service";

interface ProximityAlertProps {
  alert?: EmergencyAlert | null;
}

export const ProximityAlert: React.FC<ProximityAlertProps> = ({ alert }) => {
  if (!alert) return null;

  return (
    <div
      className="p-6 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden group"
      style={{
        backgroundColor: govTheme.status.dangerSoft,
        borderColor: "rgba(166, 60, 60, 0.28)",
      }}
    >
      <div
        className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity blur-2xl"
        style={{ backgroundColor: govTheme.status.danger }}
      />

      <div className="flex items-center gap-5 relative z-10">
        <div
          className="p-4 rounded-xl flex items-center justify-center animate-pulse"
          style={{
            backgroundColor: "rgba(166, 60, 60, 0.12)",
            color: govTheme.status.danger,
          }}
        >
          <ShieldAlert size={32} />
        </div>
        <div>
          <h4
            className="font-bold text-lg mb-1"
            style={{ color: govTheme.status.danger }}
          >
            Alerta de Emergência
          </h4>
          <p className="text-sm" style={{ color: govTheme.text.secondary }}>
            {alert.address
              ? `Usuário ID #${alert.userId?.substring(0, 8) || "Desconhecido"} necessita de ajuda na localização: ${alert.address}.`
              : `Alerta recebido do Usuário ID #${alert.userId?.substring(0, 8) || "Desconhecido"} próximos às coordenadas (${alert.latitude.toFixed(4)}, ${alert.longitude.toFixed(4)}).`}
          </p>
        </div>
      </div>
      <Link
        href={`/alerts/${alert.id}`}
        className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold shadow-lg transition-transform hover:scale-105 relative z-10 whitespace-nowrap text-center"
        style={{
          backgroundColor: govTheme.status.danger,
          color: govTheme.text.inverse,
        }}
      >
        Ver Detalhes
      </Link>
    </div>
  );
};
