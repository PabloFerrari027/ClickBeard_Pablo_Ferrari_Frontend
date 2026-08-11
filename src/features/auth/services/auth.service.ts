import { apiFetch } from "@/lib/api-client";
import type {
  CompleteVerificationResponse,
  LoginResponse,
  ValidateCodeResponse,
} from "@/types/api";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  birthDate?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ValidateCodePayload {
  userId: string;
  code: string;
}

export interface CompleteVerificationPayload {
  userId: string;
}

/**
 * /auth/* and /account-verification/* routes — always with `skipAuthRefresh: true`
 * (spec §12.2) to never trigger the refresh interceptor in a loop.
 */
export const authService = {
  register(payload: RegisterPayload): Promise<void> {
    return apiFetch<void>("/users", {
      method: "POST",
      body: payload,
      skipAuthRefresh: true,
    });
  },

  login(payload: LoginPayload): Promise<LoginResponse> {
    return apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: payload,
      skipAuthRefresh: true,
    });
  },

  resendCode(userId: string): Promise<void> {
    return apiFetch<void>("/account-verification/resend", {
      method: "POST",
      body: { userId },
      skipAuthRefresh: true,
    });
  },

  validateCode(payload: ValidateCodePayload): Promise<ValidateCodeResponse> {
    return apiFetch<ValidateCodeResponse>("/account-verification/validate", {
      method: "POST",
      body: payload,
      skipAuthRefresh: true,
    });
  },

  completeVerification(
    payload: CompleteVerificationPayload
  ): Promise<CompleteVerificationResponse> {
    return apiFetch<CompleteVerificationResponse>(
      "/account-verification/complete",
      {
        method: "POST",
        body: payload,
        skipAuthRefresh: true,
      }
    );
  },
};
