/**
 * Mirrors the cache-aside TTLs documented on the backend (`CacheResource`), used
 * as `staleTime` for TanStack Query (spec §4.1, §17) — avoids refetching more
 * often than the backend would actually have given fresh data anyway.
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
