"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "../hooks/use-user";

/** Resolves the customer's name in administrative appointment listings (spec §11). */
export function CustomerName({ userId }: { userId: string }) {
  const { data, isLoading } = useUser(userId);

  if (isLoading) return <Skeleton className="h-4 w-24" aria-hidden="true" />;
  return <span>{data?.name ?? "—"}</span>;
}
