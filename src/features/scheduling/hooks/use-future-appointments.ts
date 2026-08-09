"use client";

import { useQuery } from "@tanstack/react-query";

import { CACHE_RESOURCE_STALE_TIME } from "@/lib/cache-resources";
import {
  appointmentsService,
  type FutureAppointmentsPeriod,
} from "../services/appointments.service";

export function useFutureAppointments(page: number, period?: FutureAppointmentsPeriod) {
  return useQuery({
    queryKey: ["appointments", "future", page, period],
    queryFn: () => appointmentsService.listFuture(page, period),
    staleTime: CACHE_RESOURCE_STALE_TIME.appointmentsList,
  });
}
