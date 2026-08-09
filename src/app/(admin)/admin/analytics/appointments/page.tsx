import type { Metadata } from "next";

import { AppointmentsAnalyticsContent } from "@/features/analytics/components/appointments-analytics-content";

export const metadata: Metadata = { title: "Analytics · Agendamentos" };

export default function AdminAppointmentsAnalyticsPage() {
  return <AppointmentsAnalyticsContent />;
}
