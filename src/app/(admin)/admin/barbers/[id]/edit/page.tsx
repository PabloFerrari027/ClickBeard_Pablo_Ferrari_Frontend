import type { Metadata } from "next";

import { EditBarberContent } from "@/features/barbers/components/edit-barber-content";

export const metadata: Metadata = { title: "Editar barbeiro" };

export default async function EditBarberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditBarberContent barberId={id} />;
}
