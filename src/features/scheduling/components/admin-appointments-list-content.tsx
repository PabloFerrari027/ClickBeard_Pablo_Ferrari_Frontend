"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { UseQueryResult } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Calendar, MoreHorizontal } from "lucide-react";

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
import { CustomerName } from "@/features/users/components/customer-name";
import { PLANNED_FEATURES_ENABLED } from "@/lib/feature-flags";
import { formatDateTime } from "@/lib/utils";
import { CancelByAdminDialog } from "./cancel-by-admin-dialog";
import type { Appointment, AppointmentsListResponse } from "@/types/api";

interface AdminAppointmentsListContentProps {
  title: string;
  description?: string;
  emptyTitle: string;
  useAppointmentsQuery: (page: number) => UseQueryResult<AppointmentsListResponse>;
}

/** Base compartilhada de `/admin/appointments/today` e `/admin/appointments/future` (spec §13.18). */
export function AdminAppointmentsListContent({
  title,
  description,
  emptyTitle,
  useAppointmentsQuery,
}: AdminAppointmentsListContentProps) {
  const [page, setPage] = useState(1);
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useAppointmentsQuery(page);
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);

  const columns: ColumnDef<Appointment>[] = [
    {
      accessorKey: "startAt",
      header: "Data/hora",
      cell: ({ row }) => formatDateTime(row.original.startAt),
    },
    {
      id: "customer",
      header: "Cliente",
      cell: ({ row }) => <CustomerName userId={row.original.customerId} />,
    },
    {
      id: "barber",
      header: "Barbeiro",
      cell: ({ row }) => <BarberName barberId={row.original.barberId} />,
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => <AppointmentStatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
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
                <Link href={`/admin/appointments/${row.original.id}`}>Ver detalhes</Link>
              </DropdownMenuItem>
              {PLANNED_FEATURES_ENABLED && row.original.status === "SCHEDULED" ? (
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={(event) => {
                    event.preventDefault();
                    setCancelTarget(row.original);
                  }}
                >
                  Cancelar (admin)
                </DropdownMenuItem>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title={title} description={description} />
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
        emptyTitle={emptyTitle}
        onRowClick={(appointment) => router.push(`/admin/appointments/${appointment.id}`)}
      />
      {PLANNED_FEATURES_ENABLED && cancelTarget ? (
        <CancelByAdminDialog
          appointmentId={cancelTarget.id}
          open={Boolean(cancelTarget)}
          onOpenChange={(open) => !open && setCancelTarget(null)}
        />
      ) : null}
    </div>
  );
}
