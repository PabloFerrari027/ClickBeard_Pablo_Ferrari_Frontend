"use client";

import { toast } from "sonner";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ApiError, resolveErrorMessage } from "@/lib/api-error";
import { useCancelAppointment } from "../hooks/use-cancel-appointment";

interface CancelAppointmentDialogProps {
  appointmentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** `DELETE /appointments/:id` (spec §14.3) — cancelamento pelo cliente, dono do agendamento. */
export function CancelAppointmentDialog({
  appointmentId,
  open,
  onOpenChange,
}: CancelAppointmentDialogProps) {
  const { mutate, isPending } = useCancelAppointment(appointmentId);

  function handleConfirm() {
    mutate(undefined, {
      onSuccess: () => {
        toast.success("Agendamento cancelado");
        onOpenChange(false);
      },
      onError: (error) => {
        if (error instanceof ApiError && error.code === "CancellationWindowExpiredError") {
          toast.error("A janela de cancelamento expirou.");
        } else {
          toast.error(
            error instanceof ApiError ? resolveErrorMessage(error) : "Algo deu errado. Tente novamente."
          );
        }
        onOpenChange(false);
      },
    });
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Cancelar agendamento?"
      description="Esta ação libera o horário para outro cliente."
      confirmLabel="Cancelar agendamento"
      variant="destructive"
      onConfirm={handleConfirm}
      isPending={isPending}
    />
  );
}
