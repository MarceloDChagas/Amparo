import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CreateUserData, userService } from "../services/user-service";

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserData) => userService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
