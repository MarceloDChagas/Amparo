import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CreateVictimData, victimService } from "../services/victim-service";

export function useCreateVictim() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVictimData) => victimService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["victims"] });
    },
  });
}
