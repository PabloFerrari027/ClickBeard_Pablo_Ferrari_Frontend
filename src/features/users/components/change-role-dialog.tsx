"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { ApiError, resolveErrorMessage } from "@/lib/api-error";
import { useChangeRole } from "../hooks/use-change-role";
import type { UserRole } from "@/types/domain";

const ALL_ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "CLIENT", label: "Cliente" },
  { value: "BARBER", label: "Barbeiro" },
  { value: "ADMIN", label: "Administrador" },
];

/**
 * `PATCH /users/:id/role` (spec §3.1, §13.20) — disables the option matching the current role.
 * Promotion to Barber is no longer allowed here: barber registration goes through its own
 * dedicated form. The option only appears when the user is already a barber, allowing only
 * downgrading them to Client/Admin.
 */
export function ChangeRoleDialog({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: UserRole;
}) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<UserRole>(currentRole);
  const { mutate, isPending } = useChangeRole(userId);
  const roleOptions = ALL_ROLE_OPTIONS.filter(
    (option) => option.value !== "BARBER" || currentRole === "BARBER"
  );

  function handleConfirm() {
    mutate(
      { role },
      {
        onSuccess: () => {
          toast.success("Papel do usuário atualizado.");
          setOpen(false);
        },
        onError: (error) => {
          toast.error(
            error instanceof ApiError
              ? resolveErrorMessage(error)
              : "Algo deu errado. Tente novamente."
          );
        },
      }
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setRole(currentRole);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Alterar papel</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Alterar papel do usuário</DialogTitle>
          <DialogDescription>Escolha o novo papel para esta conta.</DialogDescription>
        </DialogHeader>
        <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {roleOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={option.value === currentRole}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={isPending || role === currentRole}>
            {isPending ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
