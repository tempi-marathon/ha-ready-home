import { describe, expect, it } from "vitest";
import {
  BARCODE_NOT_FOUND_MESSAGE,
  formatHassError,
  isBarcodeNotFound,
} from "./errors";

describe("formatHassError", () => {
  it("returns strings as-is", () => {
    expect(formatHassError("boom")).toBe("boom");
  });

  it("uses Error.message", () => {
    expect(formatHassError(new Error("failed"))).toBe("failed");
  });

  it("uses HA-style message field instead of [object Object]", () => {
    expect(formatHassError({ code: "home_assistant_error", message: "Unknown item_id: abc" })).toBe(
      "Unknown item_id: abc",
    );
  });

  it("falls back to JSON for plain objects", () => {
    expect(formatHassError({ code: "x" })).toBe('{"code":"x"}');
  });
});

describe("isBarcodeNotFound", () => {
  it("detects websocket not_found code", () => {
    expect(isBarcodeNotFound({ code: "not_found", message: "Product not found" })).toBe(
      true,
    );
  });

  it("maps to the user-facing copy", () => {
    expect(BARCODE_NOT_FOUND_MESSAGE).toMatch(/No product found/i);
  });
});
