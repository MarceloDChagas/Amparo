"use client";

import { useEffect, useState } from "react";

import { aggressorService } from "@/services/aggressor-service";
import { AuditLog, auditLogService } from "@/services/audit-log-service";
import { CheckIn, checkInService } from "@/services/check-in-service";
import {
  EmergencyAlert,
  emergencyAlertService,
} from "@/services/emergency-alert-service";
import { occurrenceService } from "@/services/occurrence-service";
import { userService } from "@/services/user-service";
import { colors } from "@/styles/colors";

import { DashboardStats } from "./components/DashboardStats";
import { LateCheckInAlert } from "./components/LateCheckInAlert";
import { ProximityAlert } from "./components/ProximityAlert";
import { RecentActivity } from "./components/RecentActivity";

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
  const [currentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    async function loadData() {
      try {
        const [users, aggressors, occurrences, recentLogs, alert, checkIns] =
          await Promise.all([
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
          occurrences: occurrences.length,
          activeCheckIns: checkIns.length,
        });
        setCurrentTime(Date.now());
        setActivities(recentLogs);
        setActiveAlert(alert);
        setActiveCheckIns(checkIns);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      }
    }
    loadData();
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
            <ProximityAlert alert={activeAlert} />
            {activeCheckIns
              .filter(
                (c) => new Date(c.expectedArrivalTime).getTime() < currentTime,
              )
              .map((c) => (
                <LateCheckInAlert key={c.id} checkIn={c} />
              ))}
          </div>

          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>
  );
}
