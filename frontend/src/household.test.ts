import { describe, expect, it } from "vitest";
import type { SettingsDto } from "./api";
import { foodBreakdown, householdFromSettings, petFoodBreakdown } from "./household";
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

  it("treats a response without pet fields as no pets", () => {
    const h = householdFromSettings(BASE)!;
    expect(h.pets).toEqual([]);
    expect(h.dailyPetFood).toBe(0);
    expect(h.dailyPetWater).toBe(0);
    expect(h.dailyWater).toBe(6);
  });

  it("adds pet water to the daily water and keeps pet food separate", () => {
    const h = householdFromSettings({
      ...BASE,
      pets: [
        { id: "a", name: "Rex", type: "dog", food_grams_per_day: 400, water_liters_per_day: 0.5 },
        { id: "b", name: "Tom", food_grams_per_day: 80, water_liters_per_day: 0.2 },
      ],
    })!;
    expect(h.pets.map((p) => p.name)).toEqual(["Rex", "Tom"]);
    expect(h.pets[1].type).toBe("");
    expect(h.dailyPetFood).toBe(480);
    expect(h.dailyPetWater).toBeCloseTo(0.7);
    expect(h.dailyWater).toBeCloseTo(6.7);
    expect(h.dailyCalories).toBe(4000);
  });

  it("returns null without a household", () => {
    expect(householdFromSettings(null)).toBeNull();
    expect(householdFromSettings({ ...BASE, number_of_people: null })).toBeNull();
  });

  it("has en and nl labels for the pet strings", () => {
    for (const key of ["stat.pet_food", "household.pets", "household.pet_food_period"]) {
      const en = { language: "en", locale: { language: "en" } } as never;
      const nl = { language: "nl", locale: { language: "nl" } } as never;
      expect(t(en, key)).not.toBe(key);
      expect(t(nl, key)).not.toBe(key);
      expect(t(nl, key)).not.toBe(t(en, key));
    }
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

describe("foodBreakdown", () => {
  it("lists adults only for a legacy response", () => {
    const f = foodBreakdown(householdFromSettings(BASE)!);
    expect(f.rows).toEqual([
      { key: "adults", count: 2, caloriesPerPerson: 2000, caloriesSubtotal: 4000 },
    ]);
    expect(f.dailyTotal).toBe(4000);
    expect(f.days).toBe(3);
    expect(f.periodTotal).toBe(12000);
  });

  it("lists every age category with its subtotal for a mixed household", () => {
    const f = foodBreakdown(
      householdFromSettings({
        ...BASE,
        duration_hours: 336,
        age_categories: [
          { key: "adults", count: 2, calories_per_day: 2200, water_liters_per_day: 3 },
          { key: "children", count: 2, calories_per_day: 1800, water_liters_per_day: 3 },
          { key: "babies_toddlers", count: 1, calories_per_day: 1000, water_liters_per_day: 3 },
          { key: "seniors", count: 1, calories_per_day: 1900, water_liters_per_day: 3 },
        ],
      })!,
    );
    expect(f.rows.map((r) => [r.key, r.caloriesSubtotal])).toEqual([
      ["adults", 4400],
      ["children", 3600],
      ["babies_toddlers", 1000],
      ["seniors", 1900],
    ]);
    expect(f.dailyTotal).toBe(10900);
    expect(f.periodTotal).toBe(152600);
  });

  it("leaves water and pet food out of the food breakdown", () => {
    const f = foodBreakdown(
      householdFromSettings({
        ...BASE,
        pets: [{ id: "a", name: "Rex", food_grams_per_day: 400, water_liters_per_day: 0.5 }],
      })!,
    );
    expect(f.dailyTotal).toBe(4000);
    expect(JSON.stringify(f)).not.toContain("Rex");
  });
});

describe("petFoodBreakdown", () => {
  it("is empty without pets", () => {
    const p = petFoodBreakdown(householdFromSettings(BASE)!);
    expect(p.rows).toEqual([]);
    expect(p.dailyTotal).toBe(0);
    expect(p.periodTotal).toBe(0);
  });

  it("lists each pet with its food per day and totals over the duration", () => {
    const p = petFoodBreakdown(
      householdFromSettings({
        ...BASE,
        pets: [
          { id: "a", name: "Rex", type: "dog", food_grams_per_day: 400, water_liters_per_day: 0.5 },
          { id: "b", name: "Tom", food_grams_per_day: 80, water_liters_per_day: 0.2 },
        ],
      })!,
    );
    expect(p.rows).toEqual([
      { id: "a", name: "Rex", type: "dog", foodPerDay: 400 },
      { id: "b", name: "Tom", type: "", foodPerDay: 80 },
    ]);
    expect(p.dailyTotal).toBe(480);
    expect(p.days).toBe(3);
    expect(p.periodTotal).toBe(1440);
  });

  it("keeps pets with no food in the list", () => {
    const p = petFoodBreakdown(
      householdFromSettings({
        ...BASE,
        pets: [{ id: "a", name: "Fish", food_grams_per_day: 0, water_liters_per_day: 0 }],
      })!,
    );
    expect(p.rows).toHaveLength(1);
    expect(p.dailyTotal).toBe(0);
  });
});
