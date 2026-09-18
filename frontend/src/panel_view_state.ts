/** Persist Ready Home panel sort / filter / search across remounts. */

export type PanelSort = "name" | "expiry" | "quantity";

export interface PanelViewState {
  search: string;
  filterStatus: string;
  filterLocation: string;
  filterCategory: string;
  filterReadiness: string;
  filtersOpen: boolean;
  sort: PanelSort;
}

export const DEFAULT_PANEL_VIEW: PanelViewState = {
  search: "",
  filterStatus: "all",
  filterLocation: "",
  filterCategory: "",
  filterReadiness: "",
  filtersOpen: false,
  sort: "name",
};

const STORAGE_PREFIX = "ready_home.panel.view";
const SORTS: ReadonlySet<string> = new Set(["name", "expiry", "quantity"]);

export function panelViewStorageKey(entryId?: string | null): string {
  return entryId ? `${STORAGE_PREFIX}.${entryId}` : STORAGE_PREFIX;
}

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

export function loadPanelViewState(
  storage: Pick<Storage, "getItem"> | null | undefined,
  entryId?: string | null,
): PanelViewState {
  if (!storage) return { ...DEFAULT_PANEL_VIEW };
  try {
    const raw = storage.getItem(panelViewStorageKey(entryId));
    if (!raw) return { ...DEFAULT_PANEL_VIEW };
    const parsed = JSON.parse(raw) as Partial<PanelViewState>;
    const sort = asString(parsed.sort, "name");
    return {
      search: asString(parsed.search, ""),
      filterStatus: asString(parsed.filterStatus, "all"),
      filterLocation: asString(parsed.filterLocation, ""),
      filterCategory: asString(parsed.filterCategory, ""),
      filterReadiness: asString(parsed.filterReadiness, ""),
      filtersOpen: Boolean(parsed.filtersOpen),
      sort: (SORTS.has(sort) ? sort : "name") as PanelSort,
    };
  } catch {
    return { ...DEFAULT_PANEL_VIEW };
  }
}

export function savePanelViewState(
  storage: Pick<Storage, "setItem"> | null | undefined,
  state: PanelViewState,
  entryId?: string | null,
): void {
  if (!storage) return;
  try {
    storage.setItem(panelViewStorageKey(entryId), JSON.stringify(state));
  } catch {
    // Quota / private mode — ignore.
  }
}

/** Deduplicate options (case-insensitive) and sort by localeCompare. */
export function sortedOptionList(
  options: string[],
  current = "",
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const value of [...options, current]) {
    const v = value?.trim();
    if (!v) continue;
    const key = v.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(v);
  }
  out.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
  return out;
}
