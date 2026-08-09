"use client";

import { useState } from "react";
import { UserCheck, UserMinus, UserPlus, Users } from "lucide-react";

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
import { useUserMetrics } from "../hooks/use-user-metrics";
import { AnalyticsPageHeader } from "./analytics-page-header";
import { MetricCard } from "./metric-card";

const ROLE_LABELS: Record<string, string> = {
  CLIENT: "Cliente",
  BARBER: "Barbeiro",
  ADMIN: "Administrador",
};

/** `/admin/analytics/users` (spec §13.12). */
export function UsersAnalyticsContent() {
  const [period, setPeriod] = useState<PeriodFilterValue>({ preset: "MONTH" });
  const { data, isLoading, isError, isFetching, refetch } = useUserMetrics(period);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Analytics", href: "/admin/dashboard" }, { label: "Usuários" }]} />
      <AnalyticsPageHeader
        title="Usuários"
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
              label="Total de usuários"
              value={data?.totalUsers ?? "—"}
              icon={Users}
              isLoading={isLoading}
            />
            <MetricCard
              label="Ativos"
              value={data?.activeUsers ?? "—"}
              icon={UserCheck}
              isLoading={isLoading}
            />
            <MetricCard
              label="Inativos"
              value={data?.inactiveUsers ?? "—"}
              icon={UserMinus}
              isLoading={isLoading}
            />
            <MetricCard
              label="Novos no período"
              value={data?.newUsersInPeriod ?? "—"}
              icon={UserPlus}
              isLoading={isLoading}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <MetricCard
              label="Contas verificadas"
              value={data?.verifiedAccounts ?? "—"}
              isLoading={isLoading}
            />
            <MetricCard
              label="Verificação pendente"
              value={data?.pendingVerification ?? "—"}
              isLoading={isLoading}
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Por papel</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Papel</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data
                    ? data.totalByRole.map(({ role, total }) => (
                        <TableRow key={role}>
                          <TableCell>{ROLE_LABELS[role] ?? role}</TableCell>
                          <TableCell>{total}</TableCell>
                        </TableRow>
                      ))
                    : null}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
