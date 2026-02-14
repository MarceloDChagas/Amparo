import { Bell } from "lucide-react";
import React from "react";

import { colors } from "@/styles/colors";

export function EmergencyHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <h1 className="text-white font-bold text-xl tracking-wider">AMPARO</h1>
      <div className="relative">
        <Bell size={24} color="white" />
        <div
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
          style={{
            backgroundColor: colors.secondary[300],
            color: colors.primary[900],
          }}
        >
          2
        </div>
        {/*TODO: Implementar notificações*/}
      </div>
    </header>
  );
}
