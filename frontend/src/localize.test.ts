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
});
