"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MIN_APPOINTMENT_NOTICE_HOURS } from "@/lib/business-rules";
import { formatTime } from "@/lib/utils";
import type { TimeSlot } from "@/types/api";

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  value: string | null;
  onChange: (slot: string) => void;
  disabled?: boolean;
}

const TOO_SOON_MS = MIN_APPOINTMENT_NOTICE_HOURS * 60 * 60 * 1000;

/**
 * Grade de horários de `/book` (spec §9.2): a API já retorna só os livres, mas sinaliza
 * visualmente (ícone + tooltip) slots a menos de `MIN_APPOINTMENT_NOTICE_HOURS` do agora,
 * já que a API rejeitará a reserva (`AppointmentTooSoonError`) mesmo esses aparecendo livres.
 */
export function TimeSlotPicker({ slots, value, onChange, disabled }: TimeSlotPickerProps) {
  // Snapshot tirado na montagem — evita chamar Date.now() (impuro) durante o render.
  const [now] = useState(() => Date.now());

  return (
    <div
      className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6"
      role="group"
      aria-label="Horários disponíveis"
    >
      {slots.map(({ startAt }) => {
        const tooSoon = new Date(startAt).getTime() - now < TOO_SOON_MS;
        const selected = value === startAt;
        const warningId = `slot-warning-${startAt}`;

        const button = (
          <Button
            type="button"
            variant={selected ? "default" : "outline"}
            disabled={disabled}
            onClick={() => onChange(startAt)}
            aria-label={`Horário disponível às ${formatTime(startAt)}`}
            aria-describedby={tooSoon ? warningId : undefined}
          >
            {formatTime(startAt)}
            {tooSoon ? (
              <AlertTriangle className="text-warning" aria-hidden="true" />
            ) : null}
          </Button>
        );

        if (!tooSoon) {
          return <div key={startAt}>{button}</div>;
        }

        return (
          <Tooltip key={startAt}>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent id={warningId}>
              Faltam menos de {MIN_APPOINTMENT_NOTICE_HOURS}h — a API pode rejeitar este horário.
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
