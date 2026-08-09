"use client";

import { useQuery } from "@tanstack/react-query";

import { CACHE_RESOURCE_STALE_TIME } from "@/lib/cache-resources";
import { appointmentsService } from "../services/appointments.service";

export function useTodayAppointments(page: number) {
  return useQuery({
    queryKey: ["appointments", "today", page],
    queryFn: () => appointmentsService.listToday(page),
    staleTime: CACHE_RESOURCE_STALE_TIME.appointmentsList,
  });
}
