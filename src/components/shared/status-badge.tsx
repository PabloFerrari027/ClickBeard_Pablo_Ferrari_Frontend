import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { APPOINTMENT_SLOT_MINUTES } from "@/lib/business-rules";
import type { AppointmentStatus } from "@/types/domain";

/**
 * The API never marks an appointment as completed (only SCHEDULED/CANCELLED) — "Completed" is
 * a label derived on the client by comparing the slot's end time with the local clock.
 */
function isAppointmentOver(startAt: string): boolean {
  const endAt = new Date(startAt).getTime() + APPOINTMENT_SLOT_MINUTES * 60 * 1000;
  return endAt <= Date.now();
}

/** SCHEDULED (future) → success; SCHEDULED (past) → completed; CANCELLED → outline (spec §7.1). */
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

/** Account `active:false` → muted (spec §7.1). */
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

/** "Less than 2h remaining" alert (spec §7.1: warning). */
export function WarningBadge({ children }: { children: React.ReactNode }) {
  return (
    <Badge className="border-transparent bg-warning text-warning-foreground hover:bg-warning">
      {children}
    </Badge>
  );
}
