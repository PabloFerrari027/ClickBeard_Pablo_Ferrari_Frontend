"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { PLANNED_FEATURES_ENABLED } from "@/lib/feature-flags";
import { formatDate } from "@/lib/utils";
import { useBarber } from "../hooks/use-barber";
import { BarberQualificationsPanel } from "./barber-qualifications-panel";
import { UnavailabilityForm } from "./unavailability-form";
import { UnavailabilityList } from "./unavailability-list";

/** `/admin/barbers/[id]` (spec §13.15) — management hub: Data, Qualifications, Unavailabilities [PLANNED]. */
export function AdminBarberDetailContent({ barberId }: { barberId: string }) {
  const { data: barber, isLoading, isError, refetch } = useBarber(barberId);

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Barbeiro" />
        <Skeleton className="h-64 w-full rounded-lg" aria-hidden="true" />
      </div>
    );
  }

  if (isError || !barber) {
    return (
      <div>
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
    <div className="max-w-3xl">
      <Breadcrumbs
        items={[{ label: "Barbeiros", href: "/admin/barbers" }, { label: barber.name }]}
      />
      <PageHeader
        title={barber.name}
        action={
          <Button asChild variant="outline">
            <Link href={`/admin/barbers/${barber.id}/edit`}>
              <Pencil aria-hidden="true" />
              Editar
            </Link>
          </Button>
        }
      />
      <Tabs defaultValue="data">
        <TabsList>
          <TabsTrigger value="data">Dados</TabsTrigger>
          <TabsTrigger value="qualifications">Qualificações</TabsTrigger>
          {PLANNED_FEATURES_ENABLED ? (
            <TabsTrigger value="unavailabilities">Indisponibilidades</TabsTrigger>
          ) : null}
        </TabsList>

        <TabsContent value="data" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Dados</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Idade" value={`${barber.age} anos`} />
              <Field label="Contratado em" value={formatDate(barber.hiredAt)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qualifications" className="mt-4">
          <BarberQualificationsPanel barber={barber} />
        </TabsContent>

        {PLANNED_FEATURES_ENABLED ? (
          <TabsContent value="unavailabilities" className="mt-4 space-y-4">
            <UnavailabilityForm barberId={barber.id} />
            <UnavailabilityList barberId={barber.id} />
          </TabsContent>
        ) : null}
      </Tabs>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <p className="text-sm">{value}</p>
    </div>
  );
}
