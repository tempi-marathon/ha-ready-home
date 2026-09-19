/** Pure inventory list filtering / sorting for the Ready Home panel. */

import type { InventoryItemDto, SettingsDto, Snapshot } from "./api";

export type InventorySort = "name" | "expiry" | "quantity";
export type ReadinessKind = "food" | "water" | "none";

export interface InventoryViewFilters {
  search: string;
  filterStatus: string;
  filterLocation: string;
  filterCategory: string;
  filterReadiness: string;
  sort: InventorySort;
}

export interface MeasureFormFields {
  contents_per_unit: string;
  contents_unit: string;
  calories_per_content: string;
}

export function readinessKind(
  category: string,
  settings: SettingsDto | null | undefined,
): ReadinessKind {
  const key = category.trim().toLowerCase();
  if (!key || !settings) return "none";
  if (
    (settings.water_categories ?? []).some(
      (c) => c.trim().toLowerCase() === key,
    )
  ) {
    return "water";
  }
  if (
    (settings.food_categories ?? []).some(
      (c) => c.trim().toLowerCase() === key,
    )
  ) {
    return "food";
  }
  return "none";
}

/** Contents fields are always shown; calories for food and unmapped (not water). */
export function showCaloriesField(kind: ReadinessKind): boolean {
  return kind === "food" || kind === "none";
}

function parseDecimal(raw: string): number {
  const cleaned = raw.trim().replace(",", ".");
  if (!cleaned) return Number.NaN;
  return Number(cleaned);
}

function formatMeasureNumber(value: number): string {
  const n = Number(value);
  if (Number.isNaN(n)) return "—";
  return Math.abs(n - Math.round(n)) < 0.05
    ? String(Math.round(n))
    : String(Math.round(n * 100) / 100);
}

export function contentsToLiters(amount: number, unit: string): number | null {
  if (unit === "liter") return amount;
  if (unit === "milliliter") return amount / 1000;
  return null;
}

export function itemLitersOnHand(item: InventoryItemDto): number | null {
  if (item.contents_per_unit != null && item.contents_unit) {
    const each = contentsToLiters(item.contents_per_unit, item.contents_unit);
    if (each != null) return item.quantity * each;
  }
  if (item.unit === "liter") return item.quantity;
  if (item.unit === "milliliter") return item.quantity / 1000;
  if (item.liters_per_unit != null) {
    return item.quantity * item.liters_per_unit;
  }
  return null;
}

export function itemCaloriesOnHand(item: InventoryItemDto): number | null {
  if (item.contents_per_unit != null && item.calories_per_content != null) {
    return item.quantity * item.contents_per_unit * item.calories_per_content;
  }
  if (item.calories_per_unit != null) {
    return item.quantity * item.calories_per_unit;
  }
  return null;
}

/** List-card measure text: food → kcal, water → L, unmapped → kcal and/or L when set. */
export function formatItemMeasure(
  item: InventoryItemDto,
  kind: ReadinessKind,
): string {
  if (kind === "food") {
    const kcal = itemCaloriesOnHand(item);
    return kcal == null ? "" : `${formatMeasureNumber(kcal)} kcal`;
  }
  if (kind === "water") {
    const liters = itemLitersOnHand(item);
    return liters == null ? "" : `${formatMeasureNumber(liters)} L`;
  }
  const parts: string[] = [];
  const kcal = itemCaloriesOnHand(item);
  if (kcal != null) parts.push(`${formatMeasureNumber(kcal)} kcal`);
  const liters = itemLitersOnHand(item);
  if (liters != null) parts.push(`${formatMeasureNumber(liters)} L`);
  return parts.join(" · ");
}

/** Validate contents/calories fields based on readiness kind. */
export function validateMeasureFields(
  kind: ReadinessKind,
  fields: MeasureFormFields,
): Record<string, string> {
  const errors: Record<string, string> = {};
  const contentsRaw = fields.contents_per_unit.trim();
  const unitRaw = fields.contents_unit.trim();
  const calRaw = fields.calories_per_content.trim();
  const contents = parseDecimal(contentsRaw);
  const cal = parseDecimal(calRaw);

  if (kind === "food" || kind === "water") {
    if (contentsRaw === "" || Number.isNaN(contents) || contents <= 0) {
      errors.contents_per_unit = "Contents per unit is required";
    }
    if (!unitRaw) {
      errors.contents_unit = "Contents unit is required";
    } else if (
      kind === "water" &&
      unitRaw !== "liter" &&
      unitRaw !== "milliliter"
    ) {
      errors.contents_unit = "Water contents must be liter or milliliter";
    }
  } else {
    // Unmapped: optional, but amount and unit must both be set if either is.
    const hasAmount = contentsRaw !== "";
    const hasUnit = Boolean(unitRaw);
    if (hasAmount || hasUnit) {
      if (!hasAmount || Number.isNaN(contents) || contents <= 0) {
        errors.contents_per_unit = "Enter contents per unit or clear both fields";
      }
      if (!hasUnit) {
        errors.contents_unit = "Select a contents unit or clear both fields";
      }
    }
  }

  if (kind === "food") {
    if (calRaw === "" || Number.isNaN(cal) || cal < 0) {
      errors.calories_per_content = "Calories per contents unit is required";
    }
  } else if (kind === "none" && calRaw !== "") {
    if (Number.isNaN(cal) || cal < 0) {
      errors.calories_per_content = "Enter a valid calorie value";
    }
  }

  return errors;
}

/** Build contents/calories payload for add/update based on readiness kind. */
export function measurePayload(
  kind: ReadinessKind,
  fields: MeasureFormFields,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  const contentsRaw = fields.contents_per_unit.trim();
  const unitRaw = fields.contents_unit.trim();
  const calRaw = fields.calories_per_content.trim();

  if (kind === "water") {
    payload.contents_per_unit = parseDecimal(contentsRaw);
    payload.contents_unit = unitRaw;
    payload.calories_per_content = null;
    payload.calories_per_unit = null;
    return payload;
  }

  if (kind === "food") {
    payload.contents_per_unit = parseDecimal(contentsRaw);
    payload.contents_unit = unitRaw;
    payload.calories_per_content = parseDecimal(calRaw);
    return payload;
  }

  // Unmapped: keep whatever the user filled; clear when empty.
  if (contentsRaw && unitRaw) {
    payload.contents_per_unit = parseDecimal(contentsRaw);
    payload.contents_unit = unitRaw;
  } else {
    payload.contents_per_unit = null;
    payload.contents_unit = null;
    payload.liters_per_unit = null;
  }
  if (calRaw) {
    payload.calories_per_content = parseDecimal(calRaw);
  } else {
    payload.calories_per_content = null;
    payload.calories_per_unit = null;
  }
  return payload;
}

export function itemStatus(
  item: InventoryItemDto,
  buckets: Snapshot["buckets"] | null | undefined,
): string {
  if (!buckets) return "";
  if (buckets.expired.some((i) => i.id === item.id)) return "expired";
  if (buckets.within_urgent.some((i) => i.id === item.id)) return "urgent";
  if (buckets.within_expiring.some((i) => i.id === item.id)) return "expiring";
  if (buckets.low_stock.some((i) => i.id === item.id)) return "low";
  return "";
}

export function filterAndSortItems(
  items: InventoryItemDto[],
  buckets: Snapshot["buckets"] | null | undefined,
  settings: SettingsDto | null | undefined,
  filters: InventoryViewFilters,
): InventoryItemDto[] {
  let result = [...items];
  const q = filters.search.trim().toLowerCase();
  if (q) {
    result = result.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.location.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        (i.barcode || "").toLowerCase().includes(q) ||
        (i.notes || "").toLowerCase().includes(q),
    );
  }
  if (filters.filterLocation) {
    result = result.filter(
      (i) =>
        i.location.toLowerCase() === filters.filterLocation.toLowerCase(),
    );
  }
  if (filters.filterCategory) {
    result = result.filter(
      (i) =>
        i.category.toLowerCase() === filters.filterCategory.toLowerCase(),
    );
  }
  if (filters.filterReadiness) {
    result = result.filter(
      (i) => readinessKind(i.category, settings) === filters.filterReadiness,
    );
  }
  if (filters.filterStatus !== "all") {
    const ids = new Set<string>();
    if (filters.filterStatus === "expired") {
      buckets?.expired.forEach((i) => ids.add(i.id));
    } else if (filters.filterStatus === "expiring") {
      buckets?.within_urgent.forEach((i) => ids.add(i.id));
      buckets?.within_expiring.forEach((i) => ids.add(i.id));
    } else if (filters.filterStatus === "low_stock") {
      buckets?.low_stock.forEach((i) => ids.add(i.id));
    }
    result = result.filter((i) => ids.has(i.id));
  }
  result.sort((a, b) => {
    if (filters.sort === "quantity") return a.quantity - b.quantity;
    if (filters.sort === "expiry") {
      return (a.expiry_date || "9999").localeCompare(b.expiry_date || "9999");
    }
    return a.name.localeCompare(b.name);
  });
  return result;
}
