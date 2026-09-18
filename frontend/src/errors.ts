/** Format Home Assistant / websocket errors for display. */

export function formatHassError(err: unknown): string {
  if (err == null) return "Unknown error";
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message || String(err);
  if (typeof err === "object") {
    const o = err as Record<string, unknown>;
    if (typeof o.message === "string" && o.message.trim()) return o.message;
    if (typeof o.error === "string" && o.error.trim()) return o.error;
    if (o.error && typeof o.error === "object") {
      const nested = o.error as Record<string, unknown>;
      if (typeof nested.message === "string" && nested.message.trim()) {
        return nested.message;
      }
    }
    try {
      return JSON.stringify(err);
    } catch {
      return "Unknown error";
    }
  }
  return String(err);
}

/** True when a barcode lookup failed because the product was not found. */
export function isBarcodeNotFound(err: unknown): boolean {
  if (typeof err === "object" && err !== null) {
    const o = err as Record<string, unknown>;
    if (o.code === "not_found") return true;
    const msg = typeof o.message === "string" ? o.message.toLowerCase() : "";
    if (msg.includes("product not found") || msg.includes("not found")) {
      return true;
    }
  }
  if (typeof err === "string" && /not found/i.test(err)) return true;
  return false;
}

export const BARCODE_NOT_FOUND_MESSAGE =
  "No product found for this barcode.";
