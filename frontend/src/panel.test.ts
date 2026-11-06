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

function hassFor(
  language: string,
  settings: SettingsDto,
  assessment: Record<string, unknown> = {},
): HomeAssistant {
  return {
    states: {},
    language,
    locale: { language },
    callService: async () => undefined,
    connection: {
      sendMessagePromise: async () => settings as never,
      subscribeMessage: async (cb: (snap: unknown) => void) => {
        cb({ ...SNAPSHOT, assessment, settings });
        return () => undefined;
      },
    },
    localize: (key: string) => key,
  } as unknown as HomeAssistant;
}

async function renderPanel(
  language: string,
  settings: SettingsDto,
  assessment: Record<string, unknown> = {},
): Promise<{ household: string; stats: string }> {
  const el = document.createElement("ready-home-panel") as HTMLElement & {
    hass: HomeAssistant;
    updateComplete: Promise<boolean>;
  };
  el.hass = hassFor(language, settings, assessment);
  document.body.appendChild(el);
  await new Promise((resolve) => setTimeout(resolve, 0));
  await el.updateComplete;
  const clean = (s: string | undefined | null) => (s ?? "").replace(/\s+/g, " ");
  const household = clean(el.shadowRoot?.querySelector(".household")?.textContent);
  const stats = clean(el.shadowRoot?.querySelector(".stats")?.textContent);
  el.remove();
  return { household, stats };
}

async function render(language: string, settings: SettingsDto): Promise<string> {
  return (await renderPanel(language, settings)).household;
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

const PET_SETTINGS: SettingsDto = {
  ...LEGACY_SETTINGS,
  pets: [
    { id: "a", name: "Rex", type: "dog", food_grams_per_day: 400, water_liters_per_day: 0.5 },
  ],
  pet_food_categories: ["Pet food"],
  daily_pet_food_grams: 400,
  daily_pet_water_liters: 0.5,
};

const PET_ASSESSMENT = {
  water_target: 19.5,
  water_percent: 50,
  pet_food_on_hand: 600,
  pet_food_target: 1200,
  pet_food_percent: 50,
  pet_food_supply_hours: 36,
};

describe("pets", () => {
  it("shows pets and the pet food target and readiness in English", async () => {
    const { household, stats } = await renderPanel("en", PET_SETTINGS, PET_ASSESSMENT);
    expect(household).toContain("Pets");
    expect(household).toContain("Rex (dog)");
    expect(household).toContain("400 g");
    expect(household).toContain("Pet food for 3 days 1200 g");
    expect(stats).toContain("Pet food");
    expect(stats).toContain("600 g");
    expect(stats).toContain("50% · 1200 g");
  });

  it("shows pet strings in Dutch", async () => {
    const { household, stats } = await renderPanel("nl", PET_SETTINGS, PET_ASSESSMENT);
    expect(household).toContain("Huisdieren");
    expect(household).toContain("Huisdiervoer voor 3 dagen");
    expect(stats).toContain("Huisdiervoer");
  });

  it("renders an old-format response without pet fields and hides pet food", async () => {
    const { household, stats } = await renderPanel("en", LEGACY_SETTINGS, {
      water_target: 18,
      water_percent: 50,
    });
    expect(household).toContain("Adults (18–69)");
    expect(household).not.toContain("Pets");
    expect(household).not.toContain("Pet food");
    expect(stats).not.toContain("Pet food");
  });

  it("hides the pet food tile when the target is zero", async () => {
    const { stats } = await renderPanel("en", PET_SETTINGS, {
      ...PET_ASSESSMENT,
      pet_food_target: 0,
    });
    expect(stats).not.toContain("Pet food");
  });
});

describe("pet food filter", () => {
  it("offers a pet food readiness filter in both languages", async () => {
    for (const [lang, label] of [
      ["en", "Pet food"],
      ["nl", "Huisdiervoer"],
    ] as const) {
      const el = document.createElement("ready-home-panel") as HTMLElement & {
        hass: HomeAssistant;
        updateComplete: Promise<boolean>;
      };
      el.hass = hassFor(lang, PET_SETTINGS, PET_ASSESSMENT);
      document.body.appendChild(el);
      await new Promise((resolve) => setTimeout(resolve, 0));
      await el.updateComplete;
      const find = () => el.shadowRoot?.querySelector('option[value="pet_food"]');
      if (!find()) {
        // The open state is persisted between renders, so only open when closed.
        (el.shadowRoot?.querySelector(".filters-btn") as HTMLElement | null)?.click();
        await el.updateComplete;
      }
      const option = find();
      expect(option?.textContent?.trim()).toBe(label);
      el.remove();
    }
  });
});
