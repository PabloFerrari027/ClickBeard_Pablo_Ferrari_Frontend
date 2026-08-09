import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface DataTablePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/** Reflete `page`/`totalPages` retornados pela API — nunca pagina client-side (spec §9.1, §11). */
export function DataTablePagination({
  page,
  totalPages,
  onPageChange,
}: DataTablePaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground">
        Página {page} de {totalPages}
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft aria-hidden="true" />
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Próxima
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
