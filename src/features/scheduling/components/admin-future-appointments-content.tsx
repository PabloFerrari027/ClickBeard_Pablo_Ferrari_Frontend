"use client";

import { useFutureAppointments } from "../hooks/use-future-appointments";
import { AdminAppointmentsListContent } from "./admin-appointments-list-content";

/** `/future` inclui cancelados que ainda estão no futuro (spec §13.18) — coluna Status deixa isso visível. */
export function AdminFutureAppointmentsContent() {
  return (
    <AdminAppointmentsListContent
      title="Agendamentos futuros"
      description="Inclui agendamentos já cancelados que ainda estão no futuro."
      emptyTitle="Nenhum agendamento futuro"
      useAppointmentsQuery={useFutureAppointments}
    />
  );
}
