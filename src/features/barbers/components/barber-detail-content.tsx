"use client";

import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { formatDate, getInitials } from "@/lib/utils";
import { useBarber } from "../hooks/use-barber";

/** `/barbers/[id]` (cliente, spec §13.6) — detalhe somente leitura + CTA de agendar. */
export function BarberDetailContent({ barberId }: { barberId: string }) {
  const { data: barber, isLoading, isError, refetch } = useBarber(barberId);

  if (isLoading) {
    return (
      <div className="max-w-2xl">
        <PageHeader title="Barbeiro" />
        <Skeleton className="h-64 w-full rounded-lg" aria-hidden="true" />
      </div>
    );
  }

  if (isError || !barber) {
    return (
      <div className="max-w-2xl">
        <PageHeader title="Barbeiro" />
        <ErrorState
          title="Barbeiro não encontrado"
          actionLabel="Tentar novamente"
          onAction={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Breadcrumbs items={[{ label: "Barbeiros", href: "/barbers" }, { label: barber.name }]} />
      <PageHeader title={barber.name} />
      <Card>
        <CardHeader className="flex-row items-center gap-4">
          <Avatar className="size-16">
            <AvatarFallback className="text-lg">{getInitials(barber.name)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{barber.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {barber.age} anos · desde {formatDate(barber.hiredAt)}
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Qualificações
            </p>
            <div className="flex flex-wrap gap-1.5">
              {barber.qualifications.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma qualificação cadastrada</p>
              ) : (
                barber.qualifications.map((qualification) => (
                  <Badge key={qualification.id} variant="secondary">
                    {qualification.name}
                  </Badge>
                ))
              )}
            </div>
          </div>
          <Button asChild size="lg" className="w-full">
            <Link href={`/book?barberId=${barber.id}`}>Agendar com {barber.name}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
