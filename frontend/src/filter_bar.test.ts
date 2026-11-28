import { afterEach, describe, expect, it } from "vitest";
import type { InventoryItemDto, SettingsDto } from "./api";
import "./panel";
import type { HomeAssistant } from "./types";

const SETTINGS = {
  number_of_people: 2,
  duration_hours: 72,
  water_liters_per_person_per_day: 3,
  calories_per_person_per_day: 2000,
  locations: ["Pantry", "Garage"],
  categories: ["Food", "Water"],
  food_categories: ["Food"],
  water_categories: ["Water"],
  expiring_days: 30,
  urgent_days: 7,
} as SettingsDto;

const item = (id: string, name: string, extra: Partial<InventoryItemDto> = {}): InventoryItemDto => ({
  id,
  name,
  quantity: 1,
  desired_quantity: 0,
  unit: "piece",
  location: "Pantry",
  category: "Food",
  priority: "important",
  expiry_date: null,
  ...extra,
});

const ITEMS = [
  item("1", "Rice"),
  item("2", "Beans", { location: "Garage" }),
  item("3", "Old milk"),
];

type PanelEl = HTMLElement & {
  hass: HomeAssistant;
  panel?: { config?: Record<string, unknown> };
  updateComplete: Promise<boolean>;
};
type BarEl = HTMLElement & { filters: { key: string; options: { value: string; count?: number }[] }[]; value: unknown };

async function mount(): Promise<PanelEl> {
  const hass = {
    states: {},
    language: "en",
    callService: async () => undefined,
    connection: {
      sendMessagePromise: async () => SETTINGS as never,
      subscribeMessage: async (cb: (snap: unknown) => void) => {
        cb({
          items: ITEMS,
          assessment: {},
          settings: SETTINGS,
          buckets: { expired: [ITEMS[2]], within_urgent: [], within_expiring: [], low_stock: [] },
          completeness: {},
        });
        return () => undefined;
      },
    },
    localize: (key: string) => key,
  } as unknown as HomeAssistant;
  const el = document.createElement("ready-home-panel") as PanelEl;
  el.panel = { config: { config_entry_id: "entry1" } };
  el.hass = hass;
  document.body.appendChild(el);
  await new Promise((resolve) => setTimeout(resolve, 0));
  await el.updateComplete;
  return el;
}

const bar = (el: PanelEl) => el.shadowRoot!.querySelector<BarEl>("hpu-filter-bar")!;
const count = (el: PanelEl) => el.shadowRoot!.querySelector(".item-count")?.textContent?.trim();
const change = (el: PanelEl, value: unknown) =>
  bar(el).dispatchEvent(new CustomEvent("hpu-filter-change", { detail: { value }, bubbles: true }));

afterEach(() => {
  document.body.innerHTML = "";
  localStorage.clear();
});

describe("filter bar", () => {
  it("offers status counts from the buckets and shows every item to start", async () => {
    const el = await mount();
    const status = bar(el).filters.find((f) => f.key === "status")!;
    expect(status.options.map((o) => [o.value, o.count])).toEqual([
      ["expired", 1],
      ["expiring", 0],
      ["low_stock", 0],
    ]);
    expect(count(el)).toBe("3/3");
    el.remove();
  });

  it("narrows the list by search, status and location", async () => {
    const el = await mount();
    change(el, { search: "rice", filters: {} });
    await el.updateComplete;
    expect(count(el)).toBe("1/3");
    change(el, { search: "", filters: { status: "expired" } });
    await el.updateComplete;
    expect(count(el)).toBe("1/3");
    change(el, { search: "", filters: { location: "Garage" } });
    await el.updateComplete;
    expect(count(el)).toBe("1/3");
    change(el, { search: "", filters: {} });
    await el.updateComplete;
    expect(count(el)).toBe("3/3");
    el.remove();
  });

  it("remembers the view for the next visit", async () => {
    const el = await mount();
    change(el, { search: "milk", filters: { status: "expired" } });
    await el.updateComplete;
    el.remove();
    const again = await mount();
    expect(bar(again).value).toEqual({ search: "milk", filters: { status: "expired" } });
    expect(count(again)).toBe("1/3");
    again.remove();
  });
});
