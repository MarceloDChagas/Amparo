import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  Plus,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  useCompleteCheckIn,
  useGetActiveCheckIn,
  useStartCheckIn,
} from "@/hooks/use-check-in";
import { getBestPosition } from "@/lib/geolocation";
import {
  CheckInSchedule,
  checkInService,
  DistanceType,
} from "@/services/check-in-service";

import { CheckInActive } from "./CheckInActive";
import { CheckInInstructionalCard } from "./CheckInInstructionalCard";
import { CheckInStart } from "./CheckInStart";

type SubTab = "MANUAL" | "SCHEDULE";

const STATUS_LABEL: Record<CheckInSchedule["status"], string> = {
  PENDING: "Aguardando",
  ARRIVED: "Confirmado",
  ALERTED: "Alerta disparado",
  CANCELLED: "Cancelado",
};

const STATUS_COLOR: Record<CheckInSchedule["status"], string> = {
  PENDING: "#f59e0b",
  ARRIVED: "#10b981",
  ALERTED: "#ef4444",
  CANCELLED: "#9ca3af",
};

export function CheckInTab() {
  // ── check-in manual ──────────────────────────────────────────────────────
  const [subTab, setSubTab] = useState<SubTab>("MANUAL");
  const [selectedDistance, setSelectedDistance] = useState<DistanceType>(
    DistanceType.SHORT,
  );

  const { data: activeCheckIn, isLoading } = useGetActiveCheckIn();
  const startCheckIn = useStartCheckIn();
  const completeCheckIn = useCompleteCheckIn();
  const [gettingLocationStart, setGettingLocationStart] = useState(false);
  const [gettingLocationComplete, setGettingLocationComplete] = useState(false);

  const handleStart = () => {
    const go = (lat?: number, lng?: number) =>
      startCheckIn.mutate({
        distanceType: selectedDistance,
        startLatitude: lat,
        startLongitude: lng,
      });

    setGettingLocationStart(true);
    getBestPosition(5, 15_000)
      .then((pos) => go(pos.latitude, pos.longitude))
      .catch(() => go())
      .finally(() => setGettingLocationStart(false));
  };

  const handleComplete = () => {
    const done = (lat?: number, lng?: number) =>
      completeCheckIn.mutate({ finalLatitude: lat, finalLongitude: lng });

    setGettingLocationComplete(true);
    getBestPosition(5, 15_000)
      .then((pos) => done(pos.latitude, pos.longitude))
      .catch(() => done())
      .finally(() => setGettingLocationComplete(false));
  };

  // ── check-in inteligente (AM-154) ─────────────────────────────────────────
  const [schedules, setSchedules] = useState<CheckInSchedule[]>([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    destinationAddress: "",
    expectedArrivalAt: "",
    windowMinutes: "15",
  });
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);

  const [gettingLocationCapture, setGettingLocationCapture] = useState(false);

  // Obter localização atual para destino
  const captureLocation = () => {
    setGettingLocationCapture(true);
    getBestPosition(5, 15_000)
      .then((pos) => {
        setUserLat(pos.latitude);
        setUserLng(pos.longitude);
      })
      .catch(() => {})
      .finally(() => setGettingLocationCapture(false));
  };

  useEffect(() => {
    if (subTab !== "SCHEDULE") return;
    void (async () => {
      setLoadingSchedules(true);
      try {
        const data = await checkInService.getMySchedules();
        setSchedules(data);
      } catch {
        // ignorado — não bloquear a UI por falha de rede
      } finally {
        setLoadingSchedules(false);
      }
    })();
  }, [subTab]);

  const handleCreateSchedule = async () => {
    if (
      !form.name ||
      !form.expectedArrivalAt ||
      userLat === null ||
      userLng === null
    ) {
      setScheduleError(
        "Preencha nome, horário e capture sua localização atual.",
      );
      return;
    }
    setSubmitting(true);
    setScheduleError(null);
    try {
      const created = await checkInService.createSchedule({
        name: form.name,
        destinationAddress: form.destinationAddress || undefined,
        destinationLat: userLat,
        destinationLng: userLng,
        expectedArrivalAt: new Date(form.expectedArrivalAt).toISOString(),
        windowMinutes: parseInt(form.windowMinutes) || 15,
      });
      setSchedules((prev) => [created, ...prev]);
      setShowForm(false);
      setForm({
        name: "",
        destinationAddress: "",
        expectedArrivalAt: "",
        windowMinutes: "15",
      });
      setUserLat(null);
      setUserLng(null);
    } catch {
      setScheduleError("Erro ao criar agendamento.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmArrival = async (id: string) => {
    try {
      const updated = await checkInService.confirmArrival(id);
      setSchedules((prev) => prev.map((s) => (s.id === id ? updated : s)));
    } catch {}
  };

  if (isLoading) {
    return (
      <div
        className="text-center mt-12 text-sm"
        style={{ color: "rgba(90,53,69,0.55)" }}
      >
        Carregando...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col items-center justify-start w-full max-w-md mx-auto relative px-4 mt-2"
    >
      {/* Glow teal */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: "rgba(13, 148, 136, 0.13)" }}
      />

      {/* Sub-tabs: Manual / Agendado — estilo underline, espelhando o tab principal */}
      <div
        className="w-full flex mb-4 relative z-10"
        style={{ borderBottom: "1px solid rgba(180,140,160,0.22)" }}
      >
        {(["MANUAL", "SCHEDULE"] as SubTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setSubTab(t)}
            className="flex-1 pb-2.5 text-sm font-semibold transition-colors text-center"
            style={{
              color: subTab === t ? "#2e7d62" : "#5a3545",
              borderBottom:
                subTab === t ? "2px solid #2e7d62" : "2px solid transparent",
              marginBottom: "-1px",
              letterSpacing: "0.01em",
            }}
          >
            {t === "MANUAL" ? "Manual" : "Agendamento"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {subTab === "MANUAL" ? (
          <motion.div
            key="manual"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            {!activeCheckIn ? (
              <CheckInStart
                selectedDistance={selectedDistance}
                setSelectedDistance={setSelectedDistance}
                onStart={handleStart}
                isPending={startCheckIn.isPending || gettingLocationStart}
                gettingLocation={gettingLocationStart}
              />
            ) : (
              <CheckInActive
                expectedArrivalTime={activeCheckIn.expectedArrivalTime}
                onComplete={handleComplete}
                isPending={completeCheckIn.isPending || gettingLocationComplete}
                gettingLocation={gettingLocationComplete}
              />
            )}
            <CheckInInstructionalCard />
          </motion.div>
        ) : (
          <motion.div
            key="schedule"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full space-y-3"
          >
            {/* Botão novo agendamento */}
            <button
              onClick={() => {
                setShowForm((v) => !v);
                captureLocation();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium transition-all"
              style={{
                backgroundColor: "rgba(90,158,138,0.10)",
                color: "#5a9e8a",
                border: "1px solid rgba(90,158,138,0.25)",
              }}
            >
              <Plus className="h-4 w-4" />
              Novo agendamento
            </button>

            {/* Formulário */}
            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div
                    className="rounded-2xl p-4 space-y-3"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.52)",
                      border: "1px solid rgba(180,140,160,0.18)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <p
                      className="text-xs font-semibold uppercase tracking-wide"
                      style={{ color: "rgba(90,53,69,0.65)" }}
                    >
                      Novo agendamento
                    </p>

                    {scheduleError && (
                      <div
                        className="flex items-center gap-2 text-xs rounded-xl px-3 py-2"
                        style={{
                          backgroundColor: "rgba(220,38,38,0.08)",
                          color: "#dc2626",
                        }}
                      >
                        <AlertTriangle className="h-3 w-3 shrink-0" />
                        {scheduleError}
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label
                        className="text-xs"
                        style={{ color: "rgba(90,53,69,0.65)" }}
                      >
                        Nome do destino
                      </label>
                      <input
                        className="w-full rounded-xl px-3 py-2 text-sm outline-none"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.70)",
                          border: "1px solid rgba(180,140,160,0.25)",
                          color: "#3a2530",
                        }}
                        placeholder="Ex: Trabalho, Casa da mãe…"
                        value={form.name}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, name: e.target.value }))
                        }
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        className="text-xs"
                        style={{ color: "rgba(90,53,69,0.65)" }}
                      >
                        Endereço (opcional)
                      </label>
                      <input
                        className="w-full rounded-xl px-3 py-2 text-sm outline-none"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.70)",
                          border: "1px solid rgba(180,140,160,0.25)",
                          color: "#3a2530",
                        }}
                        placeholder="Rua, número…"
                        value={form.destinationAddress}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            destinationAddress: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        className="text-xs"
                        style={{ color: "rgba(90,53,69,0.65)" }}
                      >
                        Horário esperado de chegada
                      </label>
                      <input
                        type="datetime-local"
                        className="w-full rounded-xl px-3 py-2 text-sm outline-none"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.70)",
                          border: "1px solid rgba(180,140,160,0.25)",
                          color: "#3a2530",
                        }}
                        value={form.expectedArrivalAt}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            expectedArrivalAt: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        className="text-xs"
                        style={{ color: "rgba(90,53,69,0.65)" }}
                      >
                        Tolerância (min)
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={120}
                        className="w-full rounded-xl px-3 py-2 text-sm outline-none"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.70)",
                          border: "1px solid rgba(180,140,160,0.25)",
                          color: "#3a2530",
                        }}
                        value={form.windowMinutes}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            windowMinutes: e.target.value,
                          }))
                        }
                      />
                    </div>

                    {/* Localização capturada */}
                    <button
                      onClick={captureLocation}
                      disabled={gettingLocationCapture}
                      className="w-full flex items-center gap-2 justify-center py-2 rounded-xl text-xs transition-all"
                      style={{
                        backgroundColor:
                          userLat !== null
                            ? "rgba(90,158,138,0.12)"
                            : "rgba(255,255,255,0.55)",
                        color:
                          userLat !== null ? "#5a9e8a" : "rgba(90,53,69,0.5)",
                        border: `1px solid ${userLat !== null ? "rgba(90,158,138,0.30)" : "rgba(180,140,160,0.25)"}`,
                        opacity: gettingLocationCapture ? 0.7 : 1,
                      }}
                    >
                      {gettingLocationCapture ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <MapPin className="h-3 w-3" />
                      )}
                      {gettingLocationCapture
                        ? "Obtendo localização precisa…"
                        : userLat !== null
                          ? `Localização capturada (${userLat.toFixed(4)}, ${userLng?.toFixed(4)})`
                          : "Capturar localização atual"}
                    </button>

                    <button
                      onClick={() => void handleCreateSchedule()}
                      disabled={submitting}
                      className="w-full py-3 rounded-2xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: "#5a9e8a",
                        color: "white",
                        opacity: submitting ? 0.6 : 1,
                      }}
                    >
                      {submitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CalendarClock className="h-4 w-4" />
                      )}
                      {submitting ? "Salvando…" : "Criar agendamento"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Lista de schedules */}
            {loadingSchedules ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-teal-400" />
              </div>
            ) : schedules.length === 0 ? (
              <div
                className="text-center py-8 text-sm"
                style={{ color: "rgba(90,53,69,0.45)" }}
              >
                Nenhum agendamento ainda.
                <br />
                <span className="text-xs">
                  Crie um para ser monitorada automaticamente.
                </span>
              </div>
            ) : (
              <ul className="space-y-2">
                {schedules.map((s) => (
                  <li
                    key={s.id}
                    className="rounded-2xl p-3"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.52)",
                      border: "1px solid rgba(180,140,160,0.18)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-medium truncate"
                          style={{ color: "#3a2530" }}
                        >
                          {s.name}
                        </p>
                        <p
                          className="text-xs flex items-center gap-1 mt-0.5"
                          style={{ color: "rgba(90,53,69,0.55)" }}
                        >
                          <Clock className="h-3 w-3" />
                          {new Date(s.expectedArrivalAt).toLocaleString(
                            "pt-BR",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                          <span className="ml-1">
                            · {s.windowMinutes}min tolerância
                          </span>
                        </p>
                        {s.destinationAddress && (
                          <p
                            className="text-xs truncate mt-0.5"
                            style={{ color: "rgba(90,53,69,0.40)" }}
                          >
                            {s.destinationAddress}
                          </p>
                        )}
                      </div>
                      <span
                        className="text-[10px] font-semibold px-2 py-1 rounded-full shrink-0"
                        style={{
                          backgroundColor: `${STATUS_COLOR[s.status]}20`,
                          color: STATUS_COLOR[s.status],
                          border: `1px solid ${STATUS_COLOR[s.status]}40`,
                        }}
                      >
                        {STATUS_LABEL[s.status]}
                      </span>
                    </div>

                    {s.status === "PENDING" && (
                      <button
                        onClick={() => void handleConfirmArrival(s.id)}
                        className="mt-2 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium transition-all"
                        style={{
                          backgroundColor: "rgba(90,158,138,0.12)",
                          color: "#5a9e8a",
                          border: "1px solid rgba(90,158,138,0.25)",
                        }}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        Confirmar chegada
                      </button>
                    )}

                    {s.status === "ALERTED" && (
                      <div
                        className="mt-2 flex items-center gap-2 text-xs rounded-xl px-3 py-2"
                        style={{
                          backgroundColor: "rgba(220,38,38,0.08)",
                          color: "#dc2626",
                        }}
                      >
                        <AlertTriangle className="h-3 w-3 shrink-0" />
                        Alerta de emergência disparado automaticamente
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
