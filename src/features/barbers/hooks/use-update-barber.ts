"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { barbersService, type UpdateBarberPayload } from "../services/barbers.service";

export function useUpdateBarber(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateBarberPayload) => barbersService.update(id, payload),
    onSuccess: (barber) => {
      queryClient.setQueryData(["barbers", "detail", id], barber);
      queryClient.invalidateQueries({ queryKey: ["barbers", "list"] });
    },
  });
}
