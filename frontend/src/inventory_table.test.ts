import { render, type TemplateResult } from "lit";
import { afterEach, describe, expect, it } from "vitest";
import type { InventoryItemDto, SettingsDto } from "./api";
import "./panel";
import type { HomeAssistant } from "./types";

const SETTINGS = {
  number_of_people: 2,
  duration_hours: 72,
  water_liters_per_person_per_day: 3,
  calories_per_person_per_day: 2000,
  locations: ["Pantry"],
  categories: ["Food"],
  food_categories: ["Food"],
  water_categories: [],
  expiring_days: 30,
  urgent_days: 7,
} as SettingsDto;

const RICE: InventoryItemDto = {
  id: "1",
  name: "Rice",
  quantity: 2,
  desired_quantity: 4,
  unit: "kg",
  location: "Pantry",
  category: "Food",
  priority: "important",
  expiry_date: null,
};

type Col = {
  key: string;
  label: string;
  primary?: boolean;
  render?: (row: InventoryItemDto) => TemplateResult | string | null | undefined;
};
type TableEl = HTMLElement & { columns: Col[]; rows: InventoryItemDto[]; loading: boolean };
type PanelEl = HTMLElement & { hass: HomeAssistant; updateComplete: Promise<boolean> };

async function mount(items: InventoryItemDto[], admin: boolean): Promise<PanelEl> {
  const hass = {
    states: {},
    language: "en",
    user: { is_admin: admin },
    callService: async () => undefined,
    connection: {
      sendMessagePromise: async () => SETTINGS as never,
      subscribeMessage: async (cb: (snap: unknown) => void) => {
        cb({
          items,
          assessment: {},
          settings: SETTINGS,
          buckets: { expired: [], within_urgent: [], within_expiring: [], low_stock: [] },
          completeness: {},
        });
        return () => undefined;
      },
    },
    localize: (key: string) => key,
  } as unknown as HomeAssistant;
  const el = document.createElement("ready-home-panel") as PanelEl;
  el.hass = hass;
  document.body.appendChild(el);
  await new Promise((resolve) => setTimeout(resolve, 0));
  await el.updateComplete;
  return el;
}

const table = (el: PanelEl) => el.shadowRoot!.querySelector<TableEl>("hpu-data-table")!;

function cellText(col: Col, row: InventoryItemDto): string {
  const out = col.render?.(row);
  const host = document.createElement("div");
  render(out ?? "", host);
  return host.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("inventory table", () => {
  it("shows one row per item with the same columns and values as before", async () => {
    const el = await mount([RICE], true);
    const t = table(el);
    expect(t.rows).toEqual([RICE]);
    expect(t.columns.map((c) => c.label)).toEqual([
      "Name",
      "Status",
      "Quantity",
      "L / kcal",
      "Location",
      "Category",
      "Expiry",
      "Actions",
    ]);
    expect(t.columns.find((c) => c.primary)?.key).toBe("name");
    const col = (key: string) => t.columns.find((c) => c.key === key)!;
    expect(cellText(col("quantity"), RICE)).toBe("2 / 4 kg");
    expect(cellText(col("location"), RICE)).toBe("Pantry");
    el.remove();
  });

  it("offers Edit and Remove to admins, and only View to read-only users", async () => {
    const admin = await mount([RICE], true);
    const actions = (el: PanelEl) => table(el).columns.find((c) => c.key === "actions")!;
    expect(cellText(actions(admin), RICE)).toBe("Edit Remove");
    admin.remove();
    const reader = await mount([RICE], false);
    expect(cellText(actions(reader), RICE)).toBe("View");
    reader.remove();
  });

  it("opens the item when a row is clicked", async () => {
    const el = await mount([RICE], true);
    expect(el.shadowRoot!.querySelector('[role="dialog"]')).toBeNull();
    table(el).dispatchEvent(
      new CustomEvent("hpu-row-click", { detail: { row: RICE }, bubbles: true }),
    );
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('[role="dialog"]')).not.toBeNull();
    el.remove();
  });

  it("shows the empty message with Scan and Add for admins", async () => {
    const el = await mount([], true);
    const empty = el.shadowRoot!.querySelector('hpu-data-table [slot="empty"]');
    expect(empty?.textContent).toContain("No items match.");
    expect(empty?.textContent).toContain("Scan");
    expect(empty?.textContent).toContain("Add an item");
    el.remove();
  });
});
