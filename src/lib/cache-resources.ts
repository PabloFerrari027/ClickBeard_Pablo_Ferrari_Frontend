/**
 * Espelha os TTLs do cache-aside documentado no backend (`CacheResource`), usados
 * como `staleTime` do TanStack Query (spec §4.1, §17) — evita refetch mais
 * frequente do que o backend efetivamente teria dado de novo.
 */
const MINUTE = 60_000;

export const CACHE_RESOURCE_STALE_TIME = {
  barbersList: 5 * MINUTE,
  barberDetail: 5 * MINUTE,
  qualifications: 15 * MINUTE,
  timeSlots: 30_000,
  appointmentsList: 30_000,
  appointmentDetail: 30_000,
  userDetail: 5 * MINUTE,
  usersList: 5 * MINUTE,
  analytics: 5 * MINUTE,
  unavailabilities: 30_000,
} as const;
