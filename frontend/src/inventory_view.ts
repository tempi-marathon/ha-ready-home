/** Pure inventory list filtering / sorting for the Ready Home panel. */

import type { InventoryItemDto, SettingsDto, Snapshot } from "./api";

export type InventorySort = "name" | "expiry" | "quantity";

export interface InventoryViewFilters {
  search: string;
  filterStatus: string;
  filterLocation: string;
  filterCategory: string;
  filterReadiness: string;
  sort: InventorySort;
}

export function readinessKind(
  category: string,
  settings: SettingsDto | null | undefined,
): "food" | "water" | "none" {
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
