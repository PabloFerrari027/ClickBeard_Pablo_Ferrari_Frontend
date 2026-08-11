import { AlertTriangle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MIN_APPOINTMENT_NOTICE_HOURS } from "@/lib/business-rules";

const NOTICE_MS = MIN_APPOINTMENT_NOTICE_HOURS * 60 * 60 * 1000;

/** Computes `startAt - now` (spec §9.2) — used by the UI to decide whether the cancel button appears. */
export function isWithinCancelWindow(startAt: string): boolean {
  return new Date(startAt).getTime() - Date.now() >= NOTICE_MS;
}

/** Inline alert for when the 2h window has already expired — disables the button before the round-trip. */
export function CancelWindowNotice({ startAt }: { startAt: string }) {
  if (isWithinCancelWindow(startAt)) return null;

  return (
    <Alert variant="warning">
      <AlertTriangle aria-hidden="true" />
      <AlertTitle>Cancelamento indisponível</AlertTitle>
      <AlertDescription>
        Este agendamento não pode mais ser cancelado (janela de {MIN_APPOINTMENT_NOTICE_HOURS}h
        expirada).
      </AlertDescription>
    </Alert>
  );
}
