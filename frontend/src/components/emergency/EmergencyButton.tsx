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
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const { mutate: createAlert, isPending } = useCreateEmergencyAlert();

  const handleEmergency = useCallback(() => {
    if (!user) {
      toast.error("Você precisa estar logada para enviar um alerta.");
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
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPressing(false);
    setProgress(0);
    setShowPulse(false);
  }, []);

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
    };
  }, []);

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const secondsLeft = Math.ceil(
    (HOLD_DURATION - (progress / 100) * HOLD_DURATION) / 1000,
  );

  return (
    <div
      className="relative mb-8 flex items-center justify-center"
      style={{ width: "280px", height: "280px" }}
    >
      {/* Pulse wave — keyframe pulse-wave definido em globals.css */}
      {showPulse && (
        <div
          aria-hidden="true"
          className="absolute rounded-full"
          style={{
            width: "280px",
            height: "280px",
            backgroundColor: "transparent",
            // RN01 — cor vermelha reforça que o alerta está sendo acionado
            border: "3px solid rgba(220, 38, 38, 0.6)",
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
        width="230"
        height="230"
        viewBox="0 0 230 230"
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
          cx="115"
          cy="115"
          r={radius}
          fill="transparent"
          stroke="rgba(255,255,255,0.9)"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ opacity: progress > 0 ? 1 : 0 }}
        />
      </svg>

      {/* Outer ring — vermelho escuro (reservado para emergência, RN01) */}
      <div
        aria-hidden="true"
        className="absolute rounded-full transition-transform duration-300"
        style={{
          width: "280px",
          height: "280px",
          backgroundColor: "#7f1d1d",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) ${isPressing ? "scale(1.05)" : "scale(1)"}`,
          boxShadow: isPressing ? "0 0 40px rgba(220, 38, 38, 0.5)" : "none",
        }}
      />

      {/* Middle ring — vermelho médio */}
      <div
        aria-hidden="true"
        className="absolute rounded-full transition-transform duration-300"
        style={{
          width: "220px",
          height: "220px",
          backgroundColor: "#991b1b",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) ${isPressing ? "scale(1.02)" : "scale(1)"}`,
        }}
      />

      {/* Inner circle — botão de ação principal */}
      <button
        className="absolute rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl z-20"
        style={{
          width: "170px",
          height: "170px",
          // RN01 — vermelho #dc2626 EXCLUSIVO para emergência (nunca usar em outros contextos)
          backgroundColor: isPending
            ? "rgba(220, 38, 38, 0.5)"
            : "var(--emergency)",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) ${isPressing ? "scale(0.95)" : "scale(1)"}`,
          boxShadow: isPressing
            ? "0 0 40px rgba(220, 38, 38, 0.8), inset 0 0 20px rgba(0, 0, 0, 0.15)"
            : "0 10px 30px rgba(0, 0, 0, 0.35)",
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
        <span className="text-2xl font-bold leading-tight text-center text-white transition-all duration-300">
          {isPending ? "ENVIANDO..." : isPressing ? "SEGURE..." : "EMERGÊNCIA"}
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
