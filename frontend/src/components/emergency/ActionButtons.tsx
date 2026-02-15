import { Phone, User, Users, Video } from "lucide-react";
import React from "react";

import { colors } from "@/styles/colors";

export function ActionButtons() {
  return (
    <div className="w-full max-w-md flex flex-col sm:flex-row gap-3 mb-8 px-4">
      {/* Emergency Contacts Button */}
      <button
        className="flex-1 rounded-full py-3 px-4 flex items-center justify-between shadow-lg transition-transform active:scale-95"
        style={{ backgroundColor: colors.secondary[300] }}
      >
        <div className="flex items-center gap-2">
          <Phone size={18} style={{ color: colors.primary[900] }} />
          <Users size={18} style={{ color: colors.primary[900] }} />
          <User size={18} style={{ color: colors.primary[900] }} />
        </div>
        <span
          className="font-semibold text-xs sm:text-sm whitespace-nowrap"
          style={{ color: colors.primary[900] }}
        >
          Contatos de Emergência
        </span>
      </button>

      {/* My Recordings Button */}
      <button
        className="rounded-full py-3 px-4 flex items-center justify-center shadow-lg transition-transform active:scale-95 min-w-[140px]"
        style={{ backgroundColor: colors.secondary[300] }}
      >
        <div className="flex flex-col items-center gap-1">
          <Video size={20} style={{ color: colors.primary[900] }} />
          <span
            className="font-semibold text-xs"
            style={{ color: colors.primary[900] }}
          >
            Minhas Gravações
          </span>
        </div>
      </button>
    </div>
  );
}
