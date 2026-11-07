import { describe, expect, it } from "vitest";
import { headerActions } from "./header_actions";

describe("headerActions", () => {
  it("shows every action as a button on wide screens", () => {
    expect(
      headerActions({ canWrite: true, narrow: false, hasRestockList: false }),
    ).toEqual({
      buttons: ["scan", "add_from_template", "add_item"],
      menu: [],
    });
  });

  it("includes push restock on wide screens when a restock list is set", () => {
    expect(
      headerActions({ canWrite: true, narrow: false, hasRestockList: true })
        .buttons,
    ).toEqual(["scan", "add_from_template", "push_restock", "add_item"]);
  });

  it("keeps only Add item visible on narrow screens and moves the rest to the menu", () => {
    expect(
      headerActions({ canWrite: true, narrow: true, hasRestockList: false }),
    ).toEqual({
      buttons: ["add_item"],
      menu: ["scan", "add_from_template"],
    });
  });

  it("adds push restock to the narrow menu when a restock list is set", () => {
    expect(
      headerActions({ canWrite: true, narrow: true, hasRestockList: true }).menu,
    ).toEqual(["scan", "add_from_template", "push_restock"]);
  });

  it("shows nothing to users who cannot change inventory", () => {
    for (const narrow of [true, false]) {
      expect(
        headerActions({ canWrite: false, narrow, hasRestockList: true }),
      ).toEqual({ buttons: [], menu: [] });
    }
  });
});
