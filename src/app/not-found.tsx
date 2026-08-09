import Link from "next/link";
import { FileQuestion } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <FileQuestion className="size-12 text-muted-foreground" aria-hidden="true" />
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Página não encontrada</h1>
        <p className="text-sm text-muted-foreground">
          A página que você procura não existe ou foi movida.
        </p>
      </div>
      <Button asChild>
        <Link href="/">Voltar ao início</Link>
      </Button>
    </div>
  );
}
