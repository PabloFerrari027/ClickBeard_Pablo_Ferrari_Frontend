import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { APPOINTMENT_SLOT_MINUTES } from "@/lib/business-rules";
import type { AppointmentStatus } from "@/types/domain";

/**
 * A API nunca marca um agendamento como concluído (só SCHEDULED/CANCELLED) — "Concluído" é
 * um rótulo derivado no cliente comparando o fim do slot com o relógio local.
 */
function isAppointmentOver(startAt: string): boolean {
  const endAt = new Date(startAt).getTime() + APPOINTMENT_SLOT_MINUTES * 60 * 1000;
  return endAt <= Date.now();
}

/** SCHEDULED (futuro) → success; SCHEDULED (passado) → concluído; CANCELLED → contorno (spec §7.1). */
export function AppointmentStatusBadge({
  status,
  startAt,
}: {
  status: AppointmentStatus;
  startAt: string;
}) {
  if (status === "SCHEDULED" && isAppointmentOver(startAt)) {
    return <Badge variant="secondary">Concluído</Badge>;
  }
  if (status === "SCHEDULED") {
    return (
      <Badge className="border-transparent bg-success text-success-foreground hover:bg-success">
        Agendado
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-muted-foreground">
      Cancelado
    </Badge>
  );
}

/** Conta `active:false` → muted (spec §7.1). */
export function ActiveStatusBadge({ active }: { active: boolean }) {
  return (
    <Badge
      variant={active ? "default" : "outline"}
      className={cn(!active && "text-muted-foreground")}
    >
      {active ? "Ativo" : "Inativo"}
    </Badge>
  );
}

/** Alerta de "faltam menos de 2h" (spec §7.1: warning). */
export function WarningBadge({ children }: { children: React.ReactNode }) {
  return (
    <Badge className="border-transparent bg-warning text-warning-foreground hover:bg-warning">
      {children}
    </Badge>
  );
}
