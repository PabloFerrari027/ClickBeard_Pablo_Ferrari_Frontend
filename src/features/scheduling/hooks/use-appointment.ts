"use client";

import { useQuery } from "@tanstack/react-query";

import { CACHE_RESOURCE_STALE_TIME } from "@/lib/cache-resources";
import { appointmentsService } from "../services/appointments.service";

export function useAppointment(id: string | undefined) {
  return useQuery({
    queryKey: ["appointments", "detail", id],
    queryFn: () => appointmentsService.getById(id as string),
    enabled: Boolean(id),
    staleTime: CACHE_RESOURCE_STALE_TIME.appointmentDetail,
  });
}
