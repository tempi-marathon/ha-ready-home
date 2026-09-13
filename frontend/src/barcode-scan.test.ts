import { describe, expect, it, vi } from "vitest";
import {
  applyBarcodeLookupToForm,
  hasCompanionBarcodeScanner,
  scanProductBarcode,
} from "./barcode-scan";
import type { HassExternalBus, HomeAssistant } from "./types";

function fakeHass(opts?: { hasBarCodeScanner?: number }): {
  hass: HomeAssistant;
  external: HassExternalBus;
  sent: Record<string, unknown>[];
} {
  const sent: Record<string, unknown>[] = [];
  const external: HassExternalBus = {
    config: { hasBarCodeScanner: opts?.hasBarCodeScanner },
    fireMessage: (msg) => {
      sent.push(msg);
    },
    receiveMessage: () => {},
  };

  const hass = {
    auth: { external },
    states: {},
    callService: vi.fn(),
    connection: {
      sendMessagePromise: vi.fn(),
      subscribeMessage: vi.fn(),
    },
    localize: (k: string) => k,
  } as unknown as HomeAssistant;

  return { hass, external, sent };
}

describe("hasCompanionBarcodeScanner", () => {
  it("is false without external bus", () => {
    const hass = { states: {} } as HomeAssistant;
    expect(hasCompanionBarcodeScanner(hass)).toBe(false);
  });

  it("is true when hasBarCodeScanner is set", () => {
    const { hass } = fakeHass({ hasBarCodeScanner: 1 });
    expect(hasCompanionBarcodeScanner(hass)).toBe(true);
  });
});

describe("scanProductBarcode", () => {
  it("rejects when scanner is unavailable", async () => {
    const { hass } = fakeHass();
    const handle = scanProductBarcode(hass);
    await expect(handle.done).rejects.toThrow(/No companion barcode scanner/);
  });

  it("resolves with ean_13 rawValue and closes the scanner", async () => {
    const { hass, external, sent } = fakeHass({ hasBarCodeScanner: 1 });
    const handle = scanProductBarcode(hass);

    expect(sent[0]).toMatchObject({
      type: "bar_code/scan",
      payload: expect.objectContaining({
        title: expect.any(String),
        description: expect.any(String),
      }),
    });

    external.receiveMessage({
      id: 42,
      type: "command",
      command: "bar_code/scan_result",
      payload: { rawValue: "3017620422003", format: "ean_13" },
    });

    await expect(handle.done).resolves.toBe("3017620422003");
    expect(sent.some((m) => m.type === "bar_code/close")).toBe(true);
    expect(
      sent.some(
        (m) => m.type === "result" && m.id === 42 && m.success === true,
      ),
    ).toBe(true);
  });

  it("notifies and keeps scanning for qr_code", async () => {
    const { hass, external, sent } = fakeHass({ hasBarCodeScanner: 1 });
    const handle = scanProductBarcode(hass);
    let settled = false;
    void handle.done.then(() => {
      settled = true;
    });

    external.receiveMessage({
      id: 7,
      type: "command",
      command: "bar_code/scan_result",
      payload: { rawValue: "https://example.com", format: "qr_code" },
    });

    await new Promise((r) => setTimeout(r, 10));
    expect(settled).toBe(false);
    expect(sent.some((m) => m.type === "bar_code/notify")).toBe(true);
    expect(sent.some((m) => m.type === "bar_code/close")).toBe(false);

    handle.abort();
    await expect(handle.done).resolves.toBeNull();
  });

  it("resolves null on aborted/canceled and unwraps receiveMessage", async () => {
    const { hass, external, sent } = fakeHass({ hasBarCodeScanner: 1 });
    const original = external.receiveMessage;
    const handle = scanProductBarcode(hass);
    expect(external.receiveMessage).not.toBe(original);

    external.receiveMessage({
      id: 9,
      type: "command",
      command: "bar_code/aborted",
      payload: { reason: "canceled" },
    });

    await expect(handle.done).resolves.toBeNull();
    expect(sent.some((m) => m.type === "bar_code/close")).toBe(true);
    expect(external.receiveMessage).toBe(original);
  });

  it("accepts numeric unknown formats of 8–14 digits", async () => {
    const { hass, external } = fakeHass({ hasBarCodeScanner: 1 });
    const handle = scanProductBarcode(hass);
    external.receiveMessage({
      id: 1,
      type: "command",
      command: "bar_code/scan_result",
      payload: { rawValue: "12345678", format: "unknown" },
    });
    await expect(handle.done).resolves.toBe("12345678");
  });
});

describe("applyBarcodeLookupToForm", () => {
  it("fills empty fields from Open Food Facts", () => {
    const next = applyBarcodeLookupToForm(
      {
        name: "",
        category: "",
        contents_unit: "",
        calories_per_content: "",
        barcode: "3017620422003",
      },
      {
        brand: "Nutella",
        name: "Hazelnut spread",
        calories_per_100g: 539,
      },
      "Food",
    );
    expect(next.name).toBe("Nutella Hazelnut spread");
    expect(next.category).toBe("Food");
    expect(next.contents_unit).toBe("gram");
    expect(next.calories_per_content).toBe("5.39");
  });

  it("does not overwrite populated fields", () => {
    const next = applyBarcodeLookupToForm(
      {
        name: "My custom name",
        category: "Snacks",
        contents_unit: "kilogram",
        calories_per_content: "4",
        barcode: "1",
      },
      {
        brand: "Nutella",
        name: "Hazelnut spread",
        calories_per_100g: 539,
      },
      "Food",
    );
    expect(next.name).toBe("My custom name");
    expect(next.category).toBe("Snacks");
    expect(next.contents_unit).toBe("kilogram");
    expect(next.calories_per_content).toBe("4");
  });
});
