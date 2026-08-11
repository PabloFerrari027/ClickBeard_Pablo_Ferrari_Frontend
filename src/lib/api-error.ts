import type { ApiErrorBody } from "@/types/domain";

const GUARD_ERROR_CODES = new Set([
  "Unauthorized",
  "Forbidden",
  "Bad Request",
  "Not Found",
]);

/**
 * Error thrown by every `service` (spec §4.4). Encapsulates the two API error
 * response formats: domain (`error` = exact class name) and
 * Nest guard/validation (`error` = generic HTTP status string).
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    public rawMessage: string | string[]
  ) {
    super(Array.isArray(rawMessage) ? rawMessage.join("\n") : rawMessage);
    this.name = "ApiError";
  }

  static fromBody(statusCode: number, body: ApiErrorBody): ApiError {
    return new ApiError(statusCode, body.error, body.message);
  }

  /** `true` when `error` is a domain class name, not a generic guard/validation string. */
  get isDomainError(): boolean {
    return !GUARD_ERROR_CODES.has(this.code);
  }

  get isValidationArray(): boolean {
    return Array.isArray(this.rawMessage);
  }
}

/**
 * Central `code -> friendly Portuguese message` map (spec §4.4, acceptance criterion §27 item 4).
 * Every mutation hook uses this map before falling back to `rawMessage`.
 */
export const domainErrorMessages: Record<string, string> = {
  // identity
  UserAlreadyExistsError: "Já existe uma conta com este e-mail.",
  WeakPasswordError: "A senha deve ter no mínimo 8 caracteres, com letra e número.",
  InvalidNameError: "Nome inválido.",
  InvalidEmailError: "E-mail inválido.",
  InvalidCredentialsError: "E-mail ou senha inválidos.",
  SamePasswordError: "A nova senha deve ser diferente da atual.",
  AdminCannotBeDeactivatedError: "Administradores não podem ser desativados.",
  UserNotFoundForSessionError:
    "Não foi possível concluir o login. Tente novamente.",

  // account-verification
  VerificationCodeNotFoundError:
    "Código expirado ou inexistente. Solicite um novo.",
  VerificationCodeExpiredError:
    "Código expirado ou inexistente. Solicite um novo.",
  VerificationCodeAttemptsExceededError:
    "Número máximo de tentativas excedido. Solicite um novo código.",
  InvalidVerificationCodeError: "Código incorreto.",

  // barber
  BarberNotFoundError: "Barbeiro não encontrado.",
  BarberDoesNotHaveQualificationError:
    "Este barbeiro não possui a qualificação selecionada.",
  BarberMustHaveAtLeastOneQualificationError:
    "Um barbeiro precisa ter ao menos uma qualificação.",
  InvalidHiringDateError: "A data de contratação não pode ser futura.",
  BarberUnavailabilityOverlapError:
    "Este barbeiro já tem um período de indisponibilidade que se sobrepõe ao informado.",
  InvalidUnavailabilityPeriodError:
    "O período informado é inválido (fim deve ser depois do início).",
  UnavailabilityReasonRequiredError: "Informe o motivo da indisponibilidade.",

  // qualification
  QualificationAlreadyExistsError: "Já existe uma qualificação com este nome.",
  QualificationInUseError:
    "Esta qualificação está em uso por ao menos um barbeiro e não pode ser excluída.",

  // scheduling
  AppointmentTooSoonError:
    "Este horário não é mais válido para agendamento.",
  BarberTimeSlotConflictError:
    "Este horário acabou de ser reservado por outro cliente.",
  InvalidTimeSlotError: "Horário inválido.",
  AppointmentNotFoundError: "Agendamento não encontrado.",
  AppointmentAccessDeniedError:
    "Você não tem permissão para acessar este agendamento.",
  CancellationWindowExpiredError: "A janela de cancelamento expirou.",
  CancellationReasonRequiredError: "Informe o motivo do cancelamento.",
  InvalidAppointmentPeriodError:
    "A data inicial do período deve ser anterior ou igual à data final.",

  // analytics
  CustomRangeRequiredError:
    "Informe o início e o fim do período para o filtro personalizado.",

  // generic guard/validation
  Unauthorized: "Sua sessão expirou. Faça login novamente.",
  Forbidden: "Você não tem permissão para esta ação.",
  "Not Found": "Não encontrado.",
};

const FALLBACK_MESSAGE = "Algo deu errado. Tente novamente.";
const RATE_LIMIT_MESSAGE =
  "Muitas requisições. Aguarde um momento e tente novamente.";

/** Resolves the final friendly message for an `ApiError`, with the fallbacks described in spec §4.4/§12.4. */
export function resolveErrorMessage(error: ApiError): string {
  if (error.statusCode === 429) return RATE_LIMIT_MESSAGE;

  const mapped = domainErrorMessages[error.code];
  if (mapped) return mapped;

  if (error.isValidationArray) {
    return (error.rawMessage as string[]).join("\n");
  }

  if (typeof error.rawMessage === "string" && error.rawMessage.trim()) {
    return error.rawMessage;
  }

  return FALLBACK_MESSAGE;
}
