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
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-full font-bold shadow-2xl transition-all transform hover:scale-105 active:scale-95 group"
      title="Fecha o site e abre o Google instantaneamente (ESC)"
    >
      <EyeOff size={20} />
      <span className="hidden md:inline">SAIR RÁPIDO (ESC)</span>
      <span className="md:hidden">SAIR</span>
    </button>
  );
};
