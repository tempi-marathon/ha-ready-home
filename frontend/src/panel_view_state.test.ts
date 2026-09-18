import { describe, expect, it } from "vitest";
import {
  DEFAULT_PANEL_VIEW,
  loadPanelViewState,
  panelViewStorageKey,
  savePanelViewState,
  sortedOptionList,
} from "./panel_view_state";

function memoryStorage(initial: Record<string, string> = {}) {
  const data = { ...initial };
  return {
    getItem: (key: string) => (key in data ? data[key] : null),
    setItem: (key: string, value: string) => {
      data[key] = value;
    },
    data,
  };
}

describe("panelViewStorageKey", () => {
  it("scopes by entry id when present", () => {
    expect(panelViewStorageKey()).toBe("ready_home.panel.view");
    expect(panelViewStorageKey("abc")).toBe("ready_home.panel.view.abc");
  });
});

describe("loadPanelViewState / savePanelViewState", () => {
  it("returns defaults when empty", () => {
    expect(loadPanelViewState(memoryStorage())).toEqual(DEFAULT_PANEL_VIEW);
  });

  it("round-trips view state", () => {
    const storage = memoryStorage();
    const state = {
      search: "rice",
      filterStatus: "expired",
      filterLocation: "Pantry",
      filterCategory: "Food",
      filterReadiness: "food",
      filtersOpen: true,
      sort: "expiry" as const,
    };
    savePanelViewState(storage, state);
    expect(loadPanelViewState(storage)).toEqual(state);
  });

  it("ignores invalid sort values", () => {
    const storage = memoryStorage({
      [panelViewStorageKey()]: JSON.stringify({ sort: "bogus", search: "x" }),
    });
    expect(loadPanelViewState(storage).sort).toBe("name");
    expect(loadPanelViewState(storage).search).toBe("x");
  });
});

describe("sortedOptionList", () => {
  it("sorts alphabetically and dedupes", () => {
    expect(sortedOptionList(["Zebra", "apple", "Banana", "apple"])).toEqual([
      "apple",
      "Banana",
      "Zebra",
    ]);
  });

  it("appends current when missing then sorts", () => {
    expect(sortedOptionList(["Pantry"], "Garage")).toEqual([
      "Garage",
      "Pantry",
    ]);
  });
});
