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

import { CheckIn, checkInService } from "@/services/check-in-service";
import { colors } from "@/styles/colors";

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
        style={{ backgroundColor: colors.functional.background.primary }}
      >
        <p className="text-white text-xl animate-pulse">
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
          <span className="flex items-center gap-2 text-orange-500 font-semibold bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/30">
            <Clock className="w-4 h-4" /> Em Atraso
          </span>
        );
      }
      return (
        <span className="flex items-center gap-2 text-blue-500 font-semibold bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/30">
          <Navigation className="w-4 h-4 animate-pulse" /> Em Deslocamento
        </span>
      );
    }
    if (checkInData.status === "ON_TIME") {
      return (
        <span className="flex items-center gap-2 text-green-500 font-semibold bg-green-500/10 px-3 py-1 rounded-full border border-green-500/30">
          <CheckCircle className="w-4 h-4" /> Chegada Confirmada
        </span>
      );
    }
    if (checkInData.status === "LATE") {
      return (
        <span className="flex items-center gap-2 text-red-500 font-semibold bg-red-500/10 px-3 py-1 rounded-full border border-red-500/30">
          <XCircle className="w-4 h-4" /> Chegada com Atraso
        </span>
      );
    }
    return <span className="text-gray-400">{checkInData.status}</span>;
  };

  return (
    <div
      className="p-6 md:p-10 min-h-screen"
      style={{ backgroundColor: colors.functional.background.primary }}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <span
                className={`p-2 rounded-lg ${isLate ? "bg-orange-500/20 text-orange-500" : "bg-blue-500/20 text-blue-400"}`}
              >
                <MapPin size={32} />
              </span>
              Monitoramento de Deslocamento
            </h2>
            <p className="text-gray-400 mt-2">
              Detalhes do monitoramento de trajeto do usuário.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-lg text-sm font-semibold transition bg-gray-800 hover:bg-gray-700 text-white"
          >
            Voltar ao Dashboard
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div
              className="p-6 rounded-2xl border flex flex-col gap-6 h-full"
              style={{
                backgroundColor: colors.functional.background.secondary,
                borderColor: colors.functional.border.DEFAULT,
              }}
            >
              <div className="flex justify-between items-center border-b border-gray-800 pb-4 mb-2">
                <h3 className="text-xl font-semibold text-white">
                  Dados do Trajeto
                </h3>
                {getStatusDisplay()}
              </div>

              <div className="flex items-start gap-4">
                <User size={24} className="text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Usuário</p>
                  <p className="font-semibold text-white">
                    {checkInData.user?.name || "Desconhecido"}
                  </p>
                  <p className="text-xs text-gray-500 font-mono mt-1">
                    ID: {checkInData.user?.id || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock size={24} className="text-gray-400 mt-1" />
                <div className="w-full">
                  <p className="text-sm text-gray-400">
                    Tempo Limite de Chegada
                  </p>
                  <p
                    className={`font-semibold text-lg ${isLate ? "text-orange-500" : "text-white"}`}
                  >
                    {new Date(checkInData.expectedArrivalTime).toLocaleString(
                      "pt-BR",
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Início:{" "}
                    {new Date(checkInData.startTime).toLocaleString("pt-BR")} (
                    {checkInData.distanceType})
                  </p>
                </div>
              </div>

              {checkInData.actualArrivalTime && (
                <div className="flex items-start gap-4 pt-4 border-t border-gray-800">
                  <CheckCircle size={24} className="text-green-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">
                      Horário de Chegada Real
                    </p>
                    <p className="font-semibold text-white">
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
                backgroundColor: colors.functional.background.secondary,
                borderColor: colors.functional.border.DEFAULT,
              }}
            >
              <div>
                <h3 className="text-xl font-semibold text-white border-b border-gray-800 pb-4 mb-4">
                  Estatísticas do Usuário
                </h3>
              </div>

              <div className="flex items-center gap-6">
                <div className="p-4 rounded-xl bg-blue-500/10 text-blue-400">
                  <History size={48} />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">
                    Total de viagens realizadas no Amparo
                  </p>
                  <p className="text-5xl font-black text-white">
                    {checkInData.userCheckInCount !== undefined
                      ? checkInData.userCheckInCount
                      : "..."}
                  </p>
                </div>
              </div>

              <div className="mt-4 p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                <p className="text-sm text-gray-300">
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
