import { apiFetch } from "@/lib/api-client";
import type {
  Appointment,
  AppointmentsListResponse,
  TimeSlotsResponse,
} from "@/types/api";

export interface TimeSlotsQuery {
  barberId: string;
  qualificationId: string;
  date: string;
}

export interface CreateAppointmentPayload {
  barberId: string;
  qualificationId: string;
  startAt: string;
}

export interface CancelByAdminPayload {
  reason: string;
}

export const appointmentsService = {
  getTimeSlots(query: TimeSlotsQuery): Promise<TimeSlotsResponse> {
    return apiFetch<TimeSlotsResponse>("/appointments/time-slots", {
      query: { ...query },
    });
  },

  create(payload: CreateAppointmentPayload): Promise<Appointment> {
    return apiFetch<Appointment>("/appointments", { method: "POST", body: payload });
  },

  listMine(page: number): Promise<AppointmentsListResponse> {
    return apiFetch<AppointmentsListResponse>("/appointments/me", { query: { page } });
  },

  getById(id: string): Promise<Appointment> {
    return apiFetch<Appointment>(`/appointments/${id}`);
  },

  cancel(id: string): Promise<Appointment> {
    return apiFetch<Appointment>(`/appointments/${id}`, { method: "DELETE" });
  },

  listToday(page: number): Promise<AppointmentsListResponse> {
    return apiFetch<AppointmentsListResponse>("/appointments/today", { query: { page } });
  },

  listFuture(page: number): Promise<AppointmentsListResponse> {
    return apiFetch<AppointmentsListResponse>("/appointments/future", { query: { page } });
  },

  // [PLANEJADO] — spec §3.5, atrás de PLANNED_FEATURES_ENABLED
  cancelByAdmin(id: string, payload: CancelByAdminPayload): Promise<Appointment> {
    return apiFetch<Appointment>(`/appointments/${id}/cancel`, {
      method: "PATCH",
      body: payload,
    });
  },
};
