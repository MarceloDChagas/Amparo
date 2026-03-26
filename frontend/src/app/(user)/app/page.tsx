"use client";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
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
import { useGetEmergencyContacts } from "@/data/hooks/use-get-emergency-contacts";
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

  const { data: contacts } = useGetEmergencyContacts();
  const hasNoContacts = contacts !== undefined && contacts.length === 0;

  const [activeSecondaryTab, setActiveSecondaryTab] = useState<
    "EMERGENCY" | "CHECKIN"
  >("EMERGENCY");

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <EmergencyHeader variant="light" />

      <AnimatePresence>
        {activeMainTab === "HOME" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 px-4 flex justify-center w-full z-10"
          >
            <div
              className="p-1 rounded-full flex w-full max-w-xs"
              style={{
                backgroundColor: "rgba(180,140,160,0.18)",
                boxShadow: "inset 0 1px 3px rgba(58,37,48,0.08)",
              }}
            >
              <button
                onClick={() => setActiveSecondaryTab("EMERGENCY")}
                className={`flex-1 py-3 text-xs font-medium rounded-full transition-all`}
                style={
                  activeSecondaryTab === "EMERGENCY"
                    ? {
                        backgroundColor: "white",
                        color: "#c4705a",
                        boxShadow: "0 1px 4px rgba(196,112,90,0.2)",
                      }
                    : { color: "#7a5565" }
                }
              >
                Emergência
              </button>
              <button
                onClick={() => setActiveSecondaryTab("CHECKIN")}
                className={`flex-1 py-3 text-xs font-medium rounded-full transition-all`}
                style={
                  activeSecondaryTab === "CHECKIN"
                    ? {
                        backgroundColor: "white",
                        color: "#5a9e8a",
                        boxShadow: "0 1px 4px rgba(90,158,138,0.2)",
                      }
                    : { color: "#3a2530" }
                }
              >
                Trajeto seguro
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

                  {hasNoContacts && (
                    <Link
                      href="/app/contacts"
                      className="w-full max-w-xs mb-2 flex items-center gap-3 rounded-xl bg-amber-500/15 border border-amber-400/30 px-4 py-3 transition-colors hover:bg-amber-500/20"
                    >
                      <AlertTriangle
                        size={18}
                        className="shrink-0 text-amber-400"
                      />
                      <p className="text-xs text-amber-200 leading-snug">
                        <span className="font-semibold">
                          Cadastre ao menos 1 contato
                        </span>{" "}
                        para que o alerta de emergência funcione.
                      </p>
                    </Link>
                  )}

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
