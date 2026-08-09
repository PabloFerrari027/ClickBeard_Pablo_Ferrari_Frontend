import type { Metadata } from "next";

import { AdminQualificationsTableContent } from "@/features/qualifications/components/admin-qualifications-table-content";

export const metadata: Metadata = { title: "Qualificações · Admin" };

export default function AdminQualificationsPage() {
  return <AdminQualificationsTableContent />;
}
