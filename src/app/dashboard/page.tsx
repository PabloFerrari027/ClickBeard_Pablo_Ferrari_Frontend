"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { AuthenticatedHome } from "@/features/home/components/authenticated-home";
import { useAuth } from "@/lib/auth-context";

/** `/dashboard`: painel inicial pós-login (CLIENT/BARBER/ADMIN), guarda de sessão — redireciona visitantes para `/login`. */
export default function DashboardPage() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">Carregando…</span>
      </div>
    );
  }

  return <AuthenticatedHome user={user} />;
}
