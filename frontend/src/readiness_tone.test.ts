import { describe, expect, it } from "vitest";
import { readinessTone } from "./readiness_tone";

describe("readinessTone", () => {
  const duration = 72;

  it("returns empty for null or undefined hours", () => {
    expect(readinessTone(null, duration)).toBe("");
    expect(readinessTone(undefined, duration)).toBe("");
  });

  it("returns empty for NaN hours", () => {
    expect(readinessTone(Number.NaN, duration)).toBe("");
  });

  it("returns bad when supply is zero or negative", () => {
    expect(readinessTone(0, duration)).toBe("bad");
    expect(readinessTone(-1, duration)).toBe("bad");
  });

  it("returns warn when supply is below duration", () => {
    expect(readinessTone(1, duration)).toBe("warn");
    expect(readinessTone(71, duration)).toBe("warn");
  });

  it("returns ok when supply meets or exceeds duration", () => {
    expect(readinessTone(72, duration)).toBe("ok");
    expect(readinessTone(100, duration)).toBe("ok");
  });
});
