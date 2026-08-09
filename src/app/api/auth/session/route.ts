import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { API_URL } from "@/lib/env";
import { REFRESH_TOKEN_COOKIE } from "@/lib/session-cookie";

/**
 * Setado pelo client logo após POST /account-verification/complete responder
 * (spec §12.1) — nunca expõe o refresh token a JavaScript.
 */
export async function POST(request: Request) {
  const { refreshToken, refreshTokenExpiresAt } = (await request.json()) as {
    refreshToken?: string;
    refreshTokenExpiresAt?: string;
  };

  if (!refreshToken || !refreshTokenExpiresAt) {
    return NextResponse.json(
      { statusCode: 400, message: "refreshToken é obrigatório", error: "Bad Request" },
      { status: 400 }
    );
  }

  const cookieStore = await cookies();
  cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(refreshTokenExpiresAt),
  });

  return new NextResponse(null, { status: 204 });
}

/** Logout (spec §3.2, §12.1): revoga o refresh token na API e limpa o cookie local. */
export async function DELETE() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (refreshToken) {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // best-effort — a sessão local é limpa de qualquer forma
    }
  }

  cookieStore.delete(REFRESH_TOKEN_COOKIE);
  return new NextResponse(null, { status: 204 });
}
