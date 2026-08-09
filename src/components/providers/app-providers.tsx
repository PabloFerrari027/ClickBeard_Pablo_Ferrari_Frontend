"use client";

import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import { makeQueryClient } from "@/lib/query-client";

/**
 * Composição de providers do root layout (spec §4.3, §6): `AuthProvider` expõe
 * `{user, accessToken, isLoading, login, logout}` via Context; `QueryClientProvider`
 * dá cache/loading/erro padronizados a todo hook de feature; `Toaster` é o único
 * mecanismo de feedback assíncrono (spec §16). Dark mode não é um requisito de
 * produto (spec §7.1) — `ThemeProvider` fica travado em "light", apenas para o
 * `sonner` resolver seu tema sem warning.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            {children}
            <Toaster richColors position="top-right" />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
