import type { Metadata } from "next";

import { BarberDetailContent } from "@/features/barbers/components/barber-detail-content";

export const metadata: Metadata = { title: "Barbeiro" };

export default async function BarberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BarberDetailContent barberId={id} />;
}
