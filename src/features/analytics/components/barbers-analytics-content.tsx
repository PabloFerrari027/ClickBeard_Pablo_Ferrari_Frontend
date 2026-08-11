"use client";

import { useState } from "react";
import { Scissors } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ErrorState } from "@/components/shared/error-state";
import type { PeriodFilterValue } from "@/components/shared/period-filter";
import { useBarberMetrics } from "../hooks/use-barber-metrics";
import { AnalyticsPageHeader } from "./analytics-page-header";
import { MetricCard } from "./metric-card";

/** `/admin/analytics/barbers` (spec §13.12) — `appointmentsByBarber` includes barbers with 0. */
export function BarbersAnalyticsContent() {
  const [period, setPeriod] = useState<PeriodFilterValue>({ preset: "MONTH" });
  const { data, isLoading, isError, isFetching, refetch } = useBarberMetrics(period);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Analytics", href: "/admin/dashboard" }, { label: "Barbeiros" }]} />
      <AnalyticsPageHeader
        title="Barbeiros"
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
            label="Total de barbeiros"
            value={data?.totalBarbers ?? "—"}
            icon={Scissors}
            isLoading={isLoading}
          />
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Agendamentos por barbeiro</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Barbeiro</TableHead>
                    <TableHead>Agendamentos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.appointmentsByBarber.map((item) => (
                    <TableRow key={item.barberId}>
                      <TableCell>{item.barberName}</TableCell>
                      <TableCell>{item.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Qualificações mais usadas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Qualificação</TableHead>
                    <TableHead>Usos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.mostUsedQualifications.map((item) => (
                    <TableRow key={item.qualificationId}>
                      <TableCell>{item.qualificationName}</TableCell>
                      <TableCell>{item.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
