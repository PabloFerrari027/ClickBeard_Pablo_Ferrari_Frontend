"use client";

import { useEffect, useState } from "react";
import { Search, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { formatDateTime } from "@/lib/utils";
import { useCustomerMetrics } from "../hooks/use-customer-metrics";
import { AnalyticsPageHeader } from "./analytics-page-header";
import { MetricCard } from "./metric-card";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SEARCH_DEBOUNCE_MS = 400;

/**
 * `/admin/analytics/customers` (spec §13.12) — busca opcional por `customerId`, validado
 * como UUID no client antes de enviar; 3 casos documentados para `lastAppointment`.
 */
export function CustomersAnalyticsContent() {
  const [period, setPeriod] = useState<PeriodFilterValue>({ preset: "MONTH" });
  const [searchInput, setSearchInput] = useState("");
  const [customerId, setCustomerId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const handle = setTimeout(() => {
      const trimmed = searchInput.trim();
      setCustomerId(UUID_REGEX.test(trimmed) ? trimmed : undefined);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [searchInput]);

  const { data, isLoading, isError, isFetching, refetch } = useCustomerMetrics(
    period,
    customerId
  );

  const searchInvalid = searchInput.trim().length > 0 && !UUID_REGEX.test(searchInput.trim());

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
              <CardTitle className="text-base">Buscar cliente por ID</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative max-w-sm">
                <Search
                  className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  className="pl-9"
                  placeholder="UUID do cliente"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  aria-invalid={searchInvalid}
                />
              </div>
              {searchInvalid ? (
                <p className="text-sm text-destructive">Informe um UUID válido.</p>
              ) : null}
              {customerId && !isLoading ? (
                data?.lastAppointment === null ? (
                  <p className="text-sm text-muted-foreground">Cliente não encontrado.</p>
                ) : data?.lastAppointment?.lastAppointmentAt === null ? (
                  <p className="text-sm text-muted-foreground">
                    Nenhum agendamento registrado.
                  </p>
                ) : data?.lastAppointment?.lastAppointmentAt ? (
                  <MetricCard
                    label="Último agendamento"
                    value={formatDateTime(data.lastAppointment.lastAppointmentAt)}
                  />
                ) : null
              ) : null}
            </CardContent>
          </Card>

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
                      <TableCell>{item.appointmentsCount}</TableCell>
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
