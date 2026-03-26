/**
 * RF03 — Check-in Inteligente (HIGH)
 * Inicia o monitoramento de rota segura. O usuário seleciona o tempo estimado
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
  // Identidade teal — diferencia visualmente da tela de Emergência (violeta)
  // Teal semântico: navegação, rota, movimento seguro (não conflita com verde/âmbar/vermelho do countdown)
  const teal = {
    outer: "rgba(122, 181, 160, 0.30)",
    middle: "rgba(90, 158, 138, 0.55)",
    inner: "#5a9e8a",
    innerPending: "rgba(90, 158, 138, 0.55)",
    glow: "rgba(90, 158, 138, 0.35)",
  };

  // Forma blob trajeto — inclinação oposta à emergência para diferenciar
  const blobShape = "38% 62% 54% 46% / 62% 36% 64% 38%";

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div
        className="relative flex items-center justify-center mt-6"
        style={{ width: "220px", height: "220px" }}
      >
        {/* Camada externa — blob com glow teal */}
        <div
          aria-hidden="true"
          className="absolute"
          style={{
            width: "220px",
            height: "220px",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: blobShape,
            backgroundColor: teal.outer,
            boxShadow: `0 0 48px ${teal.glow}`,
          }}
        />

        {/* Camada do meio */}
        <div
          aria-hidden="true"
          className="absolute"
          style={{
            width: "178px",
            height: "178px",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: blobShape,
            backgroundColor: teal.middle,
          }}
        />

        {/* Botão central — blob principal */}
        <button
          onClick={onStart}
          disabled={isPending}
          aria-label={
            isPending ? "Iniciando trajeto seguro" : "Iniciar trajeto seguro"
          }
          className="absolute z-20 flex flex-col items-center justify-center transition-all duration-300 active:scale-95 select-none"
          style={{
            width: "138px",
            height: "138px",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: blobShape,
            backgroundColor: isPending ? teal.innerPending : teal.inner,
            boxShadow: `0 6px 24px rgba(0,0,0,0.3), 0 0 20px ${teal.glow}`,
            cursor: isPending ? "not-allowed" : "pointer",
          }}
        >
          <span
            className="text-sm font-bold leading-tight text-center px-3 text-white tracking-wide"
            style={{ whiteSpace: "pre-line" }}
          >
            {isPending ? "INICIANDO..." : "INICIAR\nTRAJETO"}
          </span>
        </button>
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
