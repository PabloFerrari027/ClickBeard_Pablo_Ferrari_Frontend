import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { API_URL } from "@/lib/env";
import { REFRESH_TOKEN_COOKIE } from "@/lib/session-cookie";
import type { RefreshTokenResponse } from "@/types/api";

/**
 * Silent refresh (spec §12.2): lido pelo `api-client` em toda 401, e pelo
 * `AuthProvider` no boot da aplicação. O cookie httpOnly é enviado
 * automaticamente pelo browser; nunca chega a JavaScript no client.
 */
export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!refreshToken) {
    return new NextResponse(null, { status: 401 });
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }

  if (!res.ok) {
    cookieStore.delete(REFRESH_TOKEN_COOKIE);
    return new NextResponse(null, { status: 401 });
  }

  const data = (await res.json()) as RefreshTokenResponse;

  cookieStore.set(REFRESH_TOKEN_COOKIE, data.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(data.refreshTokenExpiresAt),
  });

  return NextResponse.json({
    accessToken: data.accessToken,
    accessTokenExpiresAt: data.accessTokenExpiresAt,
  });
}
