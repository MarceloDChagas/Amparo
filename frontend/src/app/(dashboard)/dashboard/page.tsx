"use client";

import { FileText, ShieldAlert, Users } from "lucide-react";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { aggressorService } from "@/services/aggressor-service";
import { occurrenceService } from "@/services/occurrence-service";
import { victimService } from "@/services/victim-service";

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
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <p className="text-muted-foreground">
        Bem-vindo ao sistema de gestão Amparo.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Vítimas
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.victims}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Agressores
            </CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.aggressors}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Ocorrências
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.occurrences}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
