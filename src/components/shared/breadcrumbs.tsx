import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Fragment } from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/** Breadcrumbs conforme tabela da spec §5 — usado nas 7 rotas que ela lista. */
export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
    >
      {items.map((item, index) => (
        <Fragment key={`${item.label}-${index}`}>
          {index > 0 ? <ChevronRight className="size-3.5" aria-hidden="true" /> : null}
          {item.href ? (
            <Link href={item.href} className="hover:text-foreground hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground" aria-current="page">
              {item.label}
            </span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
