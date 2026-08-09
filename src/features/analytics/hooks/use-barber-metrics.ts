"use client";

import { useQuery } from "@tanstack/react-query";

import type { PeriodFilterValue } from "@/components/shared/period-filter";
import { CACHE_RESOURCE_STALE_TIME } from "@/lib/cache-resources";
import { buildPeriodQuery } from "../lib/period-query";
import { analyticsService } from "../services/analytics.service";

export function useBarberMetrics(period: PeriodFilterValue) {
  return useQuery({
    queryKey: ["analytics", "barbers", period],
    queryFn: () => analyticsService.getBarbers(buildPeriodQuery(period)),
    staleTime: CACHE_RESOURCE_STALE_TIME.analytics,
  });
}
