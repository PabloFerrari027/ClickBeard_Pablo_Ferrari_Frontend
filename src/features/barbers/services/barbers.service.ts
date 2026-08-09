import { apiFetch } from "@/lib/api-client";
import type {
  Barber,
  BarberUnavailabilitiesResponse,
  BarberUnavailability,
  BarbersListResponse,
} from "@/types/api";

export interface CreateBarberPayload {
  email: string;
  age: number;
  hiredAt: string;
  qualificationIds: string[];
}

export interface UpdateBarberPayload {
  age?: number;
  hiredAt?: string;
}

export interface CreateUnavailabilityPayload {
  startAt: string;
  endAt: string;
  reason: string;
}

export const barbersService = {
  list(page: number): Promise<BarbersListResponse> {
    return apiFetch<BarbersListResponse>("/barbers", { query: { page } });
  },

  getById(id: string): Promise<Barber> {
    return apiFetch<Barber>(`/barbers/${id}`);
  },

  create(payload: CreateBarberPayload): Promise<Barber> {
    return apiFetch<Barber>("/barbers", { method: "POST", body: payload });
  },

  update(id: string, payload: UpdateBarberPayload): Promise<Barber> {
    return apiFetch<Barber>(`/barbers/${id}`, { method: "PATCH", body: payload });
  },

  addQualification(id: string, qualificationId: string): Promise<Barber> {
    return apiFetch<Barber>(`/barbers/${id}/qualifications`, {
      method: "POST",
      body: { qualificationId },
    });
  },

  removeQualification(id: string, qualificationId: string): Promise<void> {
    return apiFetch<void>(`/barbers/${id}/qualifications/${qualificationId}`, {
      method: "DELETE",
    });
  },

  // [PLANEJADO] — spec §3.3, atrás de PLANNED_FEATURES_ENABLED
  listUnavailabilities(id: string): Promise<BarberUnavailabilitiesResponse> {
    return apiFetch<BarberUnavailabilitiesResponse>(`/barbers/${id}/unavailabilities`);
  },

  createUnavailability(
    id: string,
    payload: CreateUnavailabilityPayload
  ): Promise<BarberUnavailability> {
    return apiFetch<BarberUnavailability>(`/barbers/${id}/unavailabilities`, {
      method: "POST",
      body: payload,
    });
  },

  deleteUnavailability(id: string, unavailabilityId: string): Promise<void> {
    return apiFetch<void>(`/barbers/${id}/unavailabilities/${unavailabilityId}`, {
      method: "DELETE",
    });
  },
};
