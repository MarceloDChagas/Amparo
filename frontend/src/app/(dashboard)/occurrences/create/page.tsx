"use client";

import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

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
      <div className="flex flex-col min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
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
    <div className="flex flex-col min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Avaliação de Chamados
        </h1>
        <p className="text-muted-foreground">
          Selecione um chamado de emergência para transformá-lo em ocorrência ou
          avaliá-lo.
        </p>
      </div>

      <div className="rounded-md border bg-white dark:bg-gray-800">
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
                          : "bg-gray-100 text-gray-800"
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
