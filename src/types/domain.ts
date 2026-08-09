/** Papéis de usuário — fixos, sem papel adicional possível (spec §2). */
export type UserRole = "CLIENT" | "BARBER" | "ADMIN";

/** Status de um agendamento (spec §11, §13.9). */
export type AppointmentStatus = "SCHEDULED" | "CANCELLED";

/** Presets de período usados em todas as 6 páginas de analytics (spec §9.2 PeriodFilter). */
export type PeriodPreset = "TODAY" | "WEEK" | "MONTH" | "YEAR" | "CUSTOM";

/**
 * Corpo de erro cru retornado pela API. Duas origens distintas (spec §2):
 * - domínio (`DomainErrorFilter`): `error` é o nome exato da classe (ex. "UserIsNotAdminError").
 * - guard/validação Nest: `error` é a string genérica do status HTTP ("Unauthorized", "Forbidden",
 *   "Bad Request") e `message` pode ser um array de strings.
 */
export interface ApiErrorBody {
  statusCode: number;
  message: string | string[];
  error: string;
}
