"use client";

import { X } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";

export function QuickExitButton() {
  const handleQuickExit = () => {
    // Redirect immediately to a neutral site
    // Using replace to avoid back-button issues
    window.location.replace("https://www.msn.com/pt-br/clima");
  };

  return (
    <div className="fixed top-4 right-4 z-[100] md:top-auto md:bottom-20 md:right-8">
      <Button
        variant="destructive"
        onClick={handleQuickExit}
        className="rounded-full shadow-2xl h-14 px-6 md:h-16 md:px-8 flex items-center gap-2 font-bold animate-pulse"
        style={{
          backgroundColor: "#dc2626",
          boxShadow: "0 0 20px rgba(220, 38, 38, 0.4)",
        }}
      >
        <X size={24} />
        <span>SAÍDA RÁPIDA</span>
      </Button>
    </div>
  );
}
