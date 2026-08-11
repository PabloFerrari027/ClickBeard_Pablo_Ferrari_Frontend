"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  appointmentsService,
  type CancelByAdminPayload,
} from "../services/appointments.service";

/** [PLANNED] `PATCH /appointments/:id/cancel` (spec §10.8, §14.4). */
export function useCancelAppointmentByAdmin(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CancelByAdminPayload) => appointmentsService.cancelByAdmin(id, payload),
    onSuccess: (appointment) => {
      queryClient.setQueryData(["appointments", "detail", id], appointment);
      queryClient.invalidateQueries({ queryKey: ["appointments", "today"] });
      queryClient.invalidateQueries({ queryKey: ["appointments", "future"] });
    },
  });
}
