import React from "react";

import { colors } from "@/styles/colors";

import { Step } from "./Step";

export const HowItWorksSection: React.FC = () => (
  <section
    className="py-32 relative"
    style={{ backgroundColor: colors.functional.background.primary }}
  >
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-20">
        <div
          className="text-sm font-bold tracking-widest mb-4 transition-all"
          style={{ color: colors.accent[400] }}
        >
          JORNADA DA VÍTIMA
        </div>
        <h2
          className="text-4xl md:text-5xl font-bold mb-6"
          style={{ color: colors.functional.text.primary }}
        >
          Fluxo de Amparo em 3 Passos
        </h2>
        <div
          className="w-24 h-1.5 mx-auto rounded-full opacity-80"
          style={{ background: colors.gradients.card }}
        ></div>
      </div>

      {/* Timeline Wrapper */}
      <div className="relative">
        <div className="grid md:grid-cols-3 gap-12 gap-y-16 relative z-10">
          <Step
            number="1"
            title="Acolhimento Digital"
            description="A vítima ou gestor realiza o cadastro inicial em um ambiente criptografado e discreto, garantindo total privacidade desde o primeiro contato."
          />
          <Step
            number="2"
            title="Monitoramento Ativo"
            description="Histórico de ocorrências e medidas protetivas são atualizados em tempo real, permitindo aos gestores prever e mitigar riscos."
          />
          <Step
            number="3"
            title="Resposta Imediata"
            description="Em caso de risco iminente, a rede de apoio e autoridades competentes são notificadas instantaneamente via protocolos otimizados."
          />
        </div>
      </div>
    </div>
  </section>
);
