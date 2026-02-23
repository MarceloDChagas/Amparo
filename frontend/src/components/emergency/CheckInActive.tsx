import { format } from "date-fns";

import { Label } from "../ui/label";

interface CheckInActiveProps {
  expectedArrivalTime: Date | string;
  onComplete: () => void;
  isPending: boolean;
}

export function CheckInActive({
  expectedArrivalTime,
  onComplete,
  isPending,
}: CheckInActiveProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center mt-6">
      <div className="mb-4 text-center w-full z-30">
        <Label className="text-lg font-semibold block mb-1 text-white">
          Chegada Prevista
        </Label>
        <div className="text-4xl font-bold tracking-wider text-white">
          {format(new Date(expectedArrivalTime), "HH:mm")}
        </div>
      </div>

      <div
        className="relative flex items-center justify-center mt-6"
        style={{ width: "280px", height: "280px" }}
      >
        <style jsx>{`
          @keyframes pulseWaveGreen {
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

        {/* Pulse waves animation */}
        {!isPending && (
          <div
            className="absolute rounded-full"
            style={{
              width: "280px",
              height: "280px",
              backgroundColor: "transparent",
              border: "3px solid rgba(34, 197, 94, 0.4)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              animation: "pulseWaveGreen 2s ease-out infinite",
            }}
          />
        )}

        {/* Outer ring - darkest green */}
        <div
          className="absolute rounded-full transition-transform duration-300"
          style={{
            width: "280px",
            height: "280px",
            backgroundColor: "#14532d",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Middle ring - medium green */}
        <div
          className="absolute rounded-full transition-transform duration-300"
          style={{
            width: "220px",
            height: "220px",
            backgroundColor: "#16a34a",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Inner circle - lighter green */}
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
            className="w-full h-full rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95"
            style={{
              backgroundColor: isPending ? "#86efac" : "#4ade80",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
              cursor: isPending ? "not-allowed" : "pointer",
            }}
          >
            <span
              className="text-2xl font-bold leading-tight text-center transition-all duration-300 px-4"
              style={{
                color: "#14532d",
              }}
            >
              {isPending ? "FINALIZANDO..." : "MARCAR CHEGADA"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
