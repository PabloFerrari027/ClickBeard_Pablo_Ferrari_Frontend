"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { Calendar, MoreHorizontal, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { AppointmentStatusBadge } from "@/components/shared/status-badge";
import { BarberName } from "@/features/barbers/components/barber-name";
import { QualificationName } from "@/features/qualifications/components/qualification-name";
import { formatDateTime } from "@/lib/utils";
import { useMyAppointments } from "../hooks/use-my-appointments";
import { AppointmentCard } from "./appointment-card";
import { CancelAppointmentDialog } from "./cancel-appointment-dialog";
import { isWithinCancelWindow } from "./cancel-window-notice";
import type { Appointment } from "@/types/api";

/** `/appointments` (cliente, spec §13.9) — todos os próprios agendamentos, qualquer status. */
export function MyAppointmentsContent() {
  const [page, setPage] = useState(1);
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useMyAppointments(page);
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);

  const columns: ColumnDef<Appointment>[] = [
    {
      accessorKey: "startAt",
      header: "Data/hora",
      cell: ({ row }) => formatDateTime(row.original.startAt),
    },
    {
      id: "barber",
      header: "Barbeiro",
      cell: ({ row }) => <BarberName barberId={row.original.barberId} />,
    },
    {
      id: "qualification",
      header: "Qualificação",
      cell: ({ row }) => <QualificationName qualificationId={row.original.qualificationId} />,
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => <AppointmentStatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const appointment = row.original;
        const canCancel =
          appointment.status === "SCHEDULED" && isWithinCancelWindow(appointment.startAt);
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Ações"
                  onClick={(event) => event.stopPropagation()}
                >
                  <MoreHorizontal className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/appointments/${appointment.id}`}>Ver detalhes</Link>
                </DropdownMenuItem>
                {canCancel ? (
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={(event) => {
                      event.preventDefault();
                      setCancelTarget(appointment);
                    }}
                  >
                    Cancelar
                  </DropdownMenuItem>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Meus agendamentos"
        action={
          <Button asChild>
            <Link href="/book">
              <Plus aria-hidden="true" />
              Novo agendamento
            </Link>
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={data?.appointments ?? []}
        page={data?.page ?? 1}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyIcon={Calendar}
        emptyTitle="Você ainda não tem agendamentos"
        emptyAction={
          <Button asChild>
            <Link href="/book">
              <Plus aria-hidden="true" />
              Agendar agora
            </Link>
          </Button>
        }
        onRowClick={(appointment) => router.push(`/appointments/${appointment.id}`)}
        renderMobileCard={(appointment) => <AppointmentCard appointment={appointment} />}
      />
      {cancelTarget ? (
        <CancelAppointmentDialog
          appointmentId={cancelTarget.id}
          open={Boolean(cancelTarget)}
          onOpenChange={(open) => !open && setCancelTarget(null)}
        />
      ) : null}
    </div>
  );
}
