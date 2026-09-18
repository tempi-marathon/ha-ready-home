/** Companion-app barcode scanning via Home Assistant's external bus. */

import type { HomeAssistant } from "./types";

const PRODUCT_FORMATS = new Set([
  "ean_13",
  "ean_8",
  "upc_a",
  "upc_e",
  "code_128",
]);

export type BarcodeLookupResult = {
  name: string;
  brand: string;
  contents_per_unit: number | null;
  contents_unit: string | null;
  calories_per_100g: number | null;
  calories_per_100ml: number | null;
  barcode: string;
};

function caloriesPerContentUnit(
  contentsUnit: string,
  result: Pick<BarcodeLookupResult, "calories_per_100g" | "calories_per_100ml">,
): number | null {
  const round4 = (n: number) => Math.round(n * 10000) / 10000;
  if (contentsUnit === "gram" && result.calories_per_100g != null) {
    return round4(result.calories_per_100g / 100);
  }
  if (contentsUnit === "kilogram" && result.calories_per_100g != null) {
    return round4(result.calories_per_100g * 10);
  }
  if (contentsUnit === "milliliter" && result.calories_per_100ml != null) {
    return round4(result.calories_per_100ml / 100);
  }
  if (contentsUnit === "liter" && result.calories_per_100ml != null) {
    return round4(result.calories_per_100ml * 10);
  }
  return null;
}

export type ScanHandle = {
  done: Promise<string | null>;
  abort: () => void;
};

type ExternalCommandMessage = {
  id?: number;
  type: "command";
  command: string;
  payload?: {
    rawValue?: string;
    format?: string;
    reason?: string;
  };
};

function isProductBarcode(format: string, rawValue: string): boolean {
  if (PRODUCT_FORMATS.has(format)) return true;
  return /^\d{8,14}$/.test(rawValue.trim());
}

export function hasCompanionBarcodeScanner(hass: HomeAssistant): boolean {
  return Boolean(hass.auth?.external?.config?.hasBarCodeScanner);
}

/**
 * Open the Companion native barcode scanner.
 * Resolves with the scanned code, or null if canceled / "Enter manually".
 */
export function scanProductBarcode(
  hass: HomeAssistant,
  options?: {
    title?: string;
    description?: string;
    alternativeOptionLabel?: string;
    rejectMessage?: string;
  },
): ScanHandle {
  const external = hass.auth?.external;
  if (!external?.config?.hasBarCodeScanner) {
    return {
      done: Promise.reject(new Error("No companion barcode scanner")),
      abort: () => {},
    };
  }

  let settled = false;
  let resolve!: (value: string | null) => void;
  const done = new Promise<string | null>((r) => {
    resolve = r;
  });

  const originalReceive = external.receiveMessage;

  const finish = (value: string | null) => {
    if (settled) return;
    settled = true;
    try {
      external.fireMessage({ type: "bar_code/close" });
    } catch {
      // Companion may already have closed the overlay.
    } finally {
      external.receiveMessage = originalReceive;
    }
    resolve(value);
  };

  external.receiveMessage = (msg: unknown) => {
    const command = msg as ExternalCommandMessage;
    if (command?.type === "command" && command.command === "bar_code/scan_result") {
      if (command.id != null) {
        external.fireMessage({
          id: command.id,
          type: "result",
          success: true,
          result: null,
        });
      }
      const rawValue = String(command.payload?.rawValue ?? "").trim();
      const format = String(command.payload?.format ?? "unknown");
      if (rawValue && isProductBarcode(format, rawValue)) {
        finish(rawValue);
        return;
      }
      external.fireMessage({
        type: "bar_code/notify",
        payload: {
          message:
            options?.rejectMessage ??
            "Not a product barcode — try an EAN/UPC code",
        },
      });
      return;
    }

    if (command?.type === "command" && command.command === "bar_code/aborted") {
      if (command.id != null) {
        external.fireMessage({
          id: command.id,
          type: "result",
          success: true,
          result: null,
        });
      }
      finish(null);
      return;
    }

    originalReceive.call(external, msg);
  };

  external.fireMessage({
    type: "bar_code/scan",
    payload: {
      title: options?.title ?? "Scan barcode",
      description:
        options?.description ?? "Point the camera at a product barcode",
      alternative_option_label:
        options?.alternativeOptionLabel ?? "Enter manually",
    },
  });

  return {
    done,
    abort: () => finish(null),
  };
}

/** Prefill form fields from Open Food Facts — only empty fields. */
export function applyBarcodeLookupToForm(
  form: Record<string, string>,
  result: Pick<
    BarcodeLookupResult,
    | "name"
    | "brand"
    | "contents_per_unit"
    | "contents_unit"
    | "calories_per_100g"
    | "calories_per_100ml"
  >,
  foodCategoryFallback = "Food",
): Record<string, string> {
  const next = { ...form };
  const offName = [result.brand, result.name].filter(Boolean).join(" ").trim();
  if (!(next.name || "").trim() && offName) {
    next.name = offName;
  }
  if (!(next.category || "").trim()) {
    next.category = foodCategoryFallback;
  }
  if (
    !(next.contents_per_unit || "").trim() &&
    result.contents_per_unit != null
  ) {
    next.contents_per_unit = String(result.contents_per_unit);
  }
  if (!(next.contents_unit || "").trim()) {
    next.contents_unit = result.contents_unit?.trim() || "gram";
  }
  if (!(next.calories_per_content || "").trim()) {
    const calories = caloriesPerContentUnit(next.contents_unit, result);
    if (calories != null) {
      next.calories_per_content = String(calories);
    }
  }
  return next;
}
