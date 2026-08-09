import { z } from "zod";

import { MIN_PASSWORD_LENGTH } from "@/lib/business-rules";

/** Espelha a validação documentada da API (spec §10.1, §10.4): mín. 8, letra e número. Compartilhado entre registro e troca de senha. */
export const passwordSchema = z
  .string()
  .min(MIN_PASSWORD_LENGTH, `Mínimo de ${MIN_PASSWORD_LENGTH} caracteres, com letra e número.`)
  .regex(/[A-Za-z]/, "A senha precisa conter ao menos uma letra.")
  .regex(/\d/, "A senha precisa conter ao menos um número.");
