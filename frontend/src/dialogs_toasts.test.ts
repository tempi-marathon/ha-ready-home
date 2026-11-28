import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { InventoryItemDto, SettingsDto } from "./api";

vi.mock("@tempi-marathon/ha-panel-ui/components/confirm/confirm.js", async (original) => ({
  ...(await original<object>()),
  confirm: vi.fn(),
}));
vi.mock("@tempi-marathon/ha-panel-ui/components/toast/toast.js", async (original) => ({
  ...(await original<object>()),
  showToast: vi.fn(),
}));

import { confirm } from "@tempi-marathon/ha-panel-ui/components/confirm/confirm.js";
import { showToast } from "@tempi-marathon/ha-panel-ui/components/toast/toast.js";
import "./panel";
import type { HomeAssistant } from "./types";

const SETTINGS = {
  number_of_people: 1,
  duration_hours: 72,
  water_liters_per_person_per_day: 3,
  calories_per_person_per_day: 2000,
  locations: ["Pantry"],
  categories: ["Food", "Tools"],
  food_categories: ["Food"],
  water_categories: [],
  expiring_days: 30,
  urgent_days: 7,
} as SettingsDto;

const RICE: InventoryItemDto = {
  id: "1",
  name: "Rice",
  quantity: 2,
  desired_quantity: 0,
  unit: "piece",
  location: "Pantry",
  category: "Tools",
  priority: "important",
  expiry_date: null,
};

type PanelEl = HTMLElement & {
  hass: HomeAssistant;
  updateComplete: Promise<boolean>;
  _remove(item: InventoryItemDto): Promise<void>;
  _save(): Promise<void>;
  _openEdit(item: InventoryItemDto): void;
  _error: string;
};

async function mount(callService: (...a: unknown[]) => Promise<unknown>): Promise<PanelEl> {
  const hass = {
    states: {},
    language: "en",
    user: { is_admin: true },
    callService,
    connection: {
      sendMessagePromise: async () => SETTINGS as never,
      subscribeMessage: async (cb: (snap: unknown) => void) => {
        cb({
          items: [RICE],
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
  const el = document.createElement("ready-home-panel") as unknown as PanelEl;
  el.hass = hass;
  document.body.appendChild(el);
  await new Promise((resolve) => setTimeout(resolve, 0));
  await el.updateComplete;
  return el;
}

beforeEach(() => {
  vi.mocked(confirm).mockReset();
  vi.mocked(showToast).mockReset();
});

afterEach(() => {
  document.body.innerHTML = "";
});

describe("removing an item", () => {
  it("asks with a themed confirmation, mounted inside the panel, and does nothing when declined", async () => {
    vi.mocked(confirm).mockResolvedValue(false);
    const calls: unknown[][] = [];
    const el = await mount(async (...a) => void calls.push(a));
    await el._remove(RICE);
    expect(confirm).toHaveBeenCalledOnce();
    const options = vi.mocked(confirm).mock.calls[0][0];
    expect(options.message).toContain("Rice");
    expect(options.tone).toBe("danger");
    expect(options.host).toBe(el.shadowRoot!.querySelector(".overlays"));
    expect(calls).toEqual([]);
    expect(showToast).not.toHaveBeenCalled();
    el.remove();
  });

  it("removes the item and shows a success toast when confirmed", async () => {
    vi.mocked(confirm).mockResolvedValue(true);
    const calls: unknown[][] = [];
    const el = await mount(async (...a) => void calls.push(a));
    await el._remove(RICE);
    expect(calls[0].slice(0, 3)).toEqual(["ready_home", "remove_item", { item_id: "1" }]);
    expect(showToast).toHaveBeenCalledWith(
      expect.objectContaining({ tone: "success", message: expect.stringContaining("Rice") }),
    );
    el.remove();
  });

  it("shows an error toast when removing fails", async () => {
    vi.mocked(confirm).mockResolvedValue(true);
    const el = await mount(async () => {
      throw new Error("boom");
    });
    await el._remove(RICE);
    expect(showToast).toHaveBeenCalledWith(expect.objectContaining({ tone: "danger" }));
    expect(el._error).not.toBe("");
    el.remove();
  });
});

describe("item dialog", () => {
  it("shows a success toast after saving and an error toast when saving fails", async () => {
    const el = await mount(async () => undefined);
    el._openEdit(RICE);
    await el.updateComplete;
    await el._save();
    expect(showToast).toHaveBeenCalledWith(
      expect.objectContaining({ tone: "success", message: expect.stringContaining("Rice") }),
    );
    el.remove();

    vi.mocked(showToast).mockReset();
    const failing = await mount(async () => {
      throw new Error("nope");
    });
    failing._openEdit(RICE);
    await failing.updateComplete;
    await failing._save();
    expect(showToast).toHaveBeenCalledWith(expect.objectContaining({ tone: "danger" }));
    failing.remove();
  });

  it("stays open on a backdrop click but closes from the close button or Escape", async () => {
    const el = await mount(async () => undefined);
    el._openEdit(RICE);
    await el.updateComplete;
    const modal = () => el.shadowRoot!.querySelector("hpu-modal");
    const close = (reason: string) =>
      modal()!.dispatchEvent(
        new CustomEvent("hpu-close", {
          detail: { reason },
          bubbles: true,
          composed: true,
          cancelable: true,
        }),
      );
    close("backdrop");
    await el.updateComplete;
    expect(modal()).not.toBeNull();
    close("escape");
    await el.updateComplete;
    expect(modal()).toBeNull();
    el.remove();
  });
});
