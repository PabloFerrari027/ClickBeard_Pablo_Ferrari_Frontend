import { Calendar, Clock, LayoutDashboard, Scissors, Sparkles, User, Users } from "lucide-react";

import type { NavItem } from "./nav-item";

/** Navegação de CLIENT/BARBER, compartilhada entre `(client)/layout.tsx` e a home autenticada. */
export const CLIENT_NAV_ITEMS: NavItem[] = [
  { label: "Meus agendamentos", href: "/appointments", icon: Calendar },
  { label: "Barbeiros", href: "/barbers", icon: Scissors },
  { label: "Qualificações", href: "/qualifications", icon: Sparkles },
  { label: "Meu perfil", href: "/profile", icon: User },
];

/** Navegação ADMIN, compartilhada entre `(admin)/layout.tsx` e a home autenticada. */
export const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Usuários", href: "/admin/users", icon: Users },
  { label: "Barbeiros", href: "/admin/barbers", icon: Scissors },
  { label: "Qualificações", href: "/admin/qualifications", icon: Sparkles },
  { label: "Agendamentos de hoje", href: "/admin/appointments/today", icon: Clock },
  { label: "Agendamentos futuros", href: "/admin/appointments/future", icon: Calendar },
];
