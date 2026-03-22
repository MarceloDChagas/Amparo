/**
 * RF01 — Botão de Emergência (HIGH)
 * RN01 — Ativação por Tempo Contínuo: acionamento apenas após 2s pressionado.
 * RN02 — Impossibilidade de Autocancelamento: após disparado, não há como cancelar pelo app.
 * NRF05 — Desempenho: geolocalização com timeout de 8s, fallback para coordenadas 0,0.
 * NRF09 — Usabilidade Sob Estresse: botão de 170px, feedback visual + háptico durante o hold.
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
  const [showPulse, setShowPulse] = useState(false);
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
    setShowPulse(false);

    // Feedback de soltura prematura — mostra "Mantenha pressionado" brevemente
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
    setShowPulse(true);
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

  // Botão reduzido: 220px container → menos dominante no estado neutro (NRF09)
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const secondsLeft = Math.ceil(
    (HOLD_DURATION - (progress / 100) * HOLD_DURATION) / 1000,
  );

  return (
    <div
      className="relative mb-6 flex items-center justify-center"
      style={{ width: "220px", height: "220px" }}
    >
      {/*
       * Pulse wave — violet no estado neutro, vermelho ao pressionar.
       * RN01 — a transição de cor sinaliza que o alerta está sendo acionado.
       */}
      {showPulse && (
        <div
          aria-hidden="true"
          className="absolute rounded-full"
          style={{
            width: "220px",
            height: "220px",
            backgroundColor: "transparent",
            border: `3px solid ${isPressing ? "rgba(220, 38, 38, 0.6)" : "rgba(124, 58, 237, 0.5)"}`,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            animation: "pulse-wave 1.5s ease-out infinite",
          }}
        />
      )}

      {/* NRF10 — role="progressbar" comunica o progresso do hold para leitores de tela */}
      <svg
        className="absolute z-10 pointer-events-none"
        width="180"
        height="180"
        viewBox="0 0 180 180"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={
          isPressing
            ? `Acionando alerta: ${secondsLeft} segundo${secondsLeft !== 1 ? "s" : ""} restante${secondsLeft !== 1 ? "s" : ""}`
            : "Progresso do acionamento de emergência"
        }
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="transparent"
          stroke="rgba(255,255,255,0.9)"
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ opacity: progress > 0 ? 1 : 0 }}
        />
      </svg>

      {/*
       * Outer ring — violet no estado neutro, transição para vermelho escuro no press.
       * A mudança de cor comunica a ativação sem manter o estado de alerta permanente.
       */}
      <div
        aria-hidden="true"
        className="absolute rounded-full transition-all duration-300"
        style={{
          width: "220px",
          height: "220px",
          backgroundColor: isPressing ? "#7f1d1d" : "rgba(88, 28, 135, 0.45)",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) ${isPressing ? "scale(1.05)" : "scale(1)"}`,
          boxShadow: isPressing
            ? "0 0 40px rgba(220, 38, 38, 0.45)"
            : "0 0 32px rgba(124, 58, 237, 0.25)",
        }}
      />

      {/* Middle ring — violet no neutro, vermelho médio no press */}
      <div
        aria-hidden="true"
        className="absolute rounded-full transition-all duration-300"
        style={{
          width: "175px",
          height: "175px",
          backgroundColor: isPressing ? "#991b1b" : "rgba(109, 40, 217, 0.65)",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) ${isPressing ? "scale(1.02)" : "scale(1)"}`,
        }}
      />

      {/*
       * Inner circle — violet no neutro, vermelho pleno no press.
       * RN01 — o vermelho aparece apenas durante o acionamento (hold de 2s),
       * reservando a cor de emergência para o momento de crise, não o estado cotidiano.
       */}
      <button
        className="absolute rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl z-20"
        style={{
          width: "130px",
          height: "130px",
          backgroundColor: isPending
            ? "rgba(124, 58, 237, 0.5)"
            : isPressing
              ? "var(--emergency)"
              : "var(--primary)",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) ${isPressing ? "scale(0.95)" : "scale(1)"}`,
          boxShadow: isPressing
            ? "0 0 40px rgba(220, 38, 38, 0.8), inset 0 0 20px rgba(0, 0, 0, 0.15)"
            : "0 8px 28px rgba(88, 28, 135, 0.5)",
          cursor: isPending ? "not-allowed" : "pointer",
          opacity: isPending ? 0.7 : 1,
        }}
        disabled={isPending}
        // NRF10 — aria-label descreve a ação e o mecanismo de hold (RN01)
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
        <span
          className="text-lg font-bold leading-tight text-center text-white transition-all duration-300"
          style={{ whiteSpace: "pre-line" }}
        >
          {isPending
            ? "ENVIANDO..."
            : isPressing
              ? "SEGURE..."
              : earlyRelease
                ? "MANTENHA\nPRESSIONADO"
                : "EMERGÊNCIA"}
        </span>
        {/* RN01 — contador regressivo reforça o mecanismo de hold de 2s */}
        {isPressing && (
          <span className="text-xs font-bold mt-1 text-white/90">
            {secondsLeft}s
          </span>
        )}
      </button>
    </div>
  );
}
