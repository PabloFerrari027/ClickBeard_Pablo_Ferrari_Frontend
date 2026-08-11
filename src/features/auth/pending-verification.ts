/**
 * Transient state between /login and /login/verify (spec §12.1): kept in memory,
 * NEVER persisted — if the user reloads the page on /login/verify, this module
 * resets and the screen redirects back to /login (there is no way to recover
 * this from the API without repeating the login).
 */
export interface PendingVerification {
  userId: string;
  email: string;
  name: string;
}

let pending: PendingVerification | null = null;

export function setPendingVerification(value: PendingVerification | null): void {
  pending = value;
}

export function getPendingVerification(): PendingVerification | null {
  return pending;
}
