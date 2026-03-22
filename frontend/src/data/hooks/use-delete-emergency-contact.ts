import { useMutation, useQueryClient } from "@tanstack/react-query";

import { emergencyContactService } from "../services/emergency-contact-service";

export function useDeleteEmergencyContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => emergencyContactService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emergency-contacts"] });
    },
  });
}
