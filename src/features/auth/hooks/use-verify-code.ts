"use client";

import { useMutation } from "@tanstack/react-query";

import { useAuth } from "@/lib/auth-context";
import { authService } from "../services/auth.service";

interface VerifyCodeInput {
  userId: string;
  code: string;
}

/**
 * `validate` → automatically triggers `complete` on success → saves the session (spec §10.3).
 * The UI never calls `complete` directly; this hook chains the two steps.
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
