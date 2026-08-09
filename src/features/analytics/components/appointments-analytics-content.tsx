"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Calendar, CalendarClock, CalendarDays, CalendarRange, XCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ErrorState } from "@/components/shared/error-state";
import type { PeriodFilterValue } from "@/components/shared/period-filter";
import { formatPercent } from "@/lib/utils";
import { useAppointmentMetrics } from "../hooks/use-appointment-metrics";
import { AnalyticsPageHeader } from "./analytics-page-header";
import { MetricCard } from "./metric-card";

const TimeSlotsChart = dynamic(
  () => import("./time-slots-chart").then((mod) => mod.TimeSlotsChart),
  { ssr: false }
);
const BusiestDaysChart = dynamic(
  () => import("./busiest-days-chart").then((mod) => mod.BusiestDaysChart),
  { ssr: false }
);

/** `/admin/analytics/appointments` (spec §13.12). */
export function AppointmentsAnalyticsContent() {
  const [period, setPeriod] = useState<PeriodFilterValue>({ preset: "MONTH" });
  const { data, isLoading, isError, isFetching, refetch } = useAppointmentMetrics(period);

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[{ label: "Analytics", href: "/admin/dashboard" }, { label: "Agendamentos" }]}
      />
      <AnalyticsPageHeader
        title="Agendamentos"
        period={period}
        onPeriodChange={setPeriod}
        onRefresh={() => refetch()}
        isFetching={isFetching}
      />
      {isError ? (
        <ErrorState actionLabel="Tentar novamente" onAction={() => refetch()} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Total"
              value={data?.totalAppointments ?? "—"}
              icon={Calendar}
              isLoading={isLoading}
            />
            <MetricCard
              label="Hoje"
              value={data?.appointmentsToday ?? "—"}
              icon={CalendarClock}
              isLoading={isLoading}
            />
            <MetricCard
              label="Na semana"
              value={data?.appointmentsThisWeek ?? "—"}
              icon={CalendarDays}
              isLoading={isLoading}
            />
            <MetricCard
              label="No mês"
              value={data?.appointmentsThisMonth ?? "—"}
              icon={CalendarRange}
              isLoading={isLoading}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <MetricCard
              label="No período selecionado"
              value={data?.appointmentsInPeriod ?? "—"}
              isLoading={isLoading}
            />
            <MetricCard
              label="Futuros"
              value={data?.futureAppointments ?? "—"}
              isLoading={isLoading}
            />
            <MetricCard
              label="Cancelados"
              value={
                data
                  ? `${data.cancelledAppointments} (${formatPercent(data.cancellationRate)})`
                  : "—"
              }
              icon={XCircle}
              isLoading={isLoading}
            />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Horários mais usados</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-60 w-full" aria-hidden="true" />
                ) : data ? (
                  <TimeSlotsChart data={data.mostUsedTimeSlots} />
                ) : null}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Dias mais movimentados</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-60 w-full" aria-hidden="true" />
                ) : data ? (
                  <BusiestDaysChart data={data.busiestDaysOfWeek} />
                ) : null}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
