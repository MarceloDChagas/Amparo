import { format } from "date-fns";
import { useEffect, useState } from "react";

import {
  useCompleteCheckIn,
  useGetActiveCheckIn,
  useStartCheckIn,
} from "@/hooks/use-check-in";
import { DistanceType } from "@/services/check-in-service";

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function CheckInTab() {
  const [selectedDistance, setSelectedDistance] = useState<DistanceType>(
    DistanceType.SHORT,
  );

  const { data: activeCheckIn, isLoading } = useGetActiveCheckIn();
  const startCheckIn = useStartCheckIn();
  const completeCheckIn = useCompleteCheckIn();

  const handleStart = () => {
    startCheckIn.mutate(selectedDistance);
  };

  const handleComplete = () => {
    completeCheckIn.mutate();
  };

  if (isLoading) {
    return <div className="text-white text-center mt-12">Carregando...</div>;
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-start w-full max-w-md mx-auto relative px-4 mt-8">
      <Card className="w-full bg-white/10 backdrop-blur-sm border-white/20 text-white p-6">
        <CardContent className="flex flex-col items-center space-y-6 pt-6">
          {!activeCheckIn ? (
            <div className="w-full space-y-8 flex flex-col items-center">
              <div className="text-center w-full">
                <Label className="text-lg font-semibold block mb-3 text-white">
                  Selecione o tempo de deslocamento
                </Label>
                <div className="mx-auto w-[200px]">
                  <Select
                    value={selectedDistance}
                    onValueChange={(val) =>
                      setSelectedDistance(val as DistanceType)
                    }
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

              <div className="relative pt-4 w-full flex justify-center">
                <div className="absolute inset-0 flex items-center justify-center animate-ping opacity-20">
                  <div className="w-48 h-48 bg-primary rounded-full"></div>
                </div>
                <button
                  onClick={handleStart}
                  disabled={startCheckIn.isPending}
                  className="relative w-40 h-40 rounded-full bg-blue-600 border-4 border-blue-400 shadow-[0_0_30px_rgba(37,99,235,0.6)] flex items-center justify-center text-white font-bold text-xl active:scale-95 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span className="drop-shadow-md">
                    {startCheckIn.isPending ? "INICIANDO..." : "MARCAR SAÍDA"}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full space-y-8 flex flex-col items-center">
              <div className="text-center w-full bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/10">
                <Label className="text-base text-white/80 block mb-1">
                  Chegada Prevista:
                </Label>
                <div className="text-3xl font-bold tracking-wider">
                  {format(new Date(activeCheckIn.expectedArrivalTime), "HH:mm")}
                </div>
              </div>

              <div className="relative pt-4 w-full flex justify-center">
                <div className="absolute inset-0 flex items-center justify-center animate-pulse opacity-20">
                  <div className="w-48 h-48 bg-green-500 rounded-full"></div>
                </div>
                <button
                  onClick={handleComplete}
                  disabled={completeCheckIn.isPending}
                  className="relative w-40 h-40 rounded-full bg-green-600 border-4 border-green-400 shadow-[0_0_30px_rgba(22,163,74,0.6)] flex items-center justify-center text-white font-bold text-xl active:scale-95 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span className="drop-shadow-md text-center max-w-xs px-4">
                    {completeCheckIn.isPending
                      ? "FINALIZANDO..."
                      : "MARCAR CHEGADA"}
                  </span>
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <p className="mt-8 text-center text-white/70 text-sm max-w-sm">
        O Check-in inteligente monitora se você chega no destino no horário
        previsto. Caso atrase, enviaremos um alerta!
      </p>
    </div>
  );
}
