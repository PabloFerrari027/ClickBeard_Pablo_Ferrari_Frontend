"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { usersService } from "@/features/users/services/users.service";
import {
  clearAccessToken,
  getAccessTokenExpiresAt,
  onSessionExpired,
  setAccessToken,
} from "./auth-session";
import {
  clearUserCookie,
  readUserCookie,
  writeUserCookie,
  type ConvenienceUser,
} from "./user-cookie";
import type { CompleteVerificationResponse, User } from "@/types/api";

interface AuthContextValue {
  /** Usuário confirmado pela última chamada a `GET /users/:id` (fonte de verdade para role/active). */
  user: User | null;
  /** Preenchido a partir do cookie de conveniência para pintar header/sidebar antes do silent refresh (spec §12.1). */
  optimisticUser: ConvenienceUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  establishSession: (
    tokens: CompleteVerificationResponse,
    userId: string
  ) => Promise<User>;
  /** Sincroniza `user`/`optimisticUser`/cookie após uma edição bem-sucedida (ex.: `PATCH /users/:id/profile`). */
  updateUser: (user: User) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Refresh proativo ~1min antes de expirar (spec §12.2), dado o TTL curto de 15min do access token. */
const PROACTIVE_REFRESH_LEAD_MS = 60_000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [optimisticUser, setOptimisticUser] = useState<ConvenienceUser | null>(
    () => readUserCookie()
  );
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Quebra a referência circular entre scheduleProactiveRefresh e silentRefresh — lido
  // apenas dentro do callback do setTimeout (evento assíncrono), nunca durante o render.
  const silentRefreshRef = useRef<() => Promise<boolean>>(() => Promise.resolve(false));

  const scheduleProactiveRefresh = useCallback(() => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    const expiresAt = getAccessTokenExpiresAt();
    if (!expiresAt) return;
    const delay =
      new Date(expiresAt).getTime() - Date.now() - PROACTIVE_REFRESH_LEAD_MS;
    if (delay <= 0) return;
    refreshTimerRef.current = setTimeout(() => {
      void silentRefreshRef.current();
    }, delay);
  }, []);

  const silentRefresh = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/refresh", { method: "POST" });
      if (!res.ok) throw new Error("refresh failed");
      const data = (await res.json()) as {
        accessToken: string;
        accessTokenExpiresAt: string;
      };
      setAccessToken(data.accessToken, data.accessTokenExpiresAt);
      scheduleProactiveRefresh();
      return true;
    } catch {
      clearAccessToken();
      clearUserCookie();
      setUser(null);
      setOptimisticUser(null);
      return false;
    }
  }, [scheduleProactiveRefresh]);

  useEffect(() => {
    silentRefreshRef.current = silentRefresh;
  }, [silentRefresh]);

  useEffect(() => {
    let active = true;

    (async () => {
      const ok = await silentRefresh();
      if (!active) return;

      if (ok) {
        const cached = readUserCookie();
        if (cached) {
          try {
            const fresh = await usersService.getById(cached.id);
            if (active) {
              setUser(fresh);
              writeUserCookie(fresh);
            }
          } catch {
            // Mantém apenas o optimisticUser da cookie; a próxima chamada autenticada revalida.
          }
        }
      }

      if (active) setIsLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [silentRefresh]);

  useEffect(() => {
    return onSessionExpired(() => {
      setUser(null);
      setOptimisticUser(null);
      clearUserCookie();
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    });
  }, []);

  const establishSession = useCallback(
    async (
      tokens: CompleteVerificationResponse,
      userId: string
    ): Promise<User> => {
      setAccessToken(tokens.accessToken, tokens.accessTokenExpiresAt);

      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refreshToken: tokens.refreshToken,
          refreshTokenExpiresAt: tokens.refreshTokenExpiresAt,
        }),
      });

      const fullUser = await usersService.getById(userId);
      setUser(fullUser);
      setOptimisticUser(fullUser);
      writeUserCookie(fullUser);
      scheduleProactiveRefresh();

      return fullUser;
    },
    [scheduleProactiveRefresh]
  );

  const updateUser = useCallback((updated: User) => {
    setUser(updated);
    setOptimisticUser(updated);
    writeUserCookie(updated);
  }, []);

  const logout = useCallback(async () => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    await fetch("/api/auth/session", { method: "DELETE" }).catch(() => {});
    clearAccessToken();
    clearUserCookie();
    setUser(null);
    setOptimisticUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      optimisticUser,
      isLoading,
      isAuthenticated: user !== null,
      establishSession,
      updateUser,
      logout,
    }),
    [user, optimisticUser, isLoading, establishSession, updateUser, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
