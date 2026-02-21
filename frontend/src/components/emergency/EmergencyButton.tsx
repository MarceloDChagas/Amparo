import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { useCreateEmergencyAlert } from "@/hooks/use-emergency-alert";
import { useAuth } from "@/presentation/hooks/useAuth";
import { colors } from "@/styles/colors";

const HOLD_DURATION = 2000; // 2 seconds
const TICK_INTERVAL = 20; // 20ms for smooth animation

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
      toast.error("Você precisa estar logado para enviar um alerta.");
      return;
    }

    if (!navigator.geolocation) {
      toast.error("Geolocalização não suportada pelo seu navegador.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        createAlert({
          latitude,
          longitude,
          victimId: user.id,
        });
      },
      (error) => {
        console.error("Erro ao obter localização:", error);
        toast.error(
          "Erro ao obter localização. Enviando alerta com localização aproximada.",
        );
        createAlert({
          latitude: 0,
          longitude: 0,
          victimId: user.id,
        });
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
        // Give haptic feedback if available
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

  // SVG Progress calculation
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div
      className="relative mb-8 flex items-center justify-center"
      style={{ width: "280px", height: "280px" }}
    >
      {/* Pulse waves animation */}
      {showPulse && (
        <>
          <div
            className="absolute rounded-full animate-pulse-wave"
            style={{
              width: "280px",
              height: "280px",
              backgroundColor: "transparent",
              border: "3px solid rgba(255, 179, 217, 0.6)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              animation: "pulseWave 1.5s ease-out infinite",
            }}
          />
        </>
      )}

      {/* Progress Ring (SVG) */}
      <svg
        className="absolute z-10 pointer-events-none"
        width="230"
        height="230"
        viewBox="0 0 230 230"
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx="115"
          cy="115"
          r={radius}
          fill="transparent"
          stroke={colors.secondary[300]}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition:
              TICK_INTERVAL === TICK_INTERVAL
                ? "none"
                : "stroke-dashoffset 0.1s linear",
            opacity: progress > 0 ? 1 : 0,
          }}
        />
      </svg>

      {/* Outer ring - darkest */}
      <div
        className="absolute rounded-full transition-transform duration-300"
        style={{
          width: "280px",
          height: "280px",
          backgroundColor: "#3d3d6a",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) ${isPressing ? "scale(1.05)" : "scale(1)"}`,
          boxShadow: isPressing ? `0 0 40px ${colors.secondary[300]}` : "none",
        }}
      />

      {/* Middle ring - purple */}
      <div
        className="absolute rounded-full transition-transform duration-300"
        style={{
          width: "220px",
          height: "220px",
          backgroundColor: "#6b5b7b",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) ${isPressing ? "scale(1.02)" : "scale(1)"}`,
        }}
      />

      {/* Inner circle - pink */}
      <button
        className="absolute rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl z-20"
        style={{
          width: "170px",
          height: "170px",
          backgroundColor: isPending
            ? colors.neutral[300]
            : colors.secondary[300],
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) ${isPressing ? "scale(0.95)" : "scale(1)"}`,
          boxShadow: isPressing
            ? "0 0 40px rgba(255, 179, 217, 0.8), inset 0 0 20px rgba(0, 0, 0, 0.1)"
            : "0 10px 30px rgba(0, 0, 0, 0.3)",
          cursor: isPending ? "not-allowed" : "pointer",
          opacity: isPending ? 0.7 : 1,
        }}
        disabled={isPending}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
      >
        <span
          className="text-2xl font-bold leading-tight text-center transition-all duration-300"
          style={{
            color: colors.primary[900],
            textShadow: isPressing
              ? "0 0 10px rgba(255, 255, 255, 0.5)"
              : "none",
          }}
        >
          {isPending ? "ENVIANDO..." : isPressing ? "SEGURE..." : "EMERGÊNCIA"}
        </span>
        {isPressing && (
          <span
            className="text-xs font-bold mt-1"
            style={{ color: colors.primary[900] }}
          >
            {Math.ceil(
              (HOLD_DURATION - (progress / 100) * HOLD_DURATION) / 1000,
            )}
            s
          </span>
        )}
      </button>

      {/* CSS Keyframes */}
      <style jsx>{`
        @keyframes pulseWave {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.8);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
