/**
 * RF03 — Check-in Inteligente (HIGH)
 * RN03 — Tolerância de Atraso: exibe countdown regressivo com três fases visuais.
 *
 * Fases do countdown (NRF09 — comunicação clara do estado):
 *   ACTIVE  (> 2min restantes) — verde: no prazo
 *   WARNING (0–2min restantes)  — âmbar: atenção, prazo se esgotando
 *   OVERDUE (passou do prazo)   — vermelho: atrasada, confirmação urgente
 *
 * NRF10 — aria-live="polite" anuncia mudanças de estado para leitores de tela.
 */
import { useEffect, useState } from "react";

import { Label } from "../ui/label";

interface CheckInActiveProps {
  expectedArrivalTime: Date | string;
  onComplete: () => void;
  isPending: boolean;
}

type CheckInPhase = "ACTIVE" | "WARNING" | "OVERDUE";

const WARNING_THRESHOLD_MS = 2 * 60 * 1000; // 2 minutos

function useCheckInCountdown(expectedArrivalTime: Date | string) {
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    return new Date(expectedArrivalTime).getTime() - Date.now();
  });

  useEffect(() => {
    const target = new Date(expectedArrivalTime).getTime();

    const update = () => setTimeLeft(target - Date.now());
    update();

    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expectedArrivalTime]);

  const phase: CheckInPhase =
    timeLeft > WARNING_THRESHOLD_MS
      ? "ACTIVE"
      : timeLeft > 0
        ? "WARNING"
        : "OVERDUE";

  const absTime = Math.abs(timeLeft);
  const minutes = Math.floor(absTime / 60000);
  const seconds = Math.floor((absTime % 60000) / 1000);
  const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return { phase, formatted, isOverdue: timeLeft <= 0 };
}

// Cores por fase — comunicam o estado sem depender apenas de texto (NRF10)
const phaseConfig = {
  ACTIVE: {
    outerRing: "#14532d",
    middleRing: "#16a34a",
    innerCircle: "#4ade80",
    innerCirclePending: "#86efac",
    pulseColor: "rgba(34, 197, 94, 0.4)",
    textColor: "#14532d",
    label: "MARCAR CHEGADA",
    ariaLabel: "Confirmar chegada ao destino",
    counterPrefix: "",
  },
  WARNING: {
    outerRing: "#78350f",
    middleRing: "#d97706",
    innerCircle: "#fbbf24",
    innerCirclePending: "#fde68a",
    pulseColor: "rgba(217, 119, 6, 0.5)",
    textColor: "#78350f",
    label: "CONFIRMAR CHEGADA",
    ariaLabel: "Confirmar chegada — prazo se esgotando",
    counterPrefix: "",
  },
  OVERDUE: {
    outerRing: "#7f1d1d",
    middleRing: "#991b1b",
    innerCircle: "#dc2626",
    innerCirclePending: "#f87171",
    pulseColor: "rgba(220, 38, 38, 0.5)",
    textColor: "#ffffff",
    label: "CHEGADA ATRASADA",
    ariaLabel: "Confirmar chegada — prazo esgotado",
    counterPrefix: "+",
  },
} as const;

export function CheckInActive({
  expectedArrivalTime,
  onComplete,
  isPending,
}: CheckInActiveProps) {
  const { phase, formatted, isOverdue } =
    useCheckInCountdown(expectedArrivalTime);
  const config = phaseConfig[phase];

  return (
    <div className="w-full flex flex-col items-center justify-center mt-6">
      <div className="mb-4 text-center w-full z-30">
        <Label className="text-lg font-semibold block mb-1 text-white">
          {isOverdue ? "Chegada Atrasada" : "Tempo Restante"}
        </Label>
        {/* NRF10 — aria-live="polite" anuncia mudanças de fase para leitores de tela */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="text-4xl font-bold tracking-wider tabular-nums transition-colors duration-700"
          style={{
            color:
              phase === "ACTIVE"
                ? "#4ade80"
                : phase === "WARNING"
                  ? "#fbbf24"
                  : "#f87171",
          }}
        >
          {/* RN03 — prefixo "+" indica que o prazo já passou */}
          {config.counterPrefix}
          {formatted}
        </div>
      </div>

      <div
        className="relative flex items-center justify-center mt-6"
        style={{ width: "280px", height: "280px" }}
      >
        {/* Pulse wave — reutiliza keyframe pulse-wave de globals.css */}
        {!isPending && (
          <div
            aria-hidden="true"
            className="absolute rounded-full"
            style={{
              width: "280px",
              height: "280px",
              backgroundColor: "transparent",
              border: `3px solid ${config.pulseColor}`,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              animation: "pulse-wave 2s ease-out infinite",
            }}
          />
        )}

        {/* Outer ring */}
        <div
          aria-hidden="true"
          className="absolute rounded-full transition-colors duration-700"
          style={{
            width: "280px",
            height: "280px",
            backgroundColor: config.outerRing,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Middle ring */}
        <div
          aria-hidden="true"
          className="absolute rounded-full transition-colors duration-700"
          style={{
            width: "220px",
            height: "220px",
            backgroundColor: config.middleRing,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Inner circle — botão de confirmação */}
        <div
          className="absolute z-20"
          style={{
            width: "170px",
            height: "170px",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <button
            onClick={onComplete}
            disabled={isPending}
            aria-label={isPending ? "Finalizando trajeto" : config.ariaLabel}
            className="w-full h-full rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95"
            style={{
              backgroundColor: isPending
                ? config.innerCirclePending
                : config.innerCircle,
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
              cursor: isPending ? "not-allowed" : "pointer",
              transition: "background-color 0.7s ease",
            }}
          >
            <span
              className="text-xl font-bold leading-tight text-center transition-colors duration-700 px-4"
              style={{ color: config.textColor }}
            >
              {isPending ? "FINALIZANDO..." : config.label}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
