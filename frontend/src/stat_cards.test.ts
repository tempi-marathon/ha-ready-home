import { afterEach, describe, expect, it } from "vitest";
import type { SettingsDto } from "./api";
import "./panel";
import type { HomeAssistant } from "./types";

const SETTINGS = {
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
} as SettingsDto;

type PanelEl = HTMLElement & { hass: HomeAssistant; updateComplete: Promise<boolean> };

async function mount(assessment: Record<string, unknown>): Promise<PanelEl> {
  const hass = {
    states: {},
    language: "en",
    callService: async () => undefined,
    connection: {
      sendMessagePromise: async () => SETTINGS as never,
      subscribeMessage: async (cb: (snap: unknown) => void) => {
        cb({
          items: [],
          assessment,
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

const cards = (el: PanelEl) =>
  Array.from(el.shadowRoot!.querySelectorAll<HTMLElement>("hpu-stat-card"));

afterEach(() => {
  document.body.innerHTML = "";
});

describe("stat cards", () => {
  it("colours each card and its time-on-hand line by how long supplies last", async () => {
    const el = await mount({
      supply_hours: 100,
      water_supply_hours: 24,
      food_supply_hours: 0,
    });
    const [readiness, water, food] = cards(el);
    expect(readiness.getAttribute("tone")).toBe("success");
    expect(readiness.hasAttribute("detail-tone")).toBe(false);
    expect(water.getAttribute("tone")).toBe("warning");
    expect(water.getAttribute("detail-tone")).toBe("warning");
    expect(food.getAttribute("tone")).toBe("danger");
    expect(food.getAttribute("detail-tone")).toBe("danger");
    el.remove();
  });

  it("marks the dialog-opening cards as such and leaves Water as a plain card", async () => {
    const el = await mount({ supply_hours: 100 });
    const clickable = cards(el).filter((c) => c.hasAttribute("clickable"));
    expect(clickable.length).toBeGreaterThanOrEqual(2);
    for (const c of clickable) {
      expect(c.getAttribute("haspopup")).toBe("dialog");
      expect(c.getAttribute("accessible-label")).toBeTruthy();
    }
    const water = cards(el).find((c) => c.getAttribute("label") === "Water");
    expect(water?.hasAttribute("clickable")).toBe(false);
    el.remove();
  });
});
