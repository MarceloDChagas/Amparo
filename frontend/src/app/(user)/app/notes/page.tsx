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
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <EmergencyHeader variant="light" />

      <main className="relative flex flex-1 flex-col overflow-y-auto px-4 pb-28 pt-4 sm:px-6">
        <div className="mx-auto w-full max-w-md space-y-6">
          {/* Header */}
          <div className="flex items-start gap-3">
            <button
              onClick={() => router.back()}
              className="mt-1 rounded-full p-2 transition-colors hover:bg-black/5 shrink-0"
              style={{
                border: "1px solid rgba(180,140,160,0.3)",
                color: "#7a5565",
              }}
              aria-label="Voltar"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h2 className="text-xl font-bold" style={{ color: "#3a2530" }}>
                Minhas Notas
              </h2>
              <p className="mt-1 text-sm" style={{ color: "#7a5565" }}>
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
