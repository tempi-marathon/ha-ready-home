/** Shared websocket / DTO types for Ready Home. */

import type { HomeAssistant } from "./types";

export interface InventoryItemDto {
  id: string;
  name: string;
  quantity: number;
  desired_quantity: number;
  unit: string;
  location: string;
  category: string;
  notes?: string;
  barcode?: string;
  priority: string;
  expiry_date: string | null;
  contents_per_unit?: number | null;
  contents_unit?: string | null;
  calories_per_content?: number | null;
  liters_per_unit?: number | null;
  calories_per_unit?: number | null;
}

export interface Snapshot {
  items: InventoryItemDto[];
  assessment: Record<string, unknown>;
  buckets: {
    expired: InventoryItemDto[];
    within_urgent: InventoryItemDto[];
    within_expiring: InventoryItemDto[];
    low_stock: InventoryItemDto[];
  };
  completeness?: {
    overall_percent: number | null;
    categories: Record<
      string,
      CategoryCompletenessDto
    >;
  };
  /** Present on subscribe/list pushes; optional for older clients. */
  settings?: SettingsDto;
}

export interface MissingItemDto {
  id: string;
  name: string;
  quantity: number;
  desired_quantity: number;
  expired: boolean;
}

export interface CategoryCompletenessDto {
  percent: number;
  complete: number;
  total: number;
  missing: MissingItemDto[];
}

export interface SettingsDto {
  number_of_people: number | null;
  duration_hours: number;
  water_liters_per_person_per_day: number;
  calories_per_person_per_day: number;
  locations: string[];
  categories: string[];
  food_categories: string[];
  water_categories: string[];
  expiring_days: number;
  urgent_days: number;
  todo_entity_id?: string | null;
  auto_push_restock?: boolean;
  /** Added with age categories; absent when the backend is older than the panel. */
  age_categories?: AgeCategoryDto[];
  daily_calories?: number | null;
  daily_water_liters?: number | null;
  /** Added with pets; absent when the backend is older than the panel. */
  pets?: PetDto[];
  pet_food_categories?: string[];
  daily_pet_food_grams?: number;
  daily_pet_water_liters?: number;
  target_breakdown?: TargetBreakdownDto;
}

export interface PetDto {
  id: string;
  name: string;
  type?: string;
  food_grams_per_day: number;
  water_liters_per_day: number;
}

/** Per-group target subtotals over the full duration (no UI yet). */
export interface TargetBreakdownDto {
  water_liters: { age_categories: Record<string, number>; pets: Record<string, number> };
  food_calories: { age_categories: Record<string, number> };
  pet_food_grams: { pets: Record<string, number> };
}

export interface AgeCategoryDto {
  key: string;
  count: number;
  calories_per_day: number;
  water_liters_per_day: number;
}

export interface KitTemplateDto {
  id: string;
  name: string;
  description: string;
  item_count: number;
  items: Array<{
    name: string;
    category: string;
    desired_quantity: number;
    quantity: number;
    priority: string;
    unit: string;
  }>;
}

export async function listItems(hass: HomeAssistant): Promise<Snapshot> {
  return hass.connection.sendMessagePromise<Snapshot>({
    type: "ready_home/items/list",
  });
}

export async function getSettings(hass: HomeAssistant): Promise<SettingsDto> {
  return hass.connection.sendMessagePromise<SettingsDto>({
    type: "ready_home/settings",
  });
}

export async function subscribeInventory(
  hass: HomeAssistant,
  callback: (snapshot: Snapshot) => void,
): Promise<() => void> {
  return hass.connection.subscribeMessage<Snapshot>(callback, {
    type: "ready_home/subscribe",
  });
}

export async function lookupBarcode(
  hass: HomeAssistant,
  barcode: string,
): Promise<{
  name: string;
  brand: string;
  contents_per_unit: number | null;
  contents_unit: string | null;
  calories_per_100g: number | null;
  calories_per_100ml: number | null;
  barcode: string;
}> {
  return hass.connection.sendMessagePromise({
    type: "ready_home/barcode/lookup",
    barcode,
  });
}

export async function listKitTemplates(
  hass: HomeAssistant,
): Promise<KitTemplateDto[]> {
  const result = await hass.connection.sendMessagePromise<{
    templates: KitTemplateDto[];
  }>({
    type: "ready_home/kit_templates/list",
  });
  return result.templates;
}
