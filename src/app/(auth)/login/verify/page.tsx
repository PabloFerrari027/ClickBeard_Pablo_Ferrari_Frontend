import type { Metadata } from "next";

import { AuthCard } from "@/components/shared/auth-card";
import { VerifyCodeForm } from "@/features/auth/components/verify-code-form";

export const metadata: Metadata = {
  title: "Verifique seu e-mail",
  robots: { index: false, follow: false },
};

export default function VerifyCodePage() {
  return (
    <AuthCard title="Verifique seu e-mail">
      <VerifyCodeForm />
    </AuthCard>
  );
}
