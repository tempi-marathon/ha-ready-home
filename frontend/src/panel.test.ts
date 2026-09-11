import { describe, expect, it } from "vitest";
import "./panel";

describe("ready-home panel package", () => {
  it("registers the sidebar panel custom element", () => {
    expect(customElements.get("ready-home-panel")).toBeDefined();
  });
});
