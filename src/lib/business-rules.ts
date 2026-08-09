/**
 * Constantes de regra de negócio replicadas no frontend (client-side UX only —
 * a API é sempre a autoridade final). Cada uma referencia a seção do
 * clickbeard-frontend-spec.md de onde a regra foi extraída, para nunca
 * duplicar um número mágico em múltiplos arquivos (spec §22).
 */

/** Janela mínima antes do horário do agendamento para o cliente poder cancelar (spec §3.5, §10.9, §13.9). */
export const MIN_APPOINTMENT_NOTICE_HOURS = 2;

/** TTL do código de verificação de 2FA por e-mail (spec §10.3). */
export const VERIFICATION_CODE_TTL_MINUTES = 10;

/** Número máximo de tentativas de validação do código de 2FA (spec §9.2 OtpInput, §10.3). */
export const MAX_VERIFICATION_CODE_ATTEMPTS = 5;

/** Cooldown de UI (não imposto pela API) antes de permitir novo reenvio de código (spec §10.3). */
export const RESEND_CODE_COOLDOWN_SECONDS = 30;

/** Expediente da barbearia usado para gerar/validar a grade de horários (spec §9.2 TimeSlotPicker). */
export const BUSINESS_HOURS_START = 8;
export const BUSINESS_HOURS_END = 18;

/** Duração de cada slot de agendamento (spec §9.2 TimeSlotPicker, §10.7). */
export const APPOINTMENT_SLOT_MINUTES = 30;

/** Tamanho fixo de página retornado pela API em toda listagem paginada (spec §2). */
export const API_PAGE_SIZE = 100;

/** Comprimento mínimo do motivo de cancelamento administrativo [PLANEJADO] (spec §10.8). */
export const CANCELLATION_REASON_MIN_LENGTH = 3;

/** Comprimento mínimo do motivo de indisponibilidade de barbeiro [PLANEJADO] (spec §10.9). */
export const UNAVAILABILITY_REASON_MIN_LENGTH = 3;

/** Comprimento mínimo de senha exigido pela API (spec §10.1, §10.4). */
export const MIN_PASSWORD_LENGTH = 8;

/** Idade mínima/máxima de um barbeiro aceita pela API (spec §10.5). */
export const BARBER_MIN_AGE = 18;
export const BARBER_MAX_AGE = 100;
