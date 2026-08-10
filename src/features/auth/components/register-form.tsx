"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { useLogin } from "../hooks/use-login";
import { useRegister } from "../hooks/use-register";
import { registerSchema, type RegisterFormValues } from "../schemas/auth.schemas";

/** `POST /users` (spec §10.1). */
export function RegisterForm() {
  const router = useRouter();
  const { mutate, isPending: isRegistering } = useRegister();
  const { mutate: login, isPending: isLoggingIn } = useLogin();
  const isPending = isRegistering || isLoggingIn;

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      birthDate: "",
    },
  });

  function onSubmit(values: RegisterFormValues) {
    mutate(
      {
        name: values.name,
        email: values.email,
        password: values.password,
        birthDate: values.birthDate || undefined,
      },
      {
        onSuccess: () => {
          login(
            { email: values.email, password: values.password },
            {
              onSuccess: () => {
                router.push("/login/verify");
              },
              onError: () => {
                toast.success("Conta criada! Faça login para continuar.");
                router.push(`/login?email=${encodeURIComponent(values.email)}`);
              },
            }
          );
        },
        onError: (error) => {
          if (error instanceof ApiError) {
            if (error.code === "UserAlreadyExistsError") {
              form.setError("email", {
                message: "Já existe uma conta com este e-mail.",
              });
              return;
            }
            if (error.code === "WeakPasswordError") {
              form.setError("password", { message: resolveErrorMessage(error) });
              return;
            }
            if (error.code === "InvalidNameError") {
              form.setError("name", { message: resolveErrorMessage(error) });
              return;
            }
            if (error.code === "InvalidEmailError") {
              form.setError("email", { message: resolveErrorMessage(error) });
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome completo" disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar senha</FormLabel>
              <FormControl>
                <Input type="password" disabled={isPending} {...field} />
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
        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
          Criar conta
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link href="/login" className="text-primary underline-offset-4 hover:underline">
            Entrar
          </Link>
        </p>
      </form>
    </Form>
  );
}
