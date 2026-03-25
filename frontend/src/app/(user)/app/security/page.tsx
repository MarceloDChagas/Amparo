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
    if (tab === "HOME") { router.push("/app"); return; }
    if (tab === "REGISTERS") { router.push("/app?tab=REGISTERS"); return; }
    if (tab === "SUPPORT") { router.push("/app/contacts"); return; }
    if (tab === "MESSAGES") { router.push("/app/messages"); return; }
    router.push("/app/security");
  };

  if (!user) return null;

  return (
    <div
      className="relative flex min-h-screen flex-col overflow-hidden"
      style={{
        backgroundColor: "#f4f7fb",
        backgroundImage:
          "radial-gradient(circle at top left, rgba(36,75,122,0.13), transparent 34%), radial-gradient(circle at 85% 18%, rgba(31,58,95,0.08), transparent 26%), linear-gradient(180deg, #f8fbfd 0%, #eef3f8 100%)",
      }}
    >
      <EmergencyHeader variant="light" />

      <main className="relative flex flex-1 flex-col gap-6 overflow-y-auto px-4 pb-28 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-245 space-y-6">
          <div>
            <h2
              className="text-xl font-bold leading-tight sm:text-2xl"
              style={{ color: "#1f2937" }}
            >
              Perfil e segurança
            </h2>
            <p className="mt-1 text-sm" style={{ color: "#6b7280" }}>
              Revise seus dados e use recursos de saída e proteção com mais segurança.
            </p>
          </div>

          <div
            className="rounded-[24px] border p-5 sm:p-7"
            style={{
              borderColor: "#d8e1ea",
              backgroundColor: "#ffffff",
              boxShadow: "0 4px 24px rgba(15,23,42,0.07)",
            }}
          >
            {/* Identificação */}
            <div className="mb-5 flex items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-full"
                style={{ backgroundColor: "#e8f0f9" }}
              >
                <UserCircle2 size={22} style={{ color: "#244b7a" }} />
              </div>
              <div>
                <h3
                  className="text-base font-semibold"
                  style={{ color: "#1f2937" }}
                >
                  {user.name}
                </h3>
                <p className="text-sm" style={{ color: "#6b7280" }}>
                  {user.email}
                </p>
              </div>
            </div>

            {/* Info cards */}
            <div className="space-y-3">
              <div
                className="rounded-2xl border px-4 py-4"
                style={{ borderColor: "#d8e1ea", backgroundColor: "#f4f7fb" }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <ShieldCheck size={16} style={{ color: "#2f6b57" }} />
                  <p className="text-sm font-semibold" style={{ color: "#1f2937" }}>
                    Proteção da conta
                  </p>
                </div>
                <p className="text-sm" style={{ color: "#6b7280" }}>
                  Seu acesso está vinculado ao ambiente protegido do Amparo e só
                  deve ser usado em dispositivos confiáveis.
                </p>
              </div>

              <div
                className="rounded-2xl border px-4 py-4"
                style={{ borderColor: "#d8e1ea", backgroundColor: "#f4f7fb" }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <BellRing size={16} style={{ color: "#244b7a" }} />
                  <p className="text-sm font-semibold" style={{ color: "#1f2937" }}>
                    Notificações e avisos
                  </p>
                </div>
                <p className="text-sm" style={{ color: "#6b7280" }}>
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
                className="h-12 rounded-[14px] border text-sm font-semibold transition-colors hover:bg-gray-50"
                style={{
                  borderColor: "#d8e1ea",
                  backgroundColor: "#ffffff",
                  color: "#1f3a5f",
                }}
              >
                Abrir mensagens
              </button>
              <button
                type="button"
                onClick={() => { logout(); router.push("/login"); }}
                className="h-12 rounded-[14px] border text-sm font-semibold transition-colors hover:bg-gray-50 flex items-center justify-center gap-2"
                style={{
                  borderColor: "#d8e1ea",
                  backgroundColor: "#ffffff",
                  color: "#6b7280",
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
