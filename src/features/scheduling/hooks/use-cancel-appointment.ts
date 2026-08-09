"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { appointmentsService } from "../services/appointments.service";
import type { Appointment, AppointmentsListResponse } from "@/types/api";

/**
 * Único caso de optimistic update da aplicação (spec §17): marca `CANCELLED` na lista/detalhe
 * antes da confirmação do servidor, revertendo em erro. O risco de rollback aqui é baixo.
 */
export function useCancelAppointment(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => appointmentsService.cancel(id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["appointments"] });

      const previousDetail = queryClient.getQueryData<Appointment>(["appointments", "detail", id]);
      if (previousDetail) {
        queryClient.setQueryData<Appointment>(["appointments", "detail", id], {
          ...previousDetail,
          status: "CANCELLED",
        });
      }

      const previousLists = queryClient.getQueriesData<AppointmentsListResponse>({
        queryKey: ["appointments", "me"],
      });
      previousLists.forEach(([key, data]) => {
        if (!data) return;
        queryClient.setQueryData<AppointmentsListResponse>(key, {
          ...data,
          appointments: data.appointments.map((appointment) =>
            appointment.id === id ? { ...appointment, status: "CANCELLED" } : appointment
          ),
        });
      });

      return { previousDetail, previousLists };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousDetail) {
        queryClient.setQueryData(["appointments", "detail", id], context.previousDetail);
      }
      context?.previousLists?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}
