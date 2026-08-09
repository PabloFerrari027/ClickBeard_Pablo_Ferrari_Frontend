import type { Metadata } from "next";

import { BarbersGridContent } from "@/features/barbers/components/barbers-grid-content";

export const metadata: Metadata = { title: "Barbeiros" };

export default function BarbersPage() {
  return <BarbersGridContent />;
}
