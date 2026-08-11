import { clsx, type ClassValue } from "clsx"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** pt-BR date/time formatting (spec §11): "dd/MM/yyyy HH:mm". */
export function formatDateTime(iso: string): string {
  return format(new Date(iso), "dd/MM/yyyy HH:mm", { locale: ptBR })
}

/**
 * pt-BR date formatting (spec §11): "dd/MM/yyyy". Reads year/month/day directly from the string
 * instead of `new Date(iso)`, because "date only" values arrive as UTC midnight — converted to the
 * local timezone (e.g. America/Sao_Paulo, UTC-3) that becomes the previous day at 9pm and shows the wrong date.
 */
export function formatDate(iso: string): string {
  const [year, month, day] = iso.slice(0, 10).split("-").map(Number)
  return format(new Date(year, month - 1, day), "dd/MM/yyyy", { locale: ptBR })
}

/** Time only, used in the time slot grid and the "Time" columns (admin). */
export function formatTime(iso: string): string {
  return format(new Date(iso), "HH:mm", { locale: ptBR })
}

/** `cancellationRate`/`occupancyRate` (spec §11): pt-BR percentage, 1 decimal place. */
export function formatPercent(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value)
}

/** Initials from the name for the avatar (spec §18: no photo upload). */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}
