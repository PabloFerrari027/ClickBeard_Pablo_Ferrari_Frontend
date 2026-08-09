"use client";

import { useQuery } from "@tanstack/react-query";

import { CACHE_RESOURCE_STALE_TIME } from "@/lib/cache-resources";
import { appointmentsService, type TimeSlotsQuery } from "../services/appointments.service";

/** TTL de 30s no backend — refetch é barato a cada troca de data/barbeiro/qualificação (spec §13.8). */
export function useTimeSlots(query: Partial<TimeSlotsQuery>) {
  const { barberId, qualificationId, date } = query;
  const enabled = Boolean(barberId && qualificationId && date);

  return useQuery({
    queryKey: ["timeSlots", barberId, qualificationId, date],
    queryFn: () => appointmentsService.getTimeSlots(query as TimeSlotsQuery),
    enabled,
    staleTime: CACHE_RESOURCE_STALE_TIME.timeSlots,
  });
}
