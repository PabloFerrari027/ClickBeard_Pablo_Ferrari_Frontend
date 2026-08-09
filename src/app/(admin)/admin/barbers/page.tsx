import type { Metadata } from "next";

import { AdminBarbersTableContent } from "@/features/barbers/components/admin-barbers-table-content";

export const metadata: Metadata = { title: "Barbeiros · Admin" };

export default function AdminBarbersPage() {
  return <AdminBarbersTableContent />;
}
