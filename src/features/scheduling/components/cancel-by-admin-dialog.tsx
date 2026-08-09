"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ApiError, resolveErrorMessage } from "@/lib/api-error";
import { useCancelAppointmentByAdmin } from "../hooks/use-cancel-appointment-by-admin";
import { cancelByAdminSchema, type CancelByAdminFormValues } from "../schemas/appointments.schemas";

interface CancelByAdminDialogProps {
  appointmentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * [PLANEJADO] `PATCH /appointments/:id/cancel` (spec §10.8) — `AlertDialog` com `Textarea`
 * embutida (não um `Dialog` separado, mantendo o padrão "ação destrutiva = AlertDialog").
 */
export function CancelByAdminDialog({
  appointmentId,
  open,
  onOpenChange,
}: CancelByAdminDialogProps) {
  const { mutate, isPending } = useCancelAppointmentByAdmin(appointmentId);

  const form = useForm<CancelByAdminFormValues>({
    resolver: zodResolver(cancelByAdminSchema),
    defaultValues: { reason: "" },
  });

  function onSubmit(values: CancelByAdminFormValues) {
    mutate(values, {
      onSuccess: () => {
        toast.success("Agendamento cancelado. O cliente foi notificado por e-mail.");
        onOpenChange(false);
        form.reset();
      },
      onError: (error) => {
        toast.error(
          error instanceof ApiError ? resolveErrorMessage(error) : "Algo deu errado. Tente novamente."
        );
      },
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={(next) => !isPending && onOpenChange(next)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancelar agendamento</AlertDialogTitle>
          <AlertDialogDescription>
            O cliente será notificado por e-mail com o motivo informado.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo</FormLabel>
                  <FormControl>
                    <Textarea disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
              <Button type="submit" variant="destructive" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
                Confirmar cancelamento
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
