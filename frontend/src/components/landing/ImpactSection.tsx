import React from "react";

import { colors } from "@/styles/colors";
const stats = [
  {
    value: "3 em cada 10",
    label: "mulheres brasileiras relatam já ter sofrido violência doméstica",
    source: "DataSenado · 2023",
  },
  {
    value: "45%",
    label:
      "das mulheres vítimas de violência não tomaram providência após o episódio mais grave",
    source: "FBSP/Datafolha · 2023",
  },
  {
    value: "43%",
    label:
      "das mulheres relatam violência física, sexual ou psicológica por parceiro íntimo ao longo da vida",
    source: "FBSP/Datafolha · 2023",
  },
];

export const ImpactSection: React.FC = () => (
  <section
    className="py-20"
    style={{ backgroundColor: colors.functional.background.primary }}
  >
    <div className="max-w-6xl mx-auto px-6">
      <div className="mb-12">
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-3 flex items-center gap-2"
          style={{ color: "#6366f1" }}
        >
          <span
            className="inline-block w-5 h-px"
            style={{ backgroundColor: "#6366f1" }}
          />
          Por que isso importa
        </p>
        <h2
          className="text-2xl font-bold max-w-xl leading-snug"
          style={{ color: colors.functional.text.primary }}
        >
          A fragmentação dos serviços custa vidas.
          <br />
          <span
            className="font-normal text-xl"
            style={{ color: colors.functional.text.secondary }}
          >
            O Amparo existe para fechar essa lacuna.
          </span>
        </h2>
      </div>

      <div
        className="grid md:grid-cols-3 gap-px overflow-hidden rounded-lg"
        style={{ border: `1px solid rgba(55,48,163,0.3)` }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            className="p-6"
            style={{
              backgroundColor: "rgba(10,8,22,0.7)",
              borderRight: `1px solid rgba(55,48,163,0.2)`,
            }}
          >
            <div
              className="text-2xl font-bold mb-2 leading-tight"
              style={{ color: colors.functional.text.primary }}
            >
              {s.value}
            </div>
            <p
              className="text-sm leading-relaxed mb-3"
              style={{ color: colors.functional.text.secondary }}
            >
              {s.label}
            </p>
            <p
              className="text-xs"
              style={{ color: colors.functional.text.tertiary }}
            >
              {s.source}
            </p>
          </div>
        ))}
      </div>

      <p
        className="mt-8 text-sm leading-relaxed max-w-2xl"
        style={{ color: colors.functional.text.tertiary }}
      >
        Não é uma campanha de conscientização. É infraestrutura de resposta —
        para que assistentes sociais, policiais e agentes de saúde possam agir
        de forma coordenada, rápida e com histórico completo do caso.
      </p>
    </div>
  </section>
);
