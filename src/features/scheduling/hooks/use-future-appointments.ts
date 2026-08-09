"use client";

import { useQuery } from "@tanstack/react-query";

import { CACHE_RESOURCE_STALE_TIME } from "@/lib/cache-resources";
import { appointmentsService } from "../services/appointments.service";

export function useFutureAppointments(page: number) {
  return useQuery({
    queryKey: ["appointments", "future", page],
    queryFn: () => appointmentsService.listFuture(page),
    staleTime: CACHE_RESOURCE_STALE_TIME.appointmentsList,
  });
}
