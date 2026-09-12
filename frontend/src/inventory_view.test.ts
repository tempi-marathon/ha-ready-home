import { describe, expect, it } from "vitest";
import type { InventoryItemDto, SettingsDto, Snapshot } from "./api";
import {
  filterAndSortItems,
  itemStatus,
  readinessKind,
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
  attribute_item_cap: 100,
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
