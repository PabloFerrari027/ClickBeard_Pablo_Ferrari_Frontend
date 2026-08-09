import { AlertTriangle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MIN_APPOINTMENT_NOTICE_HOURS } from "@/lib/business-rules";

const NOTICE_MS = MIN_APPOINTMENT_NOTICE_HOURS * 60 * 60 * 1000;

/** Calcula `startAt - now` (spec §9.2) — usado pela UI para decidir se o botão de cancelar aparece. */
export function isWithinCancelWindow(startAt: string): boolean {
  return new Date(startAt).getTime() - Date.now() >= NOTICE_MS;
}

/** Alerta inline quando a janela de 2h já expirou — desabilita o botão antes do round-trip. */
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
