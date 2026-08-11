"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RoleBadge } from "@/components/shared/role-badge";
import { ApiError, resolveErrorMessage } from "@/lib/api-error";
import { useAuth } from "@/lib/auth-context";
import { formatDate } from "@/lib/utils";
import type { User } from "@/types/api";
import { useUpdateProfile } from "../hooks/use-update-profile";
import { updateProfileSchema, type UpdateProfileFormValues } from "../schemas/users.schemas";

/** `PATCH /users/:id/profile` — name and birth date, self-only; email remains read-only. */
export function ProfileCard({ user }: { user: User }) {
  const { updateUser } = useAuth();
  const { mutate, isPending } = useUpdateProfile(user.id);

  const form = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name,
      birthDate: user.birthDate ? user.birthDate.slice(0, 10) : "",
    },
  });

  function onSubmit(values: UpdateProfileFormValues) {
    mutate(
      { name: values.name, birthDate: values.birthDate || undefined },
      {
        onSuccess: (updated) => {
          updateUser(updated);
          toast.success("Perfil atualizado.");
        },
        onError: (error) => {
          if (error instanceof ApiError) {
            if (error.code === "InvalidNameError") {
              form.setError("name", { message: resolveErrorMessage(error) });
              return;
            }
            toast.error(resolveErrorMessage(error));
            return;
          }
          toast.error("Algo deu errado. Tente novamente.");
        },
      }
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados da conta</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="E-mail" value={user.email} />
          <div className="space-y-1.5">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Papel
            </p>
            <RoleBadge role={user.role} />
          </div>
          <Field label="Membro desde" value={formatDate(user.createdAt)} />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
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
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de nascimento (opcional)</FormLabel>
                  <FormControl>
                    <Input type="date" disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="sm:col-span-2 sm:w-fit" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
              Salvar alterações
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <p className="text-sm">{value}</p>
    </div>
  );
}
