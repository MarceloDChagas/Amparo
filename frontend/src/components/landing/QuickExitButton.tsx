"use client";

import { EyeOff } from "lucide-react";
import React, { useEffect } from "react";

export const QuickExitButton: React.FC = () => {
  const quickExit = () => {
    window.location.replace("https://www.google.com.br/search?q=clima+tempo");
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        quickExit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <button
      onClick={quickExit}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 text-red-400 hover:text-white hover:bg-red-700 px-4 py-2 rounded-lg font-semibold text-xs transition-all active:scale-95"
      style={{
        backgroundColor: "rgba(127, 29, 29, 0.55)",
        border: "1px solid rgba(239, 68, 68, 0.35)",
        backdropFilter: "blur(8px)",
      }}
      title="Fecha o site e abre o Google instantaneamente (ESC)"
    >
      <EyeOff size={14} />
      <span className="hidden sm:inline">Saída rápida (ESC)</span>
      <span className="sm:hidden">Sair</span>
    </button>
  );
};
