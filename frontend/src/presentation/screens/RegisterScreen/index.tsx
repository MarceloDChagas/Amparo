"use client";

import { Shield } from "lucide-react";
import Link from "next/link";

import { RegisterForm } from "@/components/auth/RegisterForm";
import { colors } from "@/styles/colors";

export function RegisterScreen() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#1a1d3a]">
      {/* Left Column: Branding / Marketing */}
      <div
        className="relative hidden lg:flex flex-col justify-center items-start p-16 overflow-hidden"
        style={{ background: colors.gradients.darkRadial }}
      >
        {/* Decorative Glow */}
        <div
          className="absolute top-0 right-0 w-full h-[500px] mix-blend-screen filter blur-[100px] opacity-30 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to bottom, ${colors.accent[900]}, transparent)`,
          }}
        />

        <div className="relative z-10 w-full max-w-lg mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-3 mb-12 group transition-transform hover:scale-105"
          >
            <div
              className="p-3 rounded-2xl"
              style={{
                background: colors.gradients.cta,
                boxShadow: `0 0 20px ${colors.special.shadow.rose}`,
              }}
            >
              <Shield size={32} className="text-white" />
            </div>
            <span className="text-3xl font-extrabold text-white tracking-tight">
              Amparo
            </span>
          </Link>

          <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight text-white drop-shadow-sm">
            Junte-se à nossa
            <br />
            rede de proteção.
          </h1>

          <p
            className="text-lg leading-relaxed max-w-md"
            style={{ color: colors.functional.text.secondary }}
          >
            Cadastre-se para ter acesso a um sistema completo de gestão de casos
            e apoio contínuo.
          </p>
        </div>
      </div>

      {/* Right Column: Form */}
      <div className="flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        {/* Subtle background glow on mobile */}
        <div className="absolute inset-0 bg-[#1a1d3a] lg:hidden -z-10" />
        <div
          className="lg:hidden absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full blur-[100px] opacity-20 pointer-events-none"
          style={{ background: colors.accent[500] }}
        />

        <div
          className="w-full max-w-md p-8 sm:p-10 rounded-[2rem] relative z-10"
          style={{
            backgroundColor: `${colors.functional.background.secondary}cc`,
            backdropFilter: "blur(20px)",
            border: `1px solid ${colors.functional.border.light}`,
            boxShadow: `0 20px 40px ${colors.special.shadow.dark}`,
          }}
        >
          {/* Decorative Top Glow inside card */}
          <div
            className="absolute -top-10 -right-10 w-32 h-32 blur-3xl rounded-full opacity-20 pointer-events-none hidden lg:block"
            style={{ background: colors.accent[500] }}
          />

          <div className="mb-8 relative z-10">
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-10">
              <Link href="/" className="inline-flex items-center gap-3">
                <div
                  className="p-2.5 rounded-xl"
                  style={{ background: colors.gradients.cta }}
                >
                  <Shield size={24} className="text-white" />
                </div>
                <span className="text-2xl font-extrabold text-white tracking-tight">
                  Amparo
                </span>
              </Link>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Criar conta</h2>
            <p style={{ color: colors.functional.text.secondary }}>
              Preencha os dados abaixo e cadastre-se.
            </p>
          </div>

          <div className="relative z-10">
            <RegisterForm />
          </div>

          <div className="mt-8 text-center text-sm relative z-10">
            <span style={{ color: colors.functional.text.tertiary }}>
              Já tem uma conta?{" "}
            </span>
            <Link
              href="/login"
              className="font-semibold transition-colors hover:opacity-80"
              style={{ color: colors.secondary[300] }}
            >
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
