import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { AppointmentStatusBadge } from "@/components/shared/status-badge";
import { BarberName } from "@/features/barbers/components/barber-name";
import { QualificationName } from "@/features/qualifications/components/qualification-name";
import { CustomerName } from "@/features/users/components/customer-name";
import { formatDateTime } from "@/lib/utils";
import type { Appointment } from "@/types/api";

interface AppointmentCardProps {
  appointment: Appointment;
  showCustomer?: boolean;
}

/** Card label/valor usado como fallback mobile do `DataTable` de agendamentos (spec §23). */
export function AppointmentCard({ appointment, showCustomer }: AppointmentCardProps) {
  return (
    <Card>
      <CardContent className="space-y-3 pt-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{formatDateTime(appointment.startAt)}</p>
          <AppointmentStatusBadge status={appointment.status} />
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <Field label="Barbeiro">
            <BarberName barberId={appointment.barberId} />
          </Field>
          <Field label="Qualificação">
            <QualificationName qualificationId={appointment.qualificationId} />
          </Field>
          {showCustomer ? (
            <Field label="Cliente">
              <CustomerName userId={appointment.customerId} />
            </Field>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-xs tracking-wide text-muted-foreground uppercase">{label}</p>
      <div>{children}</div>
    </div>
  );
}
