import { useMutation } from "@tanstack/react-query";

import {
  CreateEmergencyAlertRequest,
  EmergencyAlertService,
} from "@/data/services/emergency-alert.service";

export function useCreateEmergencyAlert() {
  return useMutation({
    mutationFn: (data: CreateEmergencyAlertRequest) =>
      EmergencyAlertService.create(data),
  });
}
