/**
 * RF03 — Check-in Inteligente (HIGH)
 * Inicia o monitoramento de rota segura. A usuária seleciona o tempo estimado
 * de deslocamento; o backend calcula o `expectedArrivalTime` (RN03).
 *
 * NRF09 — Usabilidade Sob Estresse: botão de 170px, aria-label descritivo.
 * Cores do contexto user (violeta) via CSS vars — não azul institucional.
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
  // Identidade teal — diferencia visualmente da tela de Emergência (violeta)
  // Teal semântico: navegação, rota, movimento seguro (não conflita com verde/âmbar/vermelho do countdown)
  const teal = {
    outer: "#134e4a",
    middle: "#0f766e",
    inner: "#0d9488",
    innerPending: "rgba(13, 148, 136, 0.5)",
    pulse: "rgba(13, 148, 136, 0.45)",
    glow: "rgba(13, 148, 136, 0.28)",
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div
        className="relative flex items-center justify-center mt-6"
        style={{ width: "220px", height: "220px" }}
      >
        {/* Pulse wave teal */}
        {!isPending && (
          <div
            aria-hidden="true"
            className="absolute rounded-full"
            style={{
              width: "220px",
              height: "220px",
              backgroundColor: "transparent",
              border: `3px solid ${teal.pulse}`,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              animation: "pulse-wave 2s ease-out infinite",
            }}
          />
        )}

        {/* Outer ring — teal escuro */}
        <div
          aria-hidden="true"
          className="absolute rounded-full"
          style={{
            width: "220px",
            height: "220px",
            backgroundColor: teal.outer,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: `0 0 48px ${teal.glow}`,
          }}
        />

        {/* Middle ring — teal médio */}
        <div
          aria-hidden="true"
          className="absolute rounded-full"
          style={{
            width: "175px",
            height: "175px",
            backgroundColor: teal.middle,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Inner circle — botão de ação */}
        <div
          className="absolute z-20"
          style={{
            width: "130px",
            height: "130px",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <button
            onClick={onStart}
            disabled={isPending}
            aria-label={
              isPending ? "Iniciando trajeto seguro" : "Iniciar trajeto seguro"
            }
            className="w-full h-full rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95"
            style={{
              backgroundColor: isPending ? teal.innerPending : teal.inner,
              boxShadow: `0 10px 30px rgba(0, 0, 0, 0.3), 0 0 24px ${teal.glow}`,
              cursor: isPending ? "not-allowed" : "pointer",
            }}
          >
            <span className="text-base font-bold leading-tight text-center transition-all duration-300 px-3 text-white">
              {isPending ? "INICIANDO..." : "INICIAR TRAJETO"}
            </span>
          </button>
        </div>
      </div>

      <div className="mt-6 text-center w-full z-30">
        <Label className="text-sm font-medium block mb-2 text-white/70">
          Tempo de deslocamento
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
    </div>
  );
}
