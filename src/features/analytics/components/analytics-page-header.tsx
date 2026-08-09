"use client";

import { RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { PeriodFilter, type PeriodFilterValue } from "@/components/shared/period-filter";

interface AnalyticsPageHeaderProps {
  title: string;
  description?: string;
  period: PeriodFilterValue;
  onPeriodChange: (value: PeriodFilterValue) => void;
  onRefresh: () => void;
  isFetching?: boolean;
}

/**
 * Cabeçalho comum às 6 páginas de analytics (spec §13.11-13.12): `PeriodFilter` + botão
 * "Atualizar" manual (analytics não invalida por mutação — só os 5min de cache do backend).
 */
export function AnalyticsPageHeader({
  title,
  description,
  period,
  onPeriodChange,
  onRefresh,
  isFetching,
}: AnalyticsPageHeaderProps) {
  return (
    <PageHeader
      title={title}
      description={description}
      action={
        <div className="flex flex-wrap items-end gap-2">
          <PeriodFilter value={period} onChange={onPeriodChange} />
          <Button variant="outline" onClick={onRefresh} disabled={isFetching}>
            <RotateCw className={isFetching ? "animate-spin" : undefined} aria-hidden="true" />
            Atualizar
          </Button>
        </div>
      }
    />
  );
}
