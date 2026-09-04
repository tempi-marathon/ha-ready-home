/** Websocket helpers for Ready Home. */

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
  resource: string;
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
}

export interface SettingsDto {
  number_of_people: number | null;
  duration_hours: number;
  water_liters_per_person_per_day: number;
  calories_per_person_per_day: number;
  locations: string[];
  categories: string[];
  expiring_days: number;
  urgent_days: number;
  attribute_item_cap: number;
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
  calories_per_100g: number | null;
  barcode: string;
}> {
  return hass.connection.sendMessagePromise({
    type: "ready_home/barcode/lookup",
    barcode,
  });
}
