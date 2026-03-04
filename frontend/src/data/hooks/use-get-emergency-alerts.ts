import { useQuery } from "@tanstack/react-query";

import { emergencyAlertService } from "@/services/emergency-alert-service";

export function useGetEmergencyAlerts() {
  return useQuery({
    queryKey: ["emergencyAlerts"],
    queryFn: () => emergencyAlertService.getAll(),
  });
}
