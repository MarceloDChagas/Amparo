import { FileText, Grid, MessageCircle, Shield } from "lucide-react";
import React from "react";

import { colors } from "@/styles/colors";

export type MainTabType = "HOME" | "DOCUMENTS";

interface BottomNavigationProps {
  activeMainTab: MainTabType;
  onTabChange: (tab: MainTabType) => void;
}

export function BottomNavigation({
  activeMainTab,
  onTabChange,
}: BottomNavigationProps) {
  return (
    <nav
      className="bg-white rounded-t-3xl shadow-2xl px-4 py-3 pb-6 relative"
      style={{ boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.1)" }}
    >
      {/* Center HELP Button - positioned above the nav bar */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
        <button
          className="rounded-full w-16 h-16 flex items-center justify-center shadow-2xl active:scale-95 transition-transform"
          style={{ backgroundColor: colors.secondary[300] }}
          onClick={() => onTabChange("HOME")}
        >
          <span
            className="font-bold text-xs"
            style={{ color: colors.primary[900] }}
          >
            AJUDA
          </span>
        </button>
      </div>

      <div className="flex items-center justify-between pt-2">
        {/* Home / Emergency */}
        <button
          onClick={() => onTabChange("HOME")}
          className="flex flex-col items-center gap-1 flex-1 transition-colors"
        >
          <Shield
            size={24}
            style={{
              color:
                activeMainTab === "HOME"
                  ? colors.primary[600]
                  : colors.neutral[400],
            }}
          />
          <span
            className="text-[10px] font-medium"
            style={{
              color:
                activeMainTab === "HOME"
                  ? colors.primary[600]
                  : colors.neutral[400],
            }}
          >
            Início
          </span>
        </button>

        {/* Documents - Replaces "Rede" */}
        <button
          onClick={() => onTabChange("DOCUMENTS")}
          className="flex flex-col items-center gap-1 flex-1 transition-colors"
        >
          <FileText
            size={24}
            style={{
              color:
                activeMainTab === "DOCUMENTS"
                  ? colors.primary[600]
                  : colors.neutral[400],
            }}
          />
          <span
            className="text-[10px] font-medium"
            style={{
              color:
                activeMainTab === "DOCUMENTS"
                  ? colors.primary[600]
                  : colors.neutral[400],
            }}
          >
            Documentos
          </span>
        </button>

        {/* Spacer for center button */}
        <div className="flex-1" />

        {/* Messages - Placeholder */}
        <button className="flex flex-col items-center gap-1 flex-1 opacity-40 cursor-not-allowed">
          <MessageCircle size={24} style={{ color: colors.neutral[400] }} />
          <span className="text-[10px]" style={{ color: colors.neutral[400] }}>
            Mensagens
          </span>
        </button>

        {/* Menu - Placeholder */}
        <button className="flex flex-col items-center gap-1 flex-1 opacity-40 cursor-not-allowed">
          <Grid size={24} style={{ color: colors.neutral[400] }} />
          <span className="text-[10px]" style={{ color: colors.neutral[400] }}>
            Menu
          </span>
        </button>
      </div>
    </nav>
  );
}
