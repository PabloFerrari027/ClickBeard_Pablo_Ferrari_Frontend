"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Plus, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { ApiError, resolveErrorMessage } from "@/lib/api-error";
import { formatDate } from "@/lib/utils";
import { useDeleteQualification } from "../hooks/use-delete-qualification";
import { useQualifications } from "../hooks/use-qualifications";
import { QualificationDialog } from "./qualification-dialog";
import type { Qualification } from "@/types/api";

/** `/admin/qualifications` (spec §13.17) — full CRUD, unpaginated listing (spec §2). */
export function AdminQualificationsTableContent() {
  const { data: qualifications = [], isLoading, isError, refetch } = useQualifications();
  const deleteMutation = useDeleteQualification();
  const [pendingDelete, setPendingDelete] = useState<Qualification | null>(null);
  const [search, setSearch] = useState("");

  const filteredQualifications = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return qualifications;
    return qualifications.filter(
      (qualification) =>
        qualification.name.toLowerCase().includes(term) ||
        qualification.description?.toLowerCase().includes(term)
    );
  }, [qualifications, search]);

  function handleConfirmDelete() {
    if (!pendingDelete) return;
    deleteMutation.mutate(pendingDelete.id, {
      onSuccess: () => {
        toast.success("Qualificação excluída.");
        setPendingDelete(null);
      },
      onError: (error) => {
        if (error instanceof ApiError && error.code === "QualificationInUseError") {
          toast.error(
            "Esta qualificação está em uso por ao menos um barbeiro e não pode ser excluída."
          );
        } else {
          toast.error(
            error instanceof ApiError
              ? resolveErrorMessage(error)
              : "Algo deu errado. Tente novamente."
          );
        }
        setPendingDelete(null);
      },
    });
  }

  const columns: ColumnDef<Qualification>[] = [
    { accessorKey: "name", header: "Nome" },
    {
      accessorKey: "description",
      header: "Descrição",
      cell: ({ row }) => row.original.description || "—",
    },
    {
      accessorKey: "createdAt",
      header: "Criado em",
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Ações">
                <MoreHorizontal className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <QualificationDialog
                qualification={row.original}
                trigger={
                  <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                    Editar
                  </DropdownMenuItem>
                }
              />
              <DropdownMenuItem
                variant="destructive"
                onSelect={(event) => {
                  event.preventDefault();
                  setPendingDelete(row.original);
                }}
              >
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Qualificações"
        action={
          <QualificationDialog
            trigger={
              <Button>
                <Plus aria-hidden="true" />
                Nova qualificação
              </Button>
            }
          />
        }
      />
      <div className="relative mb-4 max-w-sm">
        <Search
          className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          className="pl-9"
          placeholder="Buscar qualificação..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Buscar qualificação"
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredQualifications}
        page={1}
        totalPages={1}
        onPageChange={() => {}}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyIcon={Sparkles}
        emptyTitle={
          search.trim() ? "Nenhuma qualificação encontrada" : "Nenhuma qualificação cadastrada"
        }
        emptyAction={
          search.trim() ? undefined : (
            <QualificationDialog
              trigger={
                <Button>
                  <Plus aria-hidden="true" />
                  Criar qualificação
                </Button>
              }
            />
          )
        }
        renderMobileCard={(qualification) => (
          <Card>
            <CardContent className="space-y-3 pt-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="min-w-0 truncate text-sm font-medium">{qualification.name}</p>
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
                    <QualificationDialog
                      qualification={qualification}
                      trigger={
                        <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                          Editar
                        </DropdownMenuItem>
                      }
                    />
                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={(event) => {
                        event.preventDefault();
                        setPendingDelete(qualification);
                      }}
                    >
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-sm text-muted-foreground">
                {qualification.description || "—"}
              </p>
              <div>
                <p className="text-xs tracking-wide text-muted-foreground uppercase">
                  Criado em
                </p>
                <p className="text-sm">{formatDate(qualification.createdAt)}</p>
              </div>
            </CardContent>
          </Card>
        )}
      />
      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Excluir qualificação?"
        description={`Isto excluirá "${pendingDelete?.name}" permanentemente.`}
        confirmLabel="Excluir"
        variant="destructive"
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
