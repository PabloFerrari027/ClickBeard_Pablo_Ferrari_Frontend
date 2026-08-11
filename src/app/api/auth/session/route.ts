import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { API_URL } from "@/lib/env";
import { REFRESH_TOKEN_COOKIE } from "@/lib/session-cookie";

/**
 * Set by the client right after POST /account-verification/complete responds
 * (spec §12.1) — never exposes the refresh token to JavaScript.
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

/** Logout (spec §3.2, §12.1): revokes the refresh token on the API and clears the local cookie. */
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
      // best-effort — the local session is cleared either way
    }
  }

  cookieStore.delete(REFRESH_TOKEN_COOKIE);
  return new NextResponse(null, { status: 204 });
}
