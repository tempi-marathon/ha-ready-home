import { afterEach, describe, expect, it } from "vitest";
import { DEFAULT_PANEL_VIEW, panelViewState } from "./view_state";

afterEach(() => {
  localStorage.clear();
});

describe("panel view state", () => {
  it("returns defaults when nothing is stored", () => {
    expect(panelViewState.load("entry")).toEqual(DEFAULT_PANEL_VIEW);
  });

  it("round-trips view state", () => {
    const state = {
      search: "rice",
      filterStatus: "expired",
      filterLocation: "Pantry",
      filterCategory: "Food",
      filterReadiness: "food",
      sort: "expiry" as const,
    };
    panelViewState.save("entry", state);
    expect(panelViewState.load("entry")).toEqual(state);
  });

  it("keeps each config entry separate", () => {
    panelViewState.save("a", { ...DEFAULT_PANEL_VIEW, search: "one" });
    panelViewState.save("b", { ...DEFAULT_PANEL_VIEW, search: "two" });
    expect(panelViewState.load("a").search).toBe("one");
    expect(panelViewState.load("b").search).toBe("two");
  });

  it("ignores invalid sort values but keeps valid fields", () => {
    localStorage.setItem(
      "ready_home.panel.view",
      JSON.stringify({ entry: { sort: "bogus", search: "x" } }),
    );
    expect(panelViewState.load("entry").sort).toBe("name");
    expect(panelViewState.load("entry").search).toBe("x");
  });

  it("falls back to defaults for corrupt stored data", () => {
    localStorage.setItem("ready_home.panel.view", "{not json");
    expect(panelViewState.load("entry")).toEqual(DEFAULT_PANEL_VIEW);
  });
});
