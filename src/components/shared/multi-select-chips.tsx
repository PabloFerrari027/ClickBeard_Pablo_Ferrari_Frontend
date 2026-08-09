import { cn } from "@/lib/utils";

interface Option {
  id: string;
  name: string;
}

interface MultiSelectChipsProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  emptyMessage?: string;
}

/** Multi-seleção por chips clicáveis — alternativa simples ao `Command` com checkboxes (spec §10.5). */
export function MultiSelectChips({
  options,
  value,
  onChange,
  disabled,
  emptyMessage = "Nenhuma opção disponível.",
}: MultiSelectChipsProps) {
  if (options.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2 rounded-md border border-input p-3" role="group">
      {options.map((option) => {
        const selected = value.includes(option.id);
        return (
          <button
            key={option.id}
            type="button"
            disabled={disabled}
            aria-pressed={selected}
            onClick={() =>
              onChange(
                selected ? value.filter((id) => id !== option.id) : [...value, option.id]
              )
            }
            className={cn(
              "rounded-full border px-3 py-1 text-sm transition-colors disabled:pointer-events-none disabled:opacity-50",
              selected
                ? "border-secondary bg-accent text-accent-foreground"
                : "border-input text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {option.name}
          </button>
        );
      })}
    </div>
  );
}
