import React from "react";

import { govTheme } from "./gov-theme";

const steps = [
  {
    number: "01",
    title: "Escuta inicial e registro protegido",
    tag: "Privacidade desde o primeiro contato",
    description:
      "A demanda é acolhida com linguagem clara e canal discreto, preservando informações sensíveis e organizando o primeiro encaminhamento.",
  },
  {
    number: "02",
    title: "Acompanhamento com continuidade",
    tag: "Histórico centralizado",
    description:
      "Medidas protetivas, ocorrências e retornos da rede ficam reunidos para reduzir retrabalho e permitir continuidade do cuidado.",
  },
  {
    number: "03",
    title: "Acionamento responsável da rede",
    tag: "Resposta coordenada",
    description:
      "Quando houver necessidade, assistência social, segurança, saúde e acolhimento são acionados de forma organizada e rastreável.",
  },
];

export const HowItWorksSection: React.FC = () => (
  <section
    id="how-it-works"
    className="py-24"
    style={{
      backgroundColor: govTheme.background.section,
      borderTop: `1px solid ${govTheme.border.subtle}`,
      borderBottom: `1px solid ${govTheme.border.subtle}`,
    }}
  >
    <div className="max-w-6xl mx-auto px-6">
      <div className="mb-14">
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-3 flex items-center gap-2"
          style={{ color: govTheme.brand.blue }}
        >
          <span
            className="inline-block w-5 h-px"
            style={{ backgroundColor: govTheme.brand.sand }}
          />
          Fluxo de Atendimento
        </p>
        <h2
          className="text-3xl font-bold"
          style={{ color: govTheme.text.primary }}
        >
          Como o atendimento é organizado com clareza e continuidade
        </h2>
        <p
          className="mt-4 max-w-2xl text-base leading-7"
          style={{ color: govTheme.text.secondary }}
        >
          O desenho do serviço prioriza previsibilidade, acolhimento e atuação
          conjunta da rede pública, sem transformar a experiência em um portal
          burocrático ou frio.
        </p>
      </div>

      <div className="relative grid gap-4 md:grid-cols-3">
        <div
          className="absolute left-[33.33%] right-[33.33%] top-[2.8rem] z-0 hidden h-px md:block"
          style={{ backgroundColor: govTheme.border.subtle }}
        />
        {steps.map((step, i) => (
          <div
            key={step.number}
            className="relative z-10 rounded-[1.75rem] border p-6"
            style={{
              borderColor: govTheme.border.subtle,
              backgroundColor:
                i === 1
                  ? govTheme.background.alt
                  : i === 2
                    ? govTheme.brand.blueSurface
                    : govTheme.background.section,
              boxShadow: govTheme.shadow.card,
            }}
          >
            <div
              className="mb-4 inline-block rounded-full px-3 py-1 text-xs font-bold"
              style={{
                color: govTheme.brand.blueStrong,
                backgroundColor: govTheme.brand.blueSurface,
                border: `1px solid ${govTheme.border.strong}`,
              }}
            >
              {step.number}
            </div>
            <p
              className="text-xs font-medium mb-2"
              style={{ color: govTheme.brand.green }}
            >
              {step.tag}
            </p>
            <h3
              className="text-base font-semibold mb-3"
              style={{ color: govTheme.text.primary }}
            >
              {step.title}
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: govTheme.text.secondary }}
            >
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
