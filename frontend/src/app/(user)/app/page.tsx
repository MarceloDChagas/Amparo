"use client";
import { useState } from "react";

import {
  ActionButtons,
  BottomNavigation,
  EmergencyButton,
  EmergencyHeader,
  InstructionalCard,
} from "@/components/emergency";
import { CheckInTab } from "@/components/emergency/CheckInTab";
import { colors } from "@/styles/colors";

export default function UserAppPage() {
  const [activeTab, setActiveTab] = useState<"EMERGENCY" | "CHECKIN">(
    "EMERGENCY",
  );

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ backgroundColor: colors.primary[900] }}
    >
      <EmergencyHeader />

      {/* Tabs Switcher */}
      <div className="mt-4 px-4 flex justify-center w-full">
        <div className="bg-white/10 p-1 rounded-xl flex max-w-xs w-full">
          <button
            onClick={() => setActiveTab("EMERGENCY")}
            className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all ${
              activeTab === "EMERGENCY"
                ? "bg-white text-primary shadow-sm"
                : "text-white/80 hover:text-white"
            }`}
          >
            Emergência
          </button>
          <button
            onClick={() => setActiveTab("CHECKIN")}
            className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all ${
              activeTab === "CHECKIN"
                ? "bg-white text-primary shadow-sm"
                : "text-white/80 hover:text-white"
            }`}
          >
            Deslocamento
          </button>
        </div>
      </div>

      {activeTab === "EMERGENCY" && (
        <main className="flex-1 flex flex-col items-center justify-start px-4 pt-4">
          <EmergencyButton />
          <InstructionalCard />
          <ActionButtons />
        </main>
      )}

      {activeTab === "CHECKIN" && <CheckInTab />}

      <BottomNavigation />
    </div>
  );
}
