import type { Metadata } from "next";

import { AppointmentDetailContent } from "@/features/scheduling/components/appointment-detail-content";

export const metadata: Metadata = { title: "Agendamento" };

export default async function AppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AppointmentDetailContent appointmentId={id} />;
}
