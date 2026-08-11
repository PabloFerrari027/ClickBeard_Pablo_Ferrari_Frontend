"use client";

import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";
import type { TimeSlot } from "@/types/api";

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  value: string | null;
  onChange: (slot: string) => void;
  disabled?: boolean;
}

/** Time slot grid for `/book` (spec §9.2): the API already returns only the free ones. */
export function TimeSlotPicker({ slots, value, onChange, disabled }: TimeSlotPickerProps) {
  return (
    <div
      className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6"
      role="group"
      aria-label="Horários disponíveis"
    >
      {slots.map(({ startAt }) => {
        const selected = value === startAt;

        return (
          <Button
            key={startAt}
            type="button"
            variant={selected ? "default" : "outline"}
            disabled={disabled}
            onClick={() => onChange(startAt)}
            aria-label={`Horário disponível às ${formatTime(startAt)}`}
          >
            {formatTime(startAt)}
          </Button>
        );
      })}
    </div>
  );
}
