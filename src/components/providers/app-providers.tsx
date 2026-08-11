"use client";

import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import { makeQueryClient } from "@/lib/query-client";

/**
 * Root layout provider composition (spec §4.3, §6): `AuthProvider` exposes
 * `{user, accessToken, isLoading, login, logout}` via Context; `QueryClientProvider`
 * gives every feature hook standardized cache/loading/error handling; `Toaster` is the
 * single async feedback mechanism (spec §16). Dark mode is not a product
 * requirement (spec §7.1) — `ThemeProvider` stays locked to "light", solely so
 * `sonner` can resolve its theme without a warning.
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
