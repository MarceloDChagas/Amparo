"use client";

import { useRouter } from "next/navigation";
import React from "react";

import {
  BottomNavigation,
  EmergencyHeader,
  MainTabType,
} from "@/components/emergency";

import { ContactsFormSection } from "./components/ContactsFormSection";
import { ContactsList } from "./components/ContactsList";
import { ContactsPageBackground } from "./components/ContactsPageBackground";
import { ContactsPageIntro } from "./components/ContactsPageIntro";

export default function UserContactsPage() {
  const router = useRouter();

  const handleTabChange = (tab: MainTabType) => {
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

  return (
    <div
      className="relative flex min-h-screen flex-col overflow-hidden"
      style={{
        backgroundColor: "#f4f7fb",
        backgroundImage:
          "radial-gradient(circle at top left, rgba(36, 75, 122, 0.13), transparent 34%), radial-gradient(circle at 85% 18%, rgba(31, 58, 95, 0.08), transparent 26%), linear-gradient(180deg, #f8fbfd 0%, #eef3f8 100%)",
      }}
    >
      <ContactsPageBackground />

      <EmergencyHeader variant="light" />

      <main className="relative flex flex-1 flex-col gap-6 overflow-y-auto px-4 pb-28 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-245 space-y-6">
          <ContactsPageIntro onBack={() => router.back()} />
          <ContactsList />
          <ContactsFormSection />
        </div>
      </main>

      <BottomNavigation activeMainTab="SUPPORT" onTabChange={handleTabChange} />
    </div>
  );
}
