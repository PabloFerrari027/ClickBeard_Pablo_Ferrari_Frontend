"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ApiError, resolveErrorMessage } from "@/lib/api-error";
import { useCreateUnavailability } from "../hooks/use-create-unavailability";
import { unavailabilitySchema, type UnavailabilityFormValues } from "../schemas/barbers.schemas";

/** [PLANEJADO] `POST /barbers/:id/unavailabilities` (spec §10.9, §14.6). */
export function UnavailabilityForm({ barberId }: { barberId: string }) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateUnavailability(barberId);

  const form = useForm<UnavailabilityFormValues>({
    resolver: zodResolver(unavailabilitySchema),
    defaultValues: { startAt: "", endAt: "", reason: "" },
  });

  function onSubmit(values: UnavailabilityFormValues) {
    mutate(
      {
        startAt: new Date(values.startAt).toISOString(),
        endAt: new Date(values.endAt).toISOString(),
        reason: values.reason,
      },
      {
        onSuccess: () => {
          toast.success(
            "Indisponibilidade registrada. Agendamentos conflitantes serão cancelados e os clientes notificados."
          );
          setOpen(false);
          form.reset();
        },
        onError: (error) => {
          toast.error(
            error instanceof ApiError
              ? resolveErrorMessage(error)
              : "Algo deu errado. Tente novamente."
          );
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus aria-hidden="true" />
          Registrar indisponibilidade
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar indisponibilidade</DialogTitle>
          <DialogDescription>
            Agendamentos existentes do barbeiro neste período serão cancelados automaticamente e
            o cliente será notificado por e-mail.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="startAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Início</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fim</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
                Registrar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
