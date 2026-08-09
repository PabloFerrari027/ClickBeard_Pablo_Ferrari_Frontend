"use client";

import { useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ApiError, resolveErrorMessage } from "@/lib/api-error";
import { useQualifications } from "@/features/qualifications/hooks/use-qualifications";
import { useAddQualification } from "../hooks/use-add-qualification";
import { useRemoveQualification } from "../hooks/use-remove-qualification";
import type { Barber } from "@/types/api";

/** Aba "Qualificações" do detalhe admin de barbeiro (spec §13.15). */
export function BarberQualificationsPanel({ barber }: { barber: Barber }) {
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const { data: allQualifications = [] } = useQualifications();
  const addQualification = useAddQualification(barber.id);
  const removeQualification = useRemoveQualification(barber.id);

  const available = allQualifications.filter(
    (qualification) => !barber.qualifications.some((bq) => bq.id === qualification.id)
  );
  const isLastQualification = barber.qualifications.length === 1;

  function handleAdd() {
    if (!selected) return;
    addQualification.mutate(selected, {
      onSuccess: () => {
        toast.success("Qualificação adicionada.");
        setAddOpen(false);
        setSelected("");
      },
      onError: (error) => {
        toast.error(
          error instanceof ApiError ? resolveErrorMessage(error) : "Algo deu errado. Tente novamente."
        );
      },
    });
  }

  function handleRemove(qualificationId: string) {
    removeQualification.mutate(qualificationId, {
      onSuccess: () => toast.success("Qualificação removida."),
      onError: (error) => {
        toast.error(
          error instanceof ApiError ? resolveErrorMessage(error) : "Algo deu errado. Tente novamente."
        );
      },
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {barber.qualifications.map((qualification) => (
          <span
            key={qualification.id}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-accent px-3 py-1 text-sm text-accent-foreground"
          >
            {qualification.name}
            {isLastQualification ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <button
                      type="button"
                      disabled
                      className="text-muted-foreground opacity-50"
                      aria-label={`Remover ${qualification.name}`}
                    >
                      <X className="size-3.5" />
                    </button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  Um barbeiro precisa ter ao menos uma qualificação
                </TooltipContent>
              </Tooltip>
            ) : (
              <button
                type="button"
                onClick={() => handleRemove(qualification.id)}
                disabled={removeQualification.isPending}
                className="text-muted-foreground hover:text-destructive"
                aria-label={`Remover ${qualification.name}`}
              >
                <X className="size-3.5" />
              </button>
            )}
          </span>
        ))}
        {barber.qualifications.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma qualificação associada.</p>
        ) : null}
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" disabled={available.length === 0}>
            <Plus aria-hidden="true" />
            Adicionar qualificação
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar qualificação</DialogTitle>
          </DialogHeader>
          <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione uma qualificação" />
            </SelectTrigger>
            <SelectContent>
              {available.map((qualification) => (
                <SelectItem key={qualification.id} value={qualification.id}>
                  {qualification.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAdd} disabled={!selected || addQualification.isPending}>
              {addQualification.isPending ? (
                <Loader2 className="animate-spin" aria-hidden="true" />
              ) : null}
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
