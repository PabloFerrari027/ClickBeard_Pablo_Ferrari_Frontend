"use client";

import { useQuery } from "@tanstack/react-query";

import type { PeriodFilterValue } from "@/components/shared/period-filter";
import { CACHE_RESOURCE_STALE_TIME } from "@/lib/cache-resources";
import { buildPeriodQuery } from "../lib/period-query";
import { analyticsService } from "../services/analytics.service";

export function useCustomerMetrics(period: PeriodFilterValue, customerId?: string) {
  return useQuery({
    queryKey: ["analytics", "customers", period, customerId],
    queryFn: () =>
      analyticsService.getCustomers({ ...buildPeriodQuery(period), customerId }),
    staleTime: CACHE_RESOURCE_STALE_TIME.analytics,
  });
}
