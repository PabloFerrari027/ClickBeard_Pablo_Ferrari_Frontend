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
 * Shared header for the 6 analytics pages (spec §13.11-13.12): `PeriodFilter` + manual
 * "Refresh" button (analytics isn't invalidated by mutation — only the backend's 5min cache).
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
