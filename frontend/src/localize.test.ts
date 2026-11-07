import { describe, expect, it } from "vitest";
import { panelLanguage, statusLabel, t } from "./localize";
import type { HomeAssistant } from "./types";

function hass(language: string): HomeAssistant {
  return {
    states: {},
    language,
    locale: { language },
    callService: async () => undefined,
    connection: {
      sendMessagePromise: async () => ({}) as never,
      subscribeMessage: async () => () => undefined,
    },
    localize: (key: string) => key,
  };
}

describe("localize", () => {
  it("picks nl from locale", () => {
    expect(panelLanguage(hass("nl-NL"))).toBe("nl");
    expect(panelLanguage(hass("en-US"))).toBe("en");
  });

  it("falls back to english for unknown keys language", () => {
    expect(t(hass("fr"), "action.add_item")).toBe("Add item");
  });

  it("translates dutch actions", () => {
    expect(t(hass("nl"), "action.add_item")).toBe("Item toevoegen");
    expect(statusLabel(hass("nl"), "expired")).toBe("Verlopen");
  });

  it("falls back to key when missing", () => {
    expect(t(hass("en"), "missing.key")).toBe("missing.key");
  });

  it("has a Dutch translation, different from English, for every new panel string", () => {
    const keys = [
      "action.more",
      "household.food_title",
      "household.pet_food_title",
      "household.open_food",
      "household.open_pet_food",
      "household.pet",
      "household.food_per_day",
      "household.not_configured",
      "readiness.title",
      "readiness.open",
      "readiness.explain",
      "readiness.example",
      "completeness.explain",
      "completeness.example",
    ];
    for (const key of keys) {
      const en = t(hass("en"), key);
      const nl = t(hass("nl"), key);
      expect(en, key).not.toBe(key);
      expect(nl, key).not.toBe(key);
      expect(nl, key).not.toBe(en);
    }
  });
});
