"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { AppHeader } from "@/components/shared/app-header";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { ADMIN_NAV_ITEMS } from "@/components/shared/nav-items";
import { useAuth } from "@/lib/auth-context";

/**
 * Sidebar admin, guarda de role ADMIN (spec §4.3, §6, §12.3) — defesa em profundidade de UX,
 * nunca a fonte real de autorização (isso está 100% no backend).
 */
export default function AdminAreaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (user && user.role !== "ADMIN") {
      toast.error("Acesso restrito a administradores.");
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !user || user.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">Carregando…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AppHeader navItems={ADMIN_NAV_ITEMS} homeHref="/" />
      <div className="flex">
        <AppSidebar items={ADMIN_NAV_ITEMS} />
        <main className="min-h-[calc(100vh-4rem)] flex-1 p-4 md:p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
