import { z } from "zod";

/** Espelha a validação documentada da API (spec §10.6): trim + mín. 2 + descrição opcional. */
export const qualificationSchema = z.object({
  name: z.string().trim().min(2, "Informe ao menos 2 caracteres."),
  description: z.string().trim().optional(),
});

export type QualificationFormValues = z.infer<typeof qualificationSchema>;
