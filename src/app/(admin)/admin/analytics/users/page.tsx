import type { Metadata } from "next";

import { UsersAnalyticsContent } from "@/features/analytics/components/users-analytics-content";

export const metadata: Metadata = { title: "Analytics · Usuários" };

export default function AdminUsersAnalyticsPage() {
  return <UsersAnalyticsContent />;
}
