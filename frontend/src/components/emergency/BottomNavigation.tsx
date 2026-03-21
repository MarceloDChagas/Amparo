/**
 * Navegação inferior do app da vítima.
 *
 * NRF10 — Acessibilidade:
 *   - aria-label na <nav> identifica a região de navegação
 *   - aria-current="page" no tab ativo (leitores de tela)
 *   - Cada botão tem label visível + ícone (nunca só ícone)
 *
 * NRF09 — Usabilidade Sob Estresse:
 *   - Área de toque mínima: py-2 + ícone + texto ≈ 56px por tab
 *   - Tokens do contexto victim (violeta) em vez de azul institucional
 */
import {
  FileText,
  House,
  MessageCircle,
  ShieldCheck,
  Users,
} from "lucide-react";
import React from "react";

export type MainTabType =
  | "HOME"
  | "REGISTERS"
  | "SUPPORT"
  | "MESSAGES"
  | "PROFILE";

interface BottomNavigationProps {
  activeMainTab: MainTabType;
  onTabChange: (tab: MainTabType) => void;
}

const tabs: Array<{
  id: MainTabType;
  label: string;
  icon: React.ComponentType<{ size?: number; "aria-hidden"?: boolean }>;
}> = [
  { id: "HOME", label: "Início", icon: House },
  { id: "REGISTERS", label: "Registros", icon: FileText },
  { id: "SUPPORT", label: "Rede de apoio", icon: Users },
  { id: "MESSAGES", label: "Mensagens", icon: MessageCircle },
  { id: "PROFILE", label: "Perfil e segurança", icon: ShieldCheck },
];

export function BottomNavigation({
  activeMainTab,
  onTabChange,
}: BottomNavigationProps) {
  return (
    <nav
      aria-label="Navegação principal"
      className="rounded-t-[28px] border-t px-2 py-3 pb-6"
      style={{
        backgroundColor: "rgba(255,255,255,0.96)",
        borderColor: "rgba(168, 184, 203, 0.45)",
        boxShadow: "0 -12px 32px rgba(15, 23, 42, 0.08)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="mx-auto flex max-w-3xl items-start justify-between gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeMainTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              // NRF10 — aria-current="page" informa o tab ativo para leitores de tela
              aria-current={isActive ? "page" : undefined}
              className="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 transition-colors"
              style={{
                backgroundColor: isActive
                  ? "rgba(124, 58, 237, 0.10)"
                  : "transparent",
              }}
            >
              {/* Indicador pip acima do ícone ativo — reforça o estado além da cor */}
              <div
                aria-hidden="true"
                className="mb-0.5 rounded-full transition-all duration-200"
                style={{
                  width: isActive ? "20px" : "0px",
                  height: "2px",
                  backgroundColor: isActive ? "var(--primary)" : "transparent",
                }}
              />

              {/* NRF10 — ícone decorativo, label visível carrega o significado */}
              <Icon
                size={21}
                aria-hidden={true}
                style={{
                  color: isActive
                    ? "var(--primary)"
                    : "var(--muted-foreground)",
                }}
              />
              <span
                className="text-center text-[10px] leading-tight"
                style={{
                  // font-semibold no ativo torna a orientação legível sem depender só de cor
                  fontWeight: isActive ? 600 : 400,
                  color: isActive
                    ? "var(--primary)"
                    : "var(--muted-foreground)",
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
