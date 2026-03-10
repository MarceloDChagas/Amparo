"use client";

import { EyeOff } from "lucide-react";
import React, { useEffect } from "react";

export function QuickExitButton() {
  const handleQuickExit = () => {
    window.location.replace("https://www.msn.com/pt-br/clima");
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleQuickExit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="fixed right-4 top-4 z-100 md:right-6 md:top-5">
      <button
        type="button"
        onClick={handleQuickExit}
        className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-all hover:-translate-y-0.5"
        style={{
          color: "#fffaf8",
          backgroundColor: "rgba(166, 60, 60, 0.94)",
          border: "1px solid rgba(255, 250, 248, 0.28)",
          boxShadow: "0 12px 28px rgba(86, 29, 29, 0.22)",
          backdropFilter: "blur(10px)",
        }}
        title="Saída rápida: fecha o site e abre uma página neutra (ESC)"
      >
        <EyeOff size={16} />
        <span>Saída rápida</span>
        <span className="hidden rounded-full border border-white/20 px-2 py-0.5 text-[11px] font-medium md:inline">
          ESC
        </span>
      </button>
    </div>
  );
}
