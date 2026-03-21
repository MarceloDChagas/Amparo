"use client";

/**
 * Cabeçalho do Dashboard Operacional.
 *
 * RF04 — Dashboard Operacional: breadcrumb dinâmico identifica a seção atual.
 * NRF10 — Acessibilidade: avatar com aria-label, toggle de dark mode com aria-pressed.
 * RN04 — Avatar exibe inicial do nome (dado não-sensível) com aria-label completo.
 */
import { Moon, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { govTheme } from "@/components/landing/gov-theme";
import { useAuth } from "@/presentation/hooks/useAuth";

const pathToTitle: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/users": "Usuários",
  "/aggressors": "Agressores",
  "/occurrences": "Ocorrências",
  "/notifications": "Notificações",
};

function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof document === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  });

  const toggle = () => {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    setIsDark(next);
  };

  return { isDark, toggle };
}

export function Header() {
  const { user } = useAuth();
  const pathname = usePathname();
  const { isDark, toggle } = useDarkMode();

  // RF04 — título derivado da rota atual; fallback para segmentos dinâmicos
  const title =
    pathToTitle[pathname] ??
    pathToTitle[`/${pathname.split("/")[1]}`] ??
    "Dashboard";

  return (
    <header
      className="flex h-16 items-center justify-between px-6"
      style={{
        borderBottom: `1px solid ${govTheme.border.subtle}`,
        backgroundColor: "rgba(255,255,255,0.94)",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* RF04 — breadcrumb dinâmico via usePathname */}
      <div
        className="text-lg font-semibold"
        style={{ color: govTheme.text.primary }}
        aria-label={`Seção atual: ${title}`}
      >
        {title}
      </div>

      <div className="flex items-center gap-3">
        {/* Toggle dark mode — preferência visual do operador */}
        <button
          onClick={toggle}
          aria-pressed={isDark}
          aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
          className="flex items-center justify-center h-9 w-9 rounded-lg transition-colors hover:bg-muted"
          style={{ color: govTheme.text.muted }}
        >
          {isDark ? (
            <Sun size={18} aria-hidden="true" />
          ) : (
            <Moon size={18} aria-hidden="true" />
          )}
        </button>

        <div className="text-sm text-right">
          <p className="font-medium" style={{ color: govTheme.text.primary }}>
            {user?.name || "Usuário"}
          </p>
          <p className="text-xs" style={{ color: govTheme.text.muted }}>
            {user?.email}
          </p>
        </div>

        {/* NRF10 — aria-label com nome completo para leitores de tela */}
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold text-sm"
          role="img"
          aria-label={`Avatar de ${user?.name || "Usuário"}`}
          style={{
            color: govTheme.text.inverse,
            backgroundColor: govTheme.brand.blue,
          }}
        >
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
}
