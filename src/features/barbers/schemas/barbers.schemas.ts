import { z } from "zod";

import { BARBER_MAX_AGE, BARBER_MIN_AGE } from "@/lib/business-rules";

const hiredAtSchema = z
  .string()
  .min(1, "Informe a data de contratação.")
  .refine((value) => new Date(value).getTime() <= Date.now(), {
    message: "A data de contratação não pode ser futura.",
  });

/**
 * `age` stays as a string in the form (the `<input type="number">` already delivers it that
 * way) and is only converted to a number on submit — `z.coerce.number()` makes the schema's
 * input type diverge from its output type, which breaks `useForm<T>` typing in
 * react-hook-form.
 */
const ageSchema = z
  .string()
  .min(1, "Informe a idade.")
  .refine((value) => Number.isInteger(Number(value)), "A idade deve ser um número inteiro.")
  .refine((value) => Number(value) >= BARBER_MIN_AGE, `A idade mínima é ${BARBER_MIN_AGE}.`)
  .refine((value) => Number(value) <= BARBER_MAX_AGE, `A idade máxima é ${BARBER_MAX_AGE}.`);

/**
 * `email` is a text `Input`, not a search dropdown (spec §10.5,
 * INFORMATION MISSING FROM API item 1): there is no `GET /users?role=BARBER`.
 * The API resolves the user by email — pasting the UUID is no longer necessary.
 */
export const createBarberSchema = z.object({
  email: z.email("Informe um email válido."),
  age: ageSchema,
  hiredAt: hiredAtSchema,
  qualificationIds: z.array(z.uuid()).min(1, "Selecione ao menos uma qualificação."),
});

export type CreateBarberFormValues = z.infer<typeof createBarberSchema>;

export const updateBarberSchema = z.object({
  age: ageSchema,
  hiredAt: hiredAtSchema,
});

export type UpdateBarberFormValues = z.infer<typeof updateBarberSchema>;

export const unavailabilitySchema = z
  .object({
    startAt: z.string().min(1, "Informe o início do período."),
    endAt: z.string().min(1, "Informe o fim do período."),
    reason: z.string().trim().min(3, "Informe o motivo (mín. 3 caracteres)."),
  })
  .refine((data) => new Date(data.endAt).getTime() > new Date(data.startAt).getTime(), {
    message: "O fim deve ser depois do início.",
    path: ["endAt"],
  });

export type UnavailabilityFormValues = z.infer<typeof unavailabilitySchema>;
