import { describe, expect, it } from "vitest";
import type { InventoryItemDto, SettingsDto, Snapshot } from "./api";
import {
  filterAndSortItems,
  formatItemMeasure,
  itemStatus,
  measurePayload,
  readinessKind,
  showCaloriesField,
  validateMeasureFields,
} from "./inventory_view";

function item(
  overrides: Partial<InventoryItemDto> & Pick<InventoryItemDto, "id" | "name">,
): InventoryItemDto {
  return {
    quantity: 1,
    desired_quantity: 0,
    unit: "piece",
    location: "",
    category: "",
    priority: "important",
    expiry_date: null,
    ...overrides,
  };
}

const settings: SettingsDto = {
  number_of_people: 2,
  duration_hours: 72,
  water_liters_per_person_per_day: 3,
  calories_per_person_per_day: 2000,
  locations: ["Garage", "Pantry"],
  categories: ["Food", "Water", "Medical"],
  food_categories: ["Food"],
  water_categories: ["Water"],
  expiring_days: 30,
  urgent_days: 7,
};

const emptyBuckets: Snapshot["buckets"] = {
  expired: [],
  within_urgent: [],
  within_expiring: [],
  low_stock: [],
};

describe("readinessKind", () => {
  it("maps food and water categories case-insensitively", () => {
    expect(readinessKind("Food", settings)).toBe("food");
    expect(readinessKind(" water ", settings)).toBe("water");
    expect(readinessKind("Medical", settings)).toBe("none");
    expect(readinessKind("", settings)).toBe("none");
    expect(readinessKind("Food", null)).toBe("none");
  });
});

describe("formatItemMeasure", () => {
  it("shows kcal for food and liters for water", () => {
    const food = item({
      id: "f",
      name: "Rice",
      quantity: 2,
      contents_per_unit: 500,
      contents_unit: "gram",
      calories_per_content: 3.5,
    });
    const water = item({
      id: "w",
      name: "Water",
      quantity: 4,
      contents_per_unit: 1.5,
      contents_unit: "liter",
    });
    expect(formatItemMeasure(food, "food")).toBe("3500 kcal");
    expect(formatItemMeasure(water, "water")).toBe("6 L");
  });

  it("shows kcal and/or liters for unmapped categories", () => {
    const both = item({
      id: "m",
      name: "Gel",
      quantity: 2,
      contents_per_unit: 0.5,
      contents_unit: "liter",
      calories_per_content: 100,
    });
    expect(formatItemMeasure(both, "none")).toBe("100 kcal · 1 L");
    expect(
      formatItemMeasure(
        item({
          id: "c",
          name: "Cream",
          quantity: 1,
          contents_per_unit: 100,
          contents_unit: "gram",
          calories_per_content: 2,
        }),
        "none",
      ),
    ).toBe("200 kcal");
    expect(formatItemMeasure(item({ id: "x", name: "Empty" }), "none")).toBe(
      "",
    );
  });
});

describe("validateMeasureFields", () => {
  it("requires contents and calories for food", () => {
    expect(
      validateMeasureFields("food", {
        contents_per_unit: "",
        contents_unit: "",
        calories_per_content: "",
      }),
    ).toMatchObject({
      contents_per_unit: expect.any(String),
      contents_unit: expect.any(String),
      calories_per_content: expect.any(String),
    });
  });

  it("allows empty measures for unmapped, but requires both when one is set", () => {
    expect(
      validateMeasureFields("none", {
        contents_per_unit: "",
        contents_unit: "",
        calories_per_content: "",
      }),
    ).toEqual({});
    expect(
      validateMeasureFields("none", {
        contents_per_unit: "100",
        contents_unit: "",
        calories_per_content: "",
      }),
    ).toMatchObject({ contents_unit: expect.any(String) });
    expect(
      validateMeasureFields("none", {
        contents_per_unit: "100",
        contents_unit: "gram",
        calories_per_content: "2",
      }),
    ).toEqual({});
  });
});

describe("measurePayload", () => {
  it("keeps optional measures for unmapped categories", () => {
    expect(
      measurePayload("none", {
        contents_per_unit: "100",
        contents_unit: "gram",
        calories_per_content: "2.5",
      }),
    ).toEqual({
      contents_per_unit: 100,
      contents_unit: "gram",
      calories_per_content: 2.5,
    });
  });

  it("clears calories for water", () => {
    expect(
      measurePayload("water", {
        contents_per_unit: "1.5",
        contents_unit: "liter",
        calories_per_content: "999",
      }),
    ).toEqual({
      contents_per_unit: 1.5,
      contents_unit: "liter",
      calories_per_content: null,
      calories_per_unit: null,
    });
  });

  it("clears empty unmapped measures", () => {
    expect(
      measurePayload("none", {
        contents_per_unit: "",
        contents_unit: "",
        calories_per_content: "",
      }),
    ).toEqual({
      contents_per_unit: null,
      contents_unit: null,
      liters_per_unit: null,
      calories_per_content: null,
      calories_per_unit: null,
    });
  });
});

describe("showCaloriesField", () => {
  it("hides calories only for water", () => {
    expect(showCaloriesField("food")).toBe(true);
    expect(showCaloriesField("none")).toBe(true);
    expect(showCaloriesField("water")).toBe(false);
  });
});

describe("itemStatus", () => {
  it("returns bucket-derived status labels", () => {
    const expired = item({ id: "e", name: "Old" });
    const urgent = item({ id: "u", name: "Soon" });
    const low = item({ id: "l", name: "Low" });
    const ok = item({ id: "o", name: "Ok" });
    const buckets: Snapshot["buckets"] = {
      expired: [expired],
      within_urgent: [urgent],
      within_expiring: [],
      low_stock: [low],
    };
    expect(itemStatus(expired, buckets)).toBe("expired");
    expect(itemStatus(urgent, buckets)).toBe("urgent");
    expect(itemStatus(low, buckets)).toBe("low");
    expect(itemStatus(ok, buckets)).toBe("");
    expect(itemStatus(ok, null)).toBe("");
  });
});

describe("filterAndSortItems", () => {
  const rice = item({
    id: "1",
    name: "Rice",
    location: "Pantry",
    category: "Food",
    quantity: 5,
    expiry_date: "2027-01-01",
    notes: "bag",
  });
  const water = item({
    id: "2",
    name: "Bottled water",
    location: "Garage",
    category: "Water",
    quantity: 2,
    barcode: "999",
    expiry_date: "2026-06-01",
  });
  const gauze = item({
    id: "3",
    name: "Gauze",
    location: "Pantry",
    category: "Medical",
    quantity: 10,
    expiry_date: null,
  });
  const items = [rice, water, gauze];

  it("filters by search across name/location/category/barcode/notes", () => {
    expect(
      filterAndSortItems(items, emptyBuckets, settings, {
        search: "garage",
        filterStatus: "all",
        filterLocation: "",
        filterCategory: "",
        filterReadiness: "",
        sort: "name",
      }).map((i) => i.id),
    ).toEqual(["2"]);
    expect(
      filterAndSortItems(items, emptyBuckets, settings, {
        search: "999",
        filterStatus: "all",
        filterLocation: "",
        filterCategory: "",
        filterReadiness: "",
        sort: "name",
      }).map((i) => i.id),
    ).toEqual(["2"]);
    expect(
      filterAndSortItems(items, emptyBuckets, settings, {
        search: "bag",
        filterStatus: "all",
        filterLocation: "",
        filterCategory: "",
        filterReadiness: "",
        sort: "name",
      }).map((i) => i.id),
    ).toEqual(["1"]);
  });

  it("filters by location, category, and readiness", () => {
    expect(
      filterAndSortItems(items, emptyBuckets, settings, {
        search: "",
        filterStatus: "all",
        filterLocation: "Pantry",
        filterCategory: "",
        filterReadiness: "",
        sort: "name",
      }).map((i) => i.name),
    ).toEqual(["Gauze", "Rice"]);
    expect(
      filterAndSortItems(items, emptyBuckets, settings, {
        search: "",
        filterStatus: "all",
        filterLocation: "",
        filterCategory: "Water",
        filterReadiness: "",
        sort: "name",
      }).map((i) => i.id),
    ).toEqual(["2"]);
    expect(
      filterAndSortItems(items, emptyBuckets, settings, {
        search: "",
        filterStatus: "all",
        filterLocation: "",
        filterCategory: "",
        filterReadiness: "food",
        sort: "name",
      }).map((i) => i.id),
    ).toEqual(["1"]);
  });

  it("filters by bucket status", () => {
    const buckets: Snapshot["buckets"] = {
      expired: [water],
      within_urgent: [rice],
      within_expiring: [],
      low_stock: [gauze],
    };
    expect(
      filterAndSortItems(items, buckets, settings, {
        search: "",
        filterStatus: "expired",
        filterLocation: "",
        filterCategory: "",
        filterReadiness: "",
        sort: "name",
      }).map((i) => i.id),
    ).toEqual(["2"]);
    expect(
      filterAndSortItems(items, buckets, settings, {
        search: "",
        filterStatus: "expiring",
        filterLocation: "",
        filterCategory: "",
        filterReadiness: "",
        sort: "name",
      }).map((i) => i.id),
    ).toEqual(["1"]);
    expect(
      filterAndSortItems(items, buckets, settings, {
        search: "",
        filterStatus: "low_stock",
        filterLocation: "",
        filterCategory: "",
        filterReadiness: "",
        sort: "name",
      }).map((i) => i.id),
    ).toEqual(["3"]);
  });

  it("sorts by name, quantity, and expiry", () => {
    expect(
      filterAndSortItems(items, emptyBuckets, settings, {
        search: "",
        filterStatus: "all",
        filterLocation: "",
        filterCategory: "",
        filterReadiness: "",
        sort: "name",
      }).map((i) => i.name),
    ).toEqual(["Bottled water", "Gauze", "Rice"]);
    expect(
      filterAndSortItems(items, emptyBuckets, settings, {
        search: "",
        filterStatus: "all",
        filterLocation: "",
        filterCategory: "",
        filterReadiness: "",
        sort: "quantity",
      }).map((i) => i.id),
    ).toEqual(["2", "1", "3"]);
    expect(
      filterAndSortItems(items, emptyBuckets, settings, {
        search: "",
        filterStatus: "all",
        filterLocation: "",
        filterCategory: "",
        filterReadiness: "",
        sort: "expiry",
      }).map((i) => i.id),
    ).toEqual(["2", "1", "3"]);
  });
});
