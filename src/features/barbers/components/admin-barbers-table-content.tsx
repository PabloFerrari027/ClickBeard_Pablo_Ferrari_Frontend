"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Plus, Scissors } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { formatDate } from "@/lib/utils";
import { useBarbers } from "../hooks/use-barbers";
import type { Barber } from "@/types/api";

const MAX_VISIBLE_QUALIFICATIONS = 3;

/**
 * `/admin/barbers` (spec §13.13). The "Status" column (active/inactive) was omitted —
 * `BarberResponseDto` doesn't return the underlying user's `active` field, and calling
 * `GET /users/:id` per row doesn't scale (spec §11, INFORMATION MISSING FROM API item 4).
 */
export function AdminBarbersTableContent() {
  const [page, setPage] = useState(1);
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useBarbers(page);

  const columns: ColumnDef<Barber>[] = [
    { accessorKey: "name", header: "Nome" },
    {
      accessorKey: "age",
      header: "Idade",
      cell: ({ row }) => `${row.original.age} anos`,
    },
    {
      accessorKey: "hiredAt",
      header: "Contratado em",
      cell: ({ row }) => formatDate(row.original.hiredAt),
    },
    {
      id: "qualifications",
      header: "Qualificações",
      cell: ({ row }) => {
        const qualifications = row.original.qualifications;
        const visible = qualifications.slice(0, MAX_VISIBLE_QUALIFICATIONS);
        const extra = qualifications.length - visible.length;
        return (
          <div className="flex flex-wrap gap-1">
            {visible.map((qualification) => (
              <Badge key={qualification.id} variant="secondary">
                {qualification.name}
              </Badge>
            ))}
            {extra > 0 ? <Badge variant="outline">+{extra}</Badge> : null}
          </div>
        );
      },
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
                <Link href={`/admin/barbers/${row.original.id}`}>Ver detalhes</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/barbers/${row.original.id}/edit`}>Editar</Link>
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
        title="Barbeiros"
        action={
          <Button asChild>
            <Link href="/admin/barbers/new">
              <Plus aria-hidden="true" />
              Novo barbeiro
            </Link>
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={data?.barbers ?? []}
        page={data?.page ?? 1}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyIcon={Scissors}
        emptyTitle="Nenhum barbeiro cadastrado"
        emptyAction={
          <Button asChild>
            <Link href="/admin/barbers/new">
              <Plus aria-hidden="true" />
              Criar barbeiro
            </Link>
          </Button>
        }
        onRowClick={(barber) => router.push(`/admin/barbers/${barber.id}`)}
        renderMobileCard={(barber) => {
          const visible = barber.qualifications.slice(0, MAX_VISIBLE_QUALIFICATIONS);
          const extra = barber.qualifications.length - visible.length;
          return (
            <Card>
              <CardContent className="space-y-3 pt-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="min-w-0 truncate text-sm font-medium">{barber.name}</p>
                  <div className="flex shrink-0 items-center gap-1">
                    <p className="text-sm text-muted-foreground">{barber.age} anos</p>
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
                          <Link href={`/admin/barbers/${barber.id}`}>Ver detalhes</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/barbers/${barber.id}/edit`}>Editar</Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="text-sm">
                  <p className="text-xs tracking-wide text-muted-foreground uppercase">
                    Contratado em
                  </p>
                  <p>{formatDate(barber.hiredAt)}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {visible.map((qualification) => (
                    <Badge key={qualification.id} variant="secondary">
                      {qualification.name}
                    </Badge>
                  ))}
                  {extra > 0 ? <Badge variant="outline">+{extra}</Badge> : null}
                </div>
              </CardContent>
            </Card>
          );
        }}
      />
    </div>
  );
}
