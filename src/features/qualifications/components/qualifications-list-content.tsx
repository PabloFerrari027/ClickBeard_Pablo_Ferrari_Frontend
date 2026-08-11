"use client";

import { useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { useQualifications } from "../hooks/use-qualifications";

/** `/qualifications` (client, spec §13.7) — read-only catalog, no pagination. */
export function QualificationsListContent() {
  const { data: qualifications = [], isLoading, isError, refetch } = useQualifications();
  const [search, setSearch] = useState("");

  const filteredQualifications = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return qualifications;
    return qualifications.filter(
      (qualification) =>
        qualification.name.toLowerCase().includes(term) ||
        qualification.description?.toLowerCase().includes(term)
    );
  }, [qualifications, search]);

  return (
    <div>
      <PageHeader title="Qualificações" description="Catálogo de serviços oferecidos." />
      {!isLoading && !isError ? (
        <div className="relative mb-4 max-w-sm">
          <Search
            className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            className="pl-9"
            placeholder="Buscar qualificação..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Buscar qualificação"
          />
        </div>
      ) : null}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-20 w-full rounded-lg" aria-hidden="true" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState actionLabel="Tentar novamente" onAction={() => refetch()} />
      ) : filteredQualifications.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title={
            search.trim() ? "Nenhuma qualificação encontrada" : "Nenhuma qualificação disponível"
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredQualifications.map((qualification) => (
            <Card key={qualification.id}>
              <CardHeader>
                <CardTitle className="text-base">{qualification.name}</CardTitle>
              </CardHeader>
              {qualification.description ? (
                <CardContent className="text-sm text-muted-foreground">
                  {qualification.description}
                </CardContent>
              ) : null}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
