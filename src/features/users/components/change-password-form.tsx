"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ApiError, resolveErrorMessage } from "@/lib/api-error";
import { useChangePassword } from "../hooks/use-change-password";
import { changePasswordSchema, type ChangePasswordFormValues } from "../schemas/users.schemas";

/** `PATCH /users/:id/password` (spec §10.4) — does not log out, the current session remains valid. */
export function ChangePasswordForm({ userId }: { userId: string }) {
  const { mutate, isPending } = useChangePassword(userId);

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmNewPassword: "" },
  });

  function onSubmit(values: ChangePasswordFormValues) {
    mutate(
      { currentPassword: values.currentPassword, newPassword: values.newPassword },
      {
        onSuccess: () => {
          toast.success("Senha alterada com sucesso");
          form.reset();
        },
        onError: (error) => {
          if (error instanceof ApiError) {
            if (error.code === "InvalidCredentialsError") {
              form.setError("currentPassword", { message: "Senha atual incorreta." });
              return;
            }
            if (error.code === "WeakPasswordError" || error.code === "SamePasswordError") {
              form.setError("newPassword", { message: resolveErrorMessage(error) });
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md space-y-4">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha atual</FormLabel>
              <FormControl>
                <Input type="password" disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nova senha</FormLabel>
              <FormControl>
                <Input type="password" disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmNewPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar nova senha</FormLabel>
              <FormControl>
                <Input type="password" disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
          Alterar senha
        </Button>
      </form>
    </Form>
  );
}
