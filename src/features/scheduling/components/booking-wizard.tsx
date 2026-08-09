"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2, Scissors, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useBarber } from "@/features/barbers/hooks/use-barber";
import { useBarbers } from "@/features/barbers/hooks/use-barbers";
import { ApiError, resolveErrorMessage } from "@/lib/api-error";
import { cn, getInitials } from "@/lib/utils";
import { useCreateAppointment } from "../hooks/use-create-appointment";
import { useTimeSlots } from "../hooks/use-time-slots";
import { TimeSlotPicker } from "./time-slot-picker";

const STEP_LABELS = ["Barbeiro", "Qualificação", "Data", "Horário"];
const TOTAL_STEPS = STEP_LABELS.length;

function startOfToday(): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Wizard de 4 passos (spec §10.7, §13.8): barbeiro → qualificação → data → horário → confirmar.
 * Cada mudança de passo anterior invalida a seleção de horário e força nova consulta.
 */
export function BookingWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedBarberId = searchParams.get("barberId");

  const [step, setStep] = useState(preselectedBarberId ? 2 : 1);
  const [barberId, setBarberId] = useState<string | null>(preselectedBarberId);
  const [qualificationId, setQualificationId] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [slot, setSlot] = useState<string | null>(null);

  const { data: barbersPage, isLoading: loadingBarbers } = useBarbers(1);
  const { data: selectedBarber, isLoading: loadingBarber } = useBarber(barberId ?? undefined);
  const dateParam = date ? format(date, "yyyy-MM-dd") : undefined;
  const {
    data: timeSlotsData,
    isLoading: loadingSlots,
    refetch: refetchSlots,
  } = useTimeSlots({
    barberId: barberId ?? undefined,
    qualificationId: qualificationId ?? undefined,
    date: dateParam,
  });

  const createAppointment = useCreateAppointment();

  function handleSelectBarber(id: string) {
    setBarberId(id);
    setQualificationId(null);
    setDate(undefined);
    setSlot(null);
  }

  function handleSelectQualification(id: string) {
    setQualificationId(id);
    setDate(undefined);
    setSlot(null);
  }

  function handleSelectDate(nextDate: Date | undefined) {
    setDate(nextDate);
    setSlot(null);
  }

  function canProceed(): boolean {
    if (step === 1) return Boolean(barberId);
    if (step === 2) return Boolean(qualificationId);
    if (step === 3) return Boolean(date);
    return Boolean(slot);
  }

  function handleConfirm() {
    if (!barberId || !qualificationId || !slot) return;
    createAppointment.mutate(
      { barberId, qualificationId, startAt: slot },
      {
        onSuccess: (appointment) => {
          toast.success("Agendamento confirmado!");
          router.push(`/appointments/${appointment.id}`);
        },
        onError: (error) => {
          if (error instanceof ApiError) {
            if (error.code === "AppointmentTooSoonError") {
              toast.error("Este horário não é mais válido. Escolha outro.");
              setSlot(null);
              refetchSlots();
              return;
            }
            if (error.code === "BarberTimeSlotConflictError") {
              toast.error("Este horário acabou de ser reservado por outro cliente.");
              setSlot(null);
              refetchSlots();
              return;
            }
            toast.error(resolveErrorMessage(error));
            return;
          }
          toast.error("Algo deu errado. Tente novamente.");
        },
      }
    );
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Novo agendamento</CardTitle>
        <p className="pt-2 text-center text-sm text-muted-foreground sm:hidden">
          Passo {step} de {TOTAL_STEPS}
        </p>
        <div className="hidden items-center justify-center gap-3 pt-2 sm:flex">
          {STEP_LABELS.map((label, index) => {
            const stepNumber = index + 1;
            return (
              <div key={label} className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full text-xs font-medium",
                    stepNumber === step
                      ? "bg-primary text-primary-foreground"
                      : stepNumber < step
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {stepNumber}
                </span>
                <span className="text-sm text-muted-foreground">{label}</span>
                {stepNumber < STEP_LABELS.length ? (
                  <span className="mx-1 h-px w-6 bg-border" aria-hidden="true" />
                ) : null}
              </div>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="min-h-64">
        {step === 1 &&
          (loadingBarbers ? (
            <Skeleton className="h-48 w-full" aria-hidden="true" />
          ) : !barbersPage || barbersPage.barbers.length === 0 ? (
            <EmptyState icon={Scissors} title="Nenhum barbeiro disponível" />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {barbersPage.barbers.map((barber) => (
                <button
                  key={barber.id}
                  type="button"
                  onClick={() => handleSelectBarber(barber.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors",
                    barberId === barber.id
                      ? "border-secondary bg-accent"
                      : "border-border hover:bg-accent"
                  )}
                >
                  <Avatar className="size-12">
                    <AvatarFallback>{getInitials(barber.name)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{barber.name}</span>
                </button>
              ))}
            </div>
          ))}

        {step === 2 &&
          (loadingBarber ? (
            <Skeleton className="h-48 w-full" aria-hidden="true" />
          ) : !selectedBarber || selectedBarber.qualifications.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="Este barbeiro não possui qualificações cadastradas"
            />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {selectedBarber.qualifications.map((qualification) => (
                <button
                  key={qualification.id}
                  type="button"
                  onClick={() => handleSelectQualification(qualification.id)}
                  className={cn(
                    "rounded-lg border p-4 text-left text-sm font-medium transition-colors",
                    qualificationId === qualification.id
                      ? "border-secondary bg-accent"
                      : "border-border hover:bg-accent"
                  )}
                >
                  {qualification.name}
                </button>
              ))}
            </div>
          ))}

        {step === 3 && (
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleSelectDate}
              disabled={{ before: startOfToday() }}
            />
          </div>
        )}

        {step === 4 &&
          (loadingSlots ? (
            <Skeleton className="h-48 w-full" aria-hidden="true" />
          ) : !timeSlotsData || timeSlotsData.timeSlots.length === 0 ? (
            <EmptyState
              icon={CalendarIcon}
              title="Nenhum horário disponível nesta data. Escolha outro dia."
            />
          ) : (
            <TimeSlotPicker
              slots={timeSlotsData.timeSlots}
              value={slot}
              onChange={setSlot}
              disabled={createAppointment.isPending}
            />
          ))}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setStep((current) => Math.max(1, current - 1))}
          disabled={step === 1 || createAppointment.isPending}
        >
          Voltar
        </Button>
        {step < TOTAL_STEPS ? (
          <Button
            onClick={() => setStep((current) => Math.min(TOTAL_STEPS, current + 1))}
            disabled={!canProceed()}
          >
            Próximo
          </Button>
        ) : (
          <Button size="lg" onClick={handleConfirm} disabled={!canProceed() || createAppointment.isPending}>
            {createAppointment.isPending ? (
              <Loader2 className="animate-spin" aria-hidden="true" />
            ) : null}
            Confirmar agendamento
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
