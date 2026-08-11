"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useBarber } from "../hooks/use-barber";

/**
 * Resolves the barber's name from the TanStack Query cache (spec §11):
 * `AppointmentResponseDto` only includes `barberId`, not the name.
 */
export function BarberName({ barberId }: { barberId: string }) {
  const { data, isLoading } = useBarber(barberId);

  if (isLoading) return <Skeleton className="h-4 w-24" aria-hidden="true" />;
  return <span>{data?.name ?? "—"}</span>;
}
