"use client";

import { ArrowLeft, Plus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

import {
  BottomNavigation,
  EmergencyHeader,
  MainTabType,
} from "@/components/emergency";
import { EmergencyContactForm } from "@/presentation/components/forms/emergency-contact-form";
import { colors } from "@/styles/colors";

export default function UserContactsPage() {
  const router = useRouter();

  const handleTabChange = (tab: MainTabType) => {
    if (tab === "DOCUMENTS") {
      router.push("/app?tab=DOCUMENTS");
    } else {
      router.push("/app");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ backgroundColor: colors.primary[900] }}
    >
      {/* Background decoration */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ backgroundColor: colors.accent[500] }}
      />
      <div
        className="absolute bottom-24 left-0 w-48 h-48 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ backgroundColor: colors.accent[500] }}
      />

      <EmergencyHeader />

      <main className="flex-1 flex flex-col px-4 pb-4 overflow-y-auto gap-4">
        {/* Back + Page Title */}
        <div className="flex items-center gap-3 mt-1">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full transition-colors"
            style={{ backgroundColor: colors.overlay.medium }}
            aria-label="Voltar"
          >
            <ArrowLeft size={18} color="white" />
          </button>
          <div>
            <h2 className="text-white font-bold text-lg leading-tight">
              Contatos de Emergência
            </h2>
            <p
              className="text-xs"
              style={{ color: colors.functional.text.tertiary }}
            >
              Pessoas que serão notificadas em caso de alerta
            </p>
          </div>
        </div>

        {/* Info banner */}
        <div
          className="rounded-2xl p-4 flex items-center gap-3"
          style={{
            backgroundColor: colors.overlay.medium,
            border: `1px solid ${colors.functional.border.light}`,
          }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: colors.accent[600] }}
          >
            <Users size={18} color="white" />
          </div>
          <p
            className="text-sm"
            style={{ color: colors.functional.text.secondary }}
          >
            Seus contatos de confiança receberão um e-mail imediatamente ao
            acionar o alerta de emergência.
          </p>
        </div>

        {/* Form card */}
        <div
          className="rounded-3xl p-5 shadow-2xl"
          style={{ backgroundColor: colors.functional.background.card }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.accent[600] }}
            >
              <Plus size={16} color="white" />
            </div>
            <h3 className="font-semibold text-white text-base">
              Adicionar contato
            </h3>
          </div>

          {/* Override the form's default card wrapper with a transparent shell */}
          <div className="[&_.card]:bg-transparent [&_.card]:shadow-none [&_.card]:border-0 [&_label]:text-gray-300 [&_input]:bg-[#1f2138] [&_input]:border-[#3d3d4e] [&_input]:text-white [&_input::placeholder]:text-gray-500 [&_button[type=submit]]:bg-violet-700 [&_button[type=submit]]:border-0 [&_button[type=submit]]:text-white [&_select]:bg-[#1f2138] [&_select]:border-[#3d3d4e] [&_select]:text-white [&_[role=combobox]]:bg-[#1f2138] [&_[role=combobox]]:border-[#3d3d4e] [&_[role=combobox]]:text-white [&_p.text-muted-foreground]:text-gray-500">
            <EmergencyContactForm />
          </div>
        </div>
      </main>

      <BottomNavigation activeMainTab="HOME" onTabChange={handleTabChange} />
    </div>
  );
}
