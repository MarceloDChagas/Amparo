"use client";

import { BellRing, LogOut, ShieldCheck, UserCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  BottomNavigation,
  EmergencyHeader,
  MainTabType,
} from "@/components/emergency";
import { useAuth } from "@/presentation/hooks/useAuth";

export default function UserSecurityPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

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
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <EmergencyHeader variant="light" />

      <main className="relative flex flex-1 flex-col gap-6 overflow-y-auto px-4 pb-28 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-245 space-y-6">
          <div>
            <h2
              className="text-xl font-bold leading-tight sm:text-2xl"
              style={{ color: "#3a2530" }}
            >
              Perfil e segurança
            </h2>
            <p className="mt-1 text-sm" style={{ color: "#7a5565" }}>
              Revise seus dados e use recursos de saída e proteção com mais
              segurança.
            </p>
          </div>

          <div
            className="rounded-[24px] border p-5 sm:p-7"
            style={{
              borderColor: "rgba(180,140,160,0.25)",
              backgroundColor: "rgba(255,255,255,0.55)",
              boxShadow: "0 4px 24px rgba(58,37,48,0.07)",
              backdropFilter: "blur(8px)",
            }}
          >
            {/* Identificação */}
            <div className="mb-5 flex items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-full"
                style={{ backgroundColor: "rgba(196,112,90,0.12)" }}
              >
                <UserCircle2 size={22} style={{ color: "#c4705a" }} />
              </div>
              <div>
                <h3
                  className="text-base font-semibold"
                  style={{ color: "#3a2530" }}
                >
                  {user.name}
                </h3>
                <p className="text-sm" style={{ color: "#7a5565" }}>
                  {user.email}
                </p>
              </div>
            </div>

            {/* Info cards */}
            <div className="space-y-3">
              <div
                className="rounded-2xl border px-4 py-4"
                style={{
                  borderColor: "rgba(122,181,160,0.25)",
                  backgroundColor: "rgba(122,181,160,0.08)",
                }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <ShieldCheck size={16} style={{ color: "#5a9e8a" }} />
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "#3a2530" }}
                  >
                    Proteção da conta
                  </p>
                </div>
                <p className="text-sm" style={{ color: "#7a5565" }}>
                  Seu acesso está vinculado ao ambiente protegido do Amparo e só
                  deve ser usado em dispositivos confiáveis.
                </p>
              </div>

              <div
                className="rounded-2xl border px-4 py-4"
                style={{
                  borderColor: "rgba(196,112,90,0.20)",
                  backgroundColor: "rgba(196,112,90,0.06)",
                }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <BellRing size={16} style={{ color: "#c4705a" }} />
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "#3a2530" }}
                  >
                    Notificações e avisos
                  </p>
                </div>
                <p className="text-sm" style={{ color: "#7a5565" }}>
                  Consulte a aba de mensagens para revisar orientações, alertas
                  e retornos da sua rede de apoio.
                </p>
              </div>
            </div>

            {/* Ações */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => router.push("/app/messages")}
                className="h-12 rounded-[14px] border text-sm font-semibold transition-colors"
                style={{
                  borderColor: "rgba(196,112,90,0.25)",
                  backgroundColor: "rgba(255,255,255,0.70)",
                  color: "#c4705a",
                }}
              >
                Abrir mensagens
              </button>
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="h-12 rounded-[14px] border text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                style={{
                  borderColor: "rgba(180,140,160,0.25)",
                  backgroundColor: "rgba(255,255,255,0.70)",
                  color: "#7a5565",
                }}
              >
                <LogOut size={16} />
                Sair em segurança
              </button>
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation activeMainTab="PROFILE" onTabChange={handleTabChange} />
    </div>
  );
}
