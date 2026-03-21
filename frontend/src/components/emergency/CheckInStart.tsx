/**
 * RF03 — Check-in Inteligente (HIGH)
 * Inicia o monitoramento de rota segura. A usuária seleciona o tempo estimado
 * de deslocamento; o backend calcula o `expectedArrivalTime` (RN03).
 *
 * NRF09 — Usabilidade Sob Estresse: botão de 170px, aria-label descritivo.
 * Cores do contexto victim (violeta) via CSS vars — não azul institucional.
 */
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
        {/* Pulse wave — reutiliza keyframe pulse-wave de globals.css */}
        {!isPending && (
          <div
            aria-hidden="true"
            className="absolute rounded-full"
            style={{
              width: "280px",
              height: "280px",
              backgroundColor: "transparent",
              // Violeta — cor do contexto victim (var(--primary) = #7c3aed)
              border: "3px solid rgba(124, 58, 237, 0.4)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              animation: "pulse-wave 2s ease-out infinite",
            }}
          />
        )}

        {/* Outer ring — violeta escuro */}
        <div
          aria-hidden="true"
          className="absolute rounded-full transition-transform duration-300"
          style={{
            width: "280px",
            height: "280px",
            backgroundColor: "#3b0764",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Middle ring — violeta médio */}
        <div
          aria-hidden="true"
          className="absolute rounded-full transition-transform duration-300"
          style={{
            width: "220px",
            height: "220px",
            backgroundColor: "#6b21a8",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Inner circle — botão de ação */}
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
            aria-label={
              isPending
                ? "Iniciando monitoramento de deslocamento"
                : "Iniciar monitoramento de deslocamento seguro"
            }
            className="w-full h-full rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95"
            style={{
              // var(--primary) no contexto victim = #7c3aed (violeta)
              backgroundColor: isPending
                ? "rgba(124, 58, 237, 0.5)"
                : "var(--primary)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
              cursor: isPending ? "not-allowed" : "pointer",
            }}
          >
            <span
              className="text-2xl font-bold leading-tight text-center transition-all duration-300 px-4"
              style={{ color: "#ffffff" }}
            >
              {isPending ? "INICIANDO..." : "MARCAR SAÍDA"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
