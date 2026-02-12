import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  CreateOccurrenceData,
  occurrenceService,
} from "../services/occurrence-service";

export function useCreateOccurrence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOccurrenceData) => occurrenceService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["occurrences"] });
    },
  });
}
