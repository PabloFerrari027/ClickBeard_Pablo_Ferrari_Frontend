"use client";

import { useQuery } from "@tanstack/react-query";

import { CACHE_RESOURCE_STALE_TIME } from "@/lib/cache-resources";
import { barbersService } from "../services/barbers.service";

/** [PLANEJADO] spec §3.3 — sem paginação. */
export function useListUnavailabilities(barberId: string | undefined) {
  return useQuery({
    queryKey: ["barbers", "unavailabilities", barberId],
    queryFn: () => barbersService.listUnavailabilities(barberId as string),
    enabled: Boolean(barberId),
    staleTime: CACHE_RESOURCE_STALE_TIME.unavailabilities,
  });
}
