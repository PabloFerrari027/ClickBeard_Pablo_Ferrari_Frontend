import type { Metadata } from "next";

import { DashboardContent } from "@/features/analytics/components/dashboard-content";

export const metadata: Metadata = { title: "Dashboard" };

export default function AdminDashboardPage() {
  return <DashboardContent />;
}
