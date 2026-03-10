import { BarChart3, FolderOpen, Lock, Siren } from "lucide-react";
import React from "react";

import { colors } from "@/styles/colors";

const features = [
  {
    icon: FolderOpen,
    title: "Prontuário Unificado",
    description:
      "Histórico psicossocial, jurídico e de ocorrências por vítima — em ambiente auditável, acessível apenas por profissionais autorizados.",
  },
  {
    icon: Lock,
    title: "Privacidade e LGPD",
    description:
      "Criptografia de ponta a ponta, controle de acesso por função e conformidade integral com a LGPD desde a arquitetura.",
  },
  {
    icon: Siren,
    title: "Alerta de Emergência",
    description:
      "Em situação de risco iminente, a vítima aciona a rede de apoio com um toque — notificando contatos e órgãos competentes.",
  },
  {
    icon: BarChart3,
    title: "Inteligência Territorial",
    description:
      "Visualização de padrões por região, perfil de risco e histórico de casos — para gestores tomarem decisões embasadas em dados.",
  },
];

export const FeaturesSection: React.FC = () => (
  <section
    id="features"
    className="py-24"
    style={{ backgroundColor: colors.functional.background.primary }}
  >
    <div className="max-w-6xl mx-auto px-6">
      <div className="mb-14">
        <p
          className="text-sm font-semibold tracking-widest uppercase mb-3"
          style={{ color: colors.accent[400] }}
        >
          Funcionalidades
        </p>
        <h2
          className="text-3xl font-bold"
          style={{ color: colors.functional.text.primary }}
        >
          Tecnologia a serviço da proteção
        </h2>
      </div>

      <div
        className="grid sm:grid-cols-2 gap-px"
        style={{
          border: `1px solid ${colors.functional.border.dark}`,
          borderRadius: "0.5rem",
          overflow: "hidden",
        }}
      >
        {features.map((feature) => (
          <div
            key={feature.title}
            className="p-8"
            style={{
              backgroundColor: colors.functional.background.card,
              borderRight: `1px solid ${colors.functional.border.dark}`,
              borderBottom: `1px solid ${colors.functional.border.dark}`,
            }}
          >
            <feature.icon
              size={22}
              className="mb-5"
              style={{ color: colors.accent[400] }}
            />
            <h3
              className="text-base font-semibold mb-2"
              style={{ color: colors.functional.text.primary }}
            >
              {feature.title}
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: colors.functional.text.secondary }}
            >
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
