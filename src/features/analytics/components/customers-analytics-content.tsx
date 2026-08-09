"use client";

import { useState } from "react";
import { Users } from "lucide-react";

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
import { useCustomerMetrics } from "../hooks/use-customer-metrics";
import { AnalyticsPageHeader } from "./analytics-page-header";
import { MetricCard } from "./metric-card";

export function CustomersAnalyticsContent() {
  const [period, setPeriod] = useState<PeriodFilterValue>({ preset: "MONTH" });

  const { data, isLoading, isError, isFetching, refetch } = useCustomerMetrics(period);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Analytics", href: "/admin/dashboard" }, { label: "Clientes" }]} />
      <AnalyticsPageHeader
        title="Clientes"
        period={period}
        onPeriodChange={setPeriod}
        onRefresh={() => refetch()}
        isFetching={isFetching}
      />
      {isError ? (
        <ErrorState actionLabel="Tentar novamente" onAction={() => refetch()} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <MetricCard
              label="Clientes ativos"
              value={data?.activeCustomers ?? "—"}
              icon={Users}
              isLoading={isLoading}
            />
            <MetricCard
              label="Clientes inativos"
              value={data?.inactiveCustomers ?? "—"}
              isLoading={isLoading}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Clientes com mais agendamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Agendamentos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.topCustomersByAppointments.map((item) => (
                    <TableRow key={item.customerId}>
                      <TableCell>{item.customerName}</TableCell>
                      <TableCell>{item.total}</TableCell>
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
