"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "../hooks/use-user";

/** Resolve nome do cliente nas listagens administrativas de agendamento (spec §11). */
export function CustomerName({ userId }: { userId: string }) {
  const { data, isLoading } = useUser(userId);

  if (isLoading) return <Skeleton className="h-4 w-24" aria-hidden="true" />;
  return <span>{data?.name ?? "—"}</span>;
}
