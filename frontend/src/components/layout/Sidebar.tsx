"use client";

/**
 * Sidebar do Dashboard Operacional.
 *
 * NRF10 — Acessibilidade:
 *   - <nav> com aria-label identifica a região para leitores de tela
 *   - aria-current="page" no link ativo
 *   - Cada link tem label visível + ícone (nunca só ícone)
 *
 * NRF09 — Usabilidade Sob Estresse: min-h-11 garante área clicável de 44px.
 * RN04 — Ícone de "Agressores" em vermelho (destructive) sinaliza dado sensível.
 */
import {
  AlertTriangle,
  Bell,
  FileText,
  Home,
  LogOut,
  Navigation,
  Route,
  ShieldAlert,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/presentation/hooks/useAuth";

// Cor neutra para ícones — diferenciação vem do estado ativo, não da cor
const iconNeutral = "rgba(249, 250, 251, 0.55)";

const routes = [
  { label: "Dashboard", icon: Home, href: "/dashboard", color: iconNeutral },
  { label: "Usuários", icon: Users, href: "/users", color: iconNeutral },
  // RN04 — vermelho reservado para seção de dado sensível/restrito
  {
    label: "Agressores",
    icon: ShieldAlert,
    href: "/aggressors",
    color: "var(--destructive)",
  },
  {
    label: "Alertas",
    icon: AlertTriangle,
    href: "/alerts",
    color: iconNeutral,
  },
  {
    label: "Deslocamentos",
    icon: Navigation,
    href: "/check-ins",
    color: iconNeutral,
  },
  {
    label: "Ocorrências",
    icon: FileText,
    href: "/occurrences",
    color: iconNeutral,
  },
  {
    label: "Rotas de Patrulha",
    icon: Route,
    href: "/patrol-routes",
    color: iconNeutral,
  },
  {
    label: "Notificações",
    icon: Bell,
    href: "/notifications",
    color: iconNeutral,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div
      className="flex h-full flex-col space-y-4 py-4 text-primary-foreground"
      style={{
        backgroundColor: "var(--surface-emphasis)",
        borderRight: "1px solid var(--ring)",
      }}
    >
      <div className="px-3 py-2 flex-1">
        <Link
          href="/dashboard"
          className="flex items-center pl-3 mb-6"
          aria-label="Amparo — Painel institucional"
        >
          <div>
            <h1
              className="text-2xl"
              style={{
                fontFamily: "var(--font-brand)",
                fontWeight: 800,
                color: "#c4705a",
                letterSpacing: "0.02em",
              }}
            >
              amparo
            </h1>
            <p
              className="text-[10px] font-medium"
              style={{
                color: "rgba(249, 250, 251, 0.40)",
                letterSpacing: "0.04em",
              }}
            >
              painel institucional
            </p>
          </div>
        </Link>

        {/* NRF10 — <nav> identifica a região de navegação principal para leitores de tela */}
        <nav aria-label="Navegação principal">
          <ul className="space-y-1 list-none p-0 m-0">
            {routes.map((route) => {
              const isActive = pathname === route.href;

              return (
                <li key={route.href}>
                  <Link
                    href={route.href}
                    // NRF10 — aria-current="page" informa o link ativo
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      // NRF09 — min-h-11 garante área clicável de 44px
                      "group flex w-full min-h-11 cursor-pointer items-center justify-start rounded-xl p-3 text-sm transition",
                    )}
                    style={{
                      fontWeight: isActive ? 600 : 400,
                      borderLeft: isActive
                        ? "2px solid rgba(255,255,255,0.55)"
                        : "2px solid transparent",
                      color: isActive
                        ? "rgba(255,255,255,0.95)"
                        : "rgba(249, 250, 251, 0.55)",
                      paddingLeft: "10px",
                    }}
                  >
                    <route.icon
                      className="mr-3 h-5 w-5 shrink-0"
                      aria-hidden="true"
                      style={{ color: route.color }}
                    />
                    {route.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="px-3 py-2">
        <Button
          onClick={logout}
          variant="ghost"
          className="w-full min-h-11 justify-start rounded-xl"
          style={{ color: "rgba(249, 250, 251, 0.72)" }}
          aria-label="Sair da conta"
        >
          <LogOut className="h-5 w-5 mr-3" aria-hidden="true" />
          Sair
        </Button>
      </div>
    </div>
  );
}
