import { useQuery } from "@tanstack/react-query";

import { victimService } from "../services/victim-service";

export function useGetVictims() {
  return useQuery({
    queryKey: ["victims"],
    queryFn: victimService.getAll,
  });
}
