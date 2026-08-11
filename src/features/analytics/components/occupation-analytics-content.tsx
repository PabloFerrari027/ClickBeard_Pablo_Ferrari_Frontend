"use client";

import { useState } from "react";
import { Percent } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ErrorState } from "@/components/shared/error-state";
import type { PeriodFilterValue } from "@/components/shared/period-filter";
import { formatPercent, formatTime } from "@/lib/utils";
import { useOccupationMetrics } from "../hooks/use-occupation-metrics";
import { AnalyticsPageHeader } from "./analytics-page-header";
import { MetricCard } from "./metric-card";
import { OccupancyTable } from "./occupancy-table";

/** `/admin/analytics/occupation` (spec §13.12) — "Free slots" always refers to today. */
export function OccupationAnalyticsContent() {
  const [period, setPeriod] = useState<PeriodFilterValue>({ preset: "MONTH" });
  const { data, isLoading, isError, isFetching, refetch } = useOccupationMetrics(period);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Analytics", href: "/admin/dashboard" }, { label: "Ocupação" }]} />
      <AnalyticsPageHeader
        title="Ocupação"
        period={period}
        onPeriodChange={setPeriod}
        onRefresh={() => refetch()}
        isFetching={isFetching}
      />
      {isError ? (
        <ErrorState actionLabel="Tentar novamente" onAction={() => refetch()} />
      ) : (
        <>
          <MetricCard
            label="Ocupação média"
            value={data ? formatPercent(data.averageOccupancyRate) : "—"}
            icon={Percent}
            isLoading={isLoading}
          />
          {data ? <OccupancyTable data={data.occupancyByBarber} /> : null}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Horários livres hoje</CardTitle>
              <p className="text-xs text-muted-foreground">
                Horários livres sempre referentes ao dia de hoje, independente do período
                selecionado acima.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {data?.freeTimeSlots?.length ? (
                data.freeTimeSlots.map((entry) => (
                  <div key={entry.barberId}>
                    <p className="mb-2 text-sm font-medium">{entry.barberName}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {entry.slots.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          Sem horários livres hoje.
                        </p>
                      ) : (
                        entry.slots.map((slot) => (
                          <Badge key={slot} variant="outline">
                            {formatTime(slot)}
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Sem horários livres hoje.</p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
