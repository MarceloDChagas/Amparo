import React from "react";

import { colors } from "@/styles/colors";

interface StepProps {
  number: string;
  title: string;
  description: string;
}

export const Step: React.FC<StepProps> = ({ number, title, description }) => (
  <div className="flex flex-col relative group">
    {/* Connecting Line that highlights on hover (visible on desktop) */}
    <div
      className="hidden md:block absolute top-[28px] left-[50%] w-[100%] h-1 transition-colors duration-500"
      style={{
        backgroundColor: colors.functional.border.light,
        zIndex: 0,
      }}
    />

    <div className="flex flex-col items-center text-center px-4 relative z-10">
      <div
        className="w-14 h-14 rounded-2xl text-white flex items-center justify-center font-bold text-xl mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1"
        style={{
          backgroundColor: colors.accent[600],
          border: `1px solid ${colors.functional.border.light}`,
        }}
      >
        {number}
      </div>
      <h4
        className="text-xl font-bold mb-3"
        style={{ color: colors.functional.text.primary }}
      >
        {title}
      </h4>
      <p
        className="text-base leading-relaxed"
        style={{ color: colors.functional.text.secondary }}
      >
        {description}
      </p>
    </div>
  </div>
);
