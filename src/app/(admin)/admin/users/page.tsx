import type { Metadata } from "next";

import { AdminUsersTableContent } from "@/features/users/components/admin-users-table-content";

export const metadata: Metadata = { title: "Usuários · Admin" };

export default function AdminUsersPage() {
  return <AdminUsersTableContent />;
}
