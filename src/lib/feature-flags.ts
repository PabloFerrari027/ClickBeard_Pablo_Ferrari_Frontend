/**
 * The 4 routes marked [PLANNED] in the spec (administrative cancellation with
 * reason, barber unavailability CRUD) depend on endpoints not yet
 * confirmed as deployed to production (spec §1, Appendix item 9).
 * They stay hidden from navigation/UI until the backend confirms — but the code
 * already exists, ready to turn on by flipping this flag.
 */
export const PLANNED_FEATURES_ENABLED = false;
