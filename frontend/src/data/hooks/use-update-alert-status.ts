import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  AlertStatusType,
  emergencyAlertService,
} from "@/services/emergency-alert-service";

interface UpdateAlertStatusInput {
  alertId: string;
  status: AlertStatusType;
  cancellationReason?: string;
}

export function useUpdateAlertStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      alertId,
      status,
      cancellationReason,
    }: UpdateAlertStatusInput) =>
      emergencyAlertService.updateStatus(alertId, {
        status,
        cancellationReason,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emergencyAlerts"] });
    },
  });
}
