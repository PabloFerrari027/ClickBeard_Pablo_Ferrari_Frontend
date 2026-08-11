import { apiFetch } from "@/lib/api-client";
import type { Qualification } from "@/types/api";

export interface CreateQualificationPayload {
  name: string;
  description?: string;
}

export type UpdateQualificationPayload = Partial<CreateQualificationPayload>;

/** `GET /qualifications` doesn't paginate — returns a plain array at the root (spec §2, §3.4). */
export const qualificationsService = {
  list(): Promise<Qualification[]> {
    return apiFetch<Qualification[]>("/qualifications");
  },

  create(payload: CreateQualificationPayload): Promise<Qualification> {
    return apiFetch<Qualification>("/qualifications", {
      method: "POST",
      body: payload,
    });
  },

  update(id: string, payload: UpdateQualificationPayload): Promise<Qualification> {
    return apiFetch<Qualification>(`/qualifications/${id}`, {
      method: "PATCH",
      body: payload,
    });
  },

  remove(id: string): Promise<void> {
    return apiFetch<void>(`/qualifications/${id}`, { method: "DELETE" });
  },
};
