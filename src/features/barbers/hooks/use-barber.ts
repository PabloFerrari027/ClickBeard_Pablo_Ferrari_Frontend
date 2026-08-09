"use client";

import { useQuery } from "@tanstack/react-query";

import { CACHE_RESOURCE_STALE_TIME } from "@/lib/cache-resources";
import { barbersService } from "../services/barbers.service";

export function useBarber(id: string | undefined) {
  return useQuery({
    queryKey: ["barbers", "detail", id],
    queryFn: () => barbersService.getById(id as string),
    enabled: Boolean(id),
    staleTime: CACHE_RESOURCE_STALE_TIME.barberDetail,
  });
}
