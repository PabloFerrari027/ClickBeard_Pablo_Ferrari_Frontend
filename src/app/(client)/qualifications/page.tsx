import type { Metadata } from "next";

import { QualificationsListContent } from "@/features/qualifications/components/qualifications-list-content";

export const metadata: Metadata = { title: "Qualificações" };

export default function QualificationsPage() {
  return <QualificationsListContent />;
}
