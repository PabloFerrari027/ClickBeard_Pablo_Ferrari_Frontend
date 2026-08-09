"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { usersService, type ChangeRolePayload } from "../services/users.service";

export function useChangeRole(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ChangeRolePayload) => usersService.changeRole(userId, payload),
    onSuccess: (user) => {
      queryClient.setQueryData(["users", "detail", userId], user);
    },
  });
}
