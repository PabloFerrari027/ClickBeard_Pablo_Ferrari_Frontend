"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import type { PeriodPreset } from "@/types/domain";

export interface PeriodFilterValue {
  preset: PeriodPreset;
  startAt?: string;
  endAt?: string;
}

interface PeriodFilterProps {
  value: PeriodFilterValue;
  onChange: (value: PeriodFilterValue) => void;
}

const PRESET_LABELS: Record<PeriodPreset, string> = {
  TODAY: "Hoje",
  WEEK: "Semana",
  MONTH: "Mês",
  YEAR: "Ano",
  CUSTOM: "Personalizado",
};

const PRESETS: PeriodPreset[] = ["TODAY", "WEEK", "MONTH", "YEAR", "CUSTOM"];

/**
 * Seletor de preset + range picker para CUSTOM, reusado nas 6 páginas de
 * analytics (spec §6, §9.2). Presets fixos nunca enviam `startAt`/`endAt`;
 * CUSTOM exige ambos antes de habilitar "Aplicar" (evita `CustomRangeRequiredError`).
 */
export function PeriodFilter({ value, onChange }: PeriodFilterProps) {
  const [draftStart, setDraftStart] = useState<Date | undefined>(
    value.startAt ? new Date(value.startAt) : undefined
  );
  const [draftEnd, setDraftEnd] = useState<Date | undefined>(
    value.endAt ? new Date(value.endAt) : undefined
  );

  function handlePresetChange(preset: PeriodPreset) {
    if (preset === "CUSTOM") {
      onChange({ preset });
    } else {
      onChange({ preset, startAt: undefined, endAt: undefined });
    }
  }

  function applyCustomRange() {
    if (!draftStart || !draftEnd) return;
    onChange({
      preset: "CUSTOM",
      startAt: draftStart.toISOString(),
      endAt: draftEnd.toISOString(),
    });
  }

  return (
    <div className="flex flex-wrap items-end gap-2">
      <div className="space-y-1.5">
        <Label
          htmlFor="period-preset"
          className="text-xs font-medium tracking-wide uppercase"
        >
          Período
        </Label>
        <Select
          value={value.preset}
          onValueChange={(preset) => handlePresetChange(preset as PeriodPreset)}
        >
          <SelectTrigger id="period-preset" className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PRESETS.map((preset) => (
              <SelectItem key={preset} value={preset}>
                {PRESET_LABELS[preset]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {value.preset === "CUSTOM" ? (
        <>
          <DatePickerField label="Início" date={draftStart} onSelect={setDraftStart} />
          <DatePickerField label="Fim" date={draftEnd} onSelect={setDraftEnd} />
          <Button onClick={applyCustomRange} disabled={!draftStart || !draftEnd}>
            Aplicar
          </Button>
        </>
      ) : null}
    </div>
  );
}

function DatePickerField({
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
