"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Calendar, Percent, Scissors, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import type { PeriodFilterValue } from "@/components/shared/period-filter";
import { formatPercent } from "@/lib/utils";
import { useDashboardMetrics } from "../hooks/use-dashboard-metrics";
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

/** `/admin/dashboard` (spec §13.11) — visão consolidada, cada bloco linka para a página de analytics específica. */
export function DashboardContent() {
  const [period, setPeriod] = useState<PeriodFilterValue>({ preset: "MONTH" });
  const { data, isLoading, isError, isFetching, refetch } = useDashboardMetrics(period);

  return (
    <div className="space-y-6">
      <AnalyticsPageHeader
        title="Dashboard"
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
            <MetricCard label="Usuários" value={data?.users.totalUsers ?? "—"} icon={Users} isLoading={isLoading} />
            <MetricCard
              label="Agendamentos"
              value={data?.appointments.totalAppointments ?? "—"}
              icon={Calendar}
              isLoading={isLoading}
            />
            <MetricCard
              label="Barbeiros"
              value={data?.barbers.totalBarbers ?? "—"}
              icon={Scissors}
              isLoading={isLoading}
            />
            <MetricCard
              label="Ocupação média"
              value={data ? formatPercent(data.occupation.averageOccupancyRate) : "—"}
              icon={Percent}
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
                  <TimeSlotsChart data={data.appointments.mostUsedTimeSlots} />
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
                  <BusiestDaysChart data={data.appointments.busiestDaysOfWeek} />
                ) : null}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DashboardLinkCard title="Usuários" href="/admin/analytics/users" />
            <DashboardLinkCard title="Agendamentos" href="/admin/analytics/appointments" />
            <DashboardLinkCard title="Barbeiros" href="/admin/analytics/barbers" />
            <DashboardLinkCard
              title="Clientes"
              href="/admin/analytics/customers"
              note="Este bloco não mostra o último agendamento por cliente — veja em Analytics → Clientes."
            />
            <DashboardLinkCard title="Ocupação" href="/admin/analytics/occupation" />
          </div>
        </>
      )}
    </div>
  );
}

function DashboardLinkCard({
  title,
  href,
  note,
}: {
  title: string;
  href: string;
  note?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {note ? <p className="text-xs text-muted-foreground">{note}</p> : null}
        <Link href={href} className="text-sm text-primary underline-offset-4 hover:underline">
          Ver detalhes
        </Link>
      </CardContent>
    </Card>
  );
}
