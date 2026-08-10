"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/shared/otp-input";
import { ApiError } from "@/lib/api-error";
import { MAX_VERIFICATION_CODE_ATTEMPTS, RESEND_CODE_COOLDOWN_SECONDS } from "@/lib/business-rules";
import { useResendCode } from "../hooks/use-resend-code";
import { useVerifyCode } from "../hooks/use-verify-code";
import { getPendingVerification, setPendingVerification } from "../pending-verification";

function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!domain) return email;
  const visible = user.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(user.length - 2, 1))}@${domain}`;
}

export function VerifyCodeForm() {
  const router = useRouter();
  const [pending] = useState(() => getPendingVerification());

  const [code, setCode] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [codeBlocked, setCodeBlocked] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const verifyCode = useVerifyCode();
  const resendCode = useResendCode();

  useEffect(() => {
    if (!pending) {
      router.replace("/login");
    }
  }, [pending, router]);

  useEffect(() => {
    if (!cooldownUntil) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [cooldownUntil]);

  if (!pending) return null;

  const { userId, email } = pending;
  const cooldownRemaining = cooldownUntil ? Math.max(0, Math.ceil((cooldownUntil - now) / 1000)) : 0;

  function handleComplete(value: string) {
    setErrorMessage(null);
    verifyCode.mutate(
      { userId, code: value },
      {
        onSuccess: () => {
          setPendingVerification(null);
          router.push("/dashboard");
        },
        onError: (error) => {
          if (error instanceof ApiError) {
            if (
              error.code === "VerificationCodeNotFoundError" ||
              error.code === "VerificationCodeExpiredError"
            ) {
              setErrorMessage("Código expirado ou inexistente. Solicite um novo.");
              setCodeBlocked(true);
              return;
            }
            if (error.code === "VerificationCodeAttemptsExceededError") {
              setErrorMessage("Número máximo de tentativas excedido. Solicite um novo código.");
              setCodeBlocked(true);
              return;
            }
            if (error.code === "InvalidVerificationCodeError") {
              const nextAttempts = Math.min(attempts + 1, MAX_VERIFICATION_CODE_ATTEMPTS);
              setAttempts(nextAttempts);
              setCode("");
              setErrorMessage(
                `Código incorreto. Tentativa ${nextAttempts} de ${MAX_VERIFICATION_CODE_ATTEMPTS}`
              );
              return;
            }
          }
          setCode("");
          toast.error("Não foi possível concluir o login. Tente novamente.");
        },
      }
    );
  }

  function handleResend() {
    resendCode.mutate(userId, {
      onSuccess: () => {
        toast.success("Novo código enviado");
        setAttempts(0);
        setCode("");
        setErrorMessage(null);
        setCodeBlocked(false);
        setCooldownUntil(Date.now() + RESEND_CODE_COOLDOWN_SECONDS * 1000);
      },
      onError: () => {
        toast.error("Não foi possível reenviar o código. Tente novamente.");
      },
    });
  }

  const isPending = verifyCode.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Mail className="size-4" aria-hidden="true" />
        Enviamos um código para {maskEmail(email)}
      </div>

      <OtpInput
        value={code}
        onChange={setCode}
        onComplete={handleComplete}
        disabled={isPending || codeBlocked}
        hasError={Boolean(errorMessage)}
      />

      <div aria-live="polite" className="min-h-5 text-center text-sm">
        {isPending ? (
          <span className="inline-flex items-center gap-2 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Verificando…
          </span>
        ) : errorMessage ? (
          <span className="text-destructive">{errorMessage}</span>
        ) : null}
      </div>

      <Button
        type="button"
        variant={codeBlocked ? "default" : "outline"}
        className="w-full"
        disabled={resendCode.isPending || cooldownRemaining > 0}
        onClick={handleResend}
      >
        {resendCode.isPending ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
        {cooldownRemaining > 0 ? `Reenviar código (${cooldownRemaining}s)` : "Reenviar código"}
      </Button>
    </div>
  );
}
