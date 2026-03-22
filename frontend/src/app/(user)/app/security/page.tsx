"use client";

import { BellRing, LogOut, ShieldCheck, UserCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  BottomNavigation,
  EmergencyHeader,
  MainTabType,
} from "@/components/emergency";
import { Button } from "@/components/ui/button";
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
      <EmergencyHeader />

      <main className="relative flex flex-1 flex-col gap-6 overflow-y-auto px-4 pb-28 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-245 space-y-6">
          <div>
            <h2 className="text-xl font-bold leading-tight sm:text-2xl text-foreground">
              Perfil e segurança
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Revise seus dados e use recursos de saída e proteção com mais
              segurança.
            </p>
          </div>

          <div className="rounded-[24px] border border-border p-5 sm:p-7 bg-card shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent">
                <UserCircle2 size={22} className="text-primary" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  {user.name}
                </h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-4xl border border-border px-4 py-4 bg-secondary">
                <div className="mb-2 flex items-center gap-2">
                  <ShieldCheck size={16} style={{ color: "var(--chart-2)" }} />
                  <p className="text-sm font-semibold text-foreground">
                    Proteção da conta
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Seu acesso está vinculado ao ambiente protegido do Amparo e só
                  deve ser usado em dispositivos confiáveis.
                </p>
              </div>

              <div className="rounded-4xl border border-border px-4 py-4 bg-secondary">
                <div className="mb-2 flex items-center gap-2">
                  <BellRing size={16} className="text-primary" />
                  <p className="text-sm font-semibold text-foreground">
                    Notificações e avisos
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Consulte a aba de mensagens para revisar orientações, alertas
                  e retornos da sua rede de apoio.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-[14px] border-ring text-accent-foreground bg-card"
                onClick={() => router.push("/app/messages")}
              >
                Abrir mensagens
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-[14px] border-ring text-muted-foreground bg-card"
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
              >
                <LogOut />
                Sair em segurança
              </Button>
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation activeMainTab="PROFILE" onTabChange={handleTabChange} />
    </div>
  );
}
