import { afterEach, describe, expect, it } from "vitest";
import type { SettingsDto } from "./api";
import "./panel";
import type { HomeAssistant } from "./types";

const SETTINGS = {
  number_of_people: 1,
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

type PanelEl = HTMLElement & { hass: HomeAssistant; updateComplete: Promise<boolean> };
type FieldEl = HTMLElement & { value: string; error: string };

const press = (el: Element | null | undefined) =>
  (el?.shadowRoot?.querySelector<HTMLElement>("button") ?? (el as HTMLElement)).click();

async function openAddDialog(): Promise<PanelEl> {
  const hass = {
    states: {},
    language: "en",
    user: { is_admin: true },
    callService: async () => undefined,
    connection: {
      sendMessagePromise: async () => SETTINGS as never,
      subscribeMessage: async () => () => undefined,
    },
    localize: (key: string) => key,
  } as unknown as HomeAssistant;
  const el = document.createElement("ready-home-panel") as PanelEl;
  el.hass = hass;
  document.body.appendChild(el);
  await new Promise((resolve) => setTimeout(resolve, 0));
  await el.updateComplete;
  const add = Array.from(
    el.shadowRoot!.querySelectorAll(".header-actions hpu-button"),
  ).find((b) => b.textContent?.trim() === "Add item");
  press(add);
  await el.updateComplete;
  return el;
}

const field = (el: PanelEl, name: string) =>
  el.shadowRoot!.querySelector<FieldEl>(`[name="${name}"]`)!;

afterEach(() => {
  document.body.innerHTML = "";
});

describe("item form fields", () => {
  it("shows required-field errors on the library fields when saving an empty form", async () => {
    const el = await openAddDialog();
    const save = Array.from(el.shadowRoot!.querySelectorAll("hpu-button")).find(
      (b) => b.textContent?.trim() === "Save",
    );
    press(save);
    await el.updateComplete;
    expect(field(el, "name").error).toBe("Name is required");
    expect(field(el, "location").error).toBe("Location is required");
    expect(field(el, "category").error).toBe("Category is required");
    el.remove();
  });

  it("starts with the same defaults and clears an error when the field is edited", async () => {
    const el = await openAddDialog();
    expect(field(el, "quantity").value).toBe("1");
    expect(field(el, "desired_quantity").value).toBe("0");
    expect(field(el, "unit").value).toBe("piece");
    expect(field(el, "priority").value).toBe("important");
    const save = Array.from(el.shadowRoot!.querySelectorAll("hpu-button")).find(
      (b) => b.textContent?.trim() === "Save",
    );
    press(save);
    await el.updateComplete;
    field(el, "name").dispatchEvent(
      new CustomEvent("hpu-input", { detail: { value: "Water" }, bubbles: true }),
    );
    await el.updateComplete;
    expect(field(el, "name").value).toBe("Water");
    expect(field(el, "name").error).toBe("");
    el.remove();
  });
});
