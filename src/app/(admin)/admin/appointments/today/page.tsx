import type { Metadata } from "next";

import { AdminTodayAppointmentsContent } from "@/features/scheduling/components/admin-today-appointments-content";

export const metadata: Metadata = { title: "Agendamentos de hoje" };

export default function AdminTodayAppointmentsPage() {
  return <AdminTodayAppointmentsContent />;
}
