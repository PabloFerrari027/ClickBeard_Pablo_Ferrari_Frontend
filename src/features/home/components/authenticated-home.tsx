"use client";

import Link from "next/link";
import { ArrowRight, Calendar, Percent, Plus, Users } from "lucide-react";

import { AppHeader } from "@/components/shared/app-header";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { ADMIN_NAV_ITEMS, CLIENT_NAV_ITEMS } from "@/components/shared/nav-items";
import { ErrorState } from "@/components/shared/error-state";
import { RoleBadge } from "@/components/shared/role-badge";
import { AppointmentStatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarberName } from "@/features/barbers/components/barber-name";
import { MetricCard } from "@/features/analytics/components/metric-card";
import { useDashboardMetrics } from "@/features/analytics/hooks/use-dashboard-metrics";
import { QualificationName } from "@/features/qualifications/components/qualification-name";
import { useMyAppointments } from "@/features/scheduling/hooks/use-my-appointments";
import { formatDateTime, formatPercent } from "@/lib/utils";
import type { User } from "@/types/api";
import type { UserRole } from "@/types/domain";

function isUpcoming(startAt: string): boolean {
  return new Date(startAt).getTime() >= Date.now();
}

const GREETING_SUBTITLE: Record<UserRole, string> = {
  CLIENT: "Aqui está um resumo da sua conta.",
  BARBER: "Aqui está um resumo da sua conta.",
  ADMIN: "Aqui está um resumo do sistema.",
};

/** Home autenticada (dashboard inicial) — atalhos e resumo adaptados ao `user.role`. */
export function AuthenticatedHome({ user }: { user: User }) {
  const navItems = user.role === "ADMIN" ? ADMIN_NAV_ITEMS : CLIENT_NAV_ITEMS;
  const firstName = user.name.trim().split(/\s+/)[0] ?? user.name;

  return (
    <div className="min-h-screen">
      <AppHeader navItems={navItems} homeHref="/" />
      <div className="flex">
        <AppSidebar items={navItems} />
        <main className="min-h-[calc(100vh-4rem)] flex-1 p-4 md:p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl leading-tight font-semibold">Olá, {firstName}</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {GREETING_SUBTITLE[user.role]}
                </p>
              </div>
              <RoleBadge role={user.role} />
            </div>

            {user.role === "ADMIN" ? <AdminSummary /> : <NextAppointmentSummary />}

            <div>
              <h2 className="mb-3 text-lg font-semibold">Acesso rápido</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href}>
                      <Card className="h-full transition-colors hover:bg-accent">
                        <CardHeader className="flex-row items-center gap-3 space-y-0">
                          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent">
                            <Icon className="size-5 text-secondary" aria-hidden="true" />
                          </span>
                          <div className="flex flex-1 items-center justify-between gap-2">
                            <CardTitle className="text-base">{item.label}</CardTitle>
                            <ArrowRight
                              className="size-4 shrink-0 text-muted-foreground"
                              aria-hidden="true"
                            />
                          </div>
                        </CardHeader>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/** CLIENT/BARBER: próximo agendamento futuro. Considera apenas a página 1 de `/appointments/me` — melhor esforço, não uma busca exaustiva. */
function NextAppointmentSummary() {
  const { data, isLoading, isError, refetch } = useMyAppointments(1);

  if (isError) {
    return (
      <ErrorState
        title="Não foi possível carregar seus agendamentos"
        actionLabel="Tentar novamente"
        onAction={() => refetch()}
      />
    );
  }

  const next = data?.appointments
    .filter((a) => a.status === "SCHEDULED" && isUpcoming(a.startAt))
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Próximo agendamento</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-14 w-full" aria-hidden="true" />
        ) : next ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">{formatDateTime(next.startAt)}</p>
              <div className="text-sm text-muted-foreground">
                <BarberName barberId={next.barberId} />
                {" · "}
                <QualificationName qualificationId={next.qualificationId} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AppointmentStatusBadge status={next.status} />
              <Button variant="outline" size="sm" asChild>
                <Link href={`/appointments/${next.id}`}>Ver detalhes</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">Você não tem agendamentos futuros.</p>
            <Button size="sm" asChild>
              <Link href="/book">
                <Plus aria-hidden="true" />
                Agendar agora
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/** ADMIN: recorte curto das métricas de `/admin/dashboard`, não uma cópia do dashboard completo. */
function AdminSummary() {
  const { data, isLoading, isError, refetch } = useDashboardMetrics({ preset: "MONTH" });

  if (isError) {
    return (
      <ErrorState
        title="Não foi possível carregar o resumo"
        actionLabel="Tentar novamente"
        onAction={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Usuários" value={data?.users.totalUsers ?? "—"} icon={Users} isLoading={isLoading} />
        <MetricCard
          label="Agendamentos (mês)"
          value={data?.appointments.totalAppointments ?? "—"}
          icon={Calendar}
          isLoading={isLoading}
        />
        <MetricCard
          label="Ocupação média"
          value={data ? formatPercent(data.occupation.averageOccupancyRate) : "—"}
          icon={Percent}
          isLoading={isLoading}
        />
      </div>
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
      >
        Ver dashboard completo
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </Link>
    </div>
  );
}
