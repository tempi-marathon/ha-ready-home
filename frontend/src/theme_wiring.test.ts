import { afterEach, describe, expect, it } from "vitest";
import type { SettingsDto } from "./api";
import "./panel";
import type { HomeAssistant } from "./types";

const SETTINGS = {
  number_of_people: 1,
  duration_hours: 72,
  water_liters_per_person_per_day: 3,
  calories_per_person_per_day: 2000,
  locations: [],
  categories: [],
  food_categories: [],
  water_categories: [],
  expiring_days: 30,
  urgent_days: 7,
} as SettingsDto;

type PanelEl = HTMLElement & { hass: HomeAssistant; updateComplete: Promise<boolean> };

function hassFor(extra: Partial<HomeAssistant>): HomeAssistant {
  return {
    states: {},
    language: "en",
    callService: async () => undefined,
    connection: {
      sendMessagePromise: async () => SETTINGS as never,
      subscribeMessage: async () => () => undefined,
    },
    localize: (key: string) => key,
    ...extra,
  } as unknown as HomeAssistant;
}

async function mount(hass: HomeAssistant): Promise<PanelEl> {
  const el = document.createElement("ready-home-panel") as PanelEl;
  el.hass = hass;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("shared UI library wiring", () => {
  it("mirrors Home Assistant dark mode onto the panel root", async () => {
    const el = await mount(hassFor({ themes: { darkMode: true } }));
    expect(el.dataset.theme).toBe("dark");
    el.hass = hassFor({ themes: { darkMode: false } });
    await el.updateComplete;
    expect(el.dataset.theme).toBeUndefined();
  });

  it("does not throw when hass has no themes or language", async () => {
    const el = await mount(hassFor({ themes: undefined, language: undefined }));
    expect(el.dataset.theme).toBeUndefined();
  });

  it("applies a changed language without throwing", async () => {
    const el = await mount(hassFor({ language: "en" }));
    el.hass = hassFor({ language: "nl" });
    await expect(el.updateComplete).resolves.toBeTruthy();
  });
});
