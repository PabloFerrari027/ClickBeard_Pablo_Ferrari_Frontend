"use client";

import { Loader2 } from "lucide-react";

import { AuthenticatedHome } from "@/features/home/components/authenticated-home";
import { PublicHome } from "@/features/home/components/public-home";
import { useAuth } from "@/lib/auth-context";

/** `/` pública: landing para visitantes, dashboard inicial para usuários autenticados (spec §5, §13.4). */
export default function HomePage() {
  const { isLoading, isAuthenticated, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">Carregando…</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) return <PublicHome />;

  return <AuthenticatedHome user={user} />;
}
