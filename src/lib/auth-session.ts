/**
 * In-memory session state, outside React (spec §12.1: access token never in
 * localStorage/JS-readable cookie). `api-client.ts` and `auth-context.tsx`
 * share this module to avoid creating a circular dependency between a
 * `service` (which never imports React, spec §22) and the Context.
 */

type Listener = () => void;

let accessToken: string | null = null;
let accessTokenExpiresAt: string | null = null;
const sessionExpiredListeners = new Set<Listener>();

export function getAccessToken(): string | null {
  return accessToken;
}

export function getAccessTokenExpiresAt(): string | null {
  return accessTokenExpiresAt;
}

export function setAccessToken(
  token: string | null,
  expiresAt: string | null = null
): void {
  accessToken = token;
  accessTokenExpiresAt = expiresAt;
}

export function clearAccessToken(): void {
  accessToken = null;
  accessTokenExpiresAt = null;
}

/** `AuthProvider` subscribes to react to a refresh failure (forced logout + redirect, spec §12.2). */
export function onSessionExpired(listener: Listener): () => void {
  sessionExpiredListeners.add(listener);
  return () => sessionExpiredListeners.delete(listener);
}

export function notifySessionExpired(): void {
  clearAccessToken();
  sessionExpiredListeners.forEach((listener) => listener());
}
