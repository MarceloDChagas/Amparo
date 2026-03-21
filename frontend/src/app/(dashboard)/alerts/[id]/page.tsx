"use client";

import { AlertTriangle, Clock, MapPin, Navigation, User } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { govTheme } from "@/components/landing/gov-theme";
import {
  AlertEvent,
  EmergencyAlert,
  emergencyAlertService,
} from "@/services/emergency-alert-service";

import { AlertTimeline } from "./components/AlertTimeline";

export default function EmergencyAlertDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const alertId = params.id as string;
  const [alertData, setAlertData] = useState<EmergencyAlert | null>(null);
  const [eventsData, setEventsData] = useState<AlertEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAlert() {
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
    }
    loadAlert();
  }, [alertId, router]);

  if (loading) {
    return (
      <div
        className="min-h-screen p-6 flex justify-center items-center"
        style={{ backgroundColor: govTheme.background.page }}
      >
        <p
          className="animate-pulse text-xl"
          style={{ color: govTheme.text.primary }}
        >
          Buscando coordenadas de emergência...
        </p>
      </div>
    );
  }

  if (!alertData) return null;

  const mapsUrl = `https://maps.google.com/maps?q=${alertData.latitude},${alertData.longitude}&z=16&output=embed`;

  return (
    <div
      className="p-6 md:p-10 min-h-screen"
      style={{ backgroundColor: govTheme.background.page }}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2
              className="flex items-center gap-3 text-3xl font-bold tracking-tight"
              style={{ color: govTheme.text.primary }}
            >
              <span
                className="rounded-lg p-2"
                style={{
                  backgroundColor: govTheme.status.dangerSoft,
                  color: govTheme.status.danger,
                }}
              >
                <AlertTriangle size={32} />
              </span>
              Acionamento de Emergência
            </h2>
            <p className="mt-2" style={{ color: govTheme.text.secondary }}>
              Detalhes de rastreamento do alerta geolocalizado gerado
              instantaneamente.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-lg px-6 py-3 text-sm font-semibold transition hover:opacity-90"
            style={{
              backgroundColor: govTheme.brand.blue,
              color: govTheme.text.inverse,
            }}
          >
            Voltar ao Dashboard
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div
              className="p-6 rounded-2xl border flex flex-col gap-6"
              style={{
                backgroundColor: govTheme.background.section,
                borderColor: govTheme.border.subtle,
                boxShadow: govTheme.shadow.card,
              }}
            >
              <div>
                <h3
                  className="mb-4 border-b pb-4 text-xl font-semibold"
                  style={{
                    color: govTheme.text.primary,
                    borderColor: govTheme.border.subtle,
                  }}
                >
                  Informações de Rastreio
                </h3>
              </div>

              <div className="flex items-start gap-4">
                <User
                  size={24}
                  className="mt-1"
                  style={{ color: govTheme.text.muted }}
                />
                <div>
                  <p className="text-sm" style={{ color: govTheme.text.muted }}>
                    ID do Usuário
                  </p>
                  <p
                    className="font-semibold"
                    style={{ color: govTheme.text.primary }}
                  >
                    {alertData.userId || "Não especificado"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin
                  size={24}
                  className="mt-1"
                  style={{ color: govTheme.text.muted }}
                />
                <div>
                  <p className="text-sm" style={{ color: govTheme.text.muted }}>
                    Endereço Resolvido
                  </p>
                  <p
                    className="font-semibold"
                    style={{ color: govTheme.text.primary }}
                  >
                    {alertData.address ||
                      "Endereço indisponível ou em processamento"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock
                  size={24}
                  className="mt-1"
                  style={{ color: govTheme.text.muted }}
                />
                <div>
                  <p className="text-sm" style={{ color: govTheme.text.muted }}>
                    Data do Disparo
                  </p>
                  <p
                    className="font-semibold"
                    style={{ color: govTheme.text.primary }}
                  >
                    {new Date(alertData.createdAt).toLocaleString("pt-BR")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Navigation
                  size={24}
                  className="mt-1"
                  style={{ color: govTheme.text.muted }}
                />
                <div>
                  <p className="text-sm" style={{ color: govTheme.text.muted }}>
                    Coordenadas Extratas
                  </p>
                  <p
                    className="mt-1 rounded p-2 font-mono text-xs"
                    style={{
                      color: govTheme.text.primary,
                      backgroundColor: govTheme.background.alt,
                    }}
                  >
                    {alertData.latitude}, {alertData.longitude}
                  </p>
                </div>
              </div>

              <div
                className="pt-4"
                style={{ borderTop: `1px solid ${govTheme.border.subtle}` }}
              >
                <a
                  href={`https://www.google.com/maps?q=${alertData.latitude},${alertData.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-lg text-sm font-bold flex justify-center shadow transition-colors hover:scale-[1.02]"
                  style={{
                    backgroundColor: govTheme.status.danger,
                    color: govTheme.text.inverse,
                  }}
                >
                  Rotear no Google Maps
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div
              className="flex h-full min-h-[500px] flex-col overflow-hidden rounded-2xl border p-1"
              style={{
                borderColor: govTheme.border.subtle,
                backgroundColor: govTheme.background.section,
                boxShadow: govTheme.shadow.card,
              }}
            >
              <div
                className="flex items-center justify-between border-b px-5 py-4"
                style={{ borderColor: govTheme.border.subtle }}
              >
                <h3
                  className="flex items-center gap-2 font-semibold"
                  style={{ color: govTheme.text.primary }}
                >
                  <MapPin
                    size={20}
                    aria-hidden="true"
                    style={{ color: govTheme.status.danger }}
                  />
                  Mapa Tático
                </h3>
                {/* NRF10 — role="status" + aria-live anunciam o badge sem roubar o foco */}
                <span
                  role="status"
                  aria-live="polite"
                  className="animate-pulse rounded-full border px-3 py-1 text-xs font-medium"
                  style={{
                    color: govTheme.status.danger,
                    backgroundColor: govTheme.status.dangerSoft,
                    borderColor: "rgba(166, 60, 60, 0.28)",
                  }}
                >
                  AO VIVO
                </span>
              </div>
              <div
                className="w-full flex-1"
                style={{ backgroundColor: govTheme.background.alt }}
              >
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
        <div
          className="p-6 rounded-2xl border"
          style={{
            backgroundColor: govTheme.background.section,
            borderColor: govTheme.border.subtle,
            boxShadow: govTheme.shadow.card,
          }}
        >
          <h3
            className="mb-6 border-b pb-4 text-xl font-semibold"
            style={{
              color: govTheme.text.primary,
              borderColor: govTheme.border.subtle,
            }}
          >
            Prontuário Digital (Histórico de Eventos)
          </h3>
          <AlertTimeline events={eventsData} />
        </div>
      </div>
    </div>
  );
}
