"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { barbersService, type CreateUnavailabilityPayload } from "../services/barbers.service";

/** [PLANNED] spec §3.3, §14.6 — cancellation cascade is asynchronous on the backend; the frontend does not wait for it. */
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
