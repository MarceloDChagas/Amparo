"use client";

/**
 * RF03 — Check-in Inteligente: detalhes do monitoramento de deslocamento.
 * RN03 — Tolerância de Atraso: exibe countdown em tempo real para check-ins ACTIVE.
 * RF13 — Gestão e Evolução de Casos: status badges com semântica via componente Badge.
 *
 * NRF10 — Acessibilidade:
 *   - Badge usa ícone + cor + texto (nunca só cor)
 *   - aria-live no countdown para anunciar mudanças de estado
 */
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
import { Badge } from "@/components/ui/badge";
import { CheckIn, checkInService } from "@/services/check-in-service";

/** RN03 — countdown em tempo real para check-ins ainda ACTIVE no dashboard */
function useCountdown(targetDate: string | Date) {
  const [timeLeft, setTimeLeft] = useState(
    () => new Date(targetDate).getTime() - Date.now(),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(new Date(targetDate).getTime() - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const abs = Math.abs(timeLeft);
  const minutes = Math.floor(abs / 60000);
  const seconds = Math.floor((abs % 60000) / 1000);
  const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const isOverdue = timeLeft < 0;

  return { formatted, isOverdue };
}

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
      <div className="min-h-screen p-6 flex justify-center items-center">
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

  /** RF13 — badges semânticos para o ciclo de vida do check-in (NRF10: ícone + cor + texto) */
  const getStatusBadge = () => {
    if (checkInData.status === "ACTIVE") {
      if (isLate) {
        return (
          <Badge variant="late">
            <Clock className="w-3 h-3" aria-hidden="true" /> Em Atraso
          </Badge>
        );
      }
      return (
        <Badge variant="active">
          <Navigation className="w-3 h-3 animate-pulse" aria-hidden="true" /> Em
          Deslocamento
        </Badge>
      );
    }
    if (checkInData.status === "ON_TIME") {
      return <Badge variant="success">Chegada Confirmada</Badge>;
    }
    if (checkInData.status === "LATE") {
      return (
        <Badge variant="danger">
          <XCircle className="w-3 h-3" aria-hidden="true" /> Chegada com Atraso
        </Badge>
      );
    }
    return <Badge variant="pending">{checkInData.status}</Badge>;
  };

  return (
    <div className="p-6 md:p-10 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2
              className="flex items-center gap-3 text-3xl font-bold tracking-tight"
              style={{ color: govTheme.text.primary }}
            >
              <span
                aria-hidden="true"
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
            aria-label="Voltar ao Dashboard"
          >
            Voltar
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
                {/* RF13 — badge semântico do ciclo de vida */}
                {getStatusBadge()}
              </div>

              <div className="flex items-start gap-4">
                <User
                  size={24}
                  aria-hidden="true"
                  className="mt-1 shrink-0"
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
                  aria-hidden="true"
                  className="mt-1 shrink-0"
                  style={{ color: govTheme.text.muted }}
                />
                <div className="w-full">
                  <p className="text-sm" style={{ color: govTheme.text.muted }}>
                    {checkInData.status === "ACTIVE"
                      ? "Tempo Restante"
                      : "Tempo Limite de Chegada"}
                  </p>

                  {/* RN03 — countdown em tempo real para check-ins ainda ativos */}
                  {checkInData.status === "ACTIVE" ? (
                    <ActiveCountdown
                      expectedArrivalTime={checkInData.expectedArrivalTime}
                      isLate={isLate}
                    />
                  ) : (
                    <p
                      className="text-lg font-semibold"
                      style={{ color: govTheme.text.primary }}
                    >
                      {new Date(checkInData.expectedArrivalTime).toLocaleString(
                        "pt-BR",
                      )}
                    </p>
                  )}

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
                    aria-hidden="true"
                    className="mt-1 shrink-0"
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
                  aria-hidden="true"
                  className="rounded-xl p-4 shrink-0"
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
                    aria-label={`${checkInData.userCheckInCount ?? "..."} viagens realizadas`}
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

/** RN03 — sub-componente isolado para o countdown ativo no dashboard */
function ActiveCountdown({
  expectedArrivalTime,
  isLate,
}: {
  expectedArrivalTime: string | Date;
  isLate: boolean;
}) {
  const { formatted, isOverdue } = useCountdown(expectedArrivalTime);

  return (
    <div
      // NRF10 — aria-live anuncia mudanças de estado (polite: não interrompe)
      aria-live="polite"
      aria-atomic="true"
      className="flex items-center gap-2"
    >
      <span
        className="text-2xl font-bold tabular-nums"
        style={{
          color: isOverdue
            ? "var(--emergency)"
            : isLate
              ? "var(--warning)"
              : "var(--success)",
        }}
      >
        {isOverdue ? "+" : ""}
        {formatted}
      </span>
      <span className="text-xs" style={{ color: govTheme.text.muted }}>
        {isOverdue ? "em atraso" : "restantes"}
      </span>
    </div>
  );
}
