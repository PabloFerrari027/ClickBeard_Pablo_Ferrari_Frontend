"use client";

import { useState } from "react";
import { Scissors } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { DataTablePagination } from "@/components/shared/data-table-pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { useBarbers } from "../hooks/use-barbers";
import { BarberCard } from "./barber-card";

/** `/barbers` (customer, spec §13.6) — responsive grid, read-only. */
export function BarbersGridContent() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useBarbers(page);

  return (
    <div>
      <PageHeader title="Nossos barbeiros" />
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-48 w-full rounded-lg" aria-hidden="true" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState actionLabel="Tentar novamente" onAction={() => refetch()} />
      ) : !data || data.barbers.length === 0 ? (
        <EmptyState icon={Scissors} title="Nenhum barbeiro disponível no momento" />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.barbers.map((barber) => (
              <BarberCard key={barber.id} barber={barber} href={`/barbers/${barber.id}`} />
            ))}
          </div>
          <DataTablePagination
            page={data.page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
