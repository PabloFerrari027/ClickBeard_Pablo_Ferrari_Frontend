"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Scissors, User as UserIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth-context";
import { getInitials } from "@/lib/utils";
import { MobileNav } from "./mobile-nav";
import type { NavItem } from "./nav-item";

interface AppHeaderProps {
  navItems: NavItem[];
  homeHref: string;
}

/** Shared by the (client)/(admin) route groups (spec §8.1). */
export function AppHeader({ navItems, homeHref }: AppHeaderProps) {
  const { user, optimisticUser, logout } = useAuth();
  const router = useRouter();
  const displayUser = user ?? optimisticUser;

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6">
      <div className="flex items-center gap-2">
        <MobileNav items={navItems} onLogout={handleLogout} />
        <Link href={homeHref} className="flex items-center gap-2 font-semibold">
          <Scissors className="size-5 text-secondary" aria-hidden="true" />
          <span className="hidden sm:inline">ClickBeard</span>
        </Link>
      </div>

      {displayUser ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="Menu do usuário"
            >
              <Avatar className="size-9">
                <AvatarFallback>{getInitials(displayUser.name)}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <UserIcon aria-hidden="true" />
                Meu perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleLogout}>
              <LogOut aria-hidden="true" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </header>
  );
}
