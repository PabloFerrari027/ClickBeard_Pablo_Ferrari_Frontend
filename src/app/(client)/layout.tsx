"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { AppHeader } from "@/components/shared/app-header";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { CLIENT_NAV_ITEMS } from "@/components/shared/nav-items";
import { useAuth } from "@/lib/auth-context";

/** Sidebar + header do cliente, guarda de sessão (spec §6). CLIENT/BARBER/ADMIN autenticados. */
export default function ClientAreaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">Carregando…</span>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen">
      <AppHeader navItems={CLIENT_NAV_ITEMS} homeHref="/" />
      <div className="flex">
        <AppSidebar items={CLIENT_NAV_ITEMS} />
        <main className="min-h-[calc(100vh-4rem)] flex-1 p-4 md:p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
