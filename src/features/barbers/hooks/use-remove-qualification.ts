"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { barbersService } from "../services/barbers.service";

export function useRemoveQualification(barberId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (qualificationId: string) =>
      barbersService.removeQualification(barberId, qualificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["barbers", "detail", barberId] });
    },
  });
}
