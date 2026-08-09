import type { Metadata } from "next";
import { Suspense } from "react";

import { BookingWizard } from "@/features/scheduling/components/booking-wizard";

export const metadata: Metadata = { title: "Novo agendamento" };

export default function BookPage() {
  return (
    <Suspense fallback={null}>
      <BookingWizard />
    </Suspense>
  );
}
