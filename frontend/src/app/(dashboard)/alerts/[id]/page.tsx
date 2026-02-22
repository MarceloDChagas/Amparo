"use client";

import { AlertTriangle, Clock, MapPin, Navigation, User } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  AlertEvent,
  EmergencyAlert,
  emergencyAlertService,
} from "@/services/emergency-alert-service";
import { colors } from "@/styles/colors";

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
        style={{ backgroundColor: colors.functional.background.primary }}
      >
        <p className="text-white text-xl animate-pulse">
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
      style={{ backgroundColor: colors.functional.background.primary }}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <span className="p-2 rounded-lg bg-red-500/20 text-red-500">
                <AlertTriangle size={32} />
              </span>
              Acionamento de Emergência
            </h2>
            <p className="text-gray-400 mt-2">
              Detalhes de rastreamento do alerta geolocalizado gerado
              instantaneamente.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-lg text-sm font-semibold transition bg-gray-800 hover:bg-gray-700 text-white"
          >
            Voltar ao Dashboard
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div
              className="p-6 rounded-2xl border flex flex-col gap-6"
              style={{
                backgroundColor: colors.functional.background.secondary,
                borderColor: colors.functional.border.DEFAULT,
              }}
            >
              <div>
                <h3 className="text-xl font-semibold text-white border-b border-gray-800 pb-4 mb-4">
                  Informações de Rastreio
                </h3>
              </div>

              <div className="flex items-start gap-4">
                <User size={24} className="text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">ID do Usuário</p>
                  <p className="font-semibold text-white">
                    {alertData.userId || "Não especificado"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin size={24} className="text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Endereço Resolvido</p>
                  <p className="font-semibold text-white">
                    {alertData.address ||
                      "Endereço indisponível ou em processamento"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock size={24} className="text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Data do Disparo</p>
                  <p className="font-semibold text-white">
                    {new Date(alertData.createdAt).toLocaleString("pt-BR")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Navigation size={24} className="text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Coordenadas Extratas</p>
                  <p className="font-mono text-xs text-white bg-slate-800 p-2 rounded mt-1">
                    {alertData.latitude}, {alertData.longitude}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800">
                <a
                  href={`https://www.google.com/maps?q=${alertData.latitude},${alertData.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-lg text-sm font-bold flex justify-center shadow transition-colors hover:scale-[1.02]"
                  style={{
                    backgroundColor: colors.status.error.DEFAULT,
                    color: "white",
                  }}
                >
                  Rotear no Google Maps
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div
              className="p-1 rounded-2xl border h-full min-h-[500px] overflow-hidden bg-gray-900 flex flex-col"
              style={{
                borderColor: colors.functional.border.DEFAULT,
              }}
            >
              <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <MapPin size={20} className="text-red-500" />
                  Mapa Tático
                </h3>
                <span className="text-xs text-red-400 bg-red-500/10 px-3 py-1 rounded-full animate-pulse border border-red-500/30">
                  AO VIVO
                </span>
              </div>
              <div className="flex-1 w-full bg-slate-800">
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
            backgroundColor: colors.functional.background.secondary,
            borderColor: colors.functional.border.DEFAULT,
          }}
        >
          <h3 className="text-xl font-semibold text-white border-b border-gray-800 pb-4 mb-6">
            Prontuário Digital (Histórico de Eventos)
          </h3>
          <AlertTimeline events={eventsData} />
        </div>
      </div>
    </div>
  );
}
