"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useQualifications } from "../hooks/use-qualifications";

/** Resolve o nome via a lista completa já cacheada (`GET /qualifications` não pagina, spec §11). */
export function QualificationName({ qualificationId }: { qualificationId: string }) {
  const { data, isLoading } = useQualifications();

  if (isLoading) return <Skeleton className="h-4 w-24" aria-hidden="true" />;
  const found = data?.find((qualification) => qualification.id === qualificationId);
  return <span>{found?.name ?? "—"}</span>;
}
