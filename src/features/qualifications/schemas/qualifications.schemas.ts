import { z } from "zod";

/** Mirrors the API's documented validation (spec §10.6): trim + min. 2 + optional description. */
export const qualificationSchema = z.object({
  name: z.string().trim().min(2, "Informe ao menos 2 caracteres."),
  description: z.string().trim().optional(),
});

export type QualificationFormValues = z.infer<typeof qualificationSchema>;
