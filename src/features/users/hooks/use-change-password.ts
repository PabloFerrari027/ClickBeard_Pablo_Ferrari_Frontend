"use client";

import { useMutation } from "@tanstack/react-query";

import { usersService, type UpdatePasswordPayload } from "../services/users.service";

export function useChangePassword(userId: string) {
  return useMutation({
    mutationFn: (payload: UpdatePasswordPayload) =>
      usersService.updatePassword(userId, payload),
  });
}
