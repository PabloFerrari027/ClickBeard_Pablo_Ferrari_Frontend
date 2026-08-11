"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDate } from "@/lib/utils";
import type { FutureAppointmentsPeriod } from "../services/appointments.service";

interface AppointmentsPeriodFilterProps {
  value: FutureAppointmentsPeriod;
  onChange: (value: FutureAppointmentsPeriod) => void;
}

/**
 * `startAt`/`endAt` filter for `GET /appointments/future`. Unlike the analytics `PeriodFilter`:
 * this endpoint has no concept of a `preset` on the server, it only accepts raw bounds —
 * hence a dedicated component instead of reusing that one.
 */
export function AppointmentsPeriodFilter({ value, onChange }: AppointmentsPeriodFilterProps) {
  const [draftStart, setDraftStart] = useState<Date | undefined>(
    value.startAt ? new Date(value.startAt) : undefined
  );
  const [draftEnd, setDraftEnd] = useState<Date | undefined>(
    value.endAt ? new Date(value.endAt) : undefined
  );

  const isInvalidRange = Boolean(
    draftStart && draftEnd && draftStart.getTime() > draftEnd.getTime()
  );
  const isDirty =
    (draftStart?.toISOString() ?? null) !== (value.startAt ?? null) ||
    endOfDay(draftEnd)?.toISOString() !== value.endAt;
  const hasActiveFilter = Boolean(value.startAt || value.endAt);

  function apply() {
    if (isInvalidRange) return;
    onChange({
      startAt: draftStart?.toISOString(),
      endAt: endOfDay(draftEnd)?.toISOString(),
    });
  }

  function clear() {
    setDraftStart(undefined);
    setDraftEnd(undefined);
    onChange({});
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-end gap-2">
        <DateField label="De" date={draftStart} onSelect={setDraftStart} />
        <DateField label="Até" date={draftEnd} onSelect={setDraftEnd} />
        <Button onClick={apply} disabled={isInvalidRange || !isDirty}>
          Aplicar
        </Button>
        {hasActiveFilter ? (
          <Button variant="ghost" onClick={clear}>
            Limpar
          </Button>
        ) : null}
      </div>
      {isInvalidRange ? (
        <p className="text-xs text-destructive">
          A data inicial deve ser anterior ou igual à data final.
        </p>
      ) : null}
    </div>
  );
}

/** `endAt` is inclusive on the backend (`Op.lte`) — without this, the day selected in "Até" would be excluded. */
function endOfDay(date?: Date): Date | undefined {
  if (!date) return undefined;
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

function DateField({
  label,
  date,
  onSelect,
}: {
  label: string;
  date?: Date;
  onSelect: (date?: Date) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium tracking-wide uppercase">{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-36 justify-start font-normal">
            <CalendarIcon className="mr-2 size-4" aria-hidden="true" />
            {date ? formatDate(date.toISOString()) : "Selecionar"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={date} onSelect={onSelect} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
