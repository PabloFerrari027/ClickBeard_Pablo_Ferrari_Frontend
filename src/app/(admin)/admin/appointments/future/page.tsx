import type { Metadata } from "next";

import { AdminFutureAppointmentsContent } from "@/features/scheduling/components/admin-future-appointments-content";

export const metadata: Metadata = { title: "Agendamentos futuros" };

export default function AdminFutureAppointmentsPage() {
  return <AdminFutureAppointmentsContent />;
}
