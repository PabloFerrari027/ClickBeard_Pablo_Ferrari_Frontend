import { z } from "zod";

import { passwordSchema } from "@/schemas/password.schema";

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Informe ao menos 2 caracteres."),
    email: z.email("E-mail inválido."),
    password: passwordSchema,
    confirmPassword: z.string(),
    birthDate: z
      .string()
      .optional()
      .refine((value) => !value || new Date(value).getTime() <= Date.now(), {
        message: "A data de nascimento não pode ser futura.",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email("E-mail inválido."),
  password: z.string().min(1, "Informe sua senha."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
