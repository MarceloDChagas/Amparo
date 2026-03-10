import React from "react";

import { govTheme } from "./gov-theme";
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
    id="dados-publicos"
    className="py-20"
    style={{ backgroundColor: govTheme.background.alt }}
  >
    <div className="max-w-6xl mx-auto px-6">
      <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p
            className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest"
            style={{ color: govTheme.brand.blue }}
          >
            <span
              className="inline-block h-px w-5"
              style={{ backgroundColor: govTheme.brand.sand }}
            />
            Dados públicos
          </p>
          <h2
            className="max-w-xl text-2xl font-bold leading-snug"
            style={{ color: govTheme.text.primary }}
          >
            Informações que ajudam a entender a urgência da resposta pública.
            <br />
            <span
              className="text-xl font-normal"
              style={{ color: govTheme.text.secondary }}
            >
              A transparência dos dados fortalece prevenção, cuidado e gestão.
            </span>
          </h2>
        </div>

        <p
          className="max-w-xl text-sm leading-7 sm:text-base"
          style={{ color: govTheme.text.secondary }}
        >
          Os números abaixo não funcionam como peça publicitária. Eles servem
          para contextualizar por que a integração entre acolhimento, proteção e
          acompanhamento precisa ser tratada como política pública contínua.
        </p>
      </div>

      <div
        className="grid overflow-hidden rounded-3xl border md:grid-cols-3"
        style={{ borderColor: govTheme.border.strong }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            className="border-r p-6 last:border-r-0"
            style={{
              backgroundColor: govTheme.background.section,
              borderColor: govTheme.border.subtle,
            }}
          >
            <div
              className="text-2xl font-bold mb-2 leading-tight"
              style={{ color: govTheme.brand.blueStrong }}
            >
              {s.value}
            </div>
            <p
              className="text-sm leading-relaxed mb-3"
              style={{ color: govTheme.text.secondary }}
            >
              {s.label}
            </p>
            <p className="text-xs" style={{ color: govTheme.text.muted }}>
              {s.source}
            </p>
          </div>
        ))}
      </div>

      <p
        className="mt-8 text-sm leading-relaxed max-w-2xl"
        style={{ color: govTheme.text.secondary }}
      >
        O objetivo não é apenas informar. É oferecer base para que equipes
        técnicas planejem resposta, acompanhem trajetórias e evitem que a mulher
        precise repetir sua história a cada novo atendimento.
      </p>
    </div>
  </section>
);
