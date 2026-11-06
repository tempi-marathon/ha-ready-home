/** Per-category household needs, derived from the settings payload. */

import type { AgeCategoryDto, PetDto, SettingsDto } from "./api";

export interface HouseholdRow {
  key: string;
  count: number;
  caloriesPerPerson: number;
  waterPerPerson: number;
  caloriesSubtotal: number;
  waterSubtotal: number;
}

export interface PetRow {
  id: string;
  name: string;
  type: string;
  foodPerDay: number;
  waterPerDay: number;
}

export interface Household {
  rows: HouseholdRow[];
  /** Pets from the settings payload; empty for older backends. */
  pets: PetRow[];
  dailyCalories: number;
  /** People and pets together, matching the water target. */
  dailyWater: number;
  dailyPetWater: number;
  /** Pet food in grams per day; separate from human kcal. */
  dailyPetFood: number;
  days: number;
}

function toPetRow(p: PetDto): PetRow {
  return {
    id: p.id,
    name: p.name,
    type: p.type ?? "",
    foodPerDay: p.food_grams_per_day,
    waterPerDay: p.water_liters_per_day,
  };
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
  const pets = (settings.pets ?? []).map(toPetRow);
  const dailyPetWater = pets.reduce((sum, p) => sum + p.waterPerDay, 0);
  return {
    rows,
    pets,
    dailyCalories: rows.reduce((sum, r) => sum + r.caloriesSubtotal, 0),
    dailyWater: rows.reduce((sum, r) => sum + r.waterSubtotal, 0) + dailyPetWater,
    dailyPetWater,
    dailyPetFood: pets.reduce((sum, p) => sum + p.foodPerDay, 0),
    days: settings.duration_hours / 24,
  };
}
