import { ExternalLink } from "lucide-react";
import React from "react";

import { colors } from "@/styles/colors";

import {
  AnalyticsCard,
  SecurityCard,
  SupportNetworkCard,
  UnifiedRecordCard,
} from "./BentoCards";

export const FeaturesSection: React.FC = () => {
  return (
    <section
      id="features"
      className="py-32 relative overflow-hidden"
      style={{ backgroundColor: colors.functional.background.tertiary }}
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#3d3d4e] to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <div className="max-w-3xl">
            <div
              className="text-sm font-bold tracking-widest mb-4"
              style={{ color: colors.accent[400] }}
            >
              CAPACIDADES DO SISTEMA
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
              style={{ color: colors.functional.text.primary }}
            >
              Tecnologia a serviço da vida
            </h2>
            <p
              className="text-xl leading-relaxed"
              style={{ color: colors.functional.text.secondary }}
            >
              Ferramentas desenhadas para oferecer agilidade no atendimento e
              precisão na gestão pública de casos de violência.
            </p>
          </div>
          <button
            className="flex items-center gap-2 font-bold hover:gap-3 transition-all px-6 py-3 rounded-xl"
            style={{
              color: colors.secondary[300],
              backgroundColor: `${colors.secondary[900]}33`,
              border: `1px solid ${colors.secondary[900]}`,
            }}
          >
            Explorar documentação <ExternalLink size={18} />
          </button>
        </div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[340px]">
          {/* Card 1: Prontuário Unificado (Large) */}
          <UnifiedRecordCard />

          {/* Card 2: Segurança de Dados (Tall) */}
          <SecurityCard />

          {/* Card 3: Rede de Apoio (Standard) */}
          <SupportNetworkCard />

          {/* Card 4: Inteligência (Large) */}
          <AnalyticsCard />
        </div>
      </div>
    </section>
  );
};
