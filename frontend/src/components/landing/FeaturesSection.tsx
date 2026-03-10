import { BarChart3, FolderOpen, Lock, Siren } from "lucide-react";
import React from "react";

import { govTheme } from "./gov-theme";

const features = [
  {
    icon: FolderOpen,
    title: "Prontuário unificado",
    description:
      "Histórico psicossocial, jurídico e de ocorrências reunido em um mesmo ambiente, com acesso restrito a profissionais autorizados.",
  },
  {
    icon: Lock,
    title: "Privacidade e LGPD",
    description:
      "Criptografia, trilha de auditoria e controle por perfil para tratar dados sensíveis com rigor desde a arquitetura.",
  },
  {
    icon: Siren,
    title: "Alerta de emergência",
    description:
      "Em situação de risco iminente, o sistema facilita acionamentos e notificações para reduzir tempo de resposta da rede.",
  },
  {
    icon: BarChart3,
    title: "Leitura territorial e indicadores",
    description:
      "Indicadores públicos e operacionais ajudam gestores a acompanhar demanda, risco e continuidade do serviço com base em evidências.",
  },
];

export const FeaturesSection: React.FC = () => (
  <section
    id="features"
    className="py-24"
    style={{ backgroundColor: govTheme.background.page }}
  >
    <div className="max-w-6xl mx-auto px-6">
      <div className="mb-14">
        <p
          className="text-sm font-semibold tracking-widest uppercase mb-3"
          style={{ color: govTheme.brand.blue }}
        >
          Estrutura do serviço
        </p>
        <h2
          className="text-3xl font-bold"
          style={{ color: govTheme.text.primary }}
        >
          Recursos pensados para a rede pública atuar com mais consistência
        </h2>
        <p
          className="mt-4 max-w-2xl text-base leading-7"
          style={{ color: govTheme.text.secondary }}
        >
          Em vez de uma vitrine comercial, a página apresenta de forma direta os
          pilares que sustentam acolhimento, proteção de dados e gestão pública
          responsável.
        </p>
      </div>

      <div
        className="grid gap-4 sm:grid-cols-2"
        style={{
          borderRadius: "1rem",
        }}
      >
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-3xl border p-8"
            style={{
              backgroundColor: govTheme.background.section,
              borderColor: govTheme.border.subtle,
              boxShadow: govTheme.shadow.card,
            }}
          >
            <feature.icon
              size={22}
              className="mb-5"
              style={{ color: govTheme.brand.blue }}
            />
            <h3
              className="text-base font-semibold mb-2"
              style={{ color: govTheme.text.primary }}
            >
              {feature.title}
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: govTheme.text.secondary }}
            >
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
