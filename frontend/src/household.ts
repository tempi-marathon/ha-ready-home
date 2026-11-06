/** Per-category household needs, derived from the settings payload. */

import type { AgeCategoryDto, SettingsDto } from "./api";

export interface HouseholdRow {
  key: string;
  count: number;
  caloriesPerPerson: number;
  waterPerPerson: number;
  caloriesSubtotal: number;
  waterSubtotal: number;
}

export interface Household {
  rows: HouseholdRow[];
  dailyCalories: number;
  dailyWater: number;
  days: number;
}

function toRow(c: AgeCategoryDto): HouseholdRow {
  return {
    key: c.key,
    count: c.count,
    caloriesPerPerson: c.calories_per_day,
    waterPerPerson: c.water_liters_per_day,
    caloriesSubtotal: c.count * c.calories_per_day,
    waterSubtotal: c.count * c.water_liters_per_day,
  };
}

/**
 * Build the breakdown. Responses from an older backend lack `age_categories`;
 * then the household is read as all adults from the legacy per-person fields.
 * Returns null when no household is configured.
 */
export function householdFromSettings(
  settings: SettingsDto | null | undefined,
): Household | null {
  if (!settings) return null;
  const categories: AgeCategoryDto[] =
    settings.age_categories && settings.age_categories.length > 0
      ? settings.age_categories
      : settings.number_of_people == null
        ? []
        : [
            {
              key: "adults",
              count: settings.number_of_people,
              calories_per_day: settings.calories_per_person_per_day,
              water_liters_per_day: settings.water_liters_per_person_per_day,
            },
          ];
  const rows = categories.map(toRow);
  if (rows.reduce((sum, r) => sum + r.count, 0) <= 0) return null;
  return {
    rows,
    dailyCalories: rows.reduce((sum, r) => sum + r.caloriesSubtotal, 0),
    dailyWater: rows.reduce((sum, r) => sum + r.waterSubtotal, 0),
    days: settings.duration_hours / 24,
  };
}
