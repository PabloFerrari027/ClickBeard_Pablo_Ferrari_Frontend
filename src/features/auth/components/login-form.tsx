"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

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
import { ApiError } from "@/lib/api-error";
import { useLogin } from "../hooks/use-login";
import { loginSchema, type LoginFormValues } from "../schemas/auth.schemas";

/** `POST /auth/login` (spec §10.2) — não recebe token, apenas confirma credenciais e dispara 2FA. */
export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutate, isPending } = useLogin();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: searchParams.get("email") ?? "",
      password: "",
    },
  });

  function onSubmit(values: LoginFormValues) {
    setFormError(null);
    mutate(values, {
      onSuccess: () => {
        router.push("/login/verify");
      },
      onError: (error) => {
        if (error instanceof ApiError) {
          if (error.statusCode === 429) {
            setFormError("Muitas tentativas. Aguarde um momento.");
            return;
          }
          if (error.code === "InvalidCredentialsError") {
            setFormError("E-mail ou senha inválidos.");
            return;
          }
          setFormError("Algo deu errado. Tente novamente.");
          return;
        }
        setFormError("Algo deu errado. Tente novamente.");
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {formError ? (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />
            {formError}
          </div>
        ) : null}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="voce@email.com"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
          Entrar
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Ainda não tem conta?{" "}
          <Link href="/register" className="text-primary underline-offset-4 hover:underline">
            Criar conta
          </Link>
        </p>
      </form>
    </Form>
  );
}
