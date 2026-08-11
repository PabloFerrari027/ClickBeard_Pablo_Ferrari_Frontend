"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  appointmentsService,
  type CreateAppointmentPayload,
} from "../services/appointments.service";

/**
 * Invalidates the same 4 prefixes the backend invalidates internally (spec §4.2):
 * `appointments:me`, `appointments:today`, `appointments:future`, `timeSlots` for the chosen slot.
 * No optimistic update — the risk of `BarberTimeSlotConflictError` is real and frequent (spec §17).
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
