import Link from "next/link";
import { Scissors } from "lucide-react";
import type { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

/** Card compartilhado por /register, /login, /login/verify (spec §8.4, §13.1-13.3). */
export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <Card>
      <CardHeader className="items-center text-center">
        <Link href="/login" className="mb-2 flex items-center gap-2 text-lg font-semibold">
          <Scissors className="size-6 text-secondary" aria-hidden="true" />
          ClickBeard
        </Link>
        <CardTitle className="text-3xl font-semibold">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}
