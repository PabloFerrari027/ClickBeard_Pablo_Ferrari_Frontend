import type { UserRole } from "@/types/domain";

/**
 * NON-httpOnly convenience cookie (spec §12.1): stores `{id,name,email,role}`
 * only for immediate header/sidebar rendering before the silent refresh
 * completes. Never used as a real authorization source — every protected
 * call relies on the access token held valid in memory.
 */
const USER_COOKIE = "clickbeard_user";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export interface ConvenienceUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export function readUserCookie(): ConvenienceUser | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${USER_COOKIE}=([^;]*)`)
  );
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1])) as ConvenienceUser;
  } catch {
    return null;
  }
}

export function writeUserCookie(user: ConvenienceUser): void {
  if (typeof document === "undefined") return;
  const value = encodeURIComponent(
    JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    })
  );
  document.cookie = `${USER_COOKIE}=${value}; path=/; samesite=lax; max-age=${MAX_AGE_SECONDS}`;
}

export function clearUserCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${USER_COOKIE}=; path=/; max-age=0`;
}
