import type { Metadata } from "next";

import { BarbersAnalyticsContent } from "@/features/analytics/components/barbers-analytics-content";

export const metadata: Metadata = { title: "Analytics · Barbeiros" };

export default function AdminBarbersAnalyticsPage() {
  return <BarbersAnalyticsContent />;
}
