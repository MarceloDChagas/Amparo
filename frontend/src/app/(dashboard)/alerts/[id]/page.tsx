"use client";

import { AlertTriangle, Clock, MapPin, Navigation, User } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import {
  AlertEvent,
  EmergencyAlert,
  emergencyAlertService,
} from "@/services/emergency-alert-service";

import { AlertStatusActions } from "./components/AlertStatusActions";
import { AlertTimeline } from "./components/AlertTimeline";

export default function EmergencyAlertDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const alertId = params.id as string;
  const [alertData, setAlertData] = useState<EmergencyAlert | null>(null);
  const [eventsData, setEventsData] = useState<AlertEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAlert = useCallback(async () => {
    try {
      const [data, events] = await Promise.all([
        emergencyAlertService.getById(alertId),
        emergencyAlertService.getEvents(alertId),
      ]);
      if (!data) {
        router.push("/dashboard");
        return;
      }
      setAlertData(data);
      setEventsData(events);
    } catch (error) {
      console.error("Failed to load emergency alert data", error);
    } finally {
      setLoading(false);
    }
  }, [alertId, router]);

  useEffect(() => {
    loadAlert();
  }, [loadAlert]);

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex justify-center items-center bg-background">
        <p className="animate-pulse text-xl text-foreground">
          Buscando coordenadas de emergência...
        </p>
      </div>
    );
  }

  if (!alertData) return null;

  const mapsUrl = `https://maps.google.com/maps?q=${alertData.latitude},${alertData.longitude}&z=16&output=embed`;

  return (
    <div className="p-6 md:p-10 min-h-screen bg-background">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-foreground">
              <span className="rounded-lg p-2 bg-destructive/10 text-destructive">
                <AlertTriangle size={32} />
              </span>
              Acionamento de Emergência
            </h2>
            <p className="mt-2 text-muted-foreground">
              Detalhes de rastreamento do alerta geolocalizado gerado
              instantaneamente.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-lg px-6 py-3 text-sm font-semibold transition hover:opacity-90 bg-primary text-primary-foreground"
          >
            Voltar ao Dashboard
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            {/* Status e ações do ciclo de vida */}
            <AlertStatusActions
              alertId={alertData.id}
              status={alertData.status}
              cancellationReason={alertData.cancellationReason}
              onStatusChange={loadAlert}
            />

            <div className="p-6 rounded-2xl border border-border flex flex-col gap-6 bg-card shadow-sm">
              <div>
                <h3 className="mb-4 border-b border-border pb-4 text-xl font-semibold text-foreground">
                  Informações de Rastreio
                </h3>
              </div>

              <div className="flex items-start gap-4">
                <User size={24} className="mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">ID do Usuário</p>
                  <p className="font-semibold text-foreground">
                    {alertData.userId || "Não especificado"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin size={24} className="mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Endereço Resolvido
                  </p>
                  <p className="font-semibold text-foreground">
                    {alertData.address ||
                      "Endereço indisponível ou em processamento"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock size={24} className="mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Data do Disparo
                  </p>
                  <p className="font-semibold text-foreground">
                    {new Date(alertData.createdAt).toLocaleString("pt-BR")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Navigation size={24} className="mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Coordenadas Extratas
                  </p>
                  <p className="mt-1 rounded p-2 font-mono text-xs text-foreground bg-secondary">
                    {alertData.latitude}, {alertData.longitude}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <a
                  href={`https://www.google.com/maps?q=${alertData.latitude},${alertData.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-lg text-sm font-bold flex justify-center shadow transition-colors hover:scale-[1.02] bg-destructive text-primary-foreground"
                >
                  Rotear no Google Maps
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="flex h-full min-h-[500px] flex-col overflow-hidden rounded-2xl border border-border p-1 bg-card shadow-sm">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <h3 className="flex items-center gap-2 font-semibold text-foreground">
                  <MapPin
                    size={20}
                    aria-hidden="true"
                    className="text-destructive"
                  />
                  Mapa Tático
                </h3>
                {/* NRF10 — role="status" + aria-live anunciam o badge sem roubar o foco */}
                <span
                  role="status"
                  aria-live="polite"
                  className="animate-pulse rounded-full border px-3 py-1 text-xs font-medium text-destructive bg-destructive/10"
                  style={{ borderColor: "rgba(166, 60, 60, 0.28)" }}
                >
                  AO VIVO
                </span>
              </div>
              <div className="w-full flex-1 bg-secondary">
                <iframe
                  title="Mapa da Ocorrência"
                  src={mapsUrl}
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline do Prontuário */}
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm">
          <h3 className="mb-6 border-b border-border pb-4 text-xl font-semibold text-foreground">
            Prontuário Digital (Histórico de Eventos)
          </h3>
          <AlertTimeline events={eventsData} />
        </div>
      </div>
    </div>
  );
}
