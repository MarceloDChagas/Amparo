"use client";

import {
  ActionButtons,
  BottomNavigation,
  EmergencyButton,
  EmergencyHeader,
  InstructionalCard,
} from "@/components/emergency";
import { colors } from "@/styles/colors";

export default function VictimAppPage() {
  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ backgroundColor: colors.primary[900] }}
    >
      <EmergencyHeader />

      <main className="flex-1 flex flex-col items-center justify-start px-4 pt-4">
        <EmergencyButton />
        <InstructionalCard />
        <ActionButtons />
      </main>

      <BottomNavigation />
    </div>
  );
}
