import { LucideIcon } from "lucide-react";
import React from "react";

import { colors } from "@/styles/colors";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  colorClass: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  colorClass,
}) => (
  <div
    className="group rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 backdrop-blur-md"
    style={{
      backgroundColor: colors.functional.background.card,
      border: `1px solid ${colors.functional.border.DEFAULT}`,
    }}
  >
    <div
      className={`w-14 h-14 bg-gradient-to-br ${colorClass} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg`}
    >
      <Icon className="w-7 h-7 text-white" />
    </div>
    <h3
      className="text-xl font-bold mb-3"
      style={{ color: colors.functional.text.primary }}
    >
      {title}
    </h3>
    <p
      className="leading-relaxed"
      style={{ color: colors.functional.text.secondary }}
    >
      {description}
    </p>
  </div>
);
