"use client";
import { AnimatePresence, motion } from "framer-motion";
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

      <AnimatePresence mode="wait">
        {activeTab === "EMERGENCY" && (
          <motion.main
            key="emergency"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col items-center justify-start px-4 pt-4"
          >
            <EmergencyButton />
            <InstructionalCard />
            <ActionButtons />
          </motion.main>
        )}

        {activeTab === "CHECKIN" && <CheckInTab key="checkin" />}
      </AnimatePresence>

      <BottomNavigation />
    </div>
  );
}
