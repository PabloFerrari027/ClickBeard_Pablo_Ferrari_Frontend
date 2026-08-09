import type { Metadata } from "next";

import { MyAppointmentsContent } from "@/features/scheduling/components/my-appointments-content";

export const metadata: Metadata = { title: "Meus agendamentos" };

export default function AppointmentsPage() {
  return <MyAppointmentsContent />;
}
