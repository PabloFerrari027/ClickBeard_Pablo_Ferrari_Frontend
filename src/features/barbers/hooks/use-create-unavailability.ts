"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { barbersService, type CreateUnavailabilityPayload } from "../services/barbers.service";

/** [PLANEJADO] spec §3.3, §14.6 — cascata de cancelamento é assíncrona no backend; o frontend não espera por ela. */
export function useCreateUnavailability(barberId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUnavailabilityPayload) =>
      barbersService.createUnavailability(barberId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["barbers", "unavailabilities", barberId] });
    },
  });
}
