"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { barbersService, type CreateBarberPayload } from "../services/barbers.service";

export function useCreateBarber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBarberPayload) => barbersService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["barbers", "list"] });
    },
  });
}
