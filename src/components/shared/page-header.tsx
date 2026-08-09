import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

/** Título + descrição + ações da página — mesmo componente em toda a aplicação (spec §6, §25). */
export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl leading-tight font-semibold">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? (
        <div className="flex shrink-0 [&>*]:w-full sm:[&>*]:w-auto">{action}</div>
      ) : null}
    </div>
  );
}
