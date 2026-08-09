"use client";

import { useQuery } from "@tanstack/react-query";

import { CACHE_RESOURCE_STALE_TIME } from "@/lib/cache-resources";
import { barbersService } from "../services/barbers.service";

export function useBarbers(page: number) {
  return useQuery({
    queryKey: ["barbers", "list", page],
    queryFn: () => barbersService.list(page),
    staleTime: CACHE_RESOURCE_STALE_TIME.barbersList,
  });
}
