"use client";

import { ArrowLeft, NotebookPen } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  BottomNavigation,
  EmergencyHeader,
  MainTabType,
} from "@/components/emergency";
import { NotesSection } from "@/components/notes/NotesSection";
import { useAuth } from "@/presentation/hooks/useAuth";

export default function UserNotesPage() {
  const router = useRouter();
  const { user } = useAuth();

  const handleTabChange = (tab: MainTabType) => {
    if (tab === "HOME") {
      router.push("/app");
      return;
    }

    if (tab === "REGISTERS") {
      router.push("/app?tab=REGISTERS");
      return;
    }

    if (tab === "SUPPORT") {
      router.push("/app/contacts");
      return;
    }

    if (tab === "MESSAGES") {
      router.push("/app/messages");
      return;
    }

    router.push("/app/security");
  };

  if (!user) {
    return null;
  }

  return (
    <div
      className="relative flex min-h-screen flex-col overflow-hidden"
      style={{
        backgroundColor: "#f4f7fb",
        backgroundImage:
          "radial-gradient(circle at top left, rgba(36, 75, 122, 0.13), transparent 34%), radial-gradient(circle at 85% 18%, rgba(31, 58, 95, 0.08), transparent 26%), linear-gradient(180deg, #f8fbfd 0%, #eef3f8 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1.5"
        style={{
          background:
            "linear-gradient(90deg, rgba(216, 191, 122, 0.78) 0 18%, rgba(36, 75, 122, 0.82) 18% 76%, rgba(47, 107, 87, 0.72) 76% 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(rgba(36, 75, 122, 0.06) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.24), rgba(0,0,0,0.06) 38%, transparent 72%)",
        }}
      />
      <div
        className="pointer-events-none absolute -right-12 top-12 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(36, 75, 122, 0.08)" }}
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-24 h-64 w-64 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(47, 107, 87, 0.06)" }}
      />

      <EmergencyHeader />

      <main className="relative flex flex-1 flex-col gap-6 overflow-y-auto px-4 pb-28 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-245 space-y-6">
          <div className="flex items-start gap-3">
            <button
              onClick={() => router.back()}
              className="rounded-full border border-border p-2 transition-colors hover:opacity-90 text-accent-foreground"
              style={{
                backgroundColor: "rgba(255,255,255,0.84)",
              }}
              aria-label="Voltar"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h2 className="text-xl font-bold leading-tight sm:text-2xl text-foreground">
                Minhas Notas
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Registre observações pessoais em um espaço protegido e de fácil
                acompanhamento.
              </p>
            </div>
          </div>

          <div
            className="flex items-start gap-3 rounded-4xl border px-4 py-4 shadow-sm"
            style={{
              backgroundColor: "rgba(255,255,255,0.9)",
              borderColor: "rgba(168, 184, 203, 0.65)",
            }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent">
              <NotebookPen size={18} className="text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              Suas notas ajudam a manter contexto, histórico e informações úteis
              para o seu acompanhamento dentro do Amparo.
            </p>
          </div>

          <div
            className="rounded-[24px] border p-5 sm:p-7"
            style={{
              borderColor: "#bfd0e0",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(247,250,253,0.98) 100%)",
              boxShadow:
                "0 20px 60px rgba(15, 23, 42, 0.08), 0 2px 12px rgba(36, 75, 122, 0.05)",
              backdropFilter: "blur(12px)",
            }}
          >
            <NotesSection userId={user.id} />
          </div>
        </div>
      </main>

      <BottomNavigation
        activeMainTab="REGISTERS"
        onTabChange={handleTabChange}
      />
    </div>
  );
}
