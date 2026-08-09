import type { Metadata } from "next";

import { ProfileContent } from "@/features/users/components/profile-content";

export const metadata: Metadata = { title: "Meu perfil" };

export default function ProfilePage() {
  return <ProfileContent />;
}
