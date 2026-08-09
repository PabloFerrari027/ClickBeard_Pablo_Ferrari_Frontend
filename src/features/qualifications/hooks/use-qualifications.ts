"use client";

import { useQuery } from "@tanstack/react-query";

import { CACHE_RESOURCE_STALE_TIME } from "@/lib/cache-resources";
import { qualificationsService } from "../services/qualifications.service";

export function useQualifications() {
  return useQuery({
    queryKey: ["qualifications", "list"],
    queryFn: () => qualificationsService.list(),
    staleTime: CACHE_RESOURCE_STALE_TIME.qualifications,
  });
}
