"use client";

// see: /design-system — NRF09, NRF10, RN04
import {
  AlertTriangle,
  Bell,
  FileText,
  Home,
  Lock,
  LogOut,
  Navigation,
  Route,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/presentation/hooks/useAuth";

const iconNeutral = "rgba(249, 250, 251, 0.55)";

const operationRoutes = [
  { label: "Dashboard", icon: Home, href: "/dashboard", color: iconNeutral },
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
];

const cadastroRoutes = [
  { label: "Usuários", icon: Users, href: "/users", color: iconNeutral },
  // RN04 — âmbar (dado restrito) em vez de vermelho (reservado para alerta ativo)
  {
    label: "Agressores",
    icon: Lock,
    href: "/aggressors",
    color: "var(--warning)",
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

function NavGroup({
  label,
  routes,
  pathname,
}: {
  label: string;
  routes: typeof operationRoutes;
  pathname: string;
}) {
  return (
    <div className="mb-4">
      <p
        className="mb-1 px-3 text-[9px] font-semibold uppercase tracking-[0.1em]"
        style={{ color: "rgba(249,250,251,0.35)" }}
      >
        {label}
      </p>
      <ul className="space-y-1 list-none p-0 m-0">
        {routes.map((route) => {
          const isActive = pathname === route.href;
          return (
            <li key={route.href}>
              <Link
                href={route.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
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
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <div
      className="flex h-full flex-col py-4 text-primary-foreground"
      style={{
        backgroundColor: "var(--surface-emphasis)",
        borderRight: "1px solid var(--ring)",
      }}
    >
      <div className="px-3 py-2 flex-1">
        {/* ⑱ — subtítulo "painel institucional" removido */}
        <Link
          href="/dashboard"
          className="flex items-center pl-3 mb-6"
          aria-label="Amparo — Painel institucional"
        >
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
        </Link>

        <nav aria-label="Navegação principal">
          <NavGroup
            label="Operação"
            routes={operationRoutes}
            pathname={pathname}
          />
          <NavGroup
            label="Cadastros"
            routes={cadastroRoutes}
            pathname={pathname}
          />
        </nav>
      </div>

      {/* ⑯ — identidade do operador + Sair com borda visível */}
      <div
        className="px-3 py-2 border-t"
        style={{ borderColor: "rgba(249,250,251,0.12)" }}
      >
        {user && (
          <div className="px-3 mb-3">
            <p
              className="text-xs font-semibold truncate"
              style={{ color: "rgba(249,250,251,0.85)" }}
            >
              {user.name}
            </p>
            <p
              className="text-[10px] truncate"
              style={{ color: "rgba(249,250,251,0.40)" }}
            >
              {user.role}
            </p>
          </div>
        )}
        <Button
          onClick={logout}
          variant="ghost"
          className="w-full min-h-11 justify-start rounded-xl"
          style={{
            color: "rgba(249, 250, 251, 0.85)",
            border: "1px solid rgba(249,250,251,0.18)",
          }}
          aria-label="Sair da conta"
        >
          <LogOut className="h-5 w-5 mr-3" aria-hidden="true" />
          Sair
        </Button>
      </div>
    </div>
  );
}
