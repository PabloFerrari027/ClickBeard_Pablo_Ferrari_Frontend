import type { Metadata } from "next";

import { AuthCard } from "@/components/shared/auth-card";
import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = {
  title: "Criar conta",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <AuthCard title="Criar conta" description="Comece a agendar em segundos">
      <RegisterForm />
    </AuthCard>
  );
}
