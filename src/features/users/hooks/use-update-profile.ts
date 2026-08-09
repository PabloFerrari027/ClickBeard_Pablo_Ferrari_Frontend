"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { usersService, type UpdateProfilePayload } from "../services/users.service";

export function useUpdateProfile(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => usersService.updateProfile(userId, payload),
    onSuccess: (user) => {
      queryClient.setQueryData(["users", "detail", userId], user);
    },
  });
}
