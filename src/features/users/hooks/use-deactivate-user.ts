"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { usersService } from "../services/users.service";

export function useDeactivateUser(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => usersService.deactivate(userId),
    onSuccess: (user) => {
      queryClient.setQueryData(["users", "detail", userId], user);
    },
  });
}
