/**
 * RF03 — Check-in Inteligente: exibido quando um check-in passa do prazo sem confirmação.
 * RN03 — Tolerância de Atraso: o dashboard alerta o operador para intervir manualmente.
 *
 * NRF10 — Acessibilidade:
 *   - aria-live="assertive" anuncia o atraso imediatamente
 *   - role="alert" identifica a região como alerta
 *   - aria-hidden no elemento animado (decorativo)
 */
import { ClockAlert } from "lucide-react";
import Link from "next/link";
import React from "react";

import { CheckIn } from "@/services/check-in-service";

interface LateCheckInAlertProps {
  checkIn: CheckIn;
}

export const LateCheckInAlert: React.FC<LateCheckInAlertProps> = ({
  checkIn,
}) => {
  const arrivalTime = new Date(checkIn.expectedArrivalTime).toLocaleTimeString(
    [],
    { hour: "2-digit", minute: "2-digit" },
  );

  return (
    // NRF10 — assertive para alertas de segurança que requerem atenção imediata
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className="p-6 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden group"
      style={{
        backgroundColor: "rgba(216, 191, 122, 0.18)",
        borderColor: "rgba(216, 191, 122, 0.42)",
      }}
    >
      {/* aria-hidden — glare decorativo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity blur-2xl"
        style={{ backgroundColor: "var(--chart-3)" }}
      />

      <div className="flex items-center gap-5 relative z-10">
        <div
          aria-hidden="true"
          className="p-4 rounded-xl flex items-center justify-center animate-pulse"
          style={{
            backgroundColor: "rgba(216, 191, 122, 0.18)",
            color: "var(--chart-3)",
          }}
        >
          <ClockAlert size={32} />
        </div>
        <div>
          <h4
            className="font-bold text-lg mb-1"
            style={{ color: "var(--chart-3)" }}
          >
            Atraso de Deslocamento
          </h4>
          <p className="text-sm text-muted-foreground">
            {/* RN04 — exibe apenas início do ID (não CPF ou dado completo) */}
            Usuário ID #{checkIn.user?.id?.substring(0, 8) ||
              "Desconhecido"}{" "}
            passou do tempo limite de chegada prevista às {arrivalTime}.
          </p>
        </div>
      </div>

      <Link
        href={`/check-ins/${checkIn.id}`}
        className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold shadow-lg transition-transform hover:scale-105 relative z-10 whitespace-nowrap text-center"
        style={{
          backgroundColor: "rgba(216, 191, 122, 0.85)",
          color: "#1c1a14",
        }}
        aria-label={`Acompanhar check-in em atraso do usuário #${checkIn.user?.id?.substring(0, 8) || "Desconhecido"}`}
      >
        Acompanhar
      </Link>
    </div>
  );
};
