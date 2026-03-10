import { ArrowRight } from "lucide-react";
import React from "react";

import { colors } from "@/styles/colors";

export const CTASection: React.FC = () => (
  <section
    className="py-24"
    style={{
      backgroundColor: colors.functional.background.secondary,
      borderTop: `1px solid ${colors.functional.border.dark}`,
      borderBottom: `1px solid ${colors.functional.border.dark}`,
    }}
  >
    <div className="max-w-6xl mx-auto px-6">
      <div className="max-w-2xl">
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-5 flex items-center gap-2"
          style={{ color: colors.accent[500] }}
        >
          <span
            className="inline-block w-5 h-px"
            style={{ backgroundColor: colors.accent[500] }}
          />
          Para Gestores e Instituições
        </p>
        <h2
          className="text-3xl font-bold mb-4 leading-tight"
          style={{ color: colors.functional.text.primary }}
        >
          Sua instituição já pode fazer parte da rede Amparo.
        </h2>
        <p
          className="text-base mb-8 leading-relaxed"
          style={{ color: colors.functional.text.secondary }}
        >
          GCM, CRAS, SUAS, abrigos e delegacias podem se integrar ao sistema e
          coordenar respostas em tempo real. Mais agilidade, menos burocracia,
          mais proteção.
        </p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <a
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: colors.accent[600] }}
          >
            Integrar minha instituição
            <ArrowRight size={15} />
          </a>
          <button
            className="text-sm font-medium hover:opacity-100 transition-opacity"
            style={{ color: colors.functional.text.tertiary }}
          >
            Falar com a equipe
          </button>
        </div>
      </div>
    </div>
  </section>
);
