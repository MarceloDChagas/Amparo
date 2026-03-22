"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import {
  ActionButtons,
  BottomNavigation,
  EmergencyButton,
  EmergencyHeader,
  InstructionalCard,
  MainTabType,
} from "@/components/emergency";
import { CheckInTab } from "@/components/emergency/CheckInTab";
import { DocumentsTab } from "@/components/emergency/DocumentsTab";
import { colors } from "@/styles/colors";

export default function UserAppPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeMainTab = useMemo(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "REGISTERS" || tabParam === "DOCUMENTS") {
      return "REGISTERS";
    }

    return "HOME";
  }, [searchParams]);

  const handleMainTabChange = (tab: MainTabType) => {
    if (tab === "HOME") {
      router.push("/app");
      return;
    }

    if (tab === "REGISTERS") {
      router.push("/app?tab=REGISTERS");
      return;
    }

    if (tab === "SUPPORT") {
      router.push("/app/contacts");
      return;
    }

    if (tab === "MESSAGES") {
      router.push("/app/messages");
      return;
    }

    router.push("/app/security");
  };

  const [activeSecondaryTab, setActiveSecondaryTab] = useState<
    "EMERGENCY" | "CHECKIN"
  >("EMERGENCY");

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ backgroundColor: colors.primary[900] }}
    >
      <EmergencyHeader />

      <AnimatePresence>
        {activeMainTab === "HOME" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 px-4 flex justify-center w-full z-10"
          >
            <div
              role="tablist"
              aria-label="Modo de uso"
              className="bg-white/10 p-1 rounded-xl flex w-full max-w-xs ring-1 ring-white/20"
            >
              <button
                role="tab"
                aria-selected={activeSecondaryTab === "EMERGENCY"}
                onClick={() => setActiveSecondaryTab("EMERGENCY")}
                className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all ${
                  activeSecondaryTab === "EMERGENCY"
                    ? "bg-white shadow-sm"
                    : "text-white/80 hover:text-white"
                }`}
                style={
                  activeSecondaryTab === "EMERGENCY"
                    ? { color: "#7c3aed" }
                    : undefined
                }
              >
                Emergência
              </button>
              <button
                role="tab"
                aria-selected={activeSecondaryTab === "CHECKIN"}
                onClick={() => setActiveSecondaryTab("CHECKIN")}
                className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all ${
                  activeSecondaryTab === "CHECKIN"
                    ? "bg-white shadow-sm"
                    : "text-white/80 hover:text-white"
                }`}
                style={
                  activeSecondaryTab === "CHECKIN"
                    ? { color: "#0d9488" }
                    : undefined
                }
              >
                Deslocamento
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col relative">
        <AnimatePresence mode="wait">
          {activeMainTab === "HOME" ? (
            <motion.div
              key="home-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col"
            >
              {activeSecondaryTab === "EMERGENCY" && (
                <motion.main
                  key="emergency-content"
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

              {activeSecondaryTab === "CHECKIN" && (
                <CheckInTab key="checkin-content" />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="records-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              <DocumentsTab />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNavigation
        activeMainTab={activeMainTab}
        onTabChange={handleMainTabChange}
      />
    </div>
  );
}
