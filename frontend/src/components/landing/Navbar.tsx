"use client";

import { ShieldCheck } from "lucide-react";
import React from "react";

import { colors } from "@/styles/colors";

interface NavbarProps {
  scrolled: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ scrolled }) => (
  <nav
    className={`fixed top-0 w-full z-40 transition-all duration-300 ${
      scrolled ? "backdrop-blur-lg shadow-lg py-3" : "bg-transparent py-6"
    }`}
    style={
      scrolled
        ? {
            backgroundColor: colors.functional.background.light,
            borderBottom: `1px solid ${colors.neutral[200]}`,
          }
        : undefined
    }
  >
    <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
      <div className="flex items-center gap-2.5">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shadow-lg"
          style={{ background: colors.gradients.card }}
        >
          <ShieldCheck className="text-white w-5 h-5" />
        </div>
        <span
          className="text-xl font-bold tracking-tight bg-gradient-to-r bg-clip-text text-transparent"
          style={{ backgroundImage: colors.gradients.primary }}
        >
          Amparo
        </span>
      </div>
      <div className="flex items-center gap-6">
        <a
          href="#features"
          className={`hidden md:block text-sm font-medium transition-colors ${scrolled ? "" : "text-white/90 hover:text-white"}`}
          style={scrolled ? { color: colors.neutral[700] } : undefined}
        >
          Funcionalidades
        </a>
        <a
          href="/login"
          className={`px-5 py-2 text-sm font-semibold rounded-xl transition-all ${scrolled ? "" : "text-white/90 hover:bg-white/10"}`}
          style={scrolled ? { color: colors.accent[700] } : undefined}
        >
          Entrar
        </a>
        <button
          className="hidden sm:block px-5 py-2 text-white text-sm font-semibold rounded-xl shadow-md transition-all hover:scale-105"
          style={{ background: colors.gradients.cta }}
        >
          Criar Conta
        </button>
      </div>
    </div>
  </nav>
);
