import { useQuery } from "@tanstack/react-query";

import { userService } from "../services/user-service";

export function useGetUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: userService.getAll,
  });
}
