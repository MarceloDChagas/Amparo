import {
  ArrowRight,
  Building2,
  CircleHelp,
  Lock,
  ShieldCheck,
} from "lucide-react";
import React from "react";

// ①④ — painel direito e card "Confiança institucional" removidos (conteúdo duplicado)
// ③ — CTAs com verbo+objeto curto e hierarquia clara

const trustBadges = [
  { icon: Lock, text: "Canal criptografado" },
  { icon: ShieldCheck, text: "Uso institucional controlado" },
  { icon: Building2, text: "Rede pública integrada" },
];

export const HeroSection: React.FC = () => (
  <header
    className="relative overflow-hidden pt-44 pb-20"
    style={{
      background:
        "linear-gradient(180deg, #f1f4f8 0%, #f7f8fa 42%, #ffffff 100%)",
    }}
  >
    {/* faixa tricolor — mantida fina (2px) */}
    <div
      className="absolute left-0 right-0 top-0 h-2"
      style={{
        background: `linear-gradient(90deg, var(--chart-3) 0 18%, var(--primary) 18% 76%, var(--chart-2) 76% 100%)`,
      }}
    />

    <div
      className="absolute -right-28 top-18 h-120 w-120 rounded-full blur-3xl"
      style={{ backgroundColor: "rgba(36, 75, 122, 0.1)" }}
    />
    <div
      className="absolute -left-20 top-36 h-80 w-80 rounded-full blur-3xl"
      style={{ backgroundColor: "rgba(47, 107, 87, 0.08)" }}
    />

    <div className="relative mx-auto max-w-6xl px-6">
      <div className="max-w-3xl">
        <div
          className="mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.16em] uppercase text-accent-foreground bg-accent"
          style={{ borderColor: "var(--ring)" }}
        >
          <CircleHelp size={14} />
          Serviço oficial, seguro e acolhedor
        </div>

        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.45rem] lg:leading-[1.08] text-foreground">
          Proteção, orientação e resposta coordenada para mulheres em situação
          de violência.
        </h1>

        <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
          O Amparo conecta acolhimento, acompanhamento e a rede pública em um
          fluxo discreto e preparado para atuação municipal integrada.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href="#acesso-rapido"
            className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 bg-primary"
          >
            Pedir ajuda agora
            <ArrowRight size={15} />
          </a>
          <a
            href="#dados-publicos"
            className="inline-flex items-center justify-center gap-2 rounded-lg border px-6 py-3 text-sm font-semibold transition-colors text-accent-foreground bg-card"
            style={{ borderColor: "var(--ring)" }}
          >
            Conhecer meus direitos
          </a>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {trustBadges.map((badge) => (
            <span
              key={badge.text}
              className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm text-accent-foreground"
              style={{ backgroundColor: "rgba(255,255,255,0.92)" }}
            >
              <badge.icon size={14} style={{ color: "var(--chart-2)" }} />
              {badge.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  </header>
);
