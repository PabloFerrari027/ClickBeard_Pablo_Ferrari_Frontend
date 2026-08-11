"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { barbersService } from "../services/barbers.service";

/** [PLANNED] spec §3.3 — does not reactivate already-cancelled appointments. */
export function useDeleteUnavailability(barberId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (unavailabilityId: string) =>
      barbersService.deleteUnavailability(barberId, unavailabilityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["barbers", "unavailabilities", barberId] });
    },
  });
}
