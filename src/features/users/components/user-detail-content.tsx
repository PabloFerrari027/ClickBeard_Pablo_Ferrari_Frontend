"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { RoleBadge } from "@/components/shared/role-badge";
import { ActiveStatusBadge } from "@/components/shared/status-badge";
import { ApiError, resolveErrorMessage } from "@/lib/api-error";
import { formatDate } from "@/lib/utils";
import { useActivateUser } from "../hooks/use-activate-user";
import { useDeactivateUser } from "../hooks/use-deactivate-user";
import { useUser } from "../hooks/use-user";
import { ChangeRoleDialog } from "./change-role-dialog";

/** `/admin/users/[id]` (spec §13.20) — user management, reached from the `/admin/users` table. */
export function UserDetailContent({ userId }: { userId: string }) {
  const { data: user, isLoading, isError, error, refetch } = useUser(userId);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const deactivate = useDeactivateUser(userId);
  const activate = useActivateUser(userId);

  function handleToggleActive() {
    if (!user) return;
    if (user.active) {
      setConfirmOpen(true);
      return;
    }
    activate.mutate(undefined, {
      onSuccess: () => toast.success("Conta reativada."),
      onError: (err) =>
        toast.error(
          err instanceof ApiError ? resolveErrorMessage(err) : "Algo deu errado. Tente novamente."
        ),
    });
  }

  function handleConfirmDeactivate() {
    deactivate.mutate(undefined, {
      onSuccess: () => {
        toast.success("Conta desativada.");
        setConfirmOpen(false);
      },
      onError: (err) => {
        toast.error(
          err instanceof ApiError ? resolveErrorMessage(err) : "Algo deu errado. Tente novamente."
        );
        setConfirmOpen(false);
      },
    });
  }

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Usuário" />
        <Skeleton className="h-64 w-full rounded-lg" aria-hidden="true" />
      </div>
    );
  }

  if (isError || !user) {
    const notFound = error instanceof ApiError && error.statusCode === 404;
    return (
      <div>
        <PageHeader title="Usuário" />
        <ErrorState
          title={notFound ? "Usuário não encontrado" : "Não foi possível carregar o usuário"}
          actionLabel="Tentar novamente"
          onAction={() => refetch()}
        />
      </div>
    );
  }

  const adminCannotDeactivate = user.role === "ADMIN" && user.active;

  return (
    <div className="max-w-2xl space-y-6">
      <Breadcrumbs items={[{ label: "Usuários", href: "/admin/users" }, { label: user.name }]} />
      <PageHeader title="Usuário" description="Ações administrativas sobre esta conta." />

      <Card>
        <CardHeader className="flex-row flex-wrap items-center justify-between gap-2">
          <CardTitle className="min-w-0 truncate">{user.name}</CardTitle>
          <div className="flex shrink-0 items-center gap-2">
            <RoleBadge role={user.role} />
            <ActiveStatusBadge active={user.active} />
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="E-mail" value={user.email} />
          <Field label="Membro desde" value={formatDate(user.createdAt)} />
          <Field
            label="Data de nascimento"
            value={user.birthDate ? formatDate(user.birthDate) : "—"}
          />
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          <ChangeRoleDialog userId={user.id} currentRole={user.role} />
          {adminCannotDeactivate ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button variant="destructive" disabled>
                    Desativar
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>Administradores não podem ser desativados.</TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant={user.active ? "destructive" : "default"}
              onClick={handleToggleActive}
              disabled={activate.isPending || deactivate.isPending}
            >
              {user.active ? "Desativar" : "Ativar"}
            </Button>
          )}
        </CardFooter>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Desativar conta?"
        description="O usuário perderá acesso à aplicação até ser reativado."
        confirmLabel="Desativar"
        variant="destructive"
        onConfirm={handleConfirmDeactivate}
        isPending={deactivate.isPending}
      />
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <p className="text-sm">{value}</p>
    </div>
  );
}
