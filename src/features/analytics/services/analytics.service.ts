import { apiFetch } from "@/lib/api-client";
import type {
  AppointmentMetrics,
  BarberMetrics,
  CustomerMetrics,
  DashboardMetrics,
  OccupationMetrics,
  UserMetrics,
} from "@/types/api";

export interface AnalyticsQuery {
  preset: string;
  startAt?: string;
  endAt?: string;
}

export const analyticsService = {
  getDashboard(query: AnalyticsQuery): Promise<DashboardMetrics> {
    return apiFetch<DashboardMetrics>("/analytics/dashboard", { query: { ...query } });
  },

  getUsers(query: AnalyticsQuery): Promise<UserMetrics> {
    return apiFetch<UserMetrics>("/analytics/users", { query: { ...query } });
  },

  getAppointments(query: AnalyticsQuery): Promise<AppointmentMetrics> {
    return apiFetch<AppointmentMetrics>("/analytics/appointments", { query: { ...query } });
  },

  getBarbers(query: AnalyticsQuery): Promise<BarberMetrics> {
    return apiFetch<BarberMetrics>("/analytics/barbers", { query: { ...query } });
  },

  getCustomers(
    query: AnalyticsQuery & { customerId?: string }
  ): Promise<CustomerMetrics> {
    return apiFetch<CustomerMetrics>("/analytics/customers", { query: { ...query } });
  },

  getOccupation(query: AnalyticsQuery): Promise<OccupationMetrics> {
    return apiFetch<OccupationMetrics>("/analytics/occupation", { query: { ...query } });
  },
};
