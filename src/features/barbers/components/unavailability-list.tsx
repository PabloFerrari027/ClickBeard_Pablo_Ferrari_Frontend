"use client";

import { useState } from "react";
import { Calendar, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { ApiError, resolveErrorMessage } from "@/lib/api-error";
import { formatDateTime } from "@/lib/utils";
import { useDeleteUnavailability } from "../hooks/use-delete-unavailability";
import { useListUnavailabilities } from "../hooks/use-list-unavailabilities";

/** [PLANEJADO] `GET`/`DELETE /barbers/:id/unavailabilities` — sem paginação (spec §2, §13.15). */
export function UnavailabilityList({ barberId }: { barberId: string }) {
  const { data, isLoading, isError, refetch } = useListUnavailabilities(barberId);
  const deleteUnavailability = useDeleteUnavailability(barberId);
  const [pendingId, setPendingId] = useState<string | null>(null);

  function handleDelete() {
    if (!pendingId) return;
    deleteUnavailability.mutate(pendingId, {
      onSuccess: () => {
        toast.success("Indisponibilidade removida.");
        setPendingId(null);
      },
      onError: (error) => {
        toast.error(
          error instanceof ApiError ? resolveErrorMessage(error) : "Algo deu errado. Tente novamente."
        );
        setPendingId(null);
      },
    });
  }

  if (isLoading) return <Skeleton className="h-40 w-full rounded-lg" aria-hidden="true" />;
  if (isError) {
    return <ErrorState actionLabel="Tentar novamente" onAction={() => refetch()} />;
  }

  const unavailabilities = data?.unavailabilities ?? [];

  if (unavailabilities.length === 0) {
    return (
      <EmptyState icon={Calendar} title="Nenhum período de indisponibilidade registrado" />
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Período</TableHead>
              <TableHead>Motivo</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {unavailabilities.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {formatDateTime(item.startAt)} – {formatDateTime(item.endAt)}
                </TableCell>
                <TableCell>{item.reason}</TableCell>
                <TableCell>{formatDateTime(item.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Remover"
                    onClick={() => setPendingId(item.id)}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <ConfirmDialog
        open={pendingId !== null}
        onOpenChange={(open) => !open && setPendingId(null)}
        title="Remover indisponibilidade?"
        description="Isto não reativa agendamentos já cancelados."
        confirmLabel="Remover"
        variant="destructive"
        onConfirm={handleDelete}
        isPending={deleteUnavailability.isPending}
      />
    </>
  );
}
