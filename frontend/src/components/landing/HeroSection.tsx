import { ChevronRight, Shield } from "lucide-react";
import React from "react";

import { colors } from "@/styles/colors";

export const HeroSection: React.FC = () => (
  <header
    className="relative pt-32 pb-20 overflow-hidden"
    style={{ background: colors.gradients.darkRadial }}
  >
    {/* Animated Blobs - Dark Mode com Glow */}
    <div
      className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full mix-blend-screen filter blur-[100px] animate-blob"
      style={{
        backgroundColor: `${colors.accent[700]}33`,
        boxShadow: `0 0 100px ${colors.special.glow.violet}`,
      }}
    ></div>
    <div
      className="absolute top-[10%] right-[-5%] w-[400px] h-[400px] rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"
      style={{
        backgroundColor: `${colors.secondary[400]}33`,
        boxShadow: `0 0 80px ${colors.special.glow.pink}`,
      }}
    ></div>
    <div
      className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-4000"
      style={{
        backgroundColor: `${colors.accent[600]}26`,
        boxShadow: `0 0 120px ${colors.special.glow.violet}`,
      }}
    ></div>

    <div className="relative max-w-7xl mx-auto px-6">
      <div className="text-center max-w-4xl mx-auto">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-8 animate-fade-in backdrop-blur-sm"
          style={{
            backgroundColor: `${colors.accent[900]}66`,
            color: colors.secondary[200],
            border: `1px solid ${colors.functional.border.accent}`,
          }}
        >
          <Shield size={16} />
          <span>SISTEMA DE PROTEÇÃO INTEGRADO</span>
        </div>

        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]"
          style={{ color: colors.functional.text.primary }}
        >
          Proteção e cuidado quando{" "}
          <span
            className="bg-gradient-to-r bg-clip-text text-transparent animate-gradient-x"
            style={{
              backgroundImage: colors.gradients.hero,
              textShadow: `0 0 40px ${colors.special.glow.pink}`,
            }}
          >
            mais importa.
          </span>
        </h1>

        <p
          className="text-lg sm:text-xl mb-10 leading-relaxed max-w-2xl mx-auto"
          style={{ color: colors.functional.text.secondary }}
        >
          Plataforma digital especializada na gestão de casos de violência
          doméstica, conectando vítimas a uma rede de apoio segura e eficiente.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="/login"
            className="w-full sm:w-auto px-10 py-4 text-white rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 group hover:scale-105"
            style={{
              background: colors.gradients.cta,
              boxShadow: `0 10px 40px ${colors.special.shadow.rose}`,
            }}
          >
            Acessar Painel
            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </a>
          <button
            className="w-full sm:w-auto px-10 py-4 rounded-2xl font-bold text-lg transition-all hover:bg-[#2a2d4a]"
            style={{
              backgroundColor: `${colors.functional.background.secondary}22`,
              color: colors.secondary[200],
              border: `2px solid ${colors.functional.border.light}`,
              backdropFilter: "blur(10px)",
            }}
          >
            Ver Demonstração
          </button>
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-8 opacity-50 transition-all duration-700 hover:opacity-100">
          <div
            className="flex items-center gap-2 font-bold text-xl"
            style={{ color: colors.functional.text.tertiary }}
          >
            GUARDA MUNICIPAL
          </div>
          <div
            className="flex items-center gap-2 font-bold text-xl"
            style={{ color: colors.functional.text.tertiary }}
          >
            PREFEITURA
          </div>
          <div
            className="flex items-center gap-2 font-bold text-xl"
            style={{ color: colors.functional.text.tertiary }}
          >
            ASSISTÊNCIA SOCIAL
          </div>
        </div>
      </div>
    </div>
  </header>
);
