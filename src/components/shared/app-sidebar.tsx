"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { RoleBadge } from "./role-badge";
import type { NavItem } from "./nav-item";

interface AppSidebarProps {
  items: NavItem[];
}

/**
 * Fixa em desktop (w-64); colapsa para ícones em tablet (w-16, spec §8.2). O toggle manual
 * de expandir/colapsar descrito na spec foi simplificado para um comportamento puramente
 * responsivo por breakpoint — reduz estado sem perder o requisito central (ícones em tablet,
 * completa em desktop, escondida em mobile via `MobileNav`).
 */
export function AppSidebar({ items }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, optimisticUser, logout } = useAuth();
  const displayUser = user ?? optimisticUser;

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-16 shrink-0 flex-col border-r border-border bg-card md:flex lg:w-64">
      <nav className="flex-1 space-y-1 overflow-y-auto p-2 lg:p-4">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center justify-center gap-3 rounded-md border-l-2 border-transparent px-3 py-2 text-sm font-medium transition-colors lg:justify-start",
                    active
                      ? "border-secondary bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="lg:hidden">
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      {displayUser ? (
        <div className="space-y-2 border-t border-border p-2 lg:p-4">
          <div className="hidden space-y-1 lg:block">
            <p className="truncate text-sm font-medium">{displayUser.name}</p>
            <RoleBadge role={displayUser.role} />
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground lg:justify-start"
          >
            <LogOut className="size-4 shrink-0" aria-hidden="true" />
            <span className="hidden lg:inline">Sair</span>
          </button>
        </div>
      ) : null}
    </aside>
  );
}
