"use client";

import { useState } from "react";

import { useTodayAppointments } from "../hooks/use-today-appointments";
import { AdminAppointmentsListContent } from "./admin-appointments-list-content";

export function AdminTodayAppointmentsContent() {
  const [page, setPage] = useState(1);
  const query = useTodayAppointments(page);

  return (
    <AdminAppointmentsListContent
      title="Agendamentos de hoje"
      emptyTitle="Nenhum agendamento hoje"
      query={query}
      onPageChange={setPage}
    />
  );
}
