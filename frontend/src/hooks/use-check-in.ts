import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { checkInService, DistanceType } from "@/services/check-in-service";

export const useGetActiveCheckIn = () => {
  return useQuery({
    queryKey: ["active-check-in"],
    queryFn: () => checkInService.getActiveCheckIn(),
  });
};

export const useStartCheckIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      distanceType,
      startLatitude,
      startLongitude,
    }: {
      distanceType: DistanceType;
      startLatitude?: number;
      startLongitude?: number;
    }) =>
      checkInService.startCheckIn(distanceType, startLatitude, startLongitude),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["active-check-in"] });
      toast.success("Check-in iniciado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao iniciar check-in. Tente novamente.");
      console.error(error);
    },
  });
};

export const useCompleteCheckIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      finalLatitude,
      finalLongitude,
    }: {
      finalLatitude?: number;
      finalLongitude?: number;
    } = {}) => checkInService.completeCheckIn(finalLatitude, finalLongitude),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["active-check-in"] });
      if (data.status === "ON_TIME") {
        toast.success("Check-in finalizado: Chegada no horário previsto!");
      } else {
        toast.warning("Check-in finalizado: Chegada com atraso.");
      }
    },
    onError: (error) => {
      toast.error("Erro ao finalizar check-in.");
      console.error(error);
    },
  });
};
