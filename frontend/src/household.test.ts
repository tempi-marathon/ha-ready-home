import { describe, expect, it } from "vitest";
import type { SettingsDto } from "./api";
import { householdFromSettings } from "./household";
import { t } from "./localize";

const BASE: SettingsDto = {
  number_of_people: 2,
  duration_hours: 72,
  water_liters_per_person_per_day: 3,
  calories_per_person_per_day: 2000,
  locations: [],
  categories: [],
  food_categories: ["Food"],
  water_categories: ["Water"],
  expiring_days: 30,
  urgent_days: 7,
};

describe("householdFromSettings", () => {
  it("falls back to one adults row when age_categories is missing", () => {
    const h = householdFromSettings(BASE)!;
    expect(h.rows).toHaveLength(1);
    expect(h.rows[0]).toMatchObject({ key: "adults", count: 2, caloriesSubtotal: 4000 });
    expect(h.dailyCalories).toBe(4000);
    expect(h.dailyWater).toBe(6);
    expect(h.days).toBe(3);
  });

  it("sums a mixed household", () => {
    const h = householdFromSettings({
      ...BASE,
      duration_hours: 336,
      age_categories: [
        { key: "adults", count: 2, calories_per_day: 2200, water_liters_per_day: 3 },
        { key: "children", count: 2, calories_per_day: 1800, water_liters_per_day: 3 },
        { key: "babies_toddlers", count: 1, calories_per_day: 1000, water_liters_per_day: 3 },
        { key: "seniors", count: 1, calories_per_day: 1900, water_liters_per_day: 3 },
      ],
    })!;
    expect(h.dailyCalories).toBe(10900);
    expect(h.dailyWater).toBe(18);
    expect(h.days).toBe(14);
    expect(h.dailyCalories * h.days).toBe(152600);
  });

  it("returns null without a household", () => {
    expect(householdFromSettings(null)).toBeNull();
    expect(householdFromSettings({ ...BASE, number_of_people: null })).toBeNull();
  });

  it("has en and nl labels for every category", () => {
    for (const key of ["adults", "children", "babies_toddlers", "seniors"]) {
      const en = { language: "en", locale: { language: "en" } } as never;
      const nl = { language: "nl", locale: { language: "nl" } } as never;
      expect(t(en, `household.${key}`)).not.toBe(`household.${key}`);
      expect(t(nl, `household.${key}`)).not.toBe(t(en, `household.${key}`));
    }
  });
});
