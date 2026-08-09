import type { Metadata } from "next";

import { AdminBarberDetailContent } from "@/features/barbers/components/admin-barber-detail-content";

export const metadata: Metadata = { title: "Barbeiro · Admin" };

export default async function AdminBarberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminBarberDetailContent barberId={id} />;
}
