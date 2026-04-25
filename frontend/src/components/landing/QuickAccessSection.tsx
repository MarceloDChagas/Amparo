// ⑤ — Separado em 2 trilhas: vítima (card grande) + rede pública (3 cards menores)
import {
  ArrowRight,
  BookOpenText,
  FileCheck,
  HeartHandshake,
  ShieldAlert,
} from "lucide-react";
import React from "react";

const institutionalItems = [
  {
    icon: BookOpenText,
    title: "Entender direitos e medidas protetivas",
    description:
      "Informações públicas organizadas para apoiar decisões com mais clareza e autonomia.",
    href: "#dados-publicos",
    eyebrow: "Orientação clara",
  },
  {
    icon: HeartHandshake,
    title: "Conhecer a rede de apoio",
    description:
      "Assistência social, segurança, saúde e acolhimento em fluxo coordenado.",
    href: "#how-it-works",
    eyebrow: "Rede articulada",
  },
  {
    icon: FileCheck,
    title: "Acesso institucional",
    description:
      "Canal para equipes e órgãos públicos com controle de perfil e rastreabilidade.",
    href: "/login",
    eyebrow: "Uso institucional",
  },
];

export const QuickAccessSection: React.FC = () => (
  <section id="acesso-rapido" className="py-20 bg-background">
    <div className="mx-auto max-w-6xl px-6">
      <div className="mb-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          Acesso rápido
        </p>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-[2.2rem] text-foreground">
          Um portal de acolhimento, orientação e encaminhamento.
        </h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {/* Trilha 1 — vítima: card de destaque */}
        <a
          href="#cta-rede"
          className="group lg:col-span-1 flex flex-col rounded-[1.75rem] border-2 p-6 transition-transform duration-200 hover:-translate-y-1 shadow-sm"
          style={{
            borderColor: "var(--primary)",
            backgroundColor: "rgba(36,75,122,0.04)",
          }}
        >
          <div className="mb-5 inline-flex rounded-2xl p-3 bg-primary/10">
            <ShieldAlert size={22} style={{ color: "var(--primary)" }} />
          </div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Estou precisando de ajuda
          </p>
          <h3 className="text-xl font-semibold leading-snug text-foreground">
            Pedir ajuda com segurança
          </h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground flex-1">
            Entenda o fluxo de acolhimento, registro e acionamento da rede
            quando houver risco ou necessidade de orientação.
          </p>
          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            Acessar caminho <ArrowRight size={14} />
          </span>
        </a>

        {/* Trilha 2 — rede pública: 3 cards menores */}
        {institutionalItems.map((item) => (
          <a
            key={item.title}
            href={item.href}
            className="group flex flex-col rounded-[1.75rem] border border-border p-6 transition-transform duration-200 hover:-translate-y-1 bg-card shadow-sm"
          >
            <div className="mb-5 inline-flex rounded-2xl p-3 bg-accent">
              <item.icon size={18} className="text-primary" />
            </div>
            <p
              className="mb-2 text-xs font-semibold uppercase tracking-[0.14em]"
              style={{ color: "var(--chart-2)" }}
            >
              {item.eyebrow}
            </p>
            <h3 className="text-base font-semibold leading-snug text-foreground">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground flex-1">
              {item.description}
            </p>
            <span className="mt-6 inline-flex text-sm font-semibold transition-colors group-hover:opacity-80 text-accent-foreground">
              Acessar
            </span>
          </a>
        ))}
      </div>
    </div>
  </section>
);
