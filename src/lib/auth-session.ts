/**
 * Estado de sessão em memória, fora do React (spec §12.1: access token nunca em
 * localStorage/cookie legível por JS). `api-client.ts` e `auth-context.tsx`
 * compartilham este módulo para não criar dependência circular entre um
 * `service` (que nunca importa React, spec §22) e o Context.
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

/** `AuthProvider` se inscreve para reagir a uma falha de refresh (logout forçado + redirect, spec §12.2). */
export function onSessionExpired(listener: Listener): () => void {
  sessionExpiredListeners.add(listener);
  return () => sessionExpiredListeners.delete(listener);
}

export function notifySessionExpired(): void {
  clearAccessToken();
  sessionExpiredListeners.forEach((listener) => listener());
}
