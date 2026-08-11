"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { AppointmentStatusBadge } from "@/components/shared/status-badge";
import { BarberName } from "@/features/barbers/components/barber-name";
import { QualificationName } from "@/features/qualifications/components/qualification-name";
import { CustomerName } from "@/features/users/components/customer-name";
import { PLANNED_FEATURES_ENABLED } from "@/lib/feature-flags";
import { formatDate, formatDateTime } from "@/lib/utils";
import { useAppointment } from "../hooks/use-appointment";
import { CancelByAdminDialog } from "./cancel-by-admin-dialog";

/** `/admin/appointments/[id]` (spec §13.19) — ADMIN has access to any appointment. */
export function AdminAppointmentDetailContent({ appointmentId }: { appointmentId: string }) {
  const { data: appointment, isLoading, isError, refetch } = useAppointment(appointmentId);
  const [cancelOpen, setCancelOpen] = useState(false);

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Agendamento" />
        <Skeleton className="h-64 w-full rounded-lg" aria-hidden="true" />
      </div>
    );
  }

  if (isError || !appointment) {
    return (
      <div>
        <PageHeader title="Agendamento" />
        <ErrorState
          title="Agendamento não encontrado"
          actionLabel="Tentar novamente"
          onAction={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-4">
      <Breadcrumbs
        items={[
          { label: "Agendamentos", href: "/admin/appointments/today" },
          { label: formatDate(appointment.startAt) },
        ]}
      />
      <PageHeader title="Detalhe do agendamento" />
      <Card>
        <CardHeader className="flex-row flex-wrap items-center justify-between gap-2">
          <CardTitle className="min-w-0">{formatDateTime(appointment.startAt)}</CardTitle>
          <AppointmentStatusBadge status={appointment.status} startAt={appointment.startAt} />
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Cliente">
            <CustomerName userId={appointment.customerId} />
          </Field>
          <Field label="Barbeiro">
            <BarberName barberId={appointment.barberId} />
          </Field>
          <Field label="Qualificação">
            <QualificationName qualificationId={appointment.qualificationId} />
          </Field>
          <Field label="Criado em" value={formatDateTime(appointment.createdAt)} />
          {appointment.cancelledAt ? (
            <Field label="Cancelado em" value={formatDateTime(appointment.cancelledAt)} />
          ) : null}
          {appointment.cancellationReason ? (
            <Field label="Motivo do cancelamento" value={appointment.cancellationReason} />
          ) : null}
        </CardContent>
        {PLANNED_FEATURES_ENABLED && appointment.status === "SCHEDULED" ? (
          <CardFooter>
            <Button variant="destructive" onClick={() => setCancelOpen(true)}>
              Cancelar (admin)
            </Button>
          </CardFooter>
        ) : null}
      </Card>
      {PLANNED_FEATURES_ENABLED ? (
        <CancelByAdminDialog
          appointmentId={appointment.id}
          open={cancelOpen}
          onOpenChange={setCancelOpen}
        />
      ) : null}
    </div>
  );
}

function Field({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">{label}</p>
      {children ?? <p className="text-sm">{value}</p>}
    </div>
  );
}
