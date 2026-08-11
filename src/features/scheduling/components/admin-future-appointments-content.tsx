"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useFutureAppointments } from "../hooks/use-future-appointments";
import type { FutureAppointmentsPeriod } from "../services/appointments.service";
import { AdminAppointmentsListContent } from "./admin-appointments-list-content";
import { AppointmentsPeriodFilter } from "./appointments-period-filter";

/** `/future` includes cancelled appointments that are still in the future (spec §13.18) — the Status column makes this visible. */
export function AdminFutureAppointmentsContent() {
  const [page, setPage] = useState(1);
  const [period, setPeriod] = useState<FutureAppointmentsPeriod>({});
  const query = useFutureAppointments(page, period);
  const hasPeriodFilter = Boolean(period.startAt || period.endAt);

  function handlePeriodChange(next: FutureAppointmentsPeriod) {
    setPeriod(next);
    setPage(1);
  }

  return (
    <AdminAppointmentsListContent
      title="Agendamentos futuros"
      description="Inclui agendamentos já cancelados que ainda estão no futuro."
      emptyTitle={
        hasPeriodFilter ? "Nenhum agendamento no período selecionado" : "Nenhum agendamento futuro"
      }
      emptyDescription={
        hasPeriodFilter ? "Tente ajustar as datas ou limpar o filtro de período." : undefined
      }
      emptyAction={
        hasPeriodFilter ? (
          <Button variant="outline" onClick={() => handlePeriodChange({})}>
            Limpar filtro
          </Button>
        ) : undefined
      }
      query={query}
      onPageChange={setPage}
      filter={
        <AppointmentsPeriodFilter
          key={`${period.startAt ?? ""}_${period.endAt ?? ""}`}
          value={period}
          onChange={handlePeriodChange}
        />
      }
    />
  );
}
