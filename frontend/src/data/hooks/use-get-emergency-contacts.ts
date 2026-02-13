import { useQuery } from "@tanstack/react-query";

import { emergencyContactService } from "../services/emergency-contact-service";

export function useGetEmergencyContacts() {
  return useQuery({
    queryKey: ["emergency-contacts"],
    queryFn: () => emergencyContactService.getAll(),
  });
}
