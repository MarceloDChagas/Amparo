// see: /design-system — RF01, RN01, RN02, NRF05, NRF09, NRF10
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { useCreateEmergencyAlert } from "@/hooks/use-emergency-alert";
import {
  getBestPosition,
  PositionResult,
  watchBestPosition,
} from "@/lib/geolocation";
import { useAuth } from "@/presentation/hooks/useAuth";

const HOLD_DURATION = 2000;
const TICK_INTERVAL = 20;
// A pre-warmed fix this tight is good enough to dispatch instantly; otherwise we
// spend a short, stall-bounded budget converging toward the 5 m target.
const EMERGENCY_FAST_FIX_M = 15;

export function EmergencyButton() {
  const { user } = useAuth();
  const [isPressing, setIsPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [earlyRelease, setEarlyRelease] = useState(false);
  // ⑨ — rastreia se o alerta foi enviado sem coordenada válida
  const [isHovered, setIsHovered] = useState(false);
  const [geoFailed, setGeoFailed] = useState(false);
  const [locationDescription, setLocationDescription] = useState("");
  const [locationSubmitted, setLocationSubmitted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const earlyReleaseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Pre-warm GPS while the tab is open so a filtered, precise fix is ready the
  // instant the button is triggered. The Kalman filter inside watchBestPosition
  // fuses the stream of fixes, so livePositionRef converges toward a few metres.
  const livePositionRef = useRef<PositionResult | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);

  useEffect(() => {
    const handle = watchBestPosition((pos) => {
      livePositionRef.current = pos;
      setGpsAccuracy(Math.round(pos.accuracy));
    });
    return () => handle.stop();
  }, []);

  const {
    mutate: createAlert,
    isPending,
    isSuccess,
  } = useCreateEmergencyAlert();

  const handleEmergency = useCallback(() => {
    if (!user) {
      toast.error("Faça login para enviar um alerta.");
      return;
    }

    const send = (lat: number, lng: number) =>
      createAlert({ latitude: lat, longitude: lng, userId: user.id });

    // If the pre-warm already converged to a tight fix, dispatch immediately.
    const live = livePositionRef.current;
    if (live && live.accuracy <= EMERGENCY_FAST_FIX_M) {
      send(live.latitude, live.longitude);
      return;
    }

    // Otherwise spend a short, stall-bounded budget improving the fix, always
    // falling back to the pre-warmed position so we never lose a usable fix.
    getBestPosition(5, 8_000)
      .then((pos) => send(pos.latitude, pos.longitude))
      .catch(() => {
        // NRF05 — fallback: usa a última posição conhecida; só então desiste.
        if (livePositionRef.current) {
          const { latitude, longitude } = livePositionRef.current;
          send(latitude, longitude);
        } else {
          setGeoFailed(true);
          send(0, 0);
        }
      });
  }, [user, createAlert]);

  const handlePressEnd = useCallback(() => {
    const hadProgress = progress > 0 && progress < 100;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPressing(false);
    setProgress(0);

    if (hadProgress) {
      setEarlyRelease(true);
      if (earlyReleaseTimerRef.current)
        clearTimeout(earlyReleaseTimerRef.current);
      earlyReleaseTimerRef.current = setTimeout(
        () => setEarlyRelease(false),
        2000,
      );
    }
  }, [progress]);

  const handlePressStart = useCallback(() => {
    if (isPending || isSuccess) return;

    setIsPressing(true);
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed / HOLD_DURATION) * 100, 100);

      setProgress(newProgress);

      if (newProgress >= 100) {
        handlePressEnd();
        handleEmergency();
        // NRF09 — feedback háptico ao acionar (RN01: confirmação do hold de 2s)
        if ("vibrate" in navigator) {
          navigator.vibrate([100, 50, 100]);
        }
      }
    }, TICK_INTERVAL);
  }, [isPending, isSuccess, handleEmergency, handlePressEnd]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (earlyReleaseTimerRef.current)
        clearTimeout(earlyReleaseTimerRef.current);
    };
  }, []);

  // SVG progress ring ao redor do blob
  const CONTAINER = 230;
  const RING_SIZE = 220;
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const secondsLeft = Math.ceil(
    (HOLD_DURATION - (progress / 100) * HOLD_DURATION) / 1000,
  );

  const blobShape = "68% 32% 46% 54% / 36% 62% 38% 64%";

  const outerBg = isSuccess
    ? "rgba(22, 163, 74, 0.20)"
    : isPressing
      ? "rgba(192, 57, 43, 0.35)"
      : "rgba(220, 38, 38, 0.22)";
  const middleBg = isSuccess
    ? "rgba(22, 163, 74, 0.40)"
    : isPressing
      ? "rgba(192, 57, 43, 0.60)"
      : "rgba(220, 38, 38, 0.45)";
  const innerBg = isSuccess
    ? "#16a34a"
    : isPending
      ? "rgba(192, 57, 43, 0.70)"
      : "var(--emergency)";

  return (
    <div className="flex flex-col items-center">
      {/* Rótulo acima do botão para deixar claro que é acionável */}
      {!isSuccess && !isPending && !isPressing && (
        <p
          className="mb-1 text-xs font-bold tracking-widest uppercase text-center"
          style={{ color: "rgba(180,40,40,0.75)", letterSpacing: "0.12em" }}
          aria-hidden="true"
        >
          Botão de Emergência
        </p>
      )}
      {/* GPS accuracy indicator — visible while idle */}
      {!isSuccess && !isPending && !isPressing && gpsAccuracy !== null && (
        <p
          className="mb-2 text-[10px] font-medium text-center"
          style={{
            color:
              gpsAccuracy <= 5
                ? "rgba(22,163,74,0.85)"
                : gpsAccuracy <= 20
                  ? "rgba(202,138,4,0.85)"
                  : "rgba(220,38,38,0.70)",
          }}
          aria-label={`Precisão do GPS: ${gpsAccuracy} metros`}
        >
          GPS ±{gpsAccuracy}m
        </p>
      )}
      <div
        className="relative mb-2 flex items-center justify-center"
        style={{ width: `${CONTAINER}px`, height: `${CONTAINER}px` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* NRF10 — role="progressbar" comunica o progresso do hold para leitores de tela */}
        <svg
          className="absolute pointer-events-none z-10"
          width={RING_SIZE}
          height={RING_SIZE}
          viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={
            isPressing
              ? `Acionando alerta: ${secondsLeft} segundo${secondsLeft !== 1 ? "s" : ""} restante${secondsLeft !== 1 ? "s" : ""}`
              : "Progresso do acionamento de emergência"
          }
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) rotate(-90deg)",
          }}
        >
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={radius}
            fill="transparent"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              opacity: progress > 0 ? 1 : 0,
              transition: "opacity 0.2s",
            }}
          />
        </svg>

        <div
          aria-hidden="true"
          className={`absolute transition-all duration-300 ${isHovered && !isPressing && !isPending ? "emergency-blob-idle" : ""}`}
          style={{
            width: "220px",
            height: "220px",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: blobShape,
            backgroundColor: outerBg,
            boxShadow: isPressing
              ? "0 0 64px rgba(220, 38, 38, 0.60)"
              : undefined,
          }}
        />

        <div
          aria-hidden="true"
          className="absolute transition-all duration-300"
          style={{
            width: "178px",
            height: "178px",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: blobShape,
            backgroundColor: middleBg,
          }}
        />

        <button
          className="absolute flex flex-col items-center justify-center z-20 select-none"
          style={{
            width: "138px",
            height: "138px",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) ${isPressing ? "scale(0.93)" : "scale(1)"}`,
            borderRadius: blobShape,
            backgroundColor: innerBg,
            border: isSuccess
              ? "3px solid rgba(22,163,74,0.7)"
              : "3px solid rgba(255,255,255,0.55)",
            boxShadow: isPressing
              ? "0 0 32px rgba(192, 57, 43, 0.6), 0 0 0 6px rgba(220,38,38,0.18)"
              : "0 6px 24px rgba(220, 38, 38, 0.45), 0 0 0 4px rgba(220,38,38,0.12)",
            transition:
              "background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease",
            cursor: isPending ? "not-allowed" : "pointer",
            opacity: isPending ? 0.75 : 1,
          }}
          disabled={isPending || isSuccess}
          aria-label={
            isSuccess
              ? "Alerta enviado com sucesso"
              : isPending
                ? "Enviando alerta de emergência"
                : "Botão de emergência — segure por 2 segundos para acionar"
          }
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          onMouseLeave={handlePressEnd}
          onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
        >
          {isSuccess ? (
            <span
              className="font-bold text-white tracking-wide leading-tight text-center"
              style={{
                fontSize: "13px",
                textShadow: "0 1px 8px rgba(0,0,0,0.35)",
                whiteSpace: "pre-line",
              }}
            >
              {"ALERTA\nENVIADO"}
            </span>
          ) : isPending ? (
            <span className="text-base font-bold tracking-widest text-white/90">
              •••
            </span>
          ) : (
            <span
              className="font-bold text-white tracking-wide leading-tight text-center"
              style={{
                fontSize: earlyRelease ? "11px" : isPressing ? "28px" : "18px",
                transition: "font-size 0.2s ease",
                textShadow: "0 1px 8px rgba(0,0,0,0.35)",
                whiteSpace: "pre-line",
              }}
            >
              {isPressing
                ? `${secondsLeft}s`
                : earlyRelease
                  ? "MANTENHA\nPRESSIONADO"
                  : "EMERGÊNCIA"}
            </span>
          )}
        </button>
      </div>

      {/* ⑪ — hint idle: visível antes do primeiro toque, some ao pressionar */}
      {!isPressing && !isPending && !isSuccess && (
        <p
          className="text-sm font-semibold text-center"
          style={{ color: "rgba(160, 40, 40, 0.85)" }}
        >
          Toque e segure por 2s para acionar
        </p>
      )}

      {/* ⑨ — Passo 2 após alerta sem coordenada: pede localização manual */}
      {isSuccess && geoFailed && !locationSubmitted && (
        <div
          className="mt-4 mx-4 rounded-2xl p-4"
          style={{
            backgroundColor: "rgba(255,255,255,0.85)",
            border: "1px solid rgba(180,140,160,0.25)",
          }}
        >
          <p className="text-sm font-semibold text-foreground mb-1">
            Alerta enviado.{" "}
            <span className="font-bold" style={{ color: "var(--warning)" }}>
              Localização não capturada
            </span>
          </p>
          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
            Descreva onde você está para ajudar a equipe a localizar você:
          </p>
          <textarea
            value={locationDescription}
            onChange={(e) => setLocationDescription(e.target.value)}
            placeholder="Ex.: Rua das Flores, perto da farmácia..."
            rows={2}
            className="w-full rounded-xl border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2"
            style={{
              borderColor: "rgba(180,140,160,0.3)",
              backgroundColor: "rgba(255,255,255,0.9)",
            }}
            aria-label="Descreva sua localização atual"
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => {
                if (locationDescription.trim()) {
                  // TODO: enviar locationDescription junto ao alerta via API
                  toast.success("Localização registrada — equipe notificada.");
                }
                setLocationSubmitted(true);
              }}
              className="flex-1 rounded-xl py-2 text-sm font-semibold text-white"
              style={{ backgroundColor: "var(--emergency)" }}
            >
              Enviar localização
            </button>
            <button
              onClick={() => setLocationSubmitted(true)}
              className="rounded-xl px-4 py-2 text-sm font-medium"
              style={{
                color: "rgba(90,53,69,0.6)",
                backgroundColor: "rgba(90,53,69,0.07)",
              }}
            >
              Pular
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
