import { clsx, type ClassValue } from "clsx"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Formatação de data/hora pt-BR (spec §11): "dd/MM/yyyy HH:mm". */
export function formatDateTime(iso: string): string {
  return format(new Date(iso), "dd/MM/yyyy HH:mm", { locale: ptBR })
}

/**
 * Formatação de data pt-BR (spec §11): "dd/MM/yyyy". Lê ano/mês/dia direto da string em vez de
 * `new Date(iso)`, porque valores "só data" chegam como meia-noite UTC — convertidos para o fuso
 * local (ex.: America/Sao_Paulo, UTC-3) isso vira o dia anterior às 21h e exibe a data errada.
 */
export function formatDate(iso: string): string {
  const [year, month, day] = iso.slice(0, 10).split("-").map(Number)
  return format(new Date(year, month - 1, day), "dd/MM/yyyy", { locale: ptBR })
}

/** Apenas o horário, usado na grade de horários e nas colunas "Horário" (admin). */
export function formatTime(iso: string): string {
  return format(new Date(iso), "HH:mm", { locale: ptBR })
}

/** `cancellationRate`/`occupancyRate` (spec §11): percentual pt-BR, 1 casa decimal. */
export function formatPercent(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value)
}

/** Iniciais do nome para avatar (spec §18: não há upload de foto). */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}
