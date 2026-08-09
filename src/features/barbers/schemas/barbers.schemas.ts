import { z } from "zod";

import { BARBER_MAX_AGE, BARBER_MIN_AGE } from "@/lib/business-rules";

const hiredAtSchema = z
  .string()
  .min(1, "Informe a data de contratação.")
  .refine((value) => new Date(value).getTime() <= Date.now(), {
    message: "A data de contratação não pode ser futura.",
  });

/**
 * `age` fica como string no formulário (o `<input type="number">` já entrega isso) e só é
 * convertido para number no submit — `z.coerce.number()` faz o tipo de input do schema
 * divergir do tipo de output, o que quebra a tipagem de `useForm<T>` do react-hook-form.
 */
const ageSchema = z
  .string()
  .min(1, "Informe a idade.")
  .refine((value) => Number.isInteger(Number(value)), "A idade deve ser um número inteiro.")
  .refine((value) => Number(value) >= BARBER_MIN_AGE, `A idade mínima é ${BARBER_MIN_AGE}.`)
  .refine((value) => Number(value) <= BARBER_MAX_AGE, `A idade máxima é ${BARBER_MAX_AGE}.`);

/**
 * `email` é um `Input` de texto, não um dropdown de busca (spec §10.5,
 * INFORMAÇÃO AUSENTE NA API item 1): não existe `GET /users?role=BARBER`.
 * A API resolve o usuário pelo email — não é mais necessário colar o UUID.
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
