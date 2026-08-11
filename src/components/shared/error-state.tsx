import { AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  action?: ReactNode;
}

/**
 * Error state for any async section (spec §9.2, §12.4, §15). Standard usage is
 * `onAction`/`actionLabel` (e.g. "Try again", "Go back"); `action` allows a
 * custom node when the default button isn't enough.
 */
export function ErrorState({
  title = "Algo deu errado",
  description,
  actionLabel,
  onAction,
  action,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border px-6 py-16 text-center"
    >
      <AlertTriangle className="size-10 text-destructive" aria-hidden="true" />
      <div className="space-y-1">
        <p className="text-base font-medium">{title}</p>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ?? (onAction && actionLabel ? (
        <Button variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null)}
    </div>
  );
}
