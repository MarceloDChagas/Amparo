import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  CreateEmergencyContactData,
  emergencyContactService,
} from "../services/emergency-contact-service";

export function useCreateEmergencyContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEmergencyContactData) =>
      emergencyContactService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emergency-contacts"] });
    },
  });
}
