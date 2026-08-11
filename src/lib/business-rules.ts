/**
 * Business rule constants replicated on the frontend (client-side UX only —
 * the API is always the final authority). Each one references the section of
 * clickbeard-frontend-spec.md the rule was extracted from, to never
 * duplicate a magic number across multiple files (spec §22).
 */

/** Minimum window before the appointment time for the customer to be able to cancel (spec §3.5, §10.9, §13.9). */
export const MIN_APPOINTMENT_NOTICE_HOURS = 2;

/** TTL of the email 2FA verification code (spec §10.3). */
export const VERIFICATION_CODE_TTL_MINUTES = 10;

/** Maximum number of 2FA code validation attempts (spec §9.2 OtpInput, §10.3). */
export const MAX_VERIFICATION_CODE_ATTEMPTS = 5;

/** UI cooldown (not enforced by the API) before allowing a new code resend (spec §10.3). */
export const RESEND_CODE_COOLDOWN_SECONDS = 30;

/** Barbershop business hours used to generate/validate the time slot grid (spec §9.2 TimeSlotPicker). */
export const BUSINESS_HOURS_START = 8;
export const BUSINESS_HOURS_END = 18;

/** Duration of each appointment slot (spec §9.2 TimeSlotPicker, §10.7). */
export const APPOINTMENT_SLOT_MINUTES = 30;

/** Fixed page size returned by the API for every paginated listing (spec §2). */
export const API_PAGE_SIZE = 100;

/** Minimum length of the administrative cancellation reason [PLANNED] (spec §10.8). */
export const CANCELLATION_REASON_MIN_LENGTH = 3;

/** Minimum length of the barber unavailability reason [PLANNED] (spec §10.9). */
export const UNAVAILABILITY_REASON_MIN_LENGTH = 3;

/** Minimum password length required by the API (spec §10.1, §10.4). */
export const MIN_PASSWORD_LENGTH = 8;

/** Minimum/maximum barber age accepted by the API (spec §10.5). */
export const BARBER_MIN_AGE = 18;
export const BARBER_MAX_AGE = 100;
