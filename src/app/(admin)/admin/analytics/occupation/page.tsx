import type { Metadata } from "next";

import { OccupationAnalyticsContent } from "@/features/analytics/components/occupation-analytics-content";

export const metadata: Metadata = { title: "Analytics · Ocupação" };

export default function AdminOccupationAnalyticsPage() {
  return <OccupationAnalyticsContent />;
}
