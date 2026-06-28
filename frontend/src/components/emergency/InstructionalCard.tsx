/**
 * RN01 — Ativação por Tempo Contínuo: informa a usuária sobre o mecanismo de hold de 2s.
 * NRF09 — Usabilidade Sob Estresse: instrução clara e direta, sem texto desnecessário.
 */
import React from "react";

export function InstructionalCard() {
  return (
    <div className="mb-5 flex items-center gap-2.5">
      {/* Indicador circular — reforça o gesto de segurar sem um card pesado */}
      <div
        aria-hidden="true"
        className="shrink-0 flex items-center justify-center"
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: "1.5px solid rgba(196,112,90,0.40)",
        }}
      >
        <svg
          width="12"
          height="14"
          viewBox="0 0 12 14"
          fill="none"
          style={{ color: "#c4705a" }}
        >
          {/* ícone de mão simplificado — dedo indicando pressão */}
          <rect
            x="4"
            y="0"
            width="4"
            height="9"
            rx="2"
            fill="currentColor"
            opacity="0.9"
          />
          <rect
            x="0"
            y="4"
            width="4"
            height="7"
            rx="2"
            fill="currentColor"
            opacity="0.65"
          />
          <rect
            x="8"
            y="4"
            width="4"
            height="7"
            rx="2"
            fill="currentColor"
            opacity="0.65"
          />
          <rect
            x="0"
            y="9"
            width="12"
            height="5"
            rx="2.5"
            fill="currentColor"
            opacity="0.5"
          />
        </svg>
      </div>

      <p
        className="text-xs leading-snug"
        style={{ color: "#4a2535", fontWeight: 500 }}
      >
        Mantenha pressionado por{" "}
        <span style={{ color: "#b85d47", fontWeight: 700 }}>2 segundos</span>{" "}
        para acionar o alerta
      </p>
    </div>
  );
}
