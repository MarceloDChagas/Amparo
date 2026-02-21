import { ChevronRight, Shield } from "lucide-react";
import React from "react";

import { colors } from "@/styles/colors";

import { DashboardMockup } from "./DashboardMockup";

export const HeroSection: React.FC = () => (
  <header
    className="relative pt-32 pb-24 overflow-hidden"
    style={{ background: colors.gradients.darkRadial }}
  >
    {/* Subtle Background Glows instead of huge blobs */}
    <div
      className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b mix-blend-screen filter blur-[100px] opacity-30 pointer-events-none"
      style={{
        backgroundImage: `linear-gradient(to bottom, ${colors.accent[900]}, transparent)`,
      }}
    ></div>

    <div className="relative max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Column: Text Content */}
        <div className="text-left z-10">
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
            className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight"
            style={{ color: colors.functional.text.primary }}
          >
            Proteção e cuidado quando{" "}
            <span
              className="bg-gradient-to-r bg-clip-text text-transparent animate-gradient-x block mt-2"
              style={{
                backgroundImage: colors.gradients.hero,
                textShadow: `0 0 40px ${colors.special.glow.pink}`,
              }}
            >
              mais importa.
            </span>
          </h1>

          <p
            className="text-lg sm:text-xl mb-10 leading-relaxed max-w-xl"
            style={{ color: colors.functional.text.secondary }}
          >
            Plataforma digital especializada na gestão de casos de violência
            doméstica, conectando vítimas a uma rede de apoio segura e
            eficiente.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/login"
              className="px-8 py-4 text-white rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 group hover:scale-105"
              style={{
                background: colors.gradients.cta,
                boxShadow: `0 10px 40px ${colors.special.shadow.rose}`,
              }}
            >
              Acessar Painel
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </a>
            <button
              className="px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:bg-[#2a2d4a]"
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

          <div className="mt-12 flex items-center gap-6 opacity-60">
            <div
              className="text-sm font-semibold"
              style={{ color: colors.functional.text.tertiary }}
            >
              CONFIANÇA INSTITUCIONAL:
            </div>
            <div
              className="flex gap-4 font-bold text-sm tracking-widest"
              style={{ color: colors.functional.text.secondary }}
            >
              <span>GCM</span>
              <span>•</span>
              <span>SUAS</span>
              <span>•</span>
              <span>CRAS</span>
            </div>
          </div>
        </div>

        {/* Right Column: Dashboard Mockup */}
        <div className="relative z-10 hidden lg:block perspective-1000">
          {/* Decorative Outer Glow for Mockup */}
          <div
            className="absolute inset-0 rounded-3xl blur-2xl transform rotate-y-[-10deg] rotate-x-[5deg] scale-105"
            style={{
              background: `linear-gradient(45deg, ${colors.accent[700]}, ${colors.secondary[500]})`,
              opacity: 0.15,
            }}
          ></div>

          <DashboardMockup />
        </div>
      </div>
    </div>
  </header>
);
