"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  appointmentsService,
  type CreateAppointmentPayload,
} from "../services/appointments.service";

/**
 * Invalida os mesmos 4 prefixos que o backend invalida internamente (spec §4.2):
 * `appointments:me`, `appointments:today`, `appointments:future`, `timeSlots` do slot escolhido.
 * Sem optimistic update — o risco de `BarberTimeSlotConflictError` é real e frequente (spec §17).
 */
export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAppointmentPayload) => appointmentsService.create(payload),
    onSuccess: (_appointment, variables) => {
      queryClient.invalidateQueries({ queryKey: ["appointments", "me"] });
      queryClient.invalidateQueries({ queryKey: ["appointments", "today"] });
      queryClient.invalidateQueries({ queryKey: ["appointments", "future"] });
      queryClient.invalidateQueries({
        queryKey: ["timeSlots", variables.barberId, variables.qualificationId],
      });
    },
  });
}
