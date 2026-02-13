import { useQuery } from "@tanstack/react-query";

import { aggressorService } from "../services/aggressor-service";

export function useGetAggressors() {
  return useQuery({
    queryKey: ["aggressors"],
    queryFn: aggressorService.getAll,
  });
}
