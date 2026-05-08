/**
 * RN03 — Tolerância de Atraso: explica o mecanismo de monitoramento automático.
 * NRF09 — instrução clara sem card pesado.
 */
import React from "react";

export function CheckInInstructionalCard() {
  return (
    <div className="mt-4 mb-5 flex items-center gap-2.5">
      {/* Indicador circular teal — espelha o InstructionalCard de emergência */}
      <div
        aria-hidden="true"
        className="shrink-0 flex items-center justify-center"
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: "1.5px solid rgba(90,158,138,0.40)",
          flexShrink: 0,
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={{ color: "#5a9e8a" }}
        >
          <circle cx="6" cy="6" r="2.5" fill="currentColor" opacity="0.9" />
          <path
            d="M6 1v2M6 9v2M1 6h2M9 6h2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>
      </div>

      <p
        className="text-xs leading-snug"
        style={{ color: "rgba(90,53,69,0.7)", fontWeight: 500 }}
      >
        Informe o tempo estimado e inicie. Se não confirmar chegada,{" "}
        <span style={{ color: "#5a9e8a", fontWeight: 650 }}>
          seus contatos são avisados
        </span>{" "}
        automaticamente.
      </p>
    </div>
  );
}
