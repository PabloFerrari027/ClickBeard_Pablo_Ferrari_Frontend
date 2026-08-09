import type { PeriodFilterValue } from "@/components/shared/period-filter";

/** Nunca envia `startAt`/`endAt` para presets fixos — evita o comportamento "silenciosamente ignorado" da API (spec §9.2). */
export function buildPeriodQuery(value: PeriodFilterValue): {
  preset: string;
  startAt?: string;
  endAt?: string;
} {
  if (value.preset === "CUSTOM") {
    return { preset: value.preset, startAt: value.startAt, endAt: value.endAt };
  }
  return { preset: value.preset };
}
