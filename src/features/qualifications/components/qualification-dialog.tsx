"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { useCreateQualification } from "../hooks/use-create-qualification";
import { useUpdateQualification } from "../hooks/use-update-qualification";
import { qualificationSchema, type QualificationFormValues } from "../schemas/qualifications.schemas";
import type { Qualification } from "@/types/api";

interface QualificationDialogProps {
  /** Presente = modo edição (spec §13.17, `EditQualificationDialog`); ausente = criação. */
  qualification?: Qualification;
  trigger: ReactNode;
}

/** `POST /qualifications` + `PATCH /qualifications/:id` (spec §10.6, §13.17), num único Dialog. */
export function QualificationDialog({ qualification, trigger }: QualificationDialogProps) {
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(qualification);
  const createMutation = useCreateQualification();
  const updateMutation = useUpdateQualification();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const form = useForm<QualificationFormValues>({
    resolver: zodResolver(qualificationSchema),
    defaultValues: {
      name: qualification?.name ?? "",
      description: qualification?.description ?? "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: qualification?.name ?? "",
        description: qualification?.description ?? "",
      });
    }
  }, [open, qualification, form]);

  function onSubmit(values: QualificationFormValues) {
    const payload = { name: values.name, description: values.description || undefined };

    const callbacks = {
      onSuccess: () => {
        toast.success(isEdit ? "Qualificação atualizada." : "Qualificação criada.");
        setOpen(false);
      },
      onError: (error: unknown) => {
        if (error instanceof ApiError) {
          if (error.code === "QualificationAlreadyExistsError") {
            form.setError("name", { message: "Já existe uma qualificação com este nome." });
            return;
          }
          toast.error(resolveErrorMessage(error));
          return;
        }
        toast.error("Algo deu errado. Tente novamente.");
      },
    };

    if (isEdit && qualification) {
      updateMutation.mutate({ id: qualification.id, payload }, callbacks);
    } else {
      createMutation.mutate(payload, callbacks);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar qualificação" : "Nova qualificação"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
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
                {isEdit ? "Salvar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
