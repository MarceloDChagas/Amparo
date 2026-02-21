import { ArrowRight, ShieldCheck } from "lucide-react";
import React from "react";

import { colors } from "@/styles/colors";

export const CTASection: React.FC = () => (
  <section
    className="py-32 relative overflow-hidden"
    style={{ backgroundColor: colors.functional.background.primary }}
  >
    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#3d3d4e] to-transparent" />

    <div className="max-w-5xl mx-auto px-6">
      <div
        className="relative rounded-[2.5rem] p-12 md:p-20 text-center overflow-hidden border"
        style={{
          background: `linear-gradient(135deg, ${colors.functional.background.secondary}, ${colors.primary[900]})`,
          borderColor: colors.functional.border.light,
          boxShadow: `0 30px 60px -15px ${colors.special.shadow.dark}`,
        }}
      >
        {/* Decorative elements */}
        <div
          className="absolute top-0 right-0 -mt-24 -mr-24 w-72 h-72 rounded-full blur-3xl opacity-40 pointer-events-none"
          style={{ backgroundColor: colors.accent[500] }}
        ></div>
        <div
          className="absolute bottom-0 left-0 -mb-24 -ml-24 w-72 h-72 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: colors.secondary[500] }}
        ></div>

        <div className="relative z-10 flex flex-col items-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-xl"
            style={{
              background: colors.gradients.cta,
              boxShadow: `0 0 30px ${colors.special.shadow.rose}`,
            }}
          >
            <ShieldCheck size={32} color="white" />
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            Pronto para transformar <br className="hidden md:block" /> a rede de
            proteção?
          </h2>

          <p
            className="text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium"
            style={{ color: colors.functional.text.secondary }}
          >
            Integre sua instituição ao sistema Amparo e garanta uma resposta
            mais rápida, segura e coordenada para casos de violência doméstica.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center w-full max-w-md mx-auto sm:max-w-none">
            <button
              className="px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 group hover:-translate-y-1 shadow-xl"
              style={{
                backgroundColor: "white",
                color: colors.primary[900],
              }}
            >
              Começar Implementação
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
            <button
              className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:bg-white/10"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
              }}
            >
              Falar com Especialista
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
);
