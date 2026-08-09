import { QueryClient } from "@tanstack/react-query";

import { ApiError } from "./api-error";

/**
 * Uma instância por sessão de browser (criada dentro do Provider via `useState`,
 * spec §17). Erros 401/403/404 não devem ser retentados automaticamente —
 * apenas falhas transitórias de rede.
 */
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        retry: (failureCount, error) => {
          if (error instanceof ApiError && error.statusCode < 500) return false;
          return failureCount < 2;
        },
      },
      mutations: {
        retry: false,
      },
    },
  });
}
