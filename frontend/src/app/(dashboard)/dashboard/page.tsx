"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { govTheme } from "@/components/landing/gov-theme";
import { aggressorService } from "@/services/aggressor-service";
import { AuditLog, auditLogService } from "@/services/audit-log-service";
import { CheckIn, checkInService } from "@/services/check-in-service";
import {
  EmergencyAlert,
  emergencyAlertService,
} from "@/services/emergency-alert-service";
import { occurrenceService } from "@/services/occurrence-service";
import { Occurrence } from "@/services/occurrence-service";
import { userService } from "@/services/user-service";

import { DashboardStats } from "./components/DashboardStats";
import { LateCheckInAlert } from "./components/LateCheckInAlert";
import { ProximityAlert } from "./components/ProximityAlert";
import { RecentActivity } from "./components/RecentActivity";

const OccurrencesMap = dynamic(
  () => import("@/presentation/components/map/occurrences-map"),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex h-[400px] w-full items-center justify-center rounded-2xl border text-sm"
        style={{
          color: govTheme.text.muted,
          backgroundColor: govTheme.background.alt,
          borderColor: govTheme.border.subtle,
        }}
      >
        Carregando mapa...
      </div>
    ),
  },
);

export default function DashboardPage() {
  const [stats, setStats] = useState({
    users: 0,
    aggressors: 0,
    occurrences: 0,
    activeCheckIns: 0,
  });
  const [activities, setActivities] = useState<AuditLog[]>([]);
  const [activeAlert, setActiveAlert] = useState<EmergencyAlert | null>(null);
  const [activeCheckIns, setActiveCheckIns] = useState<CheckIn[]>([]);
  const [allOccurrences, setAllOccurrences] = useState<Occurrence[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    async function loadData() {
      try {
        const [
          users,
          aggressors,
          occurrencesData,
          recentLogs,
          alert,
          checkIns,
        ] = await Promise.all([
          userService.getAll(),
          aggressorService.getAll(),
          occurrenceService.getAll(),
          auditLogService.getRecent(),
          emergencyAlertService.getActive(),
          checkInService.getAllActive(),
        ]);
        setStats({
          users: users.length,
          aggressors: aggressors.length,
          occurrences: occurrencesData.length,
          activeCheckIns: checkIns.length,
        });
        setCurrentTime(Date.now());
        setActivities(recentLogs);
        setActiveAlert(alert);
        setActiveCheckIns(checkIns);
        setAllOccurrences(occurrencesData);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      }
    }
    loadData();
  }, []);

  return (
    <div
      className="min-h-screen p-6 md:p-10"
      style={{ backgroundColor: govTheme.background.page }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h2
            className="text-3xl font-bold tracking-tight"
            style={{ color: govTheme.text.primary }}
          >
            Painel de Controle
          </h2>
          <p style={{ color: govTheme.text.secondary }}>
            Visão geral do sistema de gestão Amparo.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <DashboardStats stats={stats} />
            <ProximityAlert alert={activeAlert} />
            {activeCheckIns
              .filter(
                (c) => new Date(c.expectedArrivalTime).getTime() < currentTime,
              )
              .map((c) => (
                <LateCheckInAlert key={c.id} checkIn={c} />
              ))}

            <div
              className="rounded-2xl border p-6"
              style={{
                backgroundColor: govTheme.background.section,
                borderColor: govTheme.border.subtle,
                boxShadow: govTheme.shadow.card,
              }}
            >
              <h3
                className="mb-4 text-lg font-semibold"
                style={{ color: govTheme.text.primary }}
              >
                Mapa de Calor de Vítimas
              </h3>
              <OccurrencesMap occurrences={allOccurrences} viewMode="heatmap" />
            </div>
          </div>

          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>
  );
}
