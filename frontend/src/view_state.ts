/** Persist Ready Home panel sort / filter / search across remounts. */

import {
  createViewState,
  parsers,
} from "@tempi-marathon/ha-panel-ui/helpers/view-state.js";

export const SORTS = ["name", "expiry", "quantity"] as const;
export type PanelSort = (typeof SORTS)[number];

export interface PanelViewState {
  search: string;
  filterStatus: string;
  filterLocation: string;
  filterCategory: string;
  filterReadiness: string;
  sort: PanelSort;
}

export const DEFAULT_PANEL_VIEW: PanelViewState = {
  search: "",
  filterStatus: "all",
  filterLocation: "",
  filterCategory: "",
  filterReadiness: "",
  sort: "name",
};

export const panelViewState = createViewState<PanelViewState>({
  storageKey: "ready_home.panel.view",
  defaults: DEFAULT_PANEL_VIEW,
  schema: {
    search: parsers.string,
    filterStatus: parsers.string,
    filterLocation: parsers.string,
    filterCategory: parsers.string,
    filterReadiness: parsers.string,
    sort: parsers.oneOf(SORTS),
  },
});
