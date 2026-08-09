import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AppointmentStatus } from "@/types/domain";

/** SCHEDULED → success; CANCELLED → contorno, não preenchido (spec §7.1). */
export function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
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
