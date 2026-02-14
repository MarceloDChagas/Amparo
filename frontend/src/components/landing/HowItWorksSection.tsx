import React from "react";

import { colors } from "@/styles/colors";

import { Step } from "./Step";

export const HowItWorksSection: React.FC = () => (
  <section
    className="py-24"
    style={{ backgroundColor: colors.functional.background.primary }}
  >
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2
          className="text-3xl font-bold mb-4"
          style={{ color: colors.functional.text.primary }}
        >
          Fluxo de Amparo em 3 Passos
        </h2>
        <div
          className="w-20 h-1.5 mx-auto rounded-full"
          style={{
            background: colors.gradients.card,
            boxShadow: `0 0 20px ${colors.special.glow.violet}`,
          }}
        ></div>
      </div>
      <div className="grid md:grid-cols-3 gap-12 relative">
        <div
          className="hidden md:block absolute top-6 left-1/4 right-1/4 h-0.5 border-t-2 border-dashed"
          style={{ borderColor: colors.functional.border.light }}
        ></div>
        <Step
          number="1"
          title="Acolhimento Digital"
          description="A vítima ou gestor realiza o cadastro inicial em um ambiente criptografado e discreto."
        />
        <Step
          number="2"
          title="Monitoramento Ativo"
          description="Histórico de ocorrências e medidas protetivas são atualizados em tempo real."
        />
        <Step
          number="3"
          title="Resposta Imediata"
          description="Em caso de risco, a rede de apoio é notificada via protocolos de segurança otimizados."
        />
      </div>
    </div>
  </section>
);
