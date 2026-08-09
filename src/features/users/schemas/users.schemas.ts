import { z } from "zod";

import { passwordSchema } from "@/schemas/password.schema";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Informe a senha atual."),
    newPassword: passwordSchema,
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Informe ao menos 2 caracteres."),
  birthDate: z
    .string()
    .optional()
    .refine((value) => !value || new Date(value).getTime() <= Date.now(), {
      message: "A data de nascimento não pode ser futura.",
    }),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
