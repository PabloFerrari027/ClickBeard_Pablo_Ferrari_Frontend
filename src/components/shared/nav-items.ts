import { Calendar, Clock, Home, LayoutDashboard, Scissors, Sparkles, User, Users } from "lucide-react";

import type { NavItem } from "./nav-item";

/** CLIENT navigation, shared between `(client)/layout.tsx` and the dashboard (`/dashboard`). No "Qualifications": the client already picks the qualification within the booking flow, a separate catalog has no use for them. */
export const CLIENT_NAV_ITEMS: NavItem[] = [
  { label: "Início", href: "/dashboard", icon: Home },
  { label: "Meus agendamentos", href: "/appointments", icon: Calendar },
  { label: "Barbeiros", href: "/barbers", icon: Scissors },
  { label: "Meu perfil", href: "/profile", icon: User },
];

/** BARBER navigation, shared between `(client)/layout.tsx` and the dashboard (`/dashboard`). */
export const BARBER_NAV_ITEMS: NavItem[] = [
  { label: "Início", href: "/dashboard", icon: Home },
  { label: "Meus agendamentos", href: "/appointments", icon: Calendar },
  { label: "Barbeiros", href: "/barbers", icon: Scissors },
  { label: "Qualificações", href: "/qualifications", icon: Sparkles },
  { label: "Meu perfil", href: "/profile", icon: User },
];

/** ADMIN navigation, shared between `(admin)/layout.tsx` and the dashboard (`/dashboard`). */
export const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: "Início", href: "/dashboard", icon: Home },
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Usuários", href: "/admin/users", icon: Users },
  { label: "Barbeiros", href: "/admin/barbers", icon: Scissors },
  { label: "Qualificações", href: "/admin/qualifications", icon: Sparkles },
  { label: "Agendamentos de hoje", href: "/admin/appointments/today", icon: Clock },
  { label: "Agendamentos futuros", href: "/admin/appointments/future", icon: Calendar },
];
