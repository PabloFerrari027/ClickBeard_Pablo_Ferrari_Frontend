import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { getInitials } from "@/lib/utils";
import type { Barber } from "@/types/api";

const MAX_VISIBLE_QUALIFICATIONS = 3;

interface BarberCardProps {
  barber: Barber;
  href: string;
  actionLabel?: string;
}

/** Card de barbeiro reusado na listagem cliente e na listagem admin em grid (spec §13.6). */
export function BarberCard({ barber, href, actionLabel = "Ver detalhes" }: BarberCardProps) {
  const visible = barber.qualifications.slice(0, MAX_VISIBLE_QUALIFICATIONS);
  const extra = barber.qualifications.length - visible.length;

  return (
    <Card>
      <CardHeader className="flex-row items-center gap-3">
        <Avatar className="size-12">
          <AvatarFallback>{getInitials(barber.name)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{barber.name}</p>
          <p className="text-sm text-muted-foreground">{barber.age} anos</p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-1.5">
        {visible.map((qualification) => (
          <Badge key={qualification.id} variant="secondary">
            {qualification.name}
          </Badge>
        ))}
        {extra > 0 ? <Badge variant="outline">+{extra}</Badge> : null}
        {barber.qualifications.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem qualificações cadastradas</p>
        ) : null}
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={href}>{actionLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
