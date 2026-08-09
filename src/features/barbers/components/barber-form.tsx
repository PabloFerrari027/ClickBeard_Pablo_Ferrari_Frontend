"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MultiSelectChips } from "@/components/shared/multi-select-chips";
import { ApiError, resolveErrorMessage } from "@/lib/api-error";
import { useQualifications } from "@/features/qualifications/hooks/use-qualifications";
import { useCreateBarber } from "../hooks/use-create-barber";
import { useUpdateBarber } from "../hooks/use-update-barber";
import {
  createBarberSchema,
  updateBarberSchema,
  type CreateBarberFormValues,
  type UpdateBarberFormValues,
} from "../schemas/barbers.schemas";

/** Criar (`POST /barbers`, spec §10.5). `email` é texto livre — não há `GET /users?role=BARBER`. */
export function CreateBarberForm() {
  const router = useRouter();
  const { mutate, isPending } = useCreateBarber();
  const { data: qualifications = [], isLoading: loadingQualifications } = useQualifications();

  const form = useForm<CreateBarberFormValues>({
    resolver: zodResolver(createBarberSchema),
    defaultValues: { email: "", age: "18", hiredAt: "", qualificationIds: [] },
  });

  function onSubmit(values: CreateBarberFormValues) {
    mutate({ ...values, age: Number(values.age) }, {
      onSuccess: (barber) => {
        toast.success("Barbeiro criado com sucesso.");
        router.push(`/admin/barbers/${barber.id}`);
      },
      onError: (error) => {
        if (error instanceof ApiError) {
          if (error.code === "InvalidHiringDateError") {
            form.setError("hiredAt", { message: resolveErrorMessage(error) });
            return;
          }
          toast.error(resolveErrorMessage(error));
          return;
        }
        toast.error("Algo deu errado. Tente novamente.");
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email do usuário</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="usuario@exemplo.com"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Informe o email de um usuário já cadastrado com papel Barbeiro — não há busca por
                nome (limitação da API).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Idade</FormLabel>
                <FormControl>
                  <Input type="number" disabled={isPending} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hiredAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de contratação</FormLabel>
                <FormControl>
                  <Input type="date" disabled={isPending} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="qualificationIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Qualificações</FormLabel>
              <FormControl>
                <MultiSelectChips
                  options={qualifications}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isPending || loadingQualifications}
                  emptyMessage="Nenhuma qualificação cadastrada — crie uma em Qualificações primeiro."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
          Criar barbeiro
        </Button>
      </form>
    </Form>
  );
}

interface EditBarberFormProps {
  barberId: string;
  defaultValues: UpdateBarberFormValues;
}

/** Editar (`PATCH /barbers/:id`, spec §10.5) — mesmo par de campos, sem `userId`/`qualificationIds`. */
export function EditBarberForm({ barberId, defaultValues }: EditBarberFormProps) {
  const router = useRouter();
  const { mutate, isPending } = useUpdateBarber(barberId);

  const form = useForm<UpdateBarberFormValues>({
    resolver: zodResolver(updateBarberSchema),
    defaultValues,
  });

  function onSubmit(values: UpdateBarberFormValues) {
    mutate({ ...values, age: Number(values.age) }, {
      onSuccess: () => {
        toast.success("Barbeiro atualizado.");
        router.push(`/admin/barbers/${barberId}`);
      },
      onError: (error) => {
        if (error instanceof ApiError) {
          if (error.code === "InvalidHiringDateError") {
            form.setError("hiredAt", { message: resolveErrorMessage(error) });
            return;
          }
          toast.error(resolveErrorMessage(error));
          return;
        }
        toast.error("Algo deu errado. Tente novamente.");
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Idade</FormLabel>
                <FormControl>
                  <Input type="number" disabled={isPending} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hiredAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de contratação</FormLabel>
                <FormControl>
                  <Input type="date" disabled={isPending} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
          Salvar alterações
        </Button>
      </form>
    </Form>
  );
}
