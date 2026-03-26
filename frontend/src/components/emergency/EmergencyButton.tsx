/**
 * RF01 — Botão de Emergência (HIGH)
 * RN01 — Ativação por Tempo Contínuo: acionamento apenas após 2s pressionado.
 * RN02 — Impossibilidade de Autocancelamento: após disparado, não há como cancelar pelo app.
 * NRF05 — Desempenho: geolocalização com timeout de 8s, fallback para coordenadas 0,0.
 * NRF09 — Usabilidade Sob Estresse: blob de 190px, feedback visual + háptico durante o hold.
 * NRF10 — Acessibilidade: role="progressbar" no SVG, aria-label dinâmico no botão.
 */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { useCreateEmergencyAlert } from "@/hooks/use-emergency-alert";
import { useAuth } from "@/presentation/hooks/useAuth";

const HOLD_DURATION = 2000;
const TICK_INTERVAL = 20;

export function EmergencyButton() {
  const { user } = useAuth();
  const [isPressing, setIsPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [earlyRelease, setEarlyRelease] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const earlyReleaseTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { mutate: createAlert, isPending } = useCreateEmergencyAlert();

  const handleEmergency = useCallback(() => {
    if (!user) {
      toast.error("Faça login para enviar um alerta.");
      return;
    }

    if (!navigator.geolocation) {
      toast.error("Geolocalização não suportada pelo seu navegador.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        createAlert({ latitude, longitude, userId: user.id });
      },
      (error) => {
        console.error("Erro ao obter localização:", error);
        toast.error(
          "Erro ao obter localização. Enviando alerta com localização aproximada.",
        );
        createAlert({ latitude: 0, longitude: 0, userId: user.id });
      },
      { timeout: 8000, maximumAge: 10000, enableHighAccuracy: true },
    );
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
    if (isPending) return;

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
  }, [isPending, handleEmergency, handlePressEnd]);

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

  // Forma blob emergência — deformação mais dramática, inclinação cima-direita
  const blobShape = "68% 32% 46% 54% / 36% 62% 38% 64%";

  const outerBg = isPressing
    ? "rgba(192, 57, 43, 0.30)"
    : "rgba(196, 112, 90, 0.28)";
  const middleBg = isPressing
    ? "rgba(192, 57, 43, 0.55)"
    : "rgba(196, 112, 90, 0.55)";
  const innerBg = isPending
    ? "rgba(196, 112, 90, 0.55)"
    : isPressing
      ? "var(--emergency)"
      : "var(--primary)";

  return (
    <div
      className="relative mb-6 flex items-center justify-center"
      style={{ width: `${CONTAINER}px`, height: `${CONTAINER}px` }}
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
          style={{ opacity: progress > 0 ? 1 : 0, transition: "opacity 0.2s" }}
        />
      </svg>

      {/* Camada externa — blob com glow */}
      <div
        aria-hidden="true"
        className="absolute transition-all duration-300"
        style={{
          width: "220px",
          height: "220px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: blobShape,
          backgroundColor: outerBg,
          boxShadow: isPressing
            ? "0 0 52px rgba(220, 38, 38, 0.45)"
            : "0 0 40px rgba(124, 58, 237, 0.3)",
        }}
      />

      {/* Camada do meio */}
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

      {/* Botão central — blob principal */}
      <button
        className="absolute flex flex-col items-center justify-center z-20 select-none"
        style={{
          width: "138px",
          height: "138px",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) ${isPressing ? "scale(0.96)" : "scale(1)"}`,
          borderRadius: blobShape,
          backgroundColor: innerBg,
          boxShadow: isPressing
            ? "0 0 32px rgba(192, 57, 43, 0.5)"
            : "0 6px 24px rgba(196, 112, 90, 0.45)",
          transition:
            "background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease",
          cursor: isPending ? "not-allowed" : "pointer",
          opacity: isPending ? 0.75 : 1,
        }}
        disabled={isPending}
        aria-label={
          isPending
            ? "Enviando alerta de emergência"
            : "Botão de emergência — segure por 2 segundos para acionar"
        }
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
      >
        {isPending ? (
          <span className="text-base font-bold tracking-widest text-white/90">
            •••
          </span>
        ) : (
          <span
            className="font-bold text-white tracking-widest leading-tight text-center"
            style={{
              fontSize: earlyRelease ? "10px" : isPressing ? "13px" : "14px",
              transition: "font-size 0.2s ease",
              textShadow: "0 1px 6px rgba(0,0,0,0.25)",
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
  );
}
