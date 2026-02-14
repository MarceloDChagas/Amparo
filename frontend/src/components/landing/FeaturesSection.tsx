import {
  BarChart3,
  ExternalLink,
  FileText,
  Lock,
  PhoneCall,
  Users,
  Zap,
} from "lucide-react";
import React from "react";

import { colors } from "@/styles/colors";

import { FeatureCard } from "./FeatureCard";

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Users,
      title: "Gestão de Vítimas",
      description:
        "Prontuário unificado com histórico psicossocial e jurídico em ambiente altamente seguro.",
      colorClass: `from-[${colors.accent[700]}] to-[${colors.accent[600]}]`,
    },
    {
      icon: FileText,
      title: "Registro de Ocorrências",
      description:
        "Linha do tempo detalhada de incidentes para facilitar o acompanhamento de medidas protetivas.",
      colorClass: `from-[${colors.secondary[600]}] to-[${colors.secondary[500]}]`,
    },
    {
      icon: PhoneCall,
      title: "Rede de Apoio",
      description:
        "Acionamento rápido de contatos de confiança e órgãos de segurança em um clique.",
      colorClass: `from-[${colors.accent[600]}] to-[${colors.accent[500]}]`,
    },
    {
      icon: Lock,
      title: "Segurança de Dados",
      description:
        "Criptografia de ponta a ponta e total conformidade com a LGPD para dados sensíveis.",
      colorClass: `from-[${colors.accent[800]}] to-[${colors.accent[700]}]`,
    },
    {
      icon: BarChart3,
      title: "Inteligência de Dados",
      description:
        "Relatórios analíticos para identificar manchas criminais e melhorar políticas públicas.",
      colorClass: `from-[${colors.secondary[700]}] to-[${colors.secondary[600]}]`,
    },
    {
      icon: Zap,
      title: "Interface Ágil",
      description:
        "Design otimizado para carregamento instantâneo, essencial em momentos de crise.",
      colorClass: `from-[${colors.accent[600]}] to-[${colors.secondary[600]}]`,
    },
  ];

  return (
    <section
      id="features"
      className="py-24"
      style={{ backgroundColor: colors.functional.background.tertiary }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2
              className="text-4xl font-bold mb-4"
              style={{ color: colors.functional.text.primary }}
            >
              Tecnologia a serviço da vida
            </h2>
            <p
              className="text-xl"
              style={{ color: colors.functional.text.secondary }}
            >
              Ferramentas desenhadas para oferecer agilidade no atendimento e
              precisão na gestão pública.
            </p>
          </div>
          <button
            className="flex items-center gap-2 font-bold hover:gap-3 transition-all"
            style={{ color: colors.secondary[300] }}
          >
            Explorar documentação <ExternalLink size={18} />
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, idx) => (
            <FeatureCard key={idx} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
};
