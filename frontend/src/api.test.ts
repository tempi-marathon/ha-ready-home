import { describe, expect, it, vi, type Mock } from "vitest";
import {
  getSettings,
  listItems,
  lookupBarcode,
  subscribeInventory,
} from "./api";
import type { HomeAssistant } from "./types";

function mockHass(
  sendMessagePromise: Mock,
  subscribeMessage: Mock = vi.fn(),
): HomeAssistant {
  // Vitest 5 Mock types are not assignable to HA's generic connection methods.
  return {
    states: {},
    callService: vi.fn(),
    connection: {
      sendMessagePromise,
      subscribeMessage,
    },
    localize: (key: string) => key,
  } as HomeAssistant;
}

describe("api websocket payloads", () => {
  it("listItems sends ready_home/items/list", async () => {
    const send = vi.fn().mockResolvedValue({ items: [], assessment: {}, buckets: {} });
    await listItems(mockHass(send));
    expect(send).toHaveBeenCalledWith({ type: "ready_home/items/list" });
  });

  it("getSettings sends ready_home/settings", async () => {
    const send = vi.fn().mockResolvedValue({
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
    });
    await getSettings(mockHass(send));
    expect(send).toHaveBeenCalledWith({ type: "ready_home/settings" });
  });

  it("subscribeInventory sends ready_home/subscribe", async () => {
    const unsub = vi.fn();
    const subscribe = vi.fn().mockResolvedValue(unsub);
    const callback = vi.fn();
    const result = await subscribeInventory(mockHass(vi.fn(), subscribe), callback);
    expect(subscribe).toHaveBeenCalledWith(callback, {
      type: "ready_home/subscribe",
    });
    expect(result).toBe(unsub);
  });

  it("lookupBarcode sends barcode and type", async () => {
    const send = vi.fn().mockResolvedValue({
      name: "Beans",
      brand: "Acme",
      contents_per_unit: 400,
      contents_unit: "gram",
      calories_per_100g: 100,
      calories_per_100ml: null,
      barcode: "123",
    });
    await lookupBarcode(mockHass(send), "123");
    expect(send).toHaveBeenCalledWith({
      type: "ready_home/barcode/lookup",
      barcode: "123",
    });
  });
});
