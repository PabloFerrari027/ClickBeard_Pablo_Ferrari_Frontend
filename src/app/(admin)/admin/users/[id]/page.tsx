import type { Metadata } from "next";

import { UserDetailContent } from "@/features/users/components/user-detail-content";

export const metadata: Metadata = { title: "Usuário" };

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <UserDetailContent userId={id} />;
}
