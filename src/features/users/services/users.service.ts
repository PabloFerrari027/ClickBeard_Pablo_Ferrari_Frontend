import { apiFetch } from "@/lib/api-client";
import type { User, UsersListResponse } from "@/types/api";
import type { UserRole } from "@/types/domain";

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfilePayload {
  name: string;
  birthDate?: string;
}

export interface ChangeRolePayload {
  role: UserRole;
}

export const usersService = {
  list(page: number): Promise<UsersListResponse> {
    return apiFetch<UsersListResponse>("/users", { query: { page } });
  },

  getById(id: string): Promise<User> {
    return apiFetch<User>(`/users/${id}`);
  },

  updatePassword(id: string, payload: UpdatePasswordPayload): Promise<void> {
    return apiFetch<void>(`/users/${id}/password`, {
      method: "PATCH",
      body: payload,
    });
  },

  updateProfile(id: string, payload: UpdateProfilePayload): Promise<User> {
    return apiFetch<User>(`/users/${id}/profile`, {
      method: "PATCH",
      body: payload,
    });
  },

  changeRole(id: string, payload: ChangeRolePayload): Promise<User> {
    return apiFetch<User>(`/users/${id}/role`, {
      method: "PATCH",
      body: payload,
    });
  },

  deactivate(id: string): Promise<User> {
    return apiFetch<User>(`/users/${id}/deactivate`, { method: "PATCH" });
  },

  activate(id: string): Promise<User> {
    return apiFetch<User>(`/users/${id}/activate`, { method: "PATCH" });
  },
};
