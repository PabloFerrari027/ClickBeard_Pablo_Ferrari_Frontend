import { QueryClient } from "@tanstack/react-query";

import { ApiError } from "./api-error";

/**
 * One instance per browser session (created inside the Provider via `useState`,
 * spec §17). 401/403/404 errors should not be retried automatically —
 * only transient network failures.
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
