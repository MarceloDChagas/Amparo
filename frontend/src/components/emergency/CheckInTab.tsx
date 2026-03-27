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
import {
  CheckInSchedule,
  DistanceType,
  checkInService,
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

  const handleStart = () => {
    const go = (lat?: number, lng?: number) =>
      startCheckIn.mutate({ distanceType: selectedDistance, startLatitude: lat, startLongitude: lng });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => go(p.coords.latitude, p.coords.longitude),
        () => go(),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
      );
    } else {
      go();
    }
  };

  const handleComplete = () => {
    const done = (lat?: number, lng?: number) =>
      completeCheckIn.mutate({ finalLatitude: lat, finalLongitude: lng });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => done(p.coords.latitude, p.coords.longitude),
        () => done(),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
      );
    } else {
      done();
    }
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

  // Obter localização atual para destino
  const captureLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setUserLat(p.coords.latitude);
        setUserLng(p.coords.longitude);
      },
      () => {},
      { enableHighAccuracy: true, timeout: 5000 },
    );
  };

  useEffect(() => {
    if (subTab === "SCHEDULE") {
      setLoadingSchedules(true);
      checkInService
        .getMySchedules()
        .then(setSchedules)
        .catch(() => {})
        .finally(() => setLoadingSchedules(false));
    }
  }, [subTab]);

  const handleCreateSchedule = async () => {
    if (!form.name || !form.expectedArrivalAt || userLat === null || userLng === null) {
      setScheduleError("Preencha nome, horário e capture sua localização atual.");
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
      setForm({ name: "", destinationAddress: "", expectedArrivalAt: "", windowMinutes: "15" });
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
      <div className="text-white text-center mt-12">Carregando...</div>
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

      {/* Sub-tabs: Manual / Agendado */}
      <div
        className="w-full p-1 rounded-full flex mb-3 relative z-10"
        style={{
          backgroundColor: "rgba(13,148,136,0.12)",
          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        {(["MANUAL", "SCHEDULE"] as SubTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setSubTab(t)}
            className="flex-1 py-2 text-xs font-medium rounded-full transition-all"
            style={
              subTab === t
                ? { backgroundColor: "white", color: "#0d9488", boxShadow: "0 1px 4px rgba(13,148,136,0.2)" }
                : { color: "rgba(255,255,255,0.65)" }
            }
          >
            {t === "MANUAL" ? "Check-in manual" : "Agendamento inteligente"}
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
                isPending={startCheckIn.isPending}
              />
            ) : (
              <CheckInActive
                expectedArrivalTime={activeCheckIn.expectedArrivalTime}
                onComplete={handleComplete}
                isPending={completeCheckIn.isPending}
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
              onClick={() => { setShowForm((v) => !v); captureLocation(); }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium transition-all"
              style={{
                backgroundColor: "rgba(13,148,136,0.18)",
                color: "#5eead4",
                border: "1px solid rgba(13,148,136,0.3)",
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
                      backgroundColor: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <p className="text-xs font-semibold text-white/80 uppercase tracking-wide">
                      Novo agendamento (AM-154)
                    </p>

                    {scheduleError && (
                      <div className="flex items-center gap-2 text-xs text-red-400">
                        <AlertTriangle className="h-3 w-3 shrink-0" />
                        {scheduleError}
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-xs text-white/60">Nome do destino</label>
                      <input
                        className="w-full rounded-xl px-3 py-2 text-sm bg-white/10 text-white placeholder-white/30 border border-white/10 outline-none focus:border-teal-400"
                        placeholder="Ex: Trabalho, Casa da mãe…"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-white/60">Endereço (opcional)</label>
                      <input
                        className="w-full rounded-xl px-3 py-2 text-sm bg-white/10 text-white placeholder-white/30 border border-white/10 outline-none focus:border-teal-400"
                        placeholder="Rua, número…"
                        value={form.destinationAddress}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, destinationAddress: e.target.value }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-white/60">Horário esperado de chegada</label>
                      <input
                        type="datetime-local"
                        className="w-full rounded-xl px-3 py-2 text-sm bg-white/10 text-white border border-white/10 outline-none focus:border-teal-400"
                        value={form.expectedArrivalAt}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, expectedArrivalAt: e.target.value }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-white/60">Tolerância (min)</label>
                      <input
                        type="number"
                        min={1}
                        max={120}
                        className="w-full rounded-xl px-3 py-2 text-sm bg-white/10 text-white border border-white/10 outline-none focus:border-teal-400"
                        value={form.windowMinutes}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, windowMinutes: e.target.value }))
                        }
                      />
                    </div>

                    {/* Localização capturada */}
                    <button
                      onClick={captureLocation}
                      className="w-full flex items-center gap-2 justify-center py-2 rounded-xl text-xs transition-all"
                      style={{
                        backgroundColor:
                          userLat !== null
                            ? "rgba(16,185,129,0.2)"
                            : "rgba(255,255,255,0.08)",
                        color: userLat !== null ? "#6ee7b7" : "rgba(255,255,255,0.5)",
                        border: `1px solid ${userLat !== null ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.1)"}`,
                      }}
                    >
                      <MapPin className="h-3 w-3" />
                      {userLat !== null
                        ? `Localização capturada (${userLat.toFixed(4)}, ${userLng?.toFixed(4)})`
                        : "Capturar localização atual"}
                    </button>

                    <button
                      onClick={() => void handleCreateSchedule()}
                      disabled={submitting}
                      className="w-full py-3 rounded-2xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: "rgba(13,148,136,0.8)",
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
              <div className="text-center py-8 text-sm text-white/40">
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
                      backgroundColor: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {s.name}
                        </p>
                        <p className="text-xs text-white/50 flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3" />
                          {new Date(s.expectedArrivalAt).toLocaleString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          <span className="ml-1">· {s.windowMinutes}min tolerância</span>
                        </p>
                        {s.destinationAddress && (
                          <p className="text-xs text-white/40 truncate mt-0.5">
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
                          backgroundColor: "rgba(16,185,129,0.15)",
                          color: "#6ee7b7",
                          border: "1px solid rgba(16,185,129,0.25)",
                        }}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        Confirmar chegada
                      </button>
                    )}

                    {s.status === "ALERTED" && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-red-400 bg-red-400/10 rounded-xl px-3 py-2">
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
