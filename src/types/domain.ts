/** User roles — fixed, no additional role possible (spec §2). */
export type UserRole = "CLIENT" | "BARBER" | "ADMIN";

/** Status of an appointment (spec §11, §13.9). */
export type AppointmentStatus = "SCHEDULED" | "CANCELLED";

/** Period presets used across all 6 analytics pages (spec §9.2 PeriodFilter). */
export type PeriodPreset = "TODAY" | "WEEK" | "MONTH" | "YEAR" | "CUSTOM";

/**
 * Raw error body returned by the API. Two distinct origins (spec §2):
 * - domain (`DomainErrorFilter`): `error` is the exact class name (e.g. "UserIsNotAdminError").
 * - Nest guard/validation: `error` is the generic HTTP status string ("Unauthorized", "Forbidden",
 *   "Bad Request") and `message` may be an array of strings.
 */
export interface ApiErrorBody {
  statusCode: number;
  message: string | string[];
  error: string;
}
