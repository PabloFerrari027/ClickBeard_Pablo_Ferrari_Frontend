"use client";

import { useMutation } from "@tanstack/react-query";

import { authService } from "../services/auth.service";

export function useResendCode() {
  return useMutation({
    mutationFn: (userId: string) => authService.resendCode(userId),
  });
}
