import type { AppointmentStatus, PeriodPreset, UserRole } from "./domain";

// ---------------------------------------------------------------------------
// identity
// ---------------------------------------------------------------------------

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
  birthDate: string | null;
}

export interface UsersListResponse {
  users: User[];
  page: number;
  totalPages: number;
}

// ---------------------------------------------------------------------------
// auth + account-verification
// ---------------------------------------------------------------------------

/** Resposta de POST /auth/login — não retorna token, apenas confirma credenciais (spec §10.2). */
export interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ValidateCodeResponse {
  verified: true;
}

/** Resposta de POST /account-verification/complete — emite a sessão (spec §12.1). */
export interface CompleteVerificationResponse {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}

// ---------------------------------------------------------------------------
// barber
// ---------------------------------------------------------------------------

export interface Qualification {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export interface Barber {
  id: string;
  userId: string;
  name: string;
  age: number;
  hiredAt: string;
  qualifications: Qualification[];
}

export interface BarbersListResponse {
  barbers: Barber[];
  page: number;
  totalPages: number;
}

/** [PLANEJADO] spec §3.3, §10.9 */
export interface BarberUnavailability {
  id: string;
  barberId: string;
  startAt: string;
  endAt: string;
  reason: string;
  createdAt: string;
}

/** [PLANEJADO] GET /barbers/:id/unavailabilities não pagina (spec §2). */
export interface BarberUnavailabilitiesResponse {
  unavailabilities: BarberUnavailability[];
}

// ---------------------------------------------------------------------------
// scheduling
// ---------------------------------------------------------------------------

export interface Appointment {
  id: string;
  customerId: string;
  barberId: string;
  qualificationId: string;
  startAt: string;
  status: AppointmentStatus;
  createdAt: string;
  cancelledAt: string | null;
  cancellationReason: string | null;
}

export interface AppointmentsListResponse {
  appointments: Appointment[];
  page: number;
  totalPages: number;
}

export interface TimeSlot {
  startAt: string;
  endAt: string;
}

/** GET /appointments/time-slots — grade de horários livres para um barbeiro/qualificação/data (spec §9.2). */
export interface TimeSlotsResponse {
  timeSlots: TimeSlot[];
}

// ---------------------------------------------------------------------------
// analytics
// ---------------------------------------------------------------------------

export interface PeriodQuery {
  preset: PeriodPreset;
  startAt?: string;
  endAt?: string;
}

export interface DayOfWeekCount {
  dayOfWeek: number;
  total: number;
}

export interface TimeSlotCount {
  startTime: string;
  total: number;
}

export interface RoleCount {
  role: UserRole;
  total: number;
}

export interface UserMetrics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  verifiedAccounts: number;
  pendingVerification: number;
  newUsersInPeriod: number;
  totalByRole: RoleCount[];
}

export interface AppointmentMetrics {
  totalAppointments: number;
  appointmentsToday: number;
  appointmentsThisWeek: number;
  appointmentsThisMonth: number;
  appointmentsInPeriod: number;
  futureAppointments: number;
  cancelledAppointments: number;
  cancellationRate: number;
  mostUsedTimeSlots: TimeSlotCount[];
  busiestDaysOfWeek: DayOfWeekCount[];
}

export interface BarberAppointmentCount {
  barberId: string;
  barberName: string;
  count: number;
}

export interface QualificationUsageCount {
  qualificationId: string;
  qualificationName: string;
  count: number;
}

export interface BarberMetrics {
  totalBarbers: number;
  appointmentsByBarber: BarberAppointmentCount[];
  mostUsedQualifications: QualificationUsageCount[];
}

export interface TopCustomer {
  customerId: string;
  customerName: string;
  appointmentsCount: number;
}

export interface CustomerLastAppointment {
  lastAppointmentAt: string | null;
}

export interface CustomerMetrics {
  activeCustomers: number;
  inactiveCustomers: number;
  topCustomersByAppointments: TopCustomer[];
  /** Presente apenas quando `customerId` é informado na query; `null` quando o cliente não existe. */
  lastAppointment?: CustomerLastAppointment | null;
}

export interface BarberOccupation {
  barberId: string;
  barberName: string;
  bookedSlots: number;
  availableSlots: number;
  occupancyRate: number;
}

export interface FreeTimeSlotsForBarber {
  barberId: string;
  barberName: string;
  slots: string[];
}

export interface OccupationMetrics {
  averageOccupancyRate: number;
  occupancyByBarber: BarberOccupation[];
  /** Sempre referente a hoje, independente do período selecionado (spec §13.12). Backend nem sempre envia. */
  freeTimeSlots?: FreeTimeSlotsForBarber[];
}

/** GET /analytics/dashboard — agrega os mesmos formatos usados pelas páginas de analytics individuais. */
export interface DashboardMetrics {
  users: UserMetrics;
  appointments: AppointmentMetrics;
  barbers: BarberMetrics;
  customers: CustomerMetrics;
  occupation: OccupationMetrics;
}
