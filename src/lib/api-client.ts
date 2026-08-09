import { ApiError } from "./api-error";
import { getAccessToken, notifySessionExpired, setAccessToken } from "./auth-session";
import { API_URL } from "./env";
import type { ApiErrorBody } from "@/types/domain";

export interface ApiFetchOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  /**
   * Rotas de /auth/* e /account-verification/* nunca disparam o refresh automático
   * em 401, para evitar loop (spec §12.2).
   */
  skipAuthRefresh?: boolean;
}

let refreshInFlight: Promise<string | null> | null = null;

/** Única chamada concorrente a POST /api/auth/refresh (Route Handler local), mesmo com múltiplas 401 simultâneas. */
function refreshAccessToken(): Promise<string | null> {
  if (!refreshInFlight) {
    refreshInFlight = fetch("/api/auth/refresh", { method: "POST" })
      .then(async (res) => {
        if (!res.ok) return null;
        const data = (await res.json()) as {
          accessToken: string;
          accessTokenExpiresAt: string;
        };
        setAccessToken(data.accessToken, data.accessTokenExpiresAt);
        return data.accessToken;
      })
      .catch(() => null)
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

function buildUrl(path: string, query?: ApiFetchOptions["query"]): string {
  const url = new URL(path, API_URL);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

async function toApiError(res: Response): Promise<ApiError> {
  let body: ApiErrorBody;
  try {
    body = (await res.json()) as ApiErrorBody;
  } catch {
    body = {
      statusCode: res.status,
      message: res.statusText || "Erro desconhecido",
      error: res.status === 401 ? "Unauthorized" : res.status === 403 ? "Forbidden" : "Error",
    };
  }
  return ApiError.fromBody(res.status, body);
}

async function performFetch(
  path: string,
  { method = "GET", body, query }: ApiFetchOptions
): Promise<Response> {
  const headers: Record<string, string> = {};
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";

  return fetch(buildUrl(path, query), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

/**
 * Wrapper único de fetch (spec §4.1, §4.4, §12.2): injeta `Authorization`, parseia os
 * dois formatos de erro da API, e enfileira um único refresh em 401 antes de
 * desistir e forçar logout. Nenhum componente `.tsx` chama `fetch` diretamente —
 * toda chamada passa por aqui via um `service`.
 */
export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  let res: Response;
  try {
    res = await performFetch(path, options);
  } catch {
    throw new ApiError(
      0,
      "NetworkError",
      "Não foi possível conectar ao servidor. Verifique sua conexão."
    );
  }

  if (res.status === 401 && !options.skipAuthRefresh) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      try {
        res = await performFetch(path, options);
      } catch {
        throw new ApiError(
          0,
          "NetworkError",
          "Não foi possível conectar ao servidor. Verifique sua conexão."
        );
      }
    } else {
      notifySessionExpired();
      throw new ApiError(401, "Unauthorized", "Sua sessão expirou.");
    }
  }

  if (!res.ok) {
    throw await toApiError(res);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}
