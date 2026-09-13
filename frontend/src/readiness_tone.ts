/** Supply-hours tone for readiness stat cards. */

export type StatTone = "ok" | "warn" | "bad" | "";

/**
 * Map supply hours vs configured duration to a card/duration tone.
 *
 * - null/NaN → no tone
 * - ≤ 0 → bad
 * - below duration → warn
 * - at or above duration → ok
 */
export function readinessTone(
  hours: number | null | undefined,
  durationHours: number,
): StatTone {
  if (hours == null || Number.isNaN(Number(hours))) return "";
  if (Number(hours) <= 0) return "bad";
  if (Number(hours) < Number(durationHours)) return "warn";
  return "ok";
}
