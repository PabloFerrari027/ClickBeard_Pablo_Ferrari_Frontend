"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { useBarber } from "../hooks/use-barber";
import { EditBarberForm } from "./barber-form";

/** `/admin/barbers/[id]/edit` (spec §13.16) — pré-popula a partir de `GET /barbers/:id`. */
export function EditBarberContent({ barberId }: { barberId: string }) {
  const { data: barber, isLoading, isError, refetch } = useBarber(barberId);

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Editar barbeiro" />
        <Skeleton className="h-48 w-full max-w-md rounded-lg" aria-hidden="true" />
      </div>
    );
  }

  if (isError || !barber) {
    return (
      <div>
        <PageHeader title="Editar barbeiro" />
        <ErrorState
          title="Barbeiro não encontrado"
          actionLabel="Tentar novamente"
          onAction={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Barbeiros", href: "/admin/barbers" },
          { label: barber.name, href: `/admin/barbers/${barber.id}` },
          { label: "Editar" },
        ]}
      />
      <PageHeader title={`Editar ${barber.name}`} />
      <EditBarberForm
        barberId={barber.id}
        defaultValues={{ age: String(barber.age), hiredAt: barber.hiredAt.slice(0, 10) }}
      />
    </div>
  );
}
