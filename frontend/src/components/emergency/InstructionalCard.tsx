/**
 * RN01 — Ativação por Tempo Contínuo: informa a usuária sobre o mecanismo de hold de 2s.
 * NRF09 — Usabilidade Sob Estresse: instrução clara e direta, sem texto desnecessário.
 */
import { Hand } from "lucide-react";
import React from "react";

export function InstructionalCard() {
  return (
    <div
      className="mb-4 w-full max-w-sm rounded-2xl px-4 py-3 backdrop-blur-sm"
      style={{
        backgroundColor: "rgba(255,255,255,0.50)",
        border: "1px solid rgba(196,112,90,0.18)",
      }}
    >
      <div className="flex items-center gap-3">
        {/* RN01 — ícone reforça o gesto de segurar */}
        <div
          aria-hidden="true"
          className="shrink-0 rounded-xl p-2"
          style={{ backgroundColor: "rgba(196,112,90,0.12)" }}
        >
          <Hand size={16} style={{ color: "#c4705a" }} />
        </div>
        <p
          className="text-sm font-medium leading-snug"
          style={{ color: "#7a5565" }}
        >
          Segure o botão por 2 segundos para acionar o alerta.
        </p>
      </div>
    </div>
  );
}
