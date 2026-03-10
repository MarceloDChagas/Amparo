import {
  ArrowRight,
  Building2,
  Clock,
  Lock,
  Shield,
  Users,
} from "lucide-react";
import React from "react";

import { colors } from "@/styles/colors";

// Subtle grid texture — absolute positioned behind hero content
const GridTexture: React.FC = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    style={{ opacity: 0.03 }}
  >
    <defs>
      <pattern
        id="amparo-grid"
        x="0"
        y="0"
        width="40"
        height="40"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M 40 0 L 0 0 0 40"
          fill="none"
          stroke="#6366f1"
          strokeWidth="0.5"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#amparo-grid)" />
  </svg>
);

const metrics = [
  {
    icon: Users,
    value: "2.400+",
    label: "vítimas acompanhadas",
    note: "desde o lançamento",
  },
  {
    icon: Building2,
    value: "38",
    label: "instituições integradas",
    note: "GCM, CRAS, SUAS e parceiros",
  },
  {
    icon: Clock,
    value: "< 3 min",
    label: "tempo médio de alerta",
    note: "da triagem ao acionamento",
  },
];

const trustBadges = [
  { icon: Lock, text: "Canal criptografado" },
  { icon: Shield, text: "Suporte 24h" },
  { icon: Building2, text: "Rede pública integrada" },
];

export const HeroSection: React.FC = () => (
  <header
    className="relative pt-36 pb-24 overflow-hidden"
    style={{ backgroundColor: colors.functional.background.primary }}
  >
    {/* Subtle grid texture */}
    <GridTexture />

    {/* Faint radial glow — left side depth */}
    <div
      className="absolute top-1/2 left-0 w-[480px] h-[480px] rounded-full pointer-events-none -translate-y-1/2 -translate-x-1/3"
      style={{
        background: `radial-gradient(circle, ${colors.accent[950] ?? "#3b0764"}66 0%, transparent 70%)`,
        filter: "blur(72px)",
      }}
    />

    <div className="relative max-w-6xl mx-auto px-6">
      <div className="max-w-2xl">
        {/* Trust badges — above the fold: slate/indigo palette, not accent */}
        <div className="flex flex-wrap gap-2 mb-8">
          {trustBadges.map((b) => (
            <span
              key={b.text}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full"
              style={{
                color: "#94a3b8",
                backgroundColor: "rgba(30,27,75,0.6)",
                border: "1px solid rgba(55,48,163,0.4)",
              }}
            >
              <b.icon size={11} style={{ color: "#818cf8" }} />
              {b.text}
            </span>
          ))}
        </div>

        <h1
          className="text-[2.35rem] sm:text-[2.6rem] font-bold tracking-tight mb-3 leading-[1.18]"
          style={{ color: colors.functional.text.primary }}
        >
          Para cada vítima,
          <br />
          uma rede de amparo{" "}
          <span style={{ color: colors.accent[400] }}>ativada.</span>
        </h1>

        <p
          className="text-xs font-medium mb-5 tracking-wide"
          style={{ color: "#6366f1" }}
        >
          Para vítimas, assistentes sociais, delegacias e abrigos.
        </p>

        <p
          className="text-base mb-10 leading-relaxed max-w-lg"
          style={{ color: colors.functional.text.secondary }}
        >
          Do primeiro registro ao acolhimento — o Amparo conecta vítimas de
          violência doméstica a abrigos, delegacias, CRAS, saúde e suporte
          psicológico em tempo real, com sigilo e rastreabilidade de cada etapa.
        </p>

        {/* CTAs with clear hierarchy */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <a
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: colors.accent[600] }}
          >
            Acessar o Sistema
            <ArrowRight size={15} />
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-1.5 px-2 py-3 text-sm transition-opacity hover:opacity-80"
            style={{ color: colors.functional.text.tertiary }}
          >
            Ver como funciona
            <ArrowRight size={13} />
          </a>
        </div>

        {/* Metric cards */}
        <div
          className="mt-14 pt-10 grid grid-cols-3 gap-3"
          style={{ borderTop: `1px solid ${colors.functional.border.dark}` }}
        >
          {metrics.map((m) => (
            <div
              key={m.label}
              className="p-3 rounded-lg"
              style={{
                backgroundColor: "rgba(17,14,35,0.8)",
                border: "1px solid rgba(55,48,163,0.35)",
              }}
            >
              <m.icon
                size={13}
                className="mb-2"
                style={{ color: colors.accent[500] }}
              />
              <div
                className="text-lg font-bold leading-tight"
                style={{ color: colors.functional.text.primary }}
              >
                {m.value}
              </div>
              <div
                className="text-xs font-medium mt-0.5 leading-snug"
                style={{ color: colors.functional.text.secondary }}
              >
                {m.label}
              </div>
              <div
                className="text-xs mt-1 leading-snug"
                style={{ color: colors.functional.text.tertiary }}
              >
                {m.note}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </header>
);
