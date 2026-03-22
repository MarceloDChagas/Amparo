"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  BottomNavigation,
  EmergencyHeader,
  MainTabType,
} from "@/components/emergency";
import { NotesSection } from "@/components/notes/NotesSection";
import { useAuth } from "@/presentation/hooks/useAuth";
import { colors } from "@/styles/colors";

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

  if (!user) return null;

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ backgroundColor: colors.primary[900] }}
    >
      <EmergencyHeader />

      <main className="relative flex flex-1 flex-col overflow-y-auto px-4 pb-28 pt-4 sm:px-6">
        <div className="mx-auto w-full max-w-md space-y-6">
          {/* Header */}
          <div className="flex items-start gap-3">
            <button
              onClick={() => router.back()}
              className="mt-1 rounded-full border border-white/20 p-2 text-white/70 transition-colors hover:bg-white/10 shrink-0"
              aria-label="Voltar"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-white">Minhas Notas</h2>
              <p className="mt-1 text-sm text-white/60">
                Registre observações em um espaço protegido.
              </p>
            </div>
          </div>

          <NotesSection userId={user.id} />
        </div>
      </main>

      <BottomNavigation
        activeMainTab="REGISTERS"
        onTabChange={handleTabChange}
      />
    </div>
  );
}
