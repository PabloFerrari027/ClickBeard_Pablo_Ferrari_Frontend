import type { ApiErrorBody } from "@/types/domain";

const GUARD_ERROR_CODES = new Set([
  "Unauthorized",
  "Forbidden",
  "Bad Request",
  "Not Found",
]);

/**
 * Erro lançado por todo `service` (spec §4.4). Encapsula os dois formatos de
 * resposta de erro da API: domínio (`error` = nome exato da classe) e
 * guard/validação Nest (`error` = string genérica do status HTTP).
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

  /** `true` quando `error` é o nome de uma classe de domínio, não uma string genérica de guard/validação. */
  get isDomainError(): boolean {
    return !GUARD_ERROR_CODES.has(this.code);
  }

  get isValidationArray(): boolean {
    return Array.isArray(this.rawMessage);
  }
}

/**
 * Mapa central `code -> mensagem amigável em português` (spec §4.4, critério de aceite §27 item 4).
 * Todo hook de mutação usa este mapa antes de recorrer ao fallback de `rawMessage`.
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

  // analytics
  CustomRangeRequiredError:
    "Informe o início e o fim do período para o filtro personalizado.",

  // guard/validação genéricos
  Unauthorized: "Sua sessão expirou. Faça login novamente.",
  Forbidden: "Você não tem permissão para esta ação.",
  "Not Found": "Não encontrado.",
};

const FALLBACK_MESSAGE = "Algo deu errado. Tente novamente.";
const RATE_LIMIT_MESSAGE =
  "Muitas requisições. Aguarde um momento e tente novamente.";

/** Resolve a mensagem amigável final para um `ApiError`, com os fallbacks descritos na spec §4.4/§12.4. */
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
