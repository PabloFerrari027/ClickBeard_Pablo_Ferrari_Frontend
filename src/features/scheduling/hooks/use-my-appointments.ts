"use client";

import { useQuery } from "@tanstack/react-query";

import { CACHE_RESOURCE_STALE_TIME } from "@/lib/cache-resources";
import { appointmentsService } from "../services/appointments.service";

export function useMyAppointments(page: number) {
  return useQuery({
    queryKey: ["appointments", "me", page],
    queryFn: () => appointmentsService.listMine(page),
    staleTime: CACHE_RESOURCE_STALE_TIME.appointmentsList,
  });
}
