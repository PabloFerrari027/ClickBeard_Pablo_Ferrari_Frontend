import type { UserRole } from "@/types/domain";

/**
 * Cookie NÃO-httpOnly de conveniência (spec §12.1): guarda `{id,name,email,role}`
 * apenas para renderização imediata do header/sidebar antes do silent refresh
 * completar. Nunca é usado como fonte de autorização real — toda chamada
 * protegida depende do access token válido em memória.
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
