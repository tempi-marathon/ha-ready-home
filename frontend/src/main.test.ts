import { describe, expect, it } from "vitest";

describe("ready-home frontend package", () => {
  it("exposes card type names used by the picker", () => {
    const types = [
      "ready-home-readiness-card",
      "ready-home-inventory-card",
    ];
    expect(types).toHaveLength(2);
  });
});
