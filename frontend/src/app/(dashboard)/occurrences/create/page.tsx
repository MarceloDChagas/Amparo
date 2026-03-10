"use client";

import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

import { govTheme } from "@/components/landing/gov-theme";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetEmergencyAlerts } from "@/data/hooks/use-get-emergency-alerts";
import { OccurrenceForm } from "@/presentation/components/forms/occurrence-form";
import { EmergencyAlert } from "@/services/emergency-alert-service";

export default function CreateOccurrencePage() {
  const { data: alerts, isLoading } = useGetEmergencyAlerts();
  const [selectedAlert, setSelectedAlert] = useState<EmergencyAlert | null>(
    null,
  );

  if (selectedAlert) {
    return (
      <div
        className="flex min-h-screen flex-col p-6"
        style={{ backgroundColor: govTheme.background.page }}
      >
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => setSelectedAlert(null)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para os Chamados
          </Button>
        </div>
        <div className="flex items-center justify-center">
          <OccurrenceForm selectedAlert={selectedAlert} />
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen flex-col p-6"
      style={{ backgroundColor: govTheme.background.page }}
    >
      <div className="mb-6">
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: govTheme.text.primary }}
        >
          Avaliação de Chamados
        </h1>
        <p style={{ color: govTheme.text.secondary }}>
          Selecione um chamado de emergência para transformá-lo em ocorrência ou
          avaliá-lo.
        </p>
      </div>

      <div
        className="rounded-2xl border"
        style={{
          borderColor: govTheme.border.subtle,
          backgroundColor: govTheme.background.section,
          boxShadow: govTheme.shadow.card,
        }}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Localização (Lat, Lng)</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Carregando chamados...
                </TableCell>
              </TableRow>
            ) : alerts && alerts.length > 0 ? (
              alerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>
                    {format(new Date(alert.createdAt), "dd/MM/yyyy HH:mm:ss")}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        alert.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {alert.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedAlert(alert)}
                    >
                      Avaliar e Registrar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Nenhum chamado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
