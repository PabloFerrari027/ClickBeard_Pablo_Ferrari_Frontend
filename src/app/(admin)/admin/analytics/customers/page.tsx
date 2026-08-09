import type { Metadata } from "next";

import { CustomersAnalyticsContent } from "@/features/analytics/components/customers-analytics-content";

export const metadata: Metadata = { title: "Analytics · Clientes" };

export default function AdminCustomersAnalyticsPage() {
  return <CustomersAnalyticsContent />;
}
