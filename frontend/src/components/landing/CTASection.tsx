import { ArrowRight } from "lucide-react";
import React from "react";

import { govTheme } from "./gov-theme";

export const CTASection: React.FC = () => (
  <section
    id="cta-rede"
    className="py-24"
    style={{
      backgroundColor: govTheme.background.emphasis,
      borderTop: `1px solid ${govTheme.border.strong}`,
      borderBottom: `1px solid ${govTheme.border.strong}`,
    }}
  >
    <div className="max-w-6xl mx-auto px-6">
      <div className="max-w-2xl">
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-5 flex items-center gap-2"
          style={{ color: govTheme.brand.sand }}
        >
          <span
            className="inline-block w-5 h-px"
            style={{ backgroundColor: govTheme.brand.sand }}
          />
          Para a rede pública
        </p>
        <h2
          className="text-3xl font-bold mb-4 leading-tight"
          style={{ color: govTheme.text.inverse }}
        >
          Sua instituição pode integrar uma resposta pública mais coordenada.
        </h2>
        <p
          className="text-base mb-8 leading-relaxed"
          style={{ color: "rgba(255,255,255,0.82)" }}
        >
          CRAS, CREAS, saúde, guarda municipal, delegacias e serviços de
          acolhimento podem operar no mesmo fluxo, com linguagem comum,
          rastreabilidade e continuidade do atendimento.
        </p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <a
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90"
            style={{
              color: govTheme.text.primary,
              backgroundColor: govTheme.brand.sand,
            }}
          >
            Solicitar acesso institucional
            <ArrowRight size={15} />
          </a>
          <a
            href="/login"
            className="inline-flex items-center py-3 text-sm font-medium transition-opacity hover:opacity-100"
            style={{ color: "rgba(255,255,255,0.78)" }}
          >
            Entrar no ambiente institucional
          </a>
        </div>
      </div>
    </div>
  </section>
);
