"use client";

import {
  CheckCircle,
  Clock,
  History,
  MapPin,
  Navigation,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { govTheme } from "@/components/landing/gov-theme";
import { CheckIn, checkInService } from "@/services/check-in-service";

export default function CheckInDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const checkInId = params.id as string;
  const [checkInData, setCheckInData] = useState<CheckIn | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCheckIn() {
      try {
        const data = await checkInService.getById(checkInId);
        if (!data) {
          router.push("/dashboard");
          return;
        }
        setCheckInData(data);
      } catch (error) {
        console.error("Failed to load check-in data", error);
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }
    loadCheckIn();
  }, [checkInId, router]);

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
          Buscando detalhes do deslocamento...
        </p>
      </div>
    );
  }

  if (!checkInData) return null;

  const isLate =
    new Date(checkInData.expectedArrivalTime).getTime() < Date.now() &&
    checkInData.status === "ACTIVE";

  const getStatusDisplay = () => {
    if (checkInData.status === "ACTIVE") {
      if (isLate) {
        return (
          <span
            className="flex items-center gap-2 rounded-full border px-3 py-1 font-semibold"
            style={{
              color: govTheme.brand.blueStrong,
              backgroundColor: "rgba(216, 191, 122, 0.18)",
              borderColor: "rgba(216, 191, 122, 0.42)",
            }}
          >
            <Clock className="w-4 h-4" /> Em Atraso
          </span>
        );
      }
      return (
        <span
          className="flex items-center gap-2 rounded-full border px-3 py-1 font-semibold"
          style={{
            color: govTheme.brand.blue,
            backgroundColor: govTheme.brand.blueSurface,
            borderColor: govTheme.border.strong,
          }}
        >
          <Navigation className="w-4 h-4 animate-pulse" /> Em Deslocamento
        </span>
      );
    }
    if (checkInData.status === "ON_TIME") {
      return (
        <span
          className="flex items-center gap-2 rounded-full border px-3 py-1 font-semibold"
          style={{
            color: govTheme.brand.green,
            backgroundColor: "rgba(47, 107, 87, 0.12)",
            borderColor: "rgba(47, 107, 87, 0.3)",
          }}
        >
          <CheckCircle className="w-4 h-4" /> Chegada Confirmada
        </span>
      );
    }
    if (checkInData.status === "LATE") {
      return (
        <span
          className="flex items-center gap-2 rounded-full border px-3 py-1 font-semibold"
          style={{
            color: govTheme.status.danger,
            backgroundColor: govTheme.status.dangerSoft,
            borderColor: "rgba(166, 60, 60, 0.28)",
          }}
        >
          <XCircle className="w-4 h-4" /> Chegada com Atraso
        </span>
      );
    }
    return (
      <span style={{ color: govTheme.text.muted }}>{checkInData.status}</span>
    );
  };

  return (
    <div
      className="p-6 md:p-10 min-h-screen"
      style={{ backgroundColor: govTheme.background.page }}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2
              className="flex items-center gap-3 text-3xl font-bold tracking-tight"
              style={{ color: govTheme.text.primary }}
            >
              <span
                className="rounded-lg p-2"
                style={{
                  backgroundColor: isLate
                    ? "rgba(216, 191, 122, 0.18)"
                    : govTheme.brand.blueSurface,
                  color: isLate
                    ? govTheme.brand.blueStrong
                    : govTheme.brand.blue,
                }}
              >
                <MapPin size={32} />
              </span>
              Monitoramento de Deslocamento
            </h2>
            <p className="mt-2" style={{ color: govTheme.text.secondary }}>
              Detalhes do monitoramento de trajeto do usuário.
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

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div
              className="p-6 rounded-2xl border flex flex-col gap-6 h-full"
              style={{
                backgroundColor: govTheme.background.section,
                borderColor: govTheme.border.subtle,
                boxShadow: govTheme.shadow.card,
              }}
            >
              <div
                className="mb-2 flex items-center justify-between border-b pb-4"
                style={{ borderColor: govTheme.border.subtle }}
              >
                <h3
                  className="text-xl font-semibold"
                  style={{ color: govTheme.text.primary }}
                >
                  Dados do Trajeto
                </h3>
                {getStatusDisplay()}
              </div>

              <div className="flex items-start gap-4">
                <User
                  size={24}
                  className="mt-1"
                  style={{ color: govTheme.text.muted }}
                />
                <div>
                  <p className="text-sm" style={{ color: govTheme.text.muted }}>
                    Usuário
                  </p>
                  <p
                    className="font-semibold"
                    style={{ color: govTheme.text.primary }}
                  >
                    {checkInData.user?.name || "Desconhecido"}
                  </p>
                  <p
                    className="mt-1 text-xs font-mono"
                    style={{ color: govTheme.text.muted }}
                  >
                    ID: {checkInData.user?.id || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock
                  size={24}
                  className="mt-1"
                  style={{ color: govTheme.text.muted }}
                />
                <div className="w-full">
                  <p className="text-sm" style={{ color: govTheme.text.muted }}>
                    Tempo Limite de Chegada
                  </p>
                  <p
                    className="text-lg font-semibold"
                    style={{
                      color: isLate
                        ? govTheme.brand.blueStrong
                        : govTheme.text.primary,
                    }}
                  >
                    {new Date(checkInData.expectedArrivalTime).toLocaleString(
                      "pt-BR",
                    )}
                  </p>
                  <p
                    className="mt-1 text-xs"
                    style={{ color: govTheme.text.muted }}
                  >
                    Início:{" "}
                    {new Date(checkInData.startTime).toLocaleString("pt-BR")} (
                    {checkInData.distanceType})
                  </p>
                </div>
              </div>

              {checkInData.actualArrivalTime && (
                <div
                  className="flex items-start gap-4 border-t pt-4"
                  style={{ borderColor: govTheme.border.subtle }}
                >
                  <CheckCircle
                    size={24}
                    className="mt-1"
                    style={{ color: govTheme.brand.green }}
                  />
                  <div>
                    <p
                      className="text-sm"
                      style={{ color: govTheme.text.muted }}
                    >
                      Horário de Chegada Real
                    </p>
                    <p
                      className="font-semibold"
                      style={{ color: govTheme.text.primary }}
                    >
                      {new Date(checkInData.actualArrivalTime).toLocaleString(
                        "pt-BR",
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div
              className="p-6 rounded-2xl border flex flex-col gap-6 h-full"
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
                  Estatísticas do Usuário
                </h3>
              </div>

              <div className="flex items-center gap-6">
                <div
                  className="rounded-xl p-4"
                  style={{
                    backgroundColor: govTheme.brand.blueSurface,
                    color: govTheme.brand.blue,
                  }}
                >
                  <History size={48} />
                </div>
                <div>
                  <p
                    className="mb-1 text-sm"
                    style={{ color: govTheme.text.muted }}
                  >
                    Total de viagens realizadas no Amparo
                  </p>
                  <p
                    className="text-5xl font-black"
                    style={{ color: govTheme.text.primary }}
                  >
                    {checkInData.userCheckInCount !== undefined
                      ? checkInData.userCheckInCount
                      : "..."}
                  </p>
                </div>
              </div>

              <div
                className="mt-4 rounded-lg border p-4"
                style={{
                  backgroundColor: govTheme.background.alt,
                  borderColor: govTheme.border.subtle,
                }}
              >
                <p
                  className="text-sm"
                  style={{ color: govTheme.text.secondary }}
                >
                  A contagem de viagens baseia-se no histórico deste usuário.
                  Usuários com alto número de viagens bem sucedidas demonstram
                  forte engajamento com a ferramenta de monitoramento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
