"use client";

import { EyeOff } from "lucide-react";
import { useEffect } from "react";

/**
 * Botão de saída rápida — NRF09/RN04.
 * Redireciona para página neutra via clique ou ESC.
 * Renderizado inline dentro do EmergencyHeader.
 * Forma blob orgânica — deformação horizontal, distinta do blob de emergência.
 */
interface QuickExitButtonProps {
  variant?: "dark" | "light";
}

export function QuickExitButton({ variant = "dark" }: QuickExitButtonProps) {
  const handleQuickExit = () => {
    window.location.replace("https://www.msn.com/pt-br/clima");
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleQuickExit();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isLight = variant === "light";

  return (
    <button
      type="button"
      onClick={handleQuickExit}
      aria-label="Saída rápida — fecha o app e abre uma página neutra"
      title="Saída rápida (ESC)"
      className="inline-flex items-center gap-1.5 rounded-full px-3 h-9 text-xs font-semibold transition-all hover:brightness-110 active:scale-95"
      style={
        isLight
          ? {
              color: "#dc2626",
              backgroundColor: "rgba(220,38,38,0.08)",
              border: "1px solid rgba(220,38,38,0.3)",
            }
          : {
              color: "#fecaca",
              backgroundColor: "rgba(220,38,38,0.18)",
              border: "1px solid rgba(220,38,38,0.35)",
            }
      }
    >
      <EyeOff size={14} aria-hidden="true" />
      <span>Sair</span>
      <span
        className="rounded border px-1.5 py-px text-[10px] font-medium hidden sm:inline"
        style={{
          borderColor: isLight
            ? "rgba(220,38,38,0.25)"
            : "rgba(248,113,113,0.3)",
          color: isLight ? "#dc2626" : "#fca5a5",
        }}
      >
        ESC
      </span>
    </button>
  );
}
