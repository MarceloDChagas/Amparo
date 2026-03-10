import React from "react";

import { colors } from "@/styles/colors";

const steps = [
  {
    number: "01",
    title: "Registro seguro",
    tag: "Privacidade desde o início",
    description:
      "A vítima ou gestor inicia o registro em canal criptografado e discreto. Nenhum dado é exposto sem consentimento.",
  },
  {
    number: "02",
    title: "Acompanhamento contínuo",
    tag: "Histórico centralizado",
    description:
      "Medidas protetivas, ocorrências e evoluções do caso são consolidadas em prontuário único e auditável.",
  },
  {
    number: "03",
    title: "Acionamento da rede",
    tag: "Resposta coordenada",
    description:
      "Quando há risco, abrigo, polícia, assistência social e suporte psicológico são notificados em tempo real.",
  },
];

export const HowItWorksSection: React.FC = () => (
  <section
    id="how-it-works"
    className="py-24"
    style={{
      backgroundColor: colors.functional.background.secondary,
      borderTop: `1px solid ${colors.functional.border.dark}`,
      borderBottom: `1px solid ${colors.functional.border.dark}`,
    }}
  >
    <div className="max-w-6xl mx-auto px-6">
      <div className="mb-14">
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-3 flex items-center gap-2"
          style={{ color: colors.accent[500] }}
        >
          <span
            className="inline-block w-5 h-px"
            style={{ backgroundColor: colors.accent[500] }}
          />
          Fluxo de Atendimento
        </p>
        <h2
          className="text-3xl font-bold"
          style={{ color: colors.functional.text.primary }}
        >
          Do primeiro contato ao amparo completo
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-0 relative">
        {/* Connector line (desktop only) */}
        <div
          className="hidden md:block absolute top-[2.6rem] left-[33.33%] right-[33.33%] h-px z-0"
          style={{ backgroundColor: colors.functional.border.dark }}
        />
        {steps.map((step, i) => (
          <div
            key={step.number}
            className="p-6 relative z-10"
            style={{
              borderLeft:
                i > 0 ? `1px solid ${colors.functional.border.dark}` : "none",
            }}
          >
            <div
              className="inline-block text-xs font-mono font-bold px-2 py-0.5 rounded mb-4"
              style={{
                color: colors.accent[400],
                backgroundColor: `${colors.accent[900]}55`,
                border: `1px solid ${colors.accent[800]}`,
              }}
            >
              {step.number}
            </div>
            <p
              className="text-xs font-medium mb-2"
              style={{ color: colors.accent[500] }}
            >
              {step.tag}
            </p>
            <h3
              className="text-base font-semibold mb-3"
              style={{ color: colors.functional.text.primary }}
            >
              {step.title}
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: colors.functional.text.secondary }}
            >
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
