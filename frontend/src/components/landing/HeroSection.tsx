import {
  ArrowRight,
  Building2,
  CheckCircle2,
  CircleHelp,
  FileText,
  Lock,
  Phone,
  ShieldCheck,
  Siren,
  Users,
} from "lucide-react";
import React from "react";

import { govTheme } from "./gov-theme";

const orientationItems = [
  {
    icon: Phone,
    title: "Atendimento inicial e sigiloso",
    description:
      "Registro estruturado para acolhimento, orientação e encaminhamento com discrição desde o primeiro contato.",
  },
  {
    icon: Users,
    title: "Rede pública articulada",
    description:
      "Fluxo compartilhado entre assistência social, segurança, saúde e serviços de apoio autorizados.",
  },
  {
    icon: FileText,
    title: "Histórico confiável para acompanhamento",
    description:
      "Cada ação fica registrada para dar continuidade ao cuidado e apoiar decisões técnicas com rastreabilidade.",
  },
];

const institutionalSignals = [
  "Fluxo preparado para operação municipal",
  "Registro com rastreabilidade e continuidade",
  "Integração entre acolhimento, saúde e segurança",
];

const trustBadges = [
  { icon: Lock, text: "Canal criptografado" },
  { icon: ShieldCheck, text: "Uso institucional controlado" },
  { icon: Building2, text: "Rede pública integrada" },
];

export const HeroSection: React.FC = () => {
  const primaryOrientationItem = orientationItems[0];
  const PrimaryOrientationIcon = primaryOrientationItem.icon;

  return (
    <header
      className="relative overflow-hidden pt-36 pb-20"
      style={{
        background:
          "linear-gradient(180deg, #f1f4f8 0%, #f7f8fa 42%, #ffffff 100%)",
      }}
    >
      <div
        className="absolute left-0 right-0 top-0 h-2"
        style={{
          background: `linear-gradient(90deg, ${govTheme.brand.sand} 0 18%, ${govTheme.brand.blue} 18% 76%, ${govTheme.brand.green} 76% 100%)`,
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
        <div
          className="mb-8 flex flex-col gap-4 rounded-[1.75rem] border px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
          style={{
            borderColor: govTheme.border.subtle,
            backgroundColor: "rgba(255,255,255,0.78)",
            boxShadow: govTheme.shadow.card,
          }}
        >
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-[0.16em]"
              style={{ color: govTheme.brand.blue }}
            >
              Portal público de acolhimento
            </p>
            <p
              className="mt-1 text-sm leading-6"
              style={{ color: govTheme.text.secondary }}
            >
              Estrutura pensada para nascer dentro do órgão municipal, com
              previsibilidade, clareza e linguagem humana.
            </p>
          </div>

          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
            style={{
              color: govTheme.status.danger,
              backgroundColor: govTheme.status.dangerSoft,
            }}
          >
            <Siren size={16} />
            Em risco imediato, acione 190
          </div>
        </div>

        <div className="grid gap-8 lg:min-h-168 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.92fr)] lg:items-start">
          <div className="flex max-w-3xl flex-col justify-between lg:min-h-136">
            <div>
              <div
                className="mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.16em] uppercase"
                style={{
                  color: govTheme.brand.blueStrong,
                  backgroundColor: govTheme.brand.blueSurface,
                  borderColor: govTheme.border.strong,
                }}
              >
                <CircleHelp size={14} />
                Serviço oficial, seguro e acolhedor
              </div>

              <h1
                className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.45rem] lg:leading-[1.08]"
                style={{ color: govTheme.text.primary }}
              >
                Proteção, orientação e resposta coordenada para mulheres em
                situação de violência.
              </h1>

              <p
                className="mt-5 max-w-2xl text-lg leading-8"
                style={{ color: govTheme.text.secondary }}
              >
                O Amparo organiza acolhimento, acompanhamento e articulação
                entre os serviços públicos em um ambiente discreto, confiável e
                preparado para atuação municipal integrada.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#acesso-rapido"
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: govTheme.brand.blue }}
                >
                  Pedir ajuda e entender os caminhos
                  <ArrowRight size={15} />
                </a>
                <a
                  href="#dados-publicos"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border px-6 py-3 text-sm font-semibold transition-colors"
                  style={{
                    color: govTheme.brand.blueStrong,
                    backgroundColor: govTheme.background.section,
                    borderColor: govTheme.border.strong,
                  }}
                >
                  Entender meus direitos e a rede
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {trustBadges.map((badge) => (
                  <span
                    key={badge.text}
                    className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm"
                    style={{
                      color: govTheme.brand.blueStrong,
                      backgroundColor: "rgba(255,255,255,0.92)",
                      borderColor: govTheme.border.subtle,
                    }}
                  >
                    <badge.icon
                      size={14}
                      style={{ color: govTheme.brand.green }}
                    />
                    {badge.text}
                  </span>
                ))}
              </div>
            </div>

            <div
              className="mt-10 rounded-[1.75rem] border p-5 sm:p-6"
              style={{
                borderColor: govTheme.border.subtle,
                backgroundColor: "rgba(255,255,255,0.9)",
                boxShadow: govTheme.shadow.card,
              }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="max-w-md">
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.14em]"
                    style={{ color: govTheme.brand.blue }}
                  >
                    Confiança institucional
                  </p>
                  <p
                    className="mt-2 text-sm leading-7"
                    style={{ color: govTheme.text.secondary }}
                  >
                    A experiência pública precisa explicar, orientar e acionar a
                    rede sem fragmentar o atendimento nem sobrecarregar a
                    usuária.
                  </p>
                </div>

                <div
                  className="rounded-2xl px-4 py-3 text-sm font-semibold"
                  style={{
                    color: govTheme.brand.blueStrong,
                    backgroundColor: govTheme.brand.blueSurface,
                  }}
                >
                  Uso orientado por protocolo e perfis autorizados
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {institutionalSignals.map((signal) => (
                  <div
                    key={signal}
                    className="rounded-2xl border px-4 py-3"
                    style={{
                      borderColor: govTheme.border.subtle,
                      backgroundColor: govTheme.background.section,
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <CheckCircle2
                        size={16}
                        className="mt-0.5 shrink-0"
                        style={{ color: govTheme.brand.green }}
                      />
                      <p
                        className="text-sm leading-6"
                        style={{ color: govTheme.text.secondary }}
                      >
                        {signal}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3 lg:pt-1">
            <div
              className="rounded-[2rem] border p-6 lg:p-7"
              style={{
                backgroundColor: govTheme.background.section,
                borderColor: govTheme.border.subtle,
                boxShadow: govTheme.shadow.soft,
              }}
            >
              <div
                className="rounded-2xl px-4 py-3 text-sm font-semibold"
                style={{
                  color: govTheme.brand.blueStrong,
                  backgroundColor: govTheme.brand.blueSurface,
                }}
              >
                Atendimento sensível, coordenação entre serviços e continuidade
                do cuidado em um mesmo fluxo institucional.
              </div>

              <div
                className="mt-5 rounded-[1.75rem] border p-5"
                style={{
                  borderColor: govTheme.border.subtle,
                  backgroundColor: "#fbfcfe",
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: govTheme.background.alt }}
                  >
                    <PrimaryOrientationIcon
                      size={18}
                      style={{ color: govTheme.brand.blue }}
                    />
                  </div>

                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-[0.14em]"
                      style={{ color: govTheme.brand.blue }}
                    >
                      Etapa prioritária
                    </p>
                    <h3
                      className="mt-2 text-lg font-semibold"
                      style={{ color: govTheme.text.primary }}
                    >
                      {primaryOrientationItem.title}
                    </h3>
                    <p
                      className="mt-3 text-sm leading-7"
                      style={{ color: govTheme.text.secondary }}
                    >
                      {primaryOrientationItem.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {orientationItems.slice(1).map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[1.5rem] border px-4 py-4"
                    style={{
                      borderColor: govTheme.border.subtle,
                      backgroundColor: govTheme.background.section,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl"
                        style={{ backgroundColor: govTheme.background.alt }}
                      >
                        <item.icon
                          size={16}
                          style={{ color: govTheme.brand.blue }}
                        />
                      </div>

                      <div>
                        <h3
                          className="text-sm font-semibold leading-6"
                          style={{ color: govTheme.text.primary }}
                        >
                          {item.title}
                        </h3>
                        <p
                          className="mt-1 text-sm leading-6"
                          style={{ color: govTheme.text.secondary }}
                        >
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div
                className="rounded-[1.75rem] border px-5 py-4"
                style={{
                  borderColor: govTheme.border.subtle,
                  backgroundColor: govTheme.brand.blueSurface,
                }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-[0.14em]"
                  style={{ color: govTheme.brand.blueStrong }}
                >
                  Acolhimento com clareza
                </p>
                <p
                  className="mt-3 text-sm leading-7"
                  style={{ color: govTheme.text.secondary }}
                >
                  Linguagem direta, sem excesso de termos técnicos, para que a
                  usuária compreenda o que acontece em cada etapa.
                </p>
              </div>

              <div
                className="rounded-[1.75rem] border px-5 py-4"
                style={{
                  borderColor: govTheme.border.subtle,
                  backgroundColor: govTheme.background.section,
                }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-[0.14em]"
                  style={{ color: govTheme.brand.green }}
                >
                  Governança pública
                </p>
                <p
                  className="mt-3 text-sm leading-7"
                  style={{ color: govTheme.text.secondary }}
                >
                  Dados e encaminhamentos organizados para apoiar auditoria,
                  continuidade de serviço e decisão técnica responsável.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
