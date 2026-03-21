import {
  BookOpenText,
  FileCheck,
  HeartHandshake,
  ShieldAlert,
} from "lucide-react";
import React from "react";

const quickAccessItems = [
  {
    icon: ShieldAlert,
    title: "Pedir ajuda com segurança",
    description:
      "Entenda o fluxo inicial de acolhimento, registro e acionamento da rede quando houver risco ou necessidade de orientação imediata.",
    href: "#cta-rede",
    eyebrow: "Atendimento prioritário",
  },
  {
    icon: BookOpenText,
    title: "Entender direitos e medidas protetivas",
    description:
      "Acesse informações públicas organizadas para apoiar decisões com mais clareza, autonomia e previsibilidade.",
    href: "#dados-publicos",
    eyebrow: "Orientação clara",
  },
  {
    icon: HeartHandshake,
    title: "Conhecer a rede de apoio",
    description:
      "Veja como assistência social, segurança, saúde e acolhimento atuam de forma coordenada no mesmo fluxo institucional.",
    href: "#how-it-works",
    eyebrow: "Rede articulada",
  },
  {
    icon: FileCheck,
    title: "Acompanhar acesso institucional",
    description:
      "Canal voltado a equipes e órgãos públicos que precisam operar o sistema com segurança, rastreabilidade e controle de perfil.",
    href: "/login",
    eyebrow: "Uso institucional",
  },
];

export const QuickAccessSection: React.FC = () => (
  <section id="acesso-rapido" className="py-20 bg-background">
    <div className="mx-auto max-w-6xl px-6">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Acesso rápido
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-[2.2rem] text-foreground">
            Um portal de acolhimento, orientação e encaminhamento.
          </h2>
        </div>

        <p className="max-w-xl text-sm leading-7 sm:text-base text-muted-foreground">
          A página inicial prioriza caminhos objetivos para ajuda, informação e
          articulação institucional, sem depender de linguagem comercial ou
          excesso de elementos promocionais.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quickAccessItems.map((item) => (
          <a
            key={item.title}
            href={item.href}
            className="group rounded-[1.75rem] border border-border p-6 transition-transform duration-200 hover:-translate-y-1 bg-card shadow-sm"
          >
            <div className="mb-5 inline-flex rounded-2xl p-3 bg-accent">
              <item.icon size={20} className="text-primary" />
            </div>

            <p
              className="mb-2 text-xs font-semibold uppercase tracking-[0.14em]"
              style={{ color: "var(--chart-2)" }}
            >
              {item.eyebrow}
            </p>
            <h3 className="text-lg font-semibold leading-snug text-foreground">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {item.description}
            </p>

            <span className="mt-6 inline-flex text-sm font-semibold transition-colors group-hover:opacity-80 text-accent-foreground">
              Acessar caminho
            </span>
          </a>
        ))}
      </div>
    </div>
  </section>
);
