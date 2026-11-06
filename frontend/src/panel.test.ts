import { describe, expect, it } from "vitest";
import type { SettingsDto } from "./api";
import "./panel";
import type { HomeAssistant } from "./types";

const LEGACY_SETTINGS: SettingsDto = {
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
};

const MIXED_SETTINGS: SettingsDto = {
  ...LEGACY_SETTINGS,
  number_of_people: 6,
  duration_hours: 336,
  age_categories: [
    { key: "adults", count: 2, calories_per_day: 2200, water_liters_per_day: 3 },
    { key: "children", count: 2, calories_per_day: 1800, water_liters_per_day: 3 },
    { key: "babies_toddlers", count: 1, calories_per_day: 1000, water_liters_per_day: 3 },
    { key: "seniors", count: 1, calories_per_day: 1900, water_liters_per_day: 3 },
  ],
  daily_calories: 10900,
  daily_water_liters: 18,
};

const SNAPSHOT = {
  items: [],
  assessment: {},
  buckets: { expired: [], within_urgent: [], within_expiring: [], low_stock: [] },
  completeness: {},
};

function hassFor(language: string, settings: SettingsDto): HomeAssistant {
  return {
    states: {},
    language,
    locale: { language },
    callService: async () => undefined,
    connection: {
      sendMessagePromise: async () => settings as never,
      subscribeMessage: async (cb: (snap: unknown) => void) => {
        cb({ ...SNAPSHOT, settings });
        return () => undefined;
      },
    },
    localize: (key: string) => key,
  } as unknown as HomeAssistant;
}

async function render(language: string, settings: SettingsDto): Promise<string> {
  const el = document.createElement("ready-home-panel") as HTMLElement & {
    hass: HomeAssistant;
    updateComplete: Promise<boolean>;
  };
  el.hass = hassFor(language, settings);
  document.body.appendChild(el);
  await new Promise((resolve) => setTimeout(resolve, 0));
  await el.updateComplete;
  const text = el.shadowRoot?.querySelector(".household")?.textContent ?? "";
  el.remove();
  return text.replace(/\s+/g, " ");
}

describe("ready-home panel package", () => {
  it("registers the sidebar panel custom element", () => {
    expect(customElements.get("ready-home-panel")).toBeDefined();
  });
});

describe("household breakdown", () => {
  it("renders from an old-format response without age_categories", async () => {
    const text = await render("en", LEGACY_SETTINGS);
    expect(text).toContain("Adults (18–69)");
    expect(text).toContain("4000 kcal");
    expect(text).toContain("Total for 3 days");
  });

  it("renders a mixed household in English", async () => {
    const text = await render("en", MIXED_SETTINGS);
    expect(text).toContain("Seniors (70+)");
    expect(text).toContain("10900 kcal");
    expect(text).toContain("Total for 14 days");
  });

  it("renders a mixed household in Dutch", async () => {
    const text = await render("nl", MIXED_SETTINGS);
    expect(text).toContain("Ouderen (70+)");
    expect(text).toContain("Totaal voor 14 dagen");
  });
});
