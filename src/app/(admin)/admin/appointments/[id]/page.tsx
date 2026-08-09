import type { Metadata } from "next";

import { AdminAppointmentDetailContent } from "@/features/scheduling/components/admin-appointment-detail-content";

export const metadata: Metadata = { title: "Agendamento · Admin" };

export default async function AdminAppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminAppointmentDetailContent appointmentId={id} />;
}
