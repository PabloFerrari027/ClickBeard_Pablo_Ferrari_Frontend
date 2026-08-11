import { z } from "zod";

import { MIN_PASSWORD_LENGTH } from "@/lib/business-rules";

/** Mirrors the API's documented validation (spec §10.1, §10.4): min. 8 chars, letter and number. Shared between registration and password change. */
export const passwordSchema = z
  .string()
  .min(MIN_PASSWORD_LENGTH, `Mínimo de ${MIN_PASSWORD_LENGTH} caracteres, com letra e número.`)
  .regex(/[A-Za-z]/, "A senha precisa conter ao menos uma letra.")
  .regex(/\d/, "A senha precisa conter ao menos um número.");
