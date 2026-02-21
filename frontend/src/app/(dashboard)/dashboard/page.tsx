"use client";

import { useEffect, useState } from "react";

import { aggressorService } from "@/services/aggressor-service";
import { occurrenceService } from "@/services/occurrence-service";
import { victimService } from "@/services/victim-service";
import { colors } from "@/styles/colors";

import { DashboardStats } from "./components/DashboardStats";
import { ProximityAlert } from "./components/ProximityAlert";
import { RecentActivity } from "./components/RecentActivity";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    victims: 0,
    aggressors: 0,
    occurrences: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const [victims, aggressors, occurrences] = await Promise.all([
          victimService.getAll(),
          aggressorService.getAll(),
          occurrenceService.getAll(),
        ]);
        setStats({
          victims: victims.length,
          aggressors: aggressors.length,
          occurrences: occurrences.length,
        });
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      }
    }
    loadStats();
  }, []);

  return (
    <div
      className="min-h-screen p-6 md:p-10"
      style={{ backgroundColor: colors.functional.background.primary }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Painel de Controle
          </h2>
          <p style={{ color: colors.functional.text.secondary }}>
            Visão geral do sistema de gestão Amparo.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <DashboardStats stats={stats} />
            <ProximityAlert />
          </div>

          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
