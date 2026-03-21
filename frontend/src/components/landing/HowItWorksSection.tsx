import React from "react";

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
    className="py-24 bg-card border-t border-border border-b"
  >
    <div className="max-w-6xl mx-auto px-6">
      <div className="mb-14">
        <p className="text-xs font-semibold tracking-widest uppercase mb-3 flex items-center gap-2 text-primary">
          <span
            className="inline-block w-5 h-px"
            style={{ backgroundColor: "var(--chart-3)" }}
          />
          Fluxo de Atendimento
        </p>
        <h2 className="text-3xl font-bold text-foreground">
          Como o atendimento é organizado com clareza e continuidade
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
          O desenho do serviço prioriza previsibilidade, acolhimento e atuação
          conjunta da rede pública, sem transformar a experiência em um portal
          burocrático ou frio.
        </p>
      </div>

      <div className="relative grid gap-4 md:grid-cols-3">
        <div className="absolute left-[33.33%] right-[33.33%] top-[2.8rem] z-0 hidden h-px md:block bg-border" />
        {steps.map((step, i) => (
          <div
            key={step.number}
            className={`relative z-10 rounded-[1.75rem] border border-border p-6 shadow-sm ${
              i === 1 ? "bg-secondary" : i === 2 ? "bg-accent" : "bg-card"
            }`}
          >
            <div
              className="mb-4 inline-block rounded-full px-3 py-1 text-xs font-bold text-accent-foreground bg-accent"
              style={{ border: "1px solid var(--ring)" }}
            >
              {step.number}
            </div>
            <p
              className="text-xs font-medium mb-2"
              style={{ color: "var(--chart-2)" }}
            >
              {step.tag}
            </p>
            <h3 className="text-base font-semibold mb-3 text-foreground">
              {step.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
