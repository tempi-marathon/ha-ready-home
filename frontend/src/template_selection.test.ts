import { describe, expect, it } from "vitest";
import { missingItems, selectedItems, toggleState } from "./template_selection";

const items = [{ name: "Bandages" }, { name: "Gauze" }, { name: "Tape" }];

describe("missingItems", () => {
  it("hides items already in the inventory, ignoring case and whitespace", () => {
    expect(missingItems(items, ["  bandages ", "Unrelated"])).toEqual([
      { name: "Gauze" },
      { name: "Tape" },
    ]);
  });

  it("uses the full inventory name list it is given", () => {
    expect(missingItems(items, [])).toEqual(items);
  });

  it("returns nothing when every item exists", () => {
    expect(missingItems(items, ["bandages", "gauze", "tape"])).toEqual([]);
  });
});

describe("selectedItems", () => {
  it("selects everything by default", () => {
    expect(selectedItems(items, new Set())).toEqual(items);
  });

  it("drops unchecked names", () => {
    expect(selectedItems(items, new Set(["Gauze"]))).toEqual([
      { name: "Bandages" },
      { name: "Tape" },
    ]);
  });

  it("ignores unchecked names that are no longer missing", () => {
    const missing = [{ name: "Tape" }];
    expect(selectedItems(missing, new Set(["Gauze"]))).toEqual(missing);
  });
});

describe("toggleState", () => {
  it("is all when nothing is unchecked", () => {
    expect(toggleState(items, new Set())).toBe("all");
  });

  it("is none when every item is unchecked", () => {
    expect(toggleState(items, new Set(["Bandages", "Gauze", "Tape"]))).toBe("none");
  });

  it("is partial for a mixed selection", () => {
    expect(toggleState(items, new Set(["Gauze"]))).toBe("partial");
  });

  it("is all for a template with nothing missing", () => {
    expect(toggleState([], new Set())).toBe("all");
  });
});
