import { Grid, MapPin, MessageCircle } from "lucide-react";
import React from "react";

import { colors } from "@/styles/colors";

export function BottomNavigation() {
  return (
    <nav
      className="bg-white rounded-t-3xl shadow-2xl px-4 py-3 pb-6 relative"
      style={{ boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.1)" }}
    >
      {/* Center HELP Button - positioned above the nav bar */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
        <button
          className="rounded-full w-16 h-16 flex items-center justify-center shadow-2xl"
          style={{ backgroundColor: colors.secondary[300] }}
        >
          <span
            className="font-bold text-sm"
            style={{ color: colors.primary[900] }}
          >
            AJUDA
          </span>
        </button>
      </div>

      <div className="flex items-center justify-between pt-2">
        {/* Forums */}
        <button className="flex flex-col items-center gap-1 flex-1">
          <MessageCircle size={24} style={{ color: colors.neutral[700] }} />
          <span className="text-xs" style={{ color: colors.neutral[700] }}>
            Fóruns
          </span>
        </button>

        {/* Network */}
        <button className="flex flex-col items-center gap-1 flex-1">
          <MapPin size={24} style={{ color: colors.neutral[700] }} />
          <span className="text-xs" style={{ color: colors.neutral[700] }}>
            Rede
          </span>
        </button>

        {/* Spacer for center button */}
        <div className="flex-1" />

        {/* Messages */}
        <button className="flex flex-col items-center gap-1 flex-1">
          <MessageCircle size={24} style={{ color: colors.neutral[700] }} />
          <span className="text-xs" style={{ color: colors.neutral[700] }}>
            Mensagens
          </span>
        </button>

        {/* Menu */}
        <button className="flex flex-col items-center gap-1 flex-1">
          <Grid size={24} style={{ color: colors.neutral[700] }} />
          <span className="text-xs" style={{ color: colors.neutral[700] }}>
            Menu
          </span>
        </button>
      </div>
    </nav>
  );
}
