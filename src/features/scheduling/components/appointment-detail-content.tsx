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
import { ApiError } from "@/lib/api-error";
import { formatDate, formatDateTime } from "@/lib/utils";
import { useAppointment } from "../hooks/use-appointment";
import { CancelAppointmentDialog } from "./cancel-appointment-dialog";
import { CancelWindowNotice, isWithinCancelWindow } from "./cancel-window-notice";

/** `/appointments/[id]` (customer, spec §13.10) — own appointment detail + cancellation. */
export function AppointmentDetailContent({ appointmentId }: { appointmentId: string }) {
  const { data: appointment, isLoading, isError, error, refetch } = useAppointment(appointmentId);
  const [cancelOpen, setCancelOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-2xl">
        <PageHeader title="Agendamento" />
        <Skeleton className="h-64 w-full rounded-lg" aria-hidden="true" />
      </div>
    );
  }

  if (isError || !appointment) {
    const notFound = error instanceof ApiError && error.statusCode === 404;
    const forbidden = error instanceof ApiError && error.statusCode === 403;
    return (
      <div className="max-w-2xl">
        <PageHeader title="Agendamento" />
        <ErrorState
          title={
            notFound
              ? "Agendamento não encontrado"
              : forbidden
                ? "Você não tem permissão para acessar isto."
                : "Não foi possível carregar o agendamento"
          }
          actionLabel="Tentar novamente"
          onAction={() => refetch()}
        />
      </div>
    );
  }

  const canCancel =
    appointment.status === "SCHEDULED" && isWithinCancelWindow(appointment.startAt);

  return (
    <div className="max-w-2xl space-y-4">
      <Breadcrumbs
        items={[
          { label: "Meus agendamentos", href: "/appointments" },
          { label: formatDate(appointment.startAt) },
        ]}
      />
      <PageHeader title="Detalhe do agendamento" />
      {appointment.status === "SCHEDULED" ? (
        <CancelWindowNotice startAt={appointment.startAt} />
      ) : null}
      <Card>
        <CardHeader className="flex-row flex-wrap items-center justify-between gap-2">
          <CardTitle className="min-w-0">{formatDateTime(appointment.startAt)}</CardTitle>
          <AppointmentStatusBadge status={appointment.status} startAt={appointment.startAt} />
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
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
            <Field label="Motivo" value={appointment.cancellationReason} />
          ) : null}
        </CardContent>
        {canCancel ? (
          <CardFooter>
            <Button variant="destructive" onClick={() => setCancelOpen(true)}>
              Cancelar agendamento
            </Button>
          </CardFooter>
        ) : null}
      </Card>
      <CancelAppointmentDialog
        appointmentId={appointment.id}
        open={cancelOpen}
        onOpenChange={setCancelOpen}
      />
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
