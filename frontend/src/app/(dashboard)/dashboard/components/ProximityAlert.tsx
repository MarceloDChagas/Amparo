/**
 * RF01 — Botão de Emergência: componente exibido quando há alerta ativo no dashboard.
 * RN02 — Impossibilidade de Autocancelamento: o operador vê o alerta; só ele pode encerrar.
 *
 * NRF10 — Acessibilidade:
 *   - aria-live="assertive" anuncia o alerta imediatamente (prioridade máxima)
 *   - role="alert" identifica a região como alerta crítico
 *   - aria-hidden no elemento animado (não duplica anúncio)
 */
import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import React from "react";

import { EmergencyAlert } from "@/services/emergency-alert-service";

interface ProximityAlertProps {
  alert?: EmergencyAlert | null;
}

export const ProximityAlert: React.FC<ProximityAlertProps> = ({ alert }) => {
  if (!alert) return null;

  return (
    // NRF10 — assertive: leitores de tela interrompem o que estavam lendo para anunciar
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className="p-6 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden group animate-pulse-border bg-destructive/10"
      style={{
        borderColor: "rgba(166, 60, 60, 0.5)",
        boxShadow:
          "0 0 0 1px rgba(166,60,60,0.25), 0 4px 24px rgba(166,60,60,0.12)",
        animation: "pulse-border 2s ease-in-out infinite",
      }}
    >
      {/* aria-hidden — animação decorativa, não anuncia nada ao leitor de tela */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity blur-2xl bg-destructive"
      />

      <div className="flex items-center gap-5 relative z-10">
        <div
          // aria-hidden — ícone decorativo; o texto "Alerta de Emergência" já anuncia
          aria-hidden="true"
          className="p-4 rounded-xl flex items-center justify-center animate-pulse text-destructive"
          style={{ backgroundColor: "rgba(166, 60, 60, 0.12)" }}
        >
          <ShieldAlert size={32} />
        </div>
        <div>
          <h4 className="font-bold text-lg mb-1 text-destructive">
            Alerta de Emergência
          </h4>
          <p className="text-sm text-muted-foreground">
            {alert.address
              ? `Usuário ID #${alert.userId?.substring(0, 8) || "Desconhecido"} necessita de ajuda na localização: ${alert.address}.`
              : `Alerta recebido do Usuário ID #${alert.userId?.substring(0, 8) || "Desconhecido"} próximo às coordenadas (${alert.latitude.toFixed(4)}, ${alert.longitude.toFixed(4)}).`}
          </p>
        </div>
      </div>

      <Link
        href={`/alerts/${alert.id}`}
        className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold shadow-lg transition-transform hover:scale-105 relative z-10 whitespace-nowrap text-center bg-destructive text-primary-foreground"
        aria-label={`Ver detalhes do alerta de emergência do usuário #${alert.userId?.substring(0, 8) || "Desconhecido"}`}
      >
        Ver Detalhes
      </Link>
    </div>
  );
};
