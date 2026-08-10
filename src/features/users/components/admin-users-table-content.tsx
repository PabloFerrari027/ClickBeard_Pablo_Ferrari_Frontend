"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { Search, Users as UsersIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { RoleBadge } from "@/components/shared/role-badge";
import { ActiveStatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/utils";
import { useUsers } from "../hooks/use-users";
import type { User } from "@/types/api";

/** `/admin/users` — tabela paginada de usuários (`GET /users`), única forma de listagem. */
export function AdminUsersTableContent() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useUsers(page);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    const users = data?.users ?? [];
    if (!term) return users;
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
    );
  }, [data?.users, search]);

  const columns: ColumnDef<User>[] = [
    { accessorKey: "name", header: "Nome" },
    { accessorKey: "email", header: "Email" },
    {
      id: "role",
      header: "Papel",
      cell: ({ row }) => <RoleBadge role={row.original.role} />,
    },
    {
      id: "active",
      header: "Status",
      cell: ({ row }) => <ActiveStatusBadge active={row.original.active} />,
    },
    {
      accessorKey: "createdAt",
      header: "Membro desde",
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
  ];

  return (
    <div>
      <PageHeader title="Usuários" description="Todos os usuários cadastrados na plataforma." />
      <div className="relative mb-4 max-w-sm">
        <Search
          className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          className="pl-9"
          placeholder="Buscar por nome ou email..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Buscar usuário"
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredUsers}
        page={data?.page ?? 1}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyIcon={UsersIcon}
        emptyTitle={search.trim() ? "Nenhum usuário encontrado" : "Nenhum usuário cadastrado"}
        onRowClick={(user) => router.push(`/admin/users/${user.id}`)}
        renderMobileCard={(user) => (
          <Card>
            <CardContent className="space-y-3 pt-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="min-w-0 truncate text-sm font-medium">{user.name}</p>
                <div className="flex shrink-0 gap-1">
                  <RoleBadge role={user.role} />
                  <ActiveStatusBadge active={user.active} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-xs tracking-wide text-muted-foreground uppercase">Email</p>
                  <p className="truncate">{user.email}</p>
                </div>
                <div>
                  <p className="text-xs tracking-wide text-muted-foreground uppercase">
                    Membro desde
                  </p>
                  <p>{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      />
    </div>
  );
}
