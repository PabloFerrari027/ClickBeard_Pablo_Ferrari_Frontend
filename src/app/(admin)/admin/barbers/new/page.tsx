import type { Metadata } from "next";

import { CreateBarberContent } from "@/features/barbers/components/create-barber-content";

export const metadata: Metadata = { title: "Novo barbeiro" };

export default function NewBarberPage() {
  return <CreateBarberContent />;
}
