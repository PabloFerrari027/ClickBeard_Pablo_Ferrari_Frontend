import { Badge } from "@/components/ui/badge";
import type { UserRole } from "@/types/domain";

const ROLE_LABELS: Record<UserRole, string> = {
  CLIENT: "Cliente",
  BARBER: "Barbeiro",
  ADMIN: "Administrador",
};

export function RoleBadge({ role }: { role: UserRole }) {
  return <Badge variant="secondary">{ROLE_LABELS[role]}</Badge>;
}
