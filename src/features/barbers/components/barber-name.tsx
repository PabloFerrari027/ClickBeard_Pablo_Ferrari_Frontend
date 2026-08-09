"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useBarber } from "../hooks/use-barber";

/**
 * Resolve o nome do barbeiro a partir do cache do TanStack Query (spec §11):
 * `AppointmentResponseDto` só traz `barberId`, não o nome.
 */
export function BarberName({ barberId }: { barberId: string }) {
  const { data, isLoading } = useBarber(barberId);

  if (isLoading) return <Skeleton className="h-4 w-24" aria-hidden="true" />;
  return <span>{data?.name ?? "—"}</span>;
}
