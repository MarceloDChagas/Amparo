import React from "react";

import { colors } from "@/styles/colors";

export const CTASection: React.FC = () => (
  <section
    className="py-24"
    style={{ backgroundColor: colors.functional.background.primary }}
  >
    <div className="max-w-6xl mx-auto px-6">
      <div
        className="relative rounded-[3rem] p-12 md:p-20 text-center overflow-hidden"
        style={{
          background: colors.gradients.cta,
          boxShadow: `0 25px 60px ${colors.special.shadow.rose}`,
        }}
      >
        {/* Efeito decorativo interno com glow */}
        <div
          className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 rounded-full blur-3xl"
          style={{ backgroundColor: `${colors.accent[500]}40` }}
        ></div>
        <div
          className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 rounded-full blur-3xl"
          style={{ backgroundColor: `${colors.secondary[300]}33` }}
        ></div>

        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Pronto para fortalecer sua rede de proteção?
          </h2>
          <p
            className="text-xl mb-12 max-w-2xl mx-auto font-medium"
            style={{ color: colors.secondary[100] }}
          >
            Junte-se às instituições que já modernizaram a gestão de proteção à
            mulher com o Amparo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="px-10 py-4 rounded-2xl font-bold text-lg transition-transform shadow-xl hover:scale-105"
              style={{
                backgroundColor: "white",
                color: colors.accent[700],
              }}
            >
              Começar Agora Grátis
            </button>
            <button
              className="px-10 py-4 backdrop-blur-md rounded-2xl font-bold text-lg transition-all hover:bg-white/20"
              style={{
                backgroundColor: `${colors.primary[900]}66`,
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              Falar com Consultor
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
);
