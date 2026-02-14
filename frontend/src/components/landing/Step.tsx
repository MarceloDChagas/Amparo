import React from "react";

import { colors } from "@/styles/colors";

interface StepProps {
  number: string;
  title: string;
  description: string;
}

export const Step: React.FC<StepProps> = ({ number, title, description }) => (
  <div className="flex flex-col items-center text-center px-4">
    <div
      className="w-12 h-12 rounded-full text-white flex items-center justify-center font-bold text-xl mb-4 shadow-md"
      style={{
        background: colors.gradients.card,
        boxShadow: `0 0 20px ${colors.special.glow.pink}, 0 0 0 4px ${colors.functional.border.light}`,
      }}
    >
      {number}
    </div>
    <h4
      className="text-lg font-bold mb-2"
      style={{ color: colors.functional.text.primary }}
    >
      {title}
    </h4>
    <p
      className="text-sm leading-relaxed"
      style={{ color: colors.functional.text.secondary }}
    >
      {description}
    </p>
  </div>
);
