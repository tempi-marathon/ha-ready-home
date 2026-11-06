/** Pure helpers for choosing which kit template items to add. */

export type ToggleState = "all" | "none" | "partial";

const key = (name: string): string => name.trim().toLowerCase();

/** Template items whose name is not in the inventory (trimmed, case-insensitive). */
export function missingItems<T extends { name: string }>(
  templateItems: readonly T[],
  inventoryNames: readonly string[],
): T[] {
  const existing = new Set(inventoryNames.map(key));
  return templateItems.filter((i) => !existing.has(key(i.name)));
}

/**
 * Missing items that are still checked. `unchecked` holds names the user
 * unchecked, so everything is checked by default and names that stopped being
 * missing (for example added elsewhere) simply drop out.
 */
export function selectedItems<T extends { name: string }>(
  missing: readonly T[],
  unchecked: ReadonlySet<string>,
): T[] {
  return missing.filter((i) => !unchecked.has(i.name));
}

export function toggleState(
  missing: readonly { name: string }[],
  unchecked: ReadonlySet<string>,
): ToggleState {
  const selected = selectedItems(missing, unchecked).length;
  if (selected === missing.length) return "all";
  return selected === 0 ? "none" : "partial";
}
