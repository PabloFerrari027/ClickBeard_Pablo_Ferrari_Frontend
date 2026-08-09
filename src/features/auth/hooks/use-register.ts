"use client";

import { useMutation } from "@tanstack/react-query";

import { authService, type RegisterPayload } from "../services/auth.service";

export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
  });
}
