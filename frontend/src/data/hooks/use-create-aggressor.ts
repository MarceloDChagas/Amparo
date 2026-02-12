import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  aggressorService,
  CreateAggressorData,
} from "../services/aggressor-service";

export function useCreateAggressor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAggressorData) => aggressorService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aggressors"] });
    },
  });
}
