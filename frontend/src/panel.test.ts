import { afterEach, describe, expect, it, vi } from "vitest";
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

type PanelEl = HTMLElement & {
  hass: HomeAssistant;
  narrow: boolean;
  updateComplete: Promise<boolean>;
};

async function mountPanel(
  language: string,
  settings: SettingsDto,
  assessment: Record<string, unknown> = {},
): Promise<PanelEl> {
  const el = document.createElement("ready-home-panel") as PanelEl;
  el.hass = hassFor(language, settings, assessment);
  document.body.appendChild(el);
  await new Promise((resolve) => setTimeout(resolve, 0));
  await el.updateComplete;
  return el;
}

/** Library controls handle clicks on the native control inside their shadow root. */
const press = (el: Element | null | undefined) =>
  (
    el?.shadowRoot?.querySelector<HTMLElement>("button, input") ??
    (el as HTMLElement)
  ).click();

const clean = (s: string | undefined | null) => (s ?? "").replace(/\s+/g, " ");

/** Text of a modal: its heading (an attribute of the library element) plus its content. */
const modalText = (m: Element | null | undefined) =>
  clean(`${m?.getAttribute("heading") ?? ""} ${m?.textContent ?? ""}`);

/** Close a modal the way the user would: button, backdrop click or Escape. */
const closeModal = (
  m: Element | null | undefined,
  reason: "button" | "backdrop" | "escape",
) =>
  m?.dispatchEvent(
    new CustomEvent("hpu-close", {
      detail: { reason },
      bubbles: true,
      composed: true,
      cancelable: true,
    }),
  );

/** Text shown by the stat cards: their label, value, meta and detail. */
const statsText = (root: ParentNode | null | undefined) =>
  clean(
    Array.from(root?.querySelectorAll("hpu-stat-card") ?? [])
      .flatMap((c) =>
        ["label", "value", "meta", "detail"].map((a) => c.getAttribute(a)),
      )
      .join(" "),
  );

/** Render the panel; `open` clicks the Food or Pet food card and reads its modal. */
async function renderPanel(
  language: string,
  settings: SettingsDto,
  assessment: Record<string, unknown> = {},
  open: "food" | "pet_food" = "food",
): Promise<{ household: string; stats: string }> {
  const el = await mountPanel(language, settings, assessment);
  const stats = statsText(el.shadowRoot);
  press(el.shadowRoot?.querySelector(`[data-stat="${open}"]`));
  await el.updateComplete;
  const household = modalText(el.shadowRoot?.querySelector(".household-dialog"));
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
    const { household, stats } = await renderPanel(
      "en",
      PET_SETTINGS,
      PET_ASSESSMENT,
      "pet_food",
    );
    expect(household).toContain("Pet food needs");
    expect(household).toContain("Rex (dog)");
    expect(household).toContain("400 g");
    expect(household).toContain("Pet food for 3 days 1200 g");
    expect(stats).toContain("Pet food");
    expect(stats).toContain("600 g");
    expect(stats).toContain("50% · 1200 g");
  });

  it("shows pet strings in Dutch", async () => {
    const { household, stats } = await renderPanel(
      "nl",
      PET_SETTINGS,
      PET_ASSESSMENT,
      "pet_food",
    );
    expect(household).toContain("Huisdiervoerbehoefte");
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
    expect(household).not.toContain("Rex");
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
      const bar = el.shadowRoot?.querySelector("hpu-filter-bar") as
        | (HTMLElement & {
            filters: { key: string; options: { value: string; label: string }[] }[];
          })
        | null;
      const option = bar?.filters
        .find((f) => f.key === "readiness")
        ?.options.find((o) => o.value === "pet_food");
      expect(option?.label).toBe(label);
      el.remove();
    }
  });
});

describe("template item selection dialog", () => {
  type Panel = HTMLElement & {
    hass: HomeAssistant;
    updateComplete: Promise<boolean>;
    _templateOpen: boolean;
    _templates: unknown[];
  };

  const TEMPLATE = {
    id: "first_aid",
    name: "First aid",
    description: "Basics",
    item_count: 3,
    items: ["Bandages", "Gauze", "Tape"].map((name) => ({
      name,
      category: "Medical",
      desired_quantity: 1,
      quantity: 0,
      priority: "essential",
      unit: "pieces",
    })),
  };

  async function openDialog(
    calls: unknown[][],
    inventory: string[] = ["bandages"],
  ) {
    const el = document.createElement("ready-home-panel") as unknown as Panel;
    const hass = hassFor("en", LEGACY_SETTINGS);
    hass.callService = (async (...args: unknown[]) => {
      calls.push(args);
      return { response: { added_count: 1, skipped_count: 0 } };
    }) as never;
    hass.connection.subscribeMessage = (async (cb: (snap: unknown) => void) => {
      cb({
        ...SNAPSHOT,
        items: inventory.map((name, i) => ({
          id: `x${i}`,
          name,
          category: "Medical",
          quantity: 1,
        })),
        settings: LEGACY_SETTINGS,
      });
      return () => undefined;
    }) as never;
    (hass as unknown as { user: unknown }).user = { is_admin: true };
    el.hass = hass;
    document.body.appendChild(el);
    await new Promise((resolve) => setTimeout(resolve, 0));
    el._templates = [TEMPLATE];
    el._templateOpen = true;
    await el.updateComplete;
    const root = el.shadowRoot!;
    const checks = () =>
      Array.from(
        root.querySelectorAll<HTMLElement & { checked: boolean; indeterminate: boolean }>(
          "hpu-checkbox.template-item",
        ),
      );
    const addButton = () =>
      root.querySelector<HTMLElement & { disabled: boolean }>(
        '.template-card hpu-button[variant="filled"]',
      )!;
    return { el, root, checks, addButton };
  }

  it("lists only missing items, collapsed, all checked by default", async () => {
    const { el, root, checks, addButton } = await openDialog([]);
    expect(root.querySelector(".template-card .item-count")?.textContent).toContain(
      "2 to add",
    );
    expect(root.querySelector<HTMLDetailsElement>(".template-items")?.open).toBe(false);
    // select-all + Gauze + Tape (Bandages already exists, matched case-insensitively)
    expect(checks().map((c) => c.checked)).toEqual([true, true, true]);
    expect(root.querySelector(".template-items")?.textContent).not.toContain("Bandages");
    expect(addButton().textContent).toContain("(2)");
    el.remove();
  });

  it("adds only checked items and disables the button when none are checked", async () => {
    const calls: unknown[][] = [];
    const { el, checks, addButton } = await openDialog(calls);
    press(checks()[1]); // uncheck Gauze
    await el.updateComplete;
    expect(checks()[0].indeterminate).toBe(true);
    press(checks()[0]); // partial -> all
    await el.updateComplete;
    expect(checks().map((c) => c.checked)).toEqual([true, true, true]);
    press(checks()[0]); // all -> none
    await el.updateComplete;
    expect(addButton().disabled).toBe(true);
    press(checks()[2]); // check Tape only
    await el.updateComplete;
    press(addButton());
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(calls[0].slice(0, 3)).toEqual([
      "ready_home",
      "apply_kit_template",
      { template_id: "first_aid", item_names: ["Tape"] },
    ]);
    el.remove();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows the added/skipped notice after adding and clears it again", async () => {
    const { el, root, addButton } = await openDialog([]);
    vi.useFakeTimers();
    press(addButton());
    await vi.advanceTimersByTimeAsync(0);
    await el.updateComplete;
    expect(root.querySelector("[role=status]")?.textContent).toContain("Added 1, skipped 0.");
    await vi.advanceTimersByTimeAsync(6000);
    await el.updateComplete;
    expect(root.querySelector("[role=status]")).toBeNull();
    el.remove();
  });

  it("keeps selections when the list is collapsed and re-expanded", async () => {
    const { el, root, checks } = await openDialog([]);
    const details = root.querySelector<HTMLDetailsElement>(".template-items")!;
    details.open = true;
    press(checks()[1]); // uncheck Gauze
    await el.updateComplete;
    details.open = false;
    await el.updateComplete;
    details.open = true;
    await el.updateComplete;
    expect(checks().map((c) => c.checked)).toEqual([false, false, true]);
    expect(root.querySelector<HTMLDetailsElement>(".template-items")?.open).toBe(true);
    el.remove();
  });

  it("resets selections and collapses when the dialog is closed and reopened", async () => {
    const { el, root, checks } = await openDialog([]);
    root.querySelector<HTMLDetailsElement>(".template-items")!.open = true;
    press(checks()[1]); // uncheck Gauze
    await el.updateComplete;
    expect(checks().map((c) => c.checked)).toEqual([false, false, true]);
    (el as unknown as { _closeTemplates: () => void })._closeTemplates();
    await el.updateComplete;
    (el as unknown as { _templateOpen: boolean })._templateOpen = true;
    await el.updateComplete;
    expect(checks().map((c) => c.checked)).toEqual([true, true, true]);
    expect(root.querySelector<HTMLDetailsElement>(".template-items")?.open).toBe(false);
    el.remove();
  });

  it("shows nothing-missing and disables adding when every item exists", async () => {
    const { el, root, addButton } = await openDialog([], ["Bandages", "gauze", " TAPE "]);
    expect(root.querySelector(".template-card .item-count")?.textContent).toContain(
      "Nothing missing",
    );
    expect(root.querySelector(".template-items")).toBeNull();
    expect(addButton().disabled).toBe(true);
    el.remove();
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
    expect(root.querySelector('hpu-modal')).toBeNull();
    expect(statsText(root)).not.toContain("Essential");

    press(root.querySelector('[data-stat="completeness"]'));
    await el.updateComplete;

    const dialog = root.querySelector('hpu-modal')!;
    const text = modalText(dialog);
    expect(text).toContain("Medical");
    expect(text).toContain("1/3");
    expect(text).toContain("Plasters");
    expect(text).toContain("2 of 5");
    expect(text).toContain("Bandage");
    expect(text).toContain("expired");
    expect(text).toContain("Tools");
    expect(text).toContain("2/2");
    expect(root.querySelectorAll(".completeness-missing li")).toHaveLength(2);

    closeModal(root.querySelector("hpu-modal"), "button");
    await el.updateComplete;
    expect(root.querySelector('hpu-modal')).toBeNull();
    el.remove();
  });

  it("closes on Escape and is localized in Dutch", async () => {
    const el = await mountWithCompleteness("nl");
    const root = el.shadowRoot!;
    press(root.querySelector('[data-stat="completeness"]'));
    await el.updateComplete;
    const text = modalText(root.querySelector('hpu-modal'));
    expect(text).toContain("verlopen");
    expect(text).toContain("2 van 5");

    closeModal(root.querySelector("hpu-modal"), "escape");
    await el.updateComplete;
    expect(root.querySelector('hpu-modal')).toBeNull();
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
      press(root.querySelector('[data-stat="completeness"]'));
      await el.updateComplete;
      const dialog = root.querySelector('hpu-modal')!;
      expect(modalText(dialog)).toContain(message);
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
    press(root.querySelector('[data-stat="completeness"]'));
    await el.updateComplete;
    expect(root.querySelectorAll(".completeness-check")).toHaveLength(1);
    expect(modalText(root.querySelector('hpu-modal'))).not.toContain(
      "Everything is complete.",
    );
    el.remove();
  });
});

describe("header actions", () => {
  type HeaderPanel = HTMLElement & {
    hass: HomeAssistant;
    narrow: boolean;
    updateComplete: Promise<boolean>;
  };

  async function mount(opts: {
    narrow: boolean;
    admin?: boolean;
    todo?: string | null;
    language?: string;
    calls?: unknown[][];
  }): Promise<HeaderPanel> {
    const el = document.createElement("ready-home-panel") as HeaderPanel;
    const hass = hassFor(opts.language ?? "en", {
      ...LEGACY_SETTINGS,
      todo_entity_id: opts.todo ?? null,
    });
    (hass as unknown as { user: unknown }).user = {
      is_admin: opts.admin ?? true,
    };
    hass.callService = (async (...args: unknown[]) => {
      opts.calls?.push(args);
      return undefined;
    }) as never;
    el.hass = hass;
    el.narrow = opts.narrow;
    document.body.appendChild(el);
    await new Promise((resolve) => setTimeout(resolve, 0));
    await el.updateComplete;
    return el;
  }

  const actions = (el: HeaderPanel) =>
    Array.from(
      el.shadowRoot?.querySelectorAll(".header-actions hpu-button") ?? [],
    ).map((b) => b.textContent?.trim());
  const trigger = (el: HeaderPanel) =>
    el.shadowRoot?.querySelector<HTMLElement>(".more-btn") ?? null;
  const menuLabels = (el: HeaderPanel) =>
    Array.from(el.shadowRoot?.querySelectorAll('[role="menuitem"]') ?? []).map(
      (b) => b.textContent?.trim(),
    );
  async function openMenu(el: HeaderPanel) {
    press(trigger(el));
    await el.updateComplete;
  }

  it("shows all three buttons and no menu on wide screens", async () => {
    const el = await mount({ narrow: false });
    expect(actions(el)).toEqual(["Scan", "Add from template", "Add item"]);
    expect(trigger(el)).toBeNull();
    el.remove();
  });

  it("shows Add item plus a More actions trigger on narrow screens", async () => {
    const el = await mount({ narrow: true });
    expect(actions(el)).toEqual(["Add item"]);
    const t = trigger(el);
    expect(t?.getAttribute("label")).toBe("More actions");
    expect(t?.getAttribute("haspopup")).toBe("menu");
    expect(t?.getAttribute("expanded")).toBe("false");
    expect(el.shadowRoot?.querySelector('[role="menu"]')).toBeNull();
    el.remove();
  });

  it("shows no actions to users who cannot change inventory", async () => {
    for (const narrow of [true, false]) {
      const el = await mount({ narrow, admin: false });
      expect(actions(el)).toEqual([]);
      expect(trigger(el)).toBeNull();
      el.remove();
    }
  });

  it("lists Scan and Add from template in the menu, plus Push restock when configured", async () => {
    const el = await mount({ narrow: true });
    await openMenu(el);
    expect(trigger(el)?.getAttribute("expanded")).toBe("true");
    expect(menuLabels(el)).toEqual(["Scan", "Add from template"]);
    el.remove();
    const withList = await mount({ narrow: true, todo: "todo.restock" });
    await openMenu(withList);
    expect(menuLabels(withList)).toEqual([
      "Scan",
      "Add from template",
      "Push restock list",
    ]);
    withList.remove();
  });

  it("translates the menu", async () => {
    const el = await mount({ narrow: true, language: "nl" });
    expect(trigger(el)?.getAttribute("label")).toBe("Meer acties");
    await openMenu(el);
    expect(menuLabels(el)).toEqual(["Scannen", "Uit sjabloon"]);
    el.remove();
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const el = await mount({ narrow: true });
    await openMenu(el);
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('[role="menu"]')).toBeNull();
    expect(el.shadowRoot?.activeElement).toBe(trigger(el));
    el.remove();
  });

  it("closes on an outside click", async () => {
    const el = await mount({ narrow: true });
    await openMenu(el);
    document.body.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('[role="menu"]')).toBeNull();
    el.remove();
  });

  it("closes after choosing an entry and runs it", async () => {
    const calls: unknown[][] = [];
    const el = await mount({ narrow: true, todo: "todo.restock", calls });
    await openMenu(el);
    const push = Array.from(
      el.shadowRoot?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? [],
    ).find((b) => b.textContent?.trim() === "Push restock list");
    push?.click();
    await new Promise((resolve) => setTimeout(resolve, 0));
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('[role="menu"]')).toBeNull();
    expect(calls.some((c) => c[1] === "push_restock_list")).toBe(true);
    expect(el.shadowRoot?.activeElement).toBe(trigger(el));
    el.remove();
  });

  it("moves between entries with the arrow keys", async () => {
    const el = await mount({ narrow: true });
    await openMenu(el);
    await new Promise((resolve) => setTimeout(resolve, 0));
    const items = () =>
      Array.from(
        el.shadowRoot?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? [],
      );
    expect(el.shadowRoot?.activeElement).toBe(items()[0]);
    items()[0].dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
    );
    expect(el.shadowRoot?.activeElement).toBe(items()[1]);
    items()[1].dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }),
    );
    expect(el.shadowRoot?.activeElement).toBe(items()[0]);
    el.remove();
  });
});

describe("household modals", () => {
  const modal = (el: PanelEl) =>
    el.shadowRoot?.querySelector<HTMLElement>(".household-dialog") ?? null;
  const card = (el: PanelEl, which: "food" | "pet_food") =>
    el.shadowRoot?.querySelector<HTMLElement>(`[data-stat="${which}"]`) ?? null;

  it("no longer shows the household block on the main page", async () => {
    const el = await mountPanel("en", PET_SETTINGS, PET_ASSESSMENT);
    expect(el.shadowRoot?.querySelector(".household")).toBeNull();
    expect(modal(el)).toBeNull();
    el.remove();
  });

  it("makes the Food and Pet food cards buttons that open a dialog", async () => {
    const el = await mountPanel("en", PET_SETTINGS, PET_ASSESSMENT);
    for (const which of ["food", "pet_food"] as const) {
      const c = card(el, which);
      expect(c?.tagName).toBe("HPU-STAT-CARD");
      expect(c?.getAttribute("haspopup")).toBe("dialog");
    }
    el.remove();
  });

  it("opens the food breakdown from the Food card, without pets or water", async () => {
    const el = await mountPanel("en", PET_SETTINGS, PET_ASSESSMENT);
    press(card(el, "food"));
    await el.updateComplete;
    const text = modalText(modal(el));
    expect(modal(el)?.tagName).toBe("HPU-MODAL");
    expect(modal(el)?.hasAttribute("open")).toBe(true);
    expect(text).toContain("Food needs");
    expect(text).toContain("Adults (18–69)");
    expect(text).toContain("2000 kcal");
    expect(text).toContain("4000 kcal");
    expect(text).toContain("Total for 3 days");
    expect(text).toContain("12000 kcal");
    expect(text).not.toContain("Rex");
    expect(text).not.toContain("Pet food");
    el.remove();
  });

  it("opens the pet breakdown from the Pet food card", async () => {
    const el = await mountPanel("en", PET_SETTINGS, PET_ASSESSMENT);
    press(card(el, "pet_food"));
    await el.updateComplete;
    const text = modalText(modal(el));
    expect(text).toContain("Pet food needs");
    expect(text).toContain("Rex (dog)");
    expect(text).toContain("400 g");
    expect(text).toContain("Pet food for 3 days 1200 g");
    expect(text).not.toContain("Adults");
    expect(text).not.toContain("kcal");
    el.remove();
  });

  it("closes with the close button, an outside click and Escape, returning focus to the card", async () => {
    const el = await mountPanel("en", PET_SETTINGS, PET_ASSESSMENT);
    const closers: Array<() => void> = (
      ["button", "backdrop", "escape"] as const
    ).map((reason) => () => closeModal(modal(el), reason));
    for (const close of closers) {
      press(card(el, "food"));
      await el.updateComplete;
      expect(modal(el)).not.toBeNull();
      close();
      await el.updateComplete;
      await el.updateComplete;
      expect(modal(el)).toBeNull();
      expect(el.shadowRoot?.activeElement).toBe(card(el, "food"));
    }
    el.remove();
  });

  it("shows a short note when no household is configured", async () => {
    const el = await mountPanel("en", {
      ...LEGACY_SETTINGS,
      number_of_people: null,
    });
    press(card(el, "food"));
    await el.updateComplete;
    expect(modalText(modal(el))).toContain("No household is set up yet.");
    el.remove();
  });

  it("translates the modals", async () => {
    const el = await mountPanel("nl", PET_SETTINGS, PET_ASSESSMENT);
    press(card(el, "food"));
    await el.updateComplete;
    expect(modalText(modal(el))).toContain("Voedselbehoefte");
    el.remove();
  });
});

describe("readiness and completeness explanations", () => {
  const text = (el: HTMLElement, selector: string) =>
    modalText(el.shadowRoot?.querySelector(selector));

  it("opens a Readiness explanation from the Readiness card", async () => {
    const el = await mountWithCompleteness("en");
    const card = el.shadowRoot?.querySelector<HTMLElement>('[data-stat="readiness"]');
    expect(card?.tagName).toBe("HPU-STAT-CARD");
    expect(card?.getAttribute("haspopup")).toBe("dialog");
    press(card);
    await el.updateComplete;
    const body = text(el, ".explain-dialog");
    expect(body).toContain("water, food and pet food");
    expect(body).toContain("Completeness");
    expect(body).toContain("Example");
    el.remove();
  });

  it("closes the Readiness explanation with Escape and returns focus to the card", async () => {
    const el = await mountWithCompleteness("en");
    const card = () =>
      el.shadowRoot?.querySelector<HTMLElement>('[data-stat="readiness"]');
    press(card());
    await el.updateComplete;
    closeModal(el.shadowRoot?.querySelector(".explain-dialog"), "escape");
    await el.updateComplete;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".explain-dialog")).toBeNull();
    expect(el.shadowRoot?.activeElement).toBe(card());
    el.remove();
  });

  it("starts the Completeness dialog with what it measures and leaves out", async () => {
    const el = await mountWithCompleteness("en");
    press(el.shadowRoot?.querySelector('[data-stat="completeness"]'));
    await el.updateComplete;
    const body = text(el, ".completeness-dialog");
    expect(body).toContain("checklist items");
    expect(body).toContain("Readiness");
    expect(body.indexOf("checklist items")).toBeLessThan(body.indexOf("Medical"));
    el.remove();
  });

  it("shows the explanations in Dutch", async () => {
    const el = await mountWithCompleteness("nl");
    press(el.shadowRoot?.querySelector('[data-stat="readiness"]'));
    await el.updateComplete;
    expect(text(el, ".explain-dialog")).toContain("Voorbeeld");
    expect(text(el, ".explain-dialog")).toContain("Compleetheid");
    el.remove();
  });
});
