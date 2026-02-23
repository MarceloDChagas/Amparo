import { DistanceType } from "@/services/check-in-service";

import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface CheckInStartProps {
  selectedDistance: DistanceType;
  setSelectedDistance: (val: DistanceType) => void;
  onStart: () => void;
  isPending: boolean;
}

export function CheckInStart({
  selectedDistance,
  setSelectedDistance,
  onStart,
  isPending,
}: CheckInStartProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="mb-4 text-center w-full z-30">
        <Label className="text-lg font-semibold block mb-3 text-white">
          Selecione o tempo de deslocamento
        </Label>
        <div className="mx-auto w-[200px]">
          <Select
            value={selectedDistance}
            onValueChange={(val) => setSelectedDistance(val as DistanceType)}
          >
            <SelectTrigger className="bg-white/20 border-white/30 text-white placeholder:text-white/70 h-12 w-full">
              <SelectValue placeholder="Tempo estimado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={DistanceType.SHORT}>
                Curto (Até 10 min)
              </SelectItem>
              <SelectItem value={DistanceType.MEDIUM}>
                Médio (Até 30 min)
              </SelectItem>
              <SelectItem value={DistanceType.LONG}>
                Longo (Até 60 min)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div
        className="relative flex items-center justify-center mt-6"
        style={{ width: "280px", height: "280px" }}
      >
        <style jsx>{`
          @keyframes pulseWaveBlue {
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

        {/* Pulse waves animation - start button is not pressed in the same way, but it pulses gently */}
        {!isPending && (
          <div
            className="absolute rounded-full"
            style={{
              width: "280px",
              height: "280px",
              backgroundColor: "transparent",
              border: "3px solid rgba(59, 130, 246, 0.4)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              animation: "pulseWaveBlue 2s ease-out infinite",
            }}
          />
        )}

        {/* Outer ring - darkest blue */}
        <div
          className="absolute rounded-full transition-transform duration-300"
          style={{
            width: "280px",
            height: "280px",
            backgroundColor: "#1e3a8a",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Middle ring - medium blue */}
        <div
          className="absolute rounded-full transition-transform duration-300"
          style={{
            width: "220px",
            height: "220px",
            backgroundColor: "#2563eb",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Inner circle - lighter blue */}
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
            onClick={onStart}
            disabled={isPending}
            className="w-full h-full rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95"
            style={{
              backgroundColor: isPending ? "#93c5fd" : "#60a5fa",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
              cursor: isPending ? "not-allowed" : "pointer",
            }}
          >
            <span
              className="text-2xl font-bold leading-tight text-center transition-all duration-300 px-4"
              style={{
                color: "#1e3a8a",
              }}
            >
              {isPending ? "INICIANDO..." : "MARCAR SAÍDA"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
