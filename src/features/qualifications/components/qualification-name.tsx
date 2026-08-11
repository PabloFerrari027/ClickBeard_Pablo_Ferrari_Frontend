"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useQualifications } from "../hooks/use-qualifications";

/** Resolves the name via the already-cached full list (`GET /qualifications` doesn't paginate, spec §11). */
export function QualificationName({ qualificationId }: { qualificationId: string }) {
  const { data, isLoading } = useQualifications();

  if (isLoading) return <Skeleton className="h-4 w-24" aria-hidden="true" />;
  const found = data?.find((qualification) => qualification.id === qualificationId);
  return <span>{found?.name ?? "—"}</span>;
}
