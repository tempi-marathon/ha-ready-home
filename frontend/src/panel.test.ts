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

describe("ready-home panel package", () => {
  it("registers the sidebar panel custom element", () => {
    expect(customElements.get("ready-home-panel")).toBeDefined();
  });
});

const COMPLETENESS = {
  overall_percent: 50,
  categories: {
    Medical: {
      percent: 33.3,
      complete: 1,
      total: 3,
      missing: [
        { id: "p", name: "Plasters", quantity: 2, desired_quantity: 5, expired: false },
        { id: "b", name: "Bandage", quantity: 4, desired_quantity: 2, expired: true },
      ],
    },
    Tools: { percent: 100, complete: 2, total: 2, missing: [] },
  },
};

async function mountWithCompleteness(
  language: string,
  completeness: unknown = COMPLETENESS,
) {
  const hass = hassFor(language, LEGACY_SETTINGS);
  (hass.connection as unknown as {
    subscribeMessage: (cb: (s: unknown) => void) => Promise<() => void>;
  }).subscribeMessage = async (cb) => {
    cb({ ...SNAPSHOT, settings: LEGACY_SETTINGS, completeness });
    return () => undefined;
  };
  const el = document.createElement("ready-home-panel") as HTMLElement & {
    hass: HomeAssistant;
    updateComplete: Promise<boolean>;
  };
  el.hass = hass;
  document.body.appendChild(el);
  await new Promise((resolve) => setTimeout(resolve, 0));
  await el.updateComplete;
  return el;
}

describe("completeness dialog", () => {
  it("opens from the tile and lists missing items with reasons", async () => {
    const el = await mountWithCompleteness("en");
    const root = el.shadowRoot!;
    expect(root.querySelector('[role="dialog"]')).toBeNull();
    expect(root.querySelector(".stats")?.textContent).not.toContain("Essential");

    (root.querySelector(".stat-button") as HTMLElement).click();
    await el.updateComplete;

    const dialog = root.querySelector('[role="dialog"]')!;
    const text = (dialog.textContent ?? "").replace(/\s+/g, " ");
    expect(text).toContain("Medical");
    expect(text).toContain("1/3");
    expect(text).toContain("Plasters");
    expect(text).toContain("2 of 5");
    expect(text).toContain("Bandage");
    expect(text).toContain("expired");
    expect(text).toContain("Tools");
    expect(text).toContain("2/2");
    expect(root.querySelectorAll(".completeness-missing li")).toHaveLength(2);

    (root.querySelector(".dialog-close") as HTMLElement).click();
    await el.updateComplete;
    expect(root.querySelector('[role="dialog"]')).toBeNull();
    el.remove();
  });

  it("closes on Escape and is localized in Dutch", async () => {
    const el = await mountWithCompleteness("nl");
    const root = el.shadowRoot!;
    (root.querySelector(".stat-button") as HTMLElement).click();
    await el.updateComplete;
    const text = root.querySelector('[role="dialog"]')?.textContent ?? "";
    expect(text).toContain("verlopen");
    expect(text).toContain("2 van 5");

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await el.updateComplete;
    expect(root.querySelector('[role="dialog"]')).toBeNull();
    el.remove();
  });

  it("marks a complete category and shows the all-complete message", async () => {
    const allComplete = {
      overall_percent: 100,
      categories: {
        Tools: { percent: 100, complete: 2, total: 2, missing: [] },
      },
    };
    for (const [lang, message, check] of [
      ["en", "Everything is complete.", "Complete"],
      ["nl", "Alles is compleet.", "Compleet"],
    ] as const) {
      const el = await mountWithCompleteness(lang, allComplete);
      const root = el.shadowRoot!;
      (root.querySelector(".stat-button") as HTMLElement).click();
      await el.updateComplete;
      const dialog = root.querySelector('[role="dialog"]')!;
      expect(dialog.textContent).toContain(message);
      expect(dialog.querySelector(".completeness-missing")).toBeNull();
      expect(
        dialog.querySelector(".completeness-check")?.getAttribute("aria-label"),
      ).toBe(check);
      el.remove();
    }
  });

  it("shows the check only on complete categories", async () => {
    const el = await mountWithCompleteness("en");
    const root = el.shadowRoot!;
    (root.querySelector(".stat-button") as HTMLElement).click();
    await el.updateComplete;
    expect(root.querySelectorAll(".completeness-check")).toHaveLength(1);
    expect(root.querySelector('[role="dialog"]')?.textContent).not.toContain(
      "Everything is complete.",
    );
    el.remove();
  });
});
