import { z } from "zod";

import { CANCELLATION_REASON_MIN_LENGTH } from "@/lib/business-rules";

/** [PLANEJADO] `PATCH /appointments/:id/cancel` (spec §10.8). */
export const cancelByAdminSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(
      CANCELLATION_REASON_MIN_LENGTH,
      `Informe o motivo (mín. ${CANCELLATION_REASON_MIN_LENGTH} caracteres).`
    ),
});

export type CancelByAdminFormValues = z.infer<typeof cancelByAdminSchema>;
