"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { barbersService } from "../services/barbers.service";

export function useAddQualification(barberId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (qualificationId: string) =>
      barbersService.addQualification(barberId, qualificationId),
    onSuccess: (barber) => {
      queryClient.setQueryData(["barbers", "detail", barberId], barber);
    },
  });
}
