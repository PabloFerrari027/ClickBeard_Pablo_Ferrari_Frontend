"use client";

import { useMutation } from "@tanstack/react-query";

import { useAuth } from "@/lib/auth-context";
import { authService } from "../services/auth.service";

interface VerifyCodeInput {
  userId: string;
  code: string;
}

/**
 * `validate` → dispara `complete` automaticamente em sucesso → grava sessão (spec §10.3).
 * A UI nunca chama `complete` diretamente; este hook encadeia os dois passos.
 */
export function useVerifyCode() {
  const { establishSession } = useAuth();

  return useMutation({
    mutationFn: async ({ userId, code }: VerifyCodeInput) => {
      await authService.validateCode({ userId, code });
      const tokens = await authService.completeVerification({ userId });
      return establishSession(tokens, userId);
    },
  });
}
