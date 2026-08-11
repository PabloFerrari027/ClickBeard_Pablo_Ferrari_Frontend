"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { DataTablePagination } from "./data-table-pagination";
import { EmptyState } from "./empty-state";
import { ErrorState } from "./error-state";

const SKELETON_ROWS = 5;

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  emptyIcon?: typeof Inbox;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  onRowClick?: (row: TData) => void;
  /** Renders each row as a stacked card below md — never forced horizontal scroll (spec §23). */
  renderMobileCard?: (row: TData) => ReactNode;
}

/**
 * Generic wrapper over `@tanstack/react-table` + server-side pagination (spec §6, §9.2).
 * Handles loading/empty/error/success consistently across the app's 10 paginated listings.
 */
export function DataTable<TData, TValue>({
  columns,
  data,
  page,
  totalPages,
  onPageChange,
  isLoading = false,
  isError = false,
  onRetry,
  emptyIcon: EmptyIcon = Inbox,
  emptyTitle = "Nenhum item encontrado",
  emptyDescription,
  emptyAction,
  onRowClick,
  renderMobileCard,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isError) {
    return (
      <ErrorState
        title="Não foi possível carregar os dados"
        actionLabel={onRetry ? "Tentar novamente" : undefined}
        onAction={onRetry}
      />
    );
  }

  if (!isLoading && data.length === 0) {
    return (
      <EmptyState
        icon={EmptyIcon}
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return (
    <div className="space-y-4">
      {renderMobileCard ? (
        <div className="space-y-3 md:hidden" aria-busy={isLoading}>
          {isLoading
            ? Array.from({ length: SKELETON_ROWS }).map((_, index) => (
                <Skeleton key={index} className="h-24 w-full rounded-lg" />
              ))
            : table.getRowModel().rows.map((row) => (
                <div
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  className={cn(onRowClick && "cursor-pointer")}
                >
                  {renderMobileCard(row.original)}
                </div>
              ))}
        </div>
      ) : null}

      <div
        className={cn(
          "overflow-x-auto rounded-lg border border-border",
          renderMobileCard && "hidden md:block"
        )}
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody aria-busy={isLoading}>
            {isLoading
              ? Array.from({ length: SKELETON_ROWS }).map((_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {columns.map((_, columnIndex) => (
                      <TableCell key={columnIndex}>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    onClick={() => onRowClick?.(row.original)}
                    className={cn(onRowClick && "cursor-pointer")}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}
