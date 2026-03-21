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
      style={{ backgroundColor: "rgba(61, 61, 106, 0.65)" }}
    >
      <div className="flex items-center gap-3">
        {/* RN01 — ícone reforça o gesto de segurar */}
        <div
          aria-hidden="true"
          className="shrink-0 rounded-xl p-2"
          style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
        >
          <Hand size={16} className="text-white/80" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/55">
            Como acionar
          </p>
          {/* RN01 — segure 2s para disparar; toque único não aciona (evita acidentes) */}
          <p className="mt-0.5 text-sm font-medium leading-snug text-white/90">
            Segure o botão por 2 segundos para enviar o alerta de emergência.
          </p>
        </div>
      </div>
    </div>
  );
}
