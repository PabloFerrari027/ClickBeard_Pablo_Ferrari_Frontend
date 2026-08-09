import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthCard } from "@/components/shared/auth-card";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Entrar",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <AuthCard title="Entrar" description="Acesse sua conta ClickBeard">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
