import type { PeriodFilterValue } from "@/components/shared/period-filter";

/** Never sends `startAt`/`endAt` for fixed presets — avoids the API's "silently ignored" behavior (spec §9.2). */
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
