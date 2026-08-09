"use client";

import { useTodayAppointments } from "../hooks/use-today-appointments";
import { AdminAppointmentsListContent } from "./admin-appointments-list-content";

export function AdminTodayAppointmentsContent() {
  return (
    <AdminAppointmentsListContent
      title="Agendamentos de hoje"
      emptyTitle="Nenhum agendamento hoje"
      useAppointmentsQuery={useTodayAppointments}
    />
  );
}
