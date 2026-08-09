"use client";

import { useMutation } from "@tanstack/react-query";

import { authService, type LoginPayload } from "../services/auth.service";
import { setPendingVerification } from "../pending-verification";

/** Sucesso (200, `{user}`) — não recebe token, apenas confirma e dispara 2FA (spec §10.2). */
export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (data) => {
      setPendingVerification({
        userId: data.user.id,
        email: data.user.email,
        name: data.user.name,
      });
    },
  });
}
