/** Ready Home sidebar management panel. */

import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import "@tempi-marathon/ha-panel-ui/components/badge/badge.js";
import "@tempi-marathon/ha-panel-ui/components/button/button.js";
import "@tempi-marathon/ha-panel-ui/components/checkbox/checkbox.js";
import "@tempi-marathon/ha-panel-ui/components/icon-button/icon-button.js";
import "@tempi-marathon/ha-panel-ui/components/input/input.js";
import "@tempi-marathon/ha-panel-ui/components/select/select.js";
import { configureLibrary } from "@tempi-marathon/ha-panel-ui/helpers/i18n-runtime.js";
import { applyTheme } from "@tempi-marathon/ha-panel-ui/tokens/theme-sync.js";
import { installTokens } from "@tempi-marathon/ha-panel-ui/tokens/tokens.js";
import { missingItems, selectedItems, toggleState } from "./template_selection";
import {
  type InventoryItemDto,
  type KitTemplateDto,
  type SettingsDto,
  type Snapshot,
  getSettings,
  listKitTemplates,
  lookupBarcode,
  subscribeInventory,
} from "./api";
import {
  applyBarcodeLookupToForm,
  hasCompanionBarcodeScanner,
  scanProductBarcode,
  type ScanHandle,
} from "./barcode-scan";
import {
  BARCODE_NOT_FOUND_MESSAGE,
  formatHassError,
  isBarcodeNotFound,
} from "./errors";
import {
  filterAndSortItems,
  formatItemMeasure,
  itemStatus,
  measurePayload,
  readinessKind,
  type ReadinessKind,
  showCaloriesField,
  validateMeasureFields,
  contentsToLiters,
} from "./inventory_view";
import { type HeaderAction, headerActions } from "./header_actions";
import {
  foodBreakdown,
  householdFromSettings,
  petFoodBreakdown,
} from "./household";
import { statusLabel, t } from "./localize";
import {
  loadPanelViewState,
  savePanelViewState,
  sortedOptionList,
  type PanelSort,
} from "./panel_view_state";
import { readinessTone } from "./readiness_tone";
import type { HomeAssistant } from "./types";

const PANEL_TAG = "ready-home-panel";
const BRAND_BASE = "/api/ready_home/brand";
const BRAND_LOGO_URL = `${BRAND_BASE}/logo.png`;
const BRAND_LOGO_2X_URL = `${BRAND_BASE}/logo@2x.png`;
const BRAND_DARK_LOGO_URL = `${BRAND_BASE}/dark_logo.png`;
const BRAND_DARK_LOGO_2X_URL = `${BRAND_BASE}/dark_logo@2x.png`;

/** mdi:menu — open HA sidebar on narrow layouts. */
const MDI_MENU =
  "M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z";
/** mdi:close — dismiss dialog. */
/** mdi:dots-vertical — overflow menu trigger. */
const MDI_DOTS_VERTICAL =
  "M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z";
const MDI_CLOSE =
  "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z";
/** mdi:shield-check — overall readiness. */
const MDI_SHIELD_CHECK =
  "M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1Z";
/** mdi:water — water readiness. */
const MDI_WATER =
  "M12,20A6,6 0 0,1 6,14C6,10 12,3.25 12,3.25C12,3.25 18,10 18,14A6,6 0 0,1 12,20Z";
/** mdi:food — food readiness. */
const MDI_FOOD =
  "M18.06 23H19.72C20.56 23 21.25 22.35 21.35 21.53L23 5.05H18V1H16.03V5.05H11.06L11.36 7.39C13.07 7.86 14.67 8.71 15.63 9.65C17.07 11.07 18.06 12.54 18.06 14.94V23M1 22V21H16.03V22C16.03 22.54 15.58 23 15 23H2C1.45 23 1 22.54 1 22M16.03 15C16.03 7 1 7 1 15H16.03M1 17H16V19H1V17Z";
/** mdi:paw — pet food readiness. */
const MDI_PAW =
  "M8.35,3C9.53,2.83 10.78,4.12 11.14,5.9C11.5,7.67 10.85,9.25 9.67,9.43C8.5,9.61 7.24,8.32 6.88,6.54C6.5,4.77 7.17,3.19 8.35,3M15.5,3C16.69,3.19 17.35,4.77 17,6.54C16.62,8.32 15.37,9.61 14.19,9.43C13,9.25 12.35,7.67 12.71,5.9C13.08,4.12 14.33,2.83 15.5,3M3,7.6C4.14,7.11 5.69,8 6.5,9.55C7.26,11.13 7,12.79 5.87,13.28C4.74,13.77 3.2,12.89 2.41,11.32C1.62,9.75 1.9,8.08 3,7.6M21,7.6C22.1,8.08 22.38,9.75 21.59,11.32C20.8,12.89 19.26,13.77 18.13,13.28C17,12.79 16.74,11.13 17.5,9.55C18.31,8 19.86,7.11 21,7.6M19.33,18.38C19.37,19.32 18.65,20.36 17.79,20.75C16,21.57 13.88,19.87 11.89,19.87C9.9,19.87 7.76,21.64 6,20.75C5,20.26 4.31,18.96 4.44,17.88C4.62,16.39 6.41,15.59 7.47,14.5C8.88,13.09 9.88,10.44 11.89,10.44C13.89,10.44 14.95,13.05 16.3,14.5C17.41,15.72 19.26,16.75 19.33,18.38Z";
/** mdi:clipboard-check — category completeness. */
const MDI_CLIPBOARD_CHECK =
  "M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3Z";

const STOCK_UNITS = ["box", "pack", "piece"] as const;
const CONTENTS_UNITS = ["gram", "kilogram", "liter", "milliliter"] as const;
const PRIORITIES = ["essential", "important", "optional"] as const;

function ucfirst(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const TEMPLATE_NOTICE_MS = 6000;

let tokensInstalled = false;

/** Adopt the shared design tokens into the document once for the whole page. */
function installTokensOnce(): void {
  if (tokensInstalled) return;
  tokensInstalled = true;
  installTokens(document);
}

export class ReadyHomePanel extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ type: Boolean }) public narrow = false;
  @property({ attribute: false }) public panel?: {
    config?: Record<string, unknown>;
  };

  @state() private _snapshot: Snapshot | null = null;
  @state() private _settings: SettingsDto | null = null;
  @state() private _search = "";
  @state() private _filterStatus = "all";
  @state() private _filterLocation = "";
  @state() private _filterCategory = "";
  @state() private _filterReadiness = "";
  @state() private _filtersOpen = false;
  @state() private _sort: PanelSort = "name";
  @state() private _dialogOpen = false;
  @state() private _editing: InventoryItemDto | null = null;
  @state() private _form: Record<string, string> = {};
  @state() private _error = "";
  @state() private _barcodeError = "";
  @state() private _fieldErrors: Record<string, string> = {};
  @state() private _saving = false;
  @state() private _scanning = false;
  @state() private _pendingRemoveIds: string[] = [];
  @state() private _completenessOpen = false;
  @state() private _moreOpen = false;
  @state() private _readinessOpen = false;
  @state() private _householdModal: "food" | "pet_food" | null = null;
  @state() private _templateOpen = false;
  @state() private _templates: KitTemplateDto[] = [];
  @state() private _templateBusy = false;
  @state() private _templateUnchecked: Record<string, Set<string>> = {};
  @state() private _templateNotice = "";
  private _templateNoticeTimer: ReturnType<typeof setTimeout> | null = null;

  private _unsub: (() => void) | null = null;
  private _connected = false;
  private _scanHandle: ScanHandle | null = null;
  private _viewHydrated = false;

  connectedCallback(): void {
    super.connectedCallback();
    this._connected = true;
    installTokensOnce();
    this._restoreViewState();
    window.addEventListener("keydown", this._onWindowKeyDown);
    void this._connect();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._connected = false;
    window.removeEventListener("keydown", this._onWindowKeyDown);
    document.removeEventListener("click", this._onDocumentClick);
    this._abortScan();
    this._setTemplateNotice("");
    this._unsub?.();
    this._unsub = null;
  }

  protected willUpdate(changed: Map<string, unknown>): void {
    if (changed.has("hass") && this.hass) {
      // Mirror Home Assistant's dark mode and language onto the shared UI library.
      applyTheme(this, this.hass.themes);
      configureLibrary({ language: this.hass.language });
    }
  }

  protected updated(changed: Map<string, unknown>): void {
    if (changed.has("hass") && this.hass && !this._unsub && this._connected) {
      void this._connect();
    }
  }

  private async _connect() {
    if (!this.hass || this._unsub) return;
    try {
      this._settings = await getSettings(this.hass);
      this._unsub = await subscribeInventory(this.hass, (snap) => {
        this._applySnapshot(snap);
      });
      this._error = "";
    } catch (err) {
      this._error = formatHassError(err);
    }
  }

  private _entryId(): string | null {
    const raw = this.panel?.config?.config_entry_id;
    return typeof raw === "string" && raw ? raw : null;
  }

  /** Admins can mutate inventory; other logged-in users are read-only. */
  private _canWrite(): boolean {
    return this.hass?.user?.is_admin === true;
  }

  private _restoreViewState() {
    const saved = loadPanelViewState(
      typeof localStorage !== "undefined" ? localStorage : null,
      this._entryId(),
    );
    this._search = saved.search;
    this._filterStatus = saved.filterStatus;
    this._filterLocation = saved.filterLocation;
    this._filterCategory = saved.filterCategory;
    this._filterReadiness = saved.filterReadiness;
    this._filtersOpen = saved.filtersOpen;
    this._sort = saved.sort;
    this._viewHydrated = true;
  }

  private _persistViewState() {
    if (!this._viewHydrated) return;
    savePanelViewState(
      typeof localStorage !== "undefined" ? localStorage : null,
      {
        search: this._search,
        filterStatus: this._filterStatus,
        filterLocation: this._filterLocation,
        filterCategory: this._filterCategory,
        filterReadiness: this._filterReadiness,
        filtersOpen: this._filtersOpen,
        sort: this._sort,
      },
      this._entryId(),
    );
  }

  private _applySnapshot(snap: Snapshot) {
    this._snapshot = snap;
    if (snap.settings) {
      this._settings = snap.settings;
    }
    if (!this._pendingRemoveIds.length) return;
    const present = new Set(snap.items.map((i) => i.id));
    const remaining = this._pendingRemoveIds.filter((id) => present.has(id));
    if (remaining.length !== this._pendingRemoveIds.length) {
      this._pendingRemoveIds = remaining;
    }
  }

  private _isRemovePending(itemId: string): boolean {
    return this._pendingRemoveIds.includes(itemId);
  }

  private get _assessment() {
    return (this._snapshot?.assessment ?? {}) as Record<string, number | null>;
  }

  private get _bucketCounts() {
    const b = this._snapshot?.buckets;
    return {
      expired: b?.expired.length ?? 0,
      expiring:
        (b?.within_urgent.length ?? 0) + (b?.within_expiring.length ?? 0),
      low_stock: b?.low_stock.length ?? 0,
    };
  }

  private get _activeFilterCount(): number {
    let n = 0;
    if (this._filterLocation) n += 1;
    if (this._filterCategory) n += 1;
    if (this._filterReadiness) n += 1;
    return n;
  }

  private _resetFilters = () => {
    this._filterLocation = "";
    this._filterCategory = "";
    this._filterReadiness = "";
    this._persistViewState();
  };

  private _readinessKind(category: string): ReadinessKind {
    return readinessKind(category, this._settings);
  }

  private get _items(): InventoryItemDto[] {
    return filterAndSortItems(
      this._snapshot?.items ?? [],
      this._snapshot?.buckets,
      this._settings,
      {
        search: this._search,
        filterStatus: this._filterStatus,
        filterLocation: this._filterLocation,
        filterCategory: this._filterCategory,
        filterReadiness: this._filterReadiness,
        sort: this._sort,
      },
    );
  }

  private _itemStatus(item: InventoryItemDto): string {
    return itemStatus(item, this._snapshot?.buckets);
  }

  private _t(key: string, vars?: Record<string, string | number>): string {
    return t(this.hass, key, vars);
  }

  private _statusLabel(status: string): string {
    return statusLabel(this.hass, status);
  }

  private _setStatusFilter(status: string) {
    this._filterStatus = this._filterStatus === status ? "all" : status;
    this._persistViewState();
  }

  private _pct(value: number | null | undefined): string {
    if (value == null || Number.isNaN(Number(value))) return "—";
    return `${Math.round(Number(value))}%`;
  }

  private _completenessPercent(): number | null {
    const raw = this._snapshot?.completeness?.overall_percent;
    if (raw == null || Number.isNaN(Number(raw))) return null;
    return Number(raw);
  }

  private _formatHours(hours: number | null | undefined): string {
    if (hours == null || Number.isNaN(Number(hours))) return "—";
    const h = Math.max(0, Math.round(Number(hours)));
    if (h < 48) return `${h}h`;
    const days = Math.round(h / 24);
    return `${days}d`;
  }

  private _formatAmount(value: number | null | undefined, unit: string): string {
    if (value == null || Number.isNaN(Number(value))) return "—";
    const n = Number(value);
    const rounded =
      Math.abs(n - Math.round(n)) < 0.05 ? Math.round(n) : Math.round(n * 10) / 10;
    return `${rounded} ${unit}`;
  }

  private _durationHours(): number {
    return (
      this._assessment.duration_hours ?? this._settings?.duration_hours ?? 72
    );
  }

  private _statToneClass(hours: number | null | undefined): string {
    const tone = readinessTone(hours, this._durationHours());
    return tone ? `stat-${tone}` : "";
  }

  private _durationClass(hours: number | null | undefined): string {
    const tone = readinessTone(hours, this._durationHours());
    if (tone === "bad") return "duration-bad";
    if (tone === "warn") return "duration-warn";
    return "";
  }

  private _expiryClass(status: string): string {
    if (status === "expired") return "expiry-expired";
    if (status === "urgent" || status === "expiring") return "expiry-warn";
    return "";
  }

  /** Format a stored YYYY-MM-DD using the HA user locale / date_format. */
  private _formatDate(iso: string | null | undefined): string {
    if (!iso) return "—";
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
    if (!match) return iso;
    const date = new Date(
      Number(match[1]),
      Number(match[2]) - 1,
      Number(match[3]),
    );
    if (Number.isNaN(date.getTime())) return iso;

    const locale = this.hass?.locale;
    const language =
      locale?.language || this.hass?.language || navigator.language || "en";
    const dateFormat = locale?.date_format ?? "language";
    const localeTag = dateFormat === "system" ? undefined : language;

    const formatter = new Intl.DateTimeFormat(localeTag, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });

    if (dateFormat === "language" || dateFormat === "system") {
      return formatter.format(date);
    }

    const parts = formatter.formatToParts(date);
    const literal = parts.find((p) => p.type === "literal")?.value ?? "/";
    const day = parts.find((p) => p.type === "day")?.value ?? "";
    const month = parts.find((p) => p.type === "month")?.value ?? "";
    const year = parts.find((p) => p.type === "year")?.value ?? "";
    const last = parts[parts.length - 1];
    const lastLiteral = last?.type === "literal" ? last.value : "";

    if (dateFormat === "DMY") {
      return `${day}${literal}${month}${literal}${year}${lastLiteral}`;
    }
    if (dateFormat === "MDY") {
      return `${month}${literal}${day}${literal}${year}${lastLiteral}`;
    }
    return `${year}${literal}${month}${literal}${day}${lastLiteral}`;
  }

  private _toggleMenu = (ev?: Event) => {
    ev?.stopPropagation();
    this.dispatchEvent(
      new CustomEvent("hass-toggle-menu", {
        bubbles: true,
        composed: true,
      }),
    );
  };

  private _optionList(options: string[], current: string): string[] {
    return sortedOptionList(options, current);
  }

  private _runHeaderAction(action: HeaderAction) {
    switch (action) {
      case "scan":
        void this._scanFromPanel();
        break;
      case "add_from_template":
        void this._openTemplates();
        break;
      case "push_restock":
        void this._pushRestock();
        break;
      case "add_item":
        this._openAdd();
        break;
    }
  }

  private _headerActionLabel(action: HeaderAction): string {
    return this._t(`action.${action}`);
  }

  private _renderHeaderActions() {
    const { buttons, menu } = headerActions({
      canWrite: this._canWrite(),
      narrow: this.narrow,
      hasRestockList: Boolean(this._settings?.todo_entity_id),
    });
    return html`
      ${buttons.map((action) =>
        this._mdButton(this._headerActionLabel(action), {
          variant: action === "add_item" ? "filled" : "outlined",
          disabled: action === "scan" && this._scanning,
          onClick: () => this._runHeaderAction(action),
        }),
      )}
      ${menu.length ? this._renderMoreMenu(menu) : nothing}
    `;
  }

  private _renderMoreMenu(menu: HeaderAction[]) {
    return html`
      <div class="more">
        <hpu-icon-button class="more-btn"
          path=${MDI_DOTS_VERTICAL}
          label=${this._t("action.more")}
          haspopup="menu"
          expanded=${this._moreOpen ? "true" : "false"}
          @hpu-click=${this._toggleMore}
        ></hpu-icon-button>
        ${this._moreOpen
          ? html`
              <div
                class="more-menu"
                role="menu"
                @keydown=${this._onMoreKeyDown}
              >
                ${menu.map(
                  (action) => html`
                    <button
                      type="button"
                      class="more-item"
                      role="menuitem"
                      ?disabled=${action === "scan" && this._scanning}
                      @click=${() => {
                        this._closeMore();
                        this._runHeaderAction(action);
                      }}
                    >
                      ${this._headerActionLabel(action)}
                    </button>
                  `,
                )}
              </div>
            `
          : nothing}
      </div>
    `;
  }

  private _toggleMore = () => {
    if (this._moreOpen) {
      this._closeMore();
      return;
    }
    this._moreOpen = true;
    document.addEventListener("click", this._onDocumentClick);
    void this.updateComplete.then(() => this._moreItems()[0]?.focus());
  };

  private _closeMore(opts: { refocus?: boolean } = { refocus: true }) {
    if (!this._moreOpen) return;
    this._moreOpen = false;
    document.removeEventListener("click", this._onDocumentClick);
    if (opts.refocus !== false) {
      void this.updateComplete.then(() =>
        this.shadowRoot
          ?.querySelector<HTMLButtonElement>(".more-btn")
          ?.focus(),
      );
    }
  }

  private _onDocumentClick = (e: Event) => {
    const wrap = this.shadowRoot?.querySelector(".more");
    if (wrap && e.composedPath().includes(wrap)) return;
    this._closeMore({ refocus: false });
  };

  private _moreItems(): HTMLButtonElement[] {
    return Array.from(
      this.shadowRoot?.querySelectorAll<HTMLButtonElement>(
        '.more-menu [role="menuitem"]:not([disabled])',
      ) ?? [],
    );
  }

  private _onMoreKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const items = this._moreItems();
    if (!items.length) return;
    e.preventDefault();
    const current = items.indexOf(
      this.shadowRoot?.activeElement as HTMLButtonElement,
    );
    const step = e.key === "ArrowDown" ? 1 : -1;
    items[(current + step + items.length) % items.length].focus();
  };

  private _mdButton(
    label: string,
    opts: {
      variant?: "filled" | "outlined" | "text" | "danger-text";
      disabled?: boolean;
      onClick: (e: Event) => void;
    },
  ) {
    const variant = opts.variant ?? "outlined";
    const danger = variant === "danger-text";
    return html`
      <hpu-button
        variant=${danger ? "text" : variant}
        tone=${danger ? "danger" : "primary"}
        ?disabled=${opts.disabled ?? false}
        @hpu-click=${opts.onClick}
        >${label}</hpu-button
      >
    `;
  }

  protected render() {
    const items = this._items;
    const a = this._assessment;
    const locations = sortedOptionList(this._settings?.locations ?? []);
    const categories = sortedOptionList(this._settings?.categories ?? []);
    const overall = a.overall_percent;
    const water = a.water_percent;
    const food = a.food_percent;
    const completeness = this._completenessPercent();
    const counts = this._bucketCounts;
    const supply = a.supply_hours;
    const waterSupply = a.water_supply_hours;
    const foodSupply = a.food_supply_hours;
    // Pet food only shows when pets create a pet food target (older backends omit it).
    const petFoodTarget = a.pet_food_target;
    const hasPetFood = petFoodTarget != null && petFoodTarget > 0;
    const petFoodSupply = a.pet_food_supply_hours;
    const darkLogo = this.hass?.themes?.darkMode === true;
    const logoSrc = darkLogo ? BRAND_DARK_LOGO_URL : BRAND_LOGO_URL;
    const logoSrcset = darkLogo
      ? `${BRAND_DARK_LOGO_URL} 1x, ${BRAND_DARK_LOGO_2X_URL} 2x`
      : `${BRAND_LOGO_URL} 1x, ${BRAND_LOGO_2X_URL} 2x`;

    return html`
      <div class="page">
        <header class="header">
          <div class="header-row">
            <div class="brand">
              ${this.narrow
                ? html`
                    <hpu-icon-button
          path=${MDI_MENU}
          label=${this._t("action.open_menu")}
          @hpu-click=${this._toggleMenu}
        ></hpu-icon-button>
                  `
                : nothing}
              <h1 class="brand-heading">
                <img
                  class="brand-logo"
                  src=${logoSrc}
                  srcset=${logoSrcset}
                  alt="Ready Home"
                  height="40"
                />
              </h1>
            </div>
            <div class="header-actions">${this._renderHeaderActions()}</div>
          </div>
        </header>

        <div class="content">
          <div class="stats">
            <button
              type="button"
              class="stat stat-button ${this._statToneClass(supply)}"
              data-stat="readiness"
              aria-haspopup="dialog"
              aria-label=${this._t("readiness.open")}
              @click=${this._openReadiness}
            >
              <span class="stat-label">
                <svg class="stat-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d=${MDI_SHIELD_CHECK} />
                </svg>
                ${this._t("stat.readiness")}
              </span>
              <span class="stat-value">${this._pct(overall)}</span>
              <span class="stat-duration ${this._durationClass(supply)}"
                >${this._formatHours(supply)}</span
              >
            </button>
            <div class="stat ${this._statToneClass(waterSupply)}">
              <span class="stat-label">
                <svg class="stat-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d=${MDI_WATER} />
                </svg>
                ${this._t("stat.water")}
              </span>
              <span class="stat-value"
                >${this._formatAmount(a.water_on_hand, "L")}</span
              >
              <span class="stat-meta"
                >${this._pct(water)} ·
                ${this._formatAmount(a.water_target, "L")}</span
              >
              <span class="stat-duration ${this._durationClass(waterSupply)}"
                >${this._formatHours(waterSupply)}</span
              >
            </div>
            <button
              type="button"
              class="stat stat-button ${this._statToneClass(foodSupply)}"
              data-stat="food"
              aria-haspopup="dialog"
              aria-label=${this._t("household.open_food")}
              @click=${() => this._openHousehold("food")}
            >
              <span class="stat-label">
                <svg class="stat-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d=${MDI_FOOD} />
                </svg>
                ${this._t("stat.food")}
              </span>
              <span class="stat-value"
                >${this._formatAmount(a.food_on_hand, "kcal")}</span
              >
              <span class="stat-meta"
                >${this._pct(food)} ·
                ${this._formatAmount(a.food_target, "kcal")}</span
              >
              <span class="stat-duration ${this._durationClass(foodSupply)}"
                >${this._formatHours(foodSupply)}</span
              >
            </button>
            ${hasPetFood
              ? html`
                  <button
                    type="button"
                    class="stat stat-button ${this._statToneClass(petFoodSupply)}"
                    data-stat="pet_food"
                    aria-haspopup="dialog"
                    aria-label=${this._t("household.open_pet_food")}
                    @click=${() => this._openHousehold("pet_food")}
                  >
                    <span class="stat-label">
                      <svg
                        class="stat-icon"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path fill="currentColor" d=${MDI_PAW} />
                      </svg>
                      ${this._t("stat.pet_food")}
                    </span>
                    <span class="stat-value"
                      >${this._formatAmount(a.pet_food_on_hand, "g")}</span
                    >
                    <span class="stat-meta"
                      >${this._pct(a.pet_food_percent)} ·
                      ${this._formatAmount(petFoodTarget, "g")}</span
                    >
                    <span class="stat-duration ${this._durationClass(petFoodSupply)}"
                      >${this._formatHours(petFoodSupply)}</span
                    >
                  </button>
                `
              : nothing}
            ${completeness != null
              ? html`
                  <button
                    type="button"
                    class="stat stat-button"
                    data-stat="completeness"
                    aria-haspopup="dialog"
                    aria-label=${this._t("completeness.open")}
                    @click=${this._openCompleteness}
                  >
                    <span class="stat-label">
                      <svg
                        class="stat-icon"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path fill="currentColor" d=${MDI_CLIPBOARD_CHECK} />
                      </svg>
                      ${this._t("stat.completeness")}
                    </span>
                    <span class="stat-value">${this._pct(completeness)}</span>
                  </button>
                `
              : nothing}
          </div>

          <div class="attention" role="group" aria-label="Attention filters">
            <button
              type="button"
              class="chip ${this._filterStatus === "expired" ? "active" : ""}"
              @click=${() => this._setStatusFilter("expired")}
            >
              ${this._t("status.expired")}
              <span class="chip-count">${counts.expired}</span>
            </button>
            <button
              type="button"
              class="chip ${this._filterStatus === "expiring" ? "active" : ""}"
              @click=${() => this._setStatusFilter("expiring")}
            >
              ${this._t("status.expiring")}
              <span class="chip-count">${counts.expiring}</span>
            </button>
            <button
              type="button"
              class="chip ${this._filterStatus === "low_stock" ? "active" : ""}"
              @click=${() => this._setStatusFilter("low_stock")}
            >
              ${this._t("status.low")}
              <span class="chip-count">${counts.low_stock}</span>
            </button>
          </div>

          <section class="inventory">
            <div class="toolbar">
              <div class="toolbar-row">
                <input
                  class="search"
                  type="search"
                  placeholder=${this._t("filter.search_placeholder")}
                  .value=${this._search}
                  @input=${(e: Event) => {
                    this._search = (e.target as HTMLInputElement).value;
                    this._persistViewState();
                  }}
                />
                <select
                  class="sort"
                  .value=${this._sort}
                  @change=${(e: Event) => {
                    this._sort = (e.target as HTMLSelectElement)
                      .value as PanelSort;
                    this._persistViewState();
                  }}
                >
                  <option value="name">${this._t("filter.sort")}: name</option>
                  <option value="expiry">${this._t("filter.sort")}: expiry</option>
                  <option value="quantity"
                    >${this._t("filter.sort")}: quantity</option
                  >
                </select>
                <hpu-button
                  class="filters-btn"
                  variant=${this._filtersOpen || this._activeFilterCount
                    ? "tonal"
                    : "outlined"}
                  @hpu-click=${() => {
                    this._filtersOpen = !this._filtersOpen;
                    this._persistViewState();
                  }}
                >
                  Filters${this._activeFilterCount
                    ? html` (${this._activeFilterCount})`
                    : nothing}
                </hpu-button>
              </div>
              ${this._filtersOpen
                ? html`
                    <div class="filters">
                      <select
                        .value=${this._filterLocation}
                        @change=${(e: Event) => {
                          this._filterLocation = (
                            e.target as HTMLSelectElement
                          ).value;
                          this._persistViewState();
                        }}
                      >
                        <option value=""
                          >${this._t("filter.all_location")}</option
                        >
                        ${locations.map(
                          (l) => html`<option value=${l}>${l}</option>`,
                        )}
                      </select>
                      <select
                        .value=${this._filterCategory}
                        @change=${(e: Event) => {
                          this._filterCategory = (
                            e.target as HTMLSelectElement
                          ).value;
                          this._persistViewState();
                        }}
                      >
                        <option value=""
                          >${this._t("filter.all_category")}</option
                        >
                        ${categories.map(
                          (c) => html`<option value=${c}>${c}</option>`,
                        )}
                      </select>
                      <select
                        .value=${this._filterReadiness}
                        @change=${(e: Event) => {
                          this._filterReadiness = (
                            e.target as HTMLSelectElement
                          ).value;
                          this._persistViewState();
                        }}
                      >
                        <option value=""
                          >${this._t("filter.all_readiness")}</option
                        >
                        <option value="water"
                          >${this._t("filter.readiness_water")}</option
                        >
                        <option value="food"
                          >${this._t("filter.readiness_food")}</option
                        >
                        <option value="pet_food"
                          >${this._t("filter.readiness_pet_food")}</option
                        >
                        <option value="none"
                          >${this._t("filter.readiness_none")}</option
                        >
                      </select>
                      ${this._activeFilterCount
                        ? this._mdButton("Reset", {
                            variant: "text",
                            onClick: this._resetFilters,
                          })
                        : nothing}
                    </div>
                  `
                : nothing}
              <div class="inventory-meta">
                <span class="item-count"
                  >${items.length}/${this._snapshot?.items.length ?? 0}</span
                >
              </div>
            </div>

            ${this._templateNotice
              ? html`<div class="field-hint" role="status">${this._templateNotice}</div>`
              : nothing}
            ${this._error
              ? html`<div class="error" role="alert">${this._error}</div>`
              : nothing}

            ${this.narrow
              ? this._renderCardList(items)
              : this._renderTable(items)}
          </section>
        </div>
      </div>

      ${this._dialogOpen ? this._renderDialog() : nothing}
      ${this._completenessOpen ? this._renderCompletenessDialog() : nothing}
      ${this._readinessOpen ? this._renderReadinessDialog() : nothing}
      ${this._householdModal
        ? this._renderHouseholdDialog(this._householdModal)
        : nothing}
      ${this._templateOpen ? this._renderTemplateDialog() : nothing}
    `;
  }

  private _renderEmpty() {
    if (!this._snapshot) {
      return html`<div class="empty">Loading inventory…</div>`;
    }
    return html`
      <div class="empty">
        No items match.
        ${this._canWrite()
          ? html`
              <div class="empty-actions">
                ${this._mdButton("Scan", {
                  variant: "outlined",
                  disabled: this._scanning,
                  onClick: () => void this._scanFromPanel(),
                })}
                ${this._mdButton("Add an item", {
                  variant: "text",
                  onClick: this._openAdd,
                })}
              </div>
            `
          : nothing}
      </div>
    `;
  }

  private _renderQtyText(item: InventoryItemDto) {
    return html`
      <span class="qty-text"
        >${item.quantity}${item.desired_quantity
          ? html` / ${item.desired_quantity}`
          : nothing}
        ${item.unit}</span
      >
    `;
  }

  private _renderMeasure(item: InventoryItemDto) {
    return formatItemMeasure(item, this._readinessKind(item.category));
  }

  private _contentsToLiters(amount: number, unit: string): number | null {
    return contentsToLiters(amount, unit);
  }

  private _formatMeasureNumber(value: number): string {
    const n = Number(value);
    if (Number.isNaN(n)) return "—";
    return Math.abs(n - Math.round(n)) < 0.05
      ? String(Math.round(n))
      : String(Math.round(n * 100) / 100);
  }

  private _contentsUnitLabel(unit: string): string {
    return ucfirst(unit || "unit");
  }

  private _formTotalContents(): number | null {
    const qty = this._parseDecimal(this._form.quantity || "0");
    const contents = this._parseDecimal(this._form.contents_per_unit || "");
    if (!this._form.contents_per_unit || Number.isNaN(contents)) return null;
    return qty * contents;
  }

  private _formTotalCalories(): number | null {
    const total = this._formTotalContents();
    const cal = this._parseDecimal(this._form.calories_per_content || "");
    if (total == null || !this._form.calories_per_content || Number.isNaN(cal)) {
      return null;
    }
    return total * cal;
  }

  private _formTotalLiters(): number | null {
    const total = this._formTotalContents();
    if (total == null || !this._form.contents_unit) return null;
    return this._contentsToLiters(total, this._form.contents_unit);
  }

  private _validateForm(): Record<string, string> {
    const f = this._form;
    const errors: Record<string, string> = {};
    if (!(f.name || "").trim()) errors.name = "Name is required";
    if (!(f.location || "").trim()) errors.location = "Location is required";
    if (!(f.category || "").trim()) errors.category = "Category is required";
    const qty = this._parseDecimal(f.quantity);
    if (f.quantity === "" || Number.isNaN(qty) || qty < 0) {
      errors.quantity = "Enter a valid quantity";
    }
    if (!(f.unit || "").trim()) errors.unit = "Unit is required";

    Object.assign(
      errors,
      validateMeasureFields(this._formReadiness(), {
        contents_per_unit: f.contents_per_unit || "",
        contents_unit: f.contents_unit || "",
        calories_per_content: f.calories_per_content || "",
      }),
    );
    return errors;
  }

  private _renderStatusBadge(status: string) {
    if (!status) return nothing;
    const tone =
      status === "expired"
        ? "danger"
        : status === "low"
          ? "info"
          : "warning";
    return html`<hpu-badge tone=${tone} size="sm"
      >${this._statusLabel(status)}</hpu-badge
    >`;
  }

  private _openHousehold(which: "food" | "pet_food") {
    this._householdModal = which;
  }

  private _closeHousehold = () => {
    const which = this._householdModal;
    if (!which) return;
    this._householdModal = null;
    void this.updateComplete.then(() =>
      this.shadowRoot
        ?.querySelector<HTMLElement>(`[data-stat="${which}"]`)
        ?.focus(),
    );
  };

  private _renderHouseholdDialog(which: "food" | "pet_food") {
    const h = householdFromSettings(this._settings);
    const title = this._t(
      which === "food" ? "household.food_title" : "household.pet_food_title",
    );
    return html`
      <div
        class="dialog-backdrop"
        @click=${(e: Event) => {
          if (e.target === e.currentTarget) this._closeHousehold();
        }}
      >
        <div
          class="dialog household-dialog ${this.narrow ? "dialog-narrow" : ""}"
          role="dialog"
          aria-modal="true"
          aria-label=${title}
        >
          <div class="dialog-header">
            <h2>${title}</h2>
            <hpu-icon-button class="dialog-close"
          path=${MDI_CLOSE}
          label=${this._t("action.close")}
          @hpu-click=${this._closeHousehold}
        ></hpu-icon-button>
          </div>
          ${!h
            ? html`<p class="field-hint">${this._t("household.not_configured")}</p>`
            : which === "food"
              ? this._renderFoodTable(h)
              : this._renderPetFoodTable(h)}
        </div>
      </div>
    `;
  }

  private _renderFoodTable(h: NonNullable<ReturnType<typeof householdFromSettings>>) {
    const f = foodBreakdown(h);
    const days = Math.round(f.days * 10) / 10;
    return html`
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>${this._t("household.category")}</th>
              <th>${this._t("household.count")}</th>
              <th>${this._t("household.per_person")}</th>
              <th>${this._t("household.subtotal")}</th>
            </tr>
          </thead>
          <tbody>
            ${f.rows.map(
              (r) => html`<tr>
                <td>${this._t(`household.${r.key}`)}</td>
                <td>${r.count}</td>
                <td>${this._formatAmount(r.caloriesPerPerson, "kcal")}</td>
                <td>${this._formatAmount(r.caloriesSubtotal, "kcal")}</td>
              </tr>`,
            )}
            <tr>
              <th colspan="3">${this._t("household.total_per_day")}</th>
              <td>${this._formatAmount(f.dailyTotal, "kcal")}</td>
            </tr>
            <tr>
              <th colspan="3">${this._t("household.total_period", { days })}</th>
              <td>${this._formatAmount(f.periodTotal, "kcal")}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  private _renderPetFoodTable(h: NonNullable<ReturnType<typeof householdFromSettings>>) {
    const p = petFoodBreakdown(h);
    const days = Math.round(p.days * 10) / 10;
    return html`
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>${this._t("household.pet")}</th>
              <th>${this._t("household.food_per_day")}</th>
            </tr>
          </thead>
          <tbody>
            ${p.rows.map(
              (r) => html`<tr>
                <td>${r.name}${r.type ? html` (${r.type})` : nothing}</td>
                <td>${this._formatAmount(r.foodPerDay, "g")}</td>
              </tr>`,
            )}
            <tr>
              <th>${this._t("household.total_per_day")}</th>
              <td>${this._formatAmount(p.dailyTotal, "g")}</td>
            </tr>
            <tr>
              <th>${this._t("household.pet_food_period", { days })}</th>
              <td>${this._formatAmount(p.periodTotal, "g")}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  private _renderTable(items: InventoryItemDto[]) {
    return html`
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Quantity</th>
              <th>L / kcal</th>
              <th>Location</th>
              <th>Category</th>
              <th>Expiry</th>
              <th class="actions-col"></th>
            </tr>
          </thead>
          <tbody>
            ${items.map((item) => this._renderRow(item))}
            ${items.length === 0
              ? html`<tr>
                  <td colspan="8">${this._renderEmpty()}</td>
                </tr>`
              : nothing}
          </tbody>
        </table>
      </div>
    `;
  }

  private _renderCardList(items: InventoryItemDto[]) {
    if (items.length === 0) {
      return this._renderEmpty();
    }
    return html`
      <div class="card-list">
        ${items.map((item) => this._renderItemCard(item))}
      </div>
    `;
  }

  private _renderRow(item: InventoryItemDto) {
    const status = this._itemStatus(item);
    const measure = this._renderMeasure(item);
    return html`
      <tr class=${status ? `row-${status}` : ""}>
        <td>
          <hpu-button
            variant="text"
            @hpu-click=${() => this._openEdit(item)}
            >${item.name}</hpu-button
          >
        </td>
        <td class="status-col">${this._renderStatusBadge(status)}</td>
        <td>${this._renderQtyText(item)}</td>
        <td class="measure-col">${measure}</td>
        <td>${item.location || "—"}</td>
        <td>${item.category || "—"}</td>
        <td class="expiry-col ${this._expiryClass(status)}">
          ${this._formatDate(item.expiry_date)}
        </td>
        <td class="actions">
          ${this._mdButton(this._canWrite() ? "Edit" : "View", {
            variant: "outlined",
            onClick: () => this._openEdit(item),
          })}
          ${this._canWrite()
            ? this._mdButton("Remove", {
                variant: "danger-text",
                disabled: this._isRemovePending(item.id),
                onClick: () => void this._remove(item),
              })
            : nothing}
        </td>
      </tr>
    `;
  }

  private _renderItemCard(item: InventoryItemDto) {
    const status = this._itemStatus(item);
    const measure = this._renderMeasure(item);
    const meta = [item.location, item.category, measure]
      .filter(Boolean)
      .join(" · ");
    return html`
      <article
        class="item-card ${status ? `row-${status}` : ""}"
        @click=${() => this._openEdit(item)}
      >
        <div class="item-card-top">
          <div class="item-card-title">
            <span class="item-name">${item.name}</span>
            ${this._renderStatusBadge(status)}
          </div>
          <hpu-button
            variant="text"
            tone="danger"
            size="sm"
            ?disabled=${this._isRemovePending(item.id)}
            ?hidden=${!this._canWrite()}
            @click=${(e: Event) => e.stopPropagation()}
            @hpu-click=${() => void this._remove(item)}
            >Remove</hpu-button
          >
        </div>
        ${meta ? html`<div class="meta">${meta}</div>` : nothing}
        <div class="item-card-bottom">
          ${this._renderQtyText(item)}
          ${item.expiry_date
            ? html`<span class="${this._expiryClass(status)}"
                >${this._formatDate(item.expiry_date)}</span
              >`
            : nothing}
        </div>
      </article>
    `;
  }

  private _formReadiness(): ReadinessKind {
    return this._readinessKind(this._form.category || "");
  }

  private _showCaloriesField(): boolean {
    return showCaloriesField(this._formReadiness());
  }

  private _renderDialog() {
    const f = this._form;
    const locations = this._optionList(
      this._settings?.locations ?? [],
      f.location || "",
    );
    const categories = this._optionList(
      this._settings?.categories ?? [],
      f.category || "",
    );
    const kind = this._formReadiness();
    const totalContents = this._formTotalContents();
    const totalLiters = this._formTotalLiters();
    const totalCalories = this._formTotalCalories();
    const contentsLabel = this._contentsUnitLabel(f.contents_unit || "unit");
    let qtyHint = "";
    if (totalContents != null && f.contents_unit) {
      qtyHint = `Total on hand: ${this._formatMeasureNumber(totalContents)} ${contentsLabel}`;
      if (totalLiters != null) {
        qtyHint += ` · ${this._formatMeasureNumber(totalLiters)} L`;
      }
      if (totalCalories != null) {
        qtyHint += ` · ${this._formatMeasureNumber(totalCalories)} kcal`;
      }
    }

    const write = this._canWrite();
    const dialogTitle = this._editing
      ? write
        ? this._t("dialog.edit_title")
        : this._t("dialog.edit_title")
      : this._t("dialog.add_title");

    return html`
      <div class="dialog-backdrop">
        <div
          class="dialog ${this.narrow ? "dialog-narrow" : ""}"
          role="dialog"
          aria-modal="true"
          aria-label=${dialogTitle}
        >
          <div class="dialog-header">
            <h2>${dialogTitle}</h2>
            <hpu-icon-button class="dialog-close"
          path=${MDI_CLOSE}
          label=${this._t("action.close")}
          @hpu-click=${this._closeDialog}
        ></hpu-icon-button>
          </div>

          <div class="form-section">
            <div class="form-section-title">Details</div>
            <div class="barcode-row">
              ${this._textField("barcode", this._t("field.barcode"), {
                write,
                error: this._barcodeError,
              })}
              ${write
                ? html`
                    ${this._mdButton(this._t("action.scan"), {
                      variant: "outlined",
                      disabled: this._scanning,
                      onClick: () => void this._scanBarcode(),
                    })}
                    ${this._mdButton(this._t("action.lookup"), {
                      variant: "outlined",
                      disabled: this._scanning || !(f.barcode || "").trim(),
                      onClick: () => void this._lookupBarcode(),
                    })}
                  `
                : nothing}
            </div>
            ${this._textField("name", "Name", { write, required: write })}
            <div class="row2">
              ${this._selectField(
                "location",
                "Location",
                locations.map((l) => ({ value: l, label: l })),
                { write, required: write, placeholder: "Select location" },
              )}
              ${this._selectField(
                "category",
                "Category",
                categories.map((c) => ({ value: c, label: c })),
                { write, required: write, placeholder: "Select category" },
              )}
            </div>
            ${this._selectField(
              "priority",
              this._t("field.priority"),
              PRIORITIES.map((p) => ({
                value: p,
                label: this._t(`priority.${p}`),
              })),
              { write, fallback: "important" },
            )}
            ${this._textField("notes", this._t("field.notes"), { write })}
          </div>

          <div class="form-section">
            <div class="form-section-title">Stock</div>
            <div class="row3">
              ${this._textField("quantity", "Quantity", {
                write,
                required: write,
                inputmode: "decimal",
                fallback: "1",
                hint: qtyHint,
              })}
              ${this._textField("desired_quantity", "Desired quantity", {
                write,
                inputmode: "decimal",
                fallback: "0",
              })}
              ${this._selectField(
                "unit",
                "Unit",
                STOCK_UNITS.map((u) => ({ value: u, label: ucfirst(u) })),
                { write, required: write, fallback: "piece" },
              )}
            </div>
            <div class="row2">
              ${this._textField("contents_per_unit", "Contents per unit", {
                write,
                required:
                  write &&
                  (kind === "food" || kind === "water" || kind === "pet_food"),
                inputmode: "decimal",
                hint: "How much is in one bottle, can, or pack?",
              })}
              ${this._selectField(
                "contents_unit",
                "Contents unit",
                CONTENTS_UNITS.map((u) => ({ value: u, label: ucfirst(u) })),
                {
                  write,
                  required:
                    write &&
                    (kind === "food" || kind === "water" || kind === "pet_food"),
                  placeholder: "Select unit",
                  hint: "Liter, milliliter, gram, or kilogram for one stock unit.",
                },
              )}
            </div>
            ${this._showCaloriesField()
              ? this._textField(
                  "calories_per_content",
                  `Calories (kcal) per ${contentsLabel}`,
                  {
                    write,
                    required: write && kind === "food",
                    inputmode: "decimal",
                    hint: `Calories per contents unit${
                      totalCalories != null
                        ? ` · Total calories on hand: ${this._formatMeasureNumber(totalCalories)} kcal`
                        : ""
                    }`,
                  },
                )
              : nothing}
            ${kind === "none"
              ? html`<div class="field-hint">
                  Category is not mapped to food, water or pet food — this item will not
                  count toward readiness.
                </div>`
              : nothing}
          </div>

          <div class="form-section">
            <div class="form-section-title">Dates</div>
            ${this._textField("expiry_date", "Expiry", { write, type: "date" })}
          </div>

          ${this._error
            ? html`<div class="error" role="alert">${this._error}</div>`
            : nothing}

          <div class="dialog-actions">
            ${this._mdButton(
              write ? this._t("action.cancel") : this._t("action.close"),
              {
                variant: "text",
                onClick: this._closeDialog,
              },
            )}
            ${write
              ? this._mdButton(this._t("action.save"), {
                  variant: "filled",
                  disabled: this._saving,
                  onClick: () => void this._save(),
                })
              : nothing}
          </div>
        </div>
      </div>
    `;
  }

  private _textField(
    key: string,
    label: string,
    o: {
      write: boolean;
      required?: boolean;
      type?: "text" | "date";
      inputmode?: string;
      hint?: string;
      error?: string;
      fallback?: string;
    },
  ) {
    return html`<hpu-input
      name=${key}
      label=${label}
      type=${o.type ?? "text"}
      inputmode=${o.inputmode ?? ""}
      hint=${o.hint ?? ""}
      error=${o.error ?? this._fieldErrors[key] ?? ""}
      ?required=${o.required ?? false}
      ?disabled=${!o.write}
      .value=${this._form[key] || o.fallback || ""}
      @hpu-input=${this._onField(key)}
    ></hpu-input>`;
  }

  private _selectField(
    key: string,
    label: string,
    options: { value: string; label: string }[],
    o: {
      write: boolean;
      required?: boolean;
      placeholder?: string;
      hint?: string;
      fallback?: string;
    },
  ) {
    return html`<hpu-select
      name=${key}
      label=${label}
      placeholder=${o.placeholder ?? ""}
      hint=${o.hint ?? ""}
      error=${this._fieldErrors[key] ?? ""}
      ?required=${o.required ?? false}
      ?disabled=${!o.write}
      .options=${options}
      .value=${this._form[key] || o.fallback || ""}
      @hpu-change=${this._onField(key)}
    ></hpu-select>`;
  }

  private _onField(key: string) {
    return (e: Event) => {
      const value = (e as CustomEvent<{ value: string }>).detail.value;
      this._form = { ...this._form, [key]: value };
      if (key === "barcode" && this._barcodeError) {
        this._barcodeError = "";
      }
      if (this._fieldErrors[key]) {
        const next = { ...this._fieldErrors };
        delete next[key];
        this._fieldErrors = next;
      }
    };
  }

  /** Accept comma or dot as decimal separator while typing. */
  private _parseDecimal(raw: string): number {
    return Number(String(raw).trim().replace(",", "."));
  }

  private _blankForm(): Record<string, string> {
    return {
      name: "",
      quantity: "1",
      desired_quantity: "0",
      unit: "piece",
      location: "",
      category: "",
      priority: "important",
      notes: "",
      barcode: "",
      expiry_date: "",
      contents_per_unit: "",
      contents_unit: "",
      calories_per_content: "",
    };
  }

  private _openTemplates = async () => {
    if (!this.hass) return;
    this._templateBusy = true;
    this._error = "";
    try {
      this._templates = await listKitTemplates(this.hass);
      this._templateUnchecked = {};
      this._setTemplateNotice("");
      this._templateOpen = true;
    } catch (err) {
      this._error = formatHassError(err);
    } finally {
      this._templateBusy = false;
    }
  };

  private _openReadiness = () => {
    this._readinessOpen = true;
  };

  private _closeReadiness = () => {
    this._readinessOpen = false;
    void this.updateComplete.then(() =>
      this.shadowRoot
        ?.querySelector<HTMLElement>('[data-stat="readiness"]')
        ?.focus(),
    );
  };

  private _renderReadinessDialog() {
    const title = this._t("readiness.title");
    return html`
      <div
        class="dialog-backdrop"
        @click=${(e: Event) => {
          if (e.target === e.currentTarget) this._closeReadiness();
        }}
      >
        <div
          class="dialog explain-dialog ${this.narrow ? "dialog-narrow" : ""}"
          role="dialog"
          aria-modal="true"
          aria-label=${title}
        >
          <div class="dialog-header">
            <h2>${title}</h2>
            <hpu-icon-button class="dialog-close"
          path=${MDI_CLOSE}
          label=${this._t("action.close")}
          @hpu-click=${this._closeReadiness}
        ></hpu-icon-button>
          </div>
          <p>${this._t("readiness.explain")}</p>
          <p class="field-hint">${this._t("readiness.example")}</p>
        </div>
      </div>
    `;
  }

  private _openCompleteness = () => {
    this._completenessOpen = true;
  };

  private _closeCompleteness = () => {
    this._completenessOpen = false;
    void this.updateComplete.then(() =>
      this.shadowRoot
        ?.querySelector<HTMLElement>('[data-stat="completeness"]')
        ?.focus(),
    );
  };

  private _renderCompletenessDialog() {
    const completeness = this._snapshot?.completeness;
    const categories = Object.entries(completeness?.categories ?? {});
    const overall = this._completenessPercent();
    const title = this._t("completeness.title");
    const allComplete = categories.every(([, c]) => c.missing.length === 0);
    return html`
      <div
        class="dialog-backdrop"
        @click=${(e: Event) => {
          if (e.target === e.currentTarget) this._closeCompleteness();
        }}
      >
        <div
          class="dialog completeness-dialog ${this.narrow ? "dialog-narrow" : ""}"
          role="dialog"
          aria-modal="true"
          aria-label=${title}
        >
          <div class="dialog-header">
            <h2>${title}</h2>
            <hpu-icon-button class="dialog-close"
          path=${MDI_CLOSE}
          label=${this._t("action.close")}
          @hpu-click=${this._closeCompleteness}
        ></hpu-icon-button>
          </div>
          <p>${this._t("completeness.explain")}</p>
          <p class="field-hint">${this._t("completeness.example")}</p>
          <div class="completeness-overall">
            ${this._t("completeness.overall")}:
            <strong>${this._pct(overall)}</strong>
          </div>
          ${allComplete
            ? html`<p class="completeness-all">
                ${this._t("completeness.all_complete")}
              </p>`
            : nothing}
          ${categories.map(
            ([name, c]) => html`
              <section class="completeness-category">
                <div class="completeness-category-head">
                  <span class="completeness-category-name">${name}</span>
                  <span class="completeness-category-score">
                    ${c.complete}/${c.total} · ${this._pct(c.percent)}
                    ${c.missing.length === 0
                      ? html`<span
                          class="completeness-check"
                          title=${this._t("completeness.category_complete")}
                          aria-label=${this._t("completeness.category_complete")}
                          >✓</span
                        >`
                      : nothing}
                  </span>
                </div>
                ${c.missing.length > 0
                  ? html`<ul class="completeness-missing">
                      ${c.missing.map(
                        (m) => html`
                          <li>
                            <span class="completeness-item-name">${m.name}</span>
                            <span
                              class="completeness-reason ${m.expired
                                ? "completeness-reason-expired"
                                : ""}"
                              >${m.expired
                                ? this._t("completeness.expired")
                                : this._t("completeness.stock", {
                                    quantity: m.quantity,
                                    desired: m.desired_quantity,
                                  })}</span
                            >
                          </li>
                        `,
                      )}
                    </ul>`
                  : nothing}
              </section>
            `,
          )}
        </div>
      </div>
    `;
  }

  private _closeTemplates = () => {
    this._templateOpen = false;
    this._templateUnchecked = {};
  };

  private _setTemplateNotice(text: string) {
    if (this._templateNoticeTimer) clearTimeout(this._templateNoticeTimer);
    this._templateNoticeTimer = null;
    this._templateNotice = text;
    if (text) {
      this._templateNoticeTimer = setTimeout(() => {
        this._templateNotice = "";
        this._templateNoticeTimer = null;
      }, TEMPLATE_NOTICE_MS);
    }
  }

  private _templateMissing(tpl: KitTemplateDto) {
    return missingItems(
      tpl.items,
      (this._snapshot?.items ?? []).map((i) => i.name),
    );
  }

  private _setTemplateUnchecked(templateId: string, names: Set<string>) {
    this._templateUnchecked = { ...this._templateUnchecked, [templateId]: names };
  }

  private _toggleTemplateItem(tpl: KitTemplateDto, name: string, checked: boolean) {
    const next = new Set(this._templateUnchecked[tpl.id] ?? []);
    if (checked) next.delete(name);
    else next.add(name);
    this._setTemplateUnchecked(tpl.id, next);
  }

  private _toggleTemplateAll(tpl: KitTemplateDto) {
    const missing = this._templateMissing(tpl);
    const state = toggleState(missing, this._templateUnchecked[tpl.id] ?? new Set());
    this._setTemplateUnchecked(
      tpl.id,
      state === "all" ? new Set(missing.map((i) => i.name)) : new Set(),
    );
  }

  private async _applyTemplate(tpl: KitTemplateDto) {
    if (!this.hass || this._templateBusy) return;
    const chosen = selectedItems(
      this._templateMissing(tpl),
      this._templateUnchecked[tpl.id] ?? new Set(),
    );
    if (!chosen.length) return;
    this._templateBusy = true;
    this._error = "";
    try {
      const result = (await this.hass.callService(
        "ready_home",
        "apply_kit_template",
        { template_id: tpl.id, item_names: chosen.map((i) => i.name) },
        undefined,
        undefined,
        true,
      )) as { response?: { added_count?: number; skipped_count?: number } } | undefined;
      const response = result?.response;
      this._setTemplateNotice(
        response
          ? this._t("template.added_result", {
              added: response.added_count ?? 0,
              skipped: response.skipped_count ?? 0,
            })
          : "",
      );
      this._closeTemplates();
    } catch (err) {
      this._error = formatHassError(err);
    } finally {
      this._templateBusy = false;
    }
  }

  private async _pushRestock() {
    if (!this.hass) return;
    this._error = "";
    try {
      await this.hass.callService("ready_home", "push_restock_list", {});
    } catch (err) {
      this._error = formatHassError(err);
    }
  }

  private _renderTemplateCard(tpl: KitTemplateDto) {
    const missing = this._templateMissing(tpl);
    const unchecked = this._templateUnchecked[tpl.id] ?? new Set<string>();
    const selected = selectedItems(missing, unchecked);
    const state = toggleState(missing, unchecked);
    return html`
      <div class="template-card">
        <div class="template-card-body">
          <strong>${tpl.name}</strong>
          <p>${tpl.description}</p>
          <span class="item-count"
            >${missing.length
              ? this._t("template.to_add", { n: missing.length })
              : this._t("template.none_missing")}</span
          >
        </div>
        ${missing.length
          ? html`
              <details class="template-items">
                <summary>${this._t("template.items")}</summary>
                <hpu-checkbox
                  class="template-item template-select-all"
                  .checked=${state === "all"}
                  .indeterminate=${state === "partial"}
                  @hpu-change=${() => this._toggleTemplateAll(tpl)}
                  >${this._t("template.select_all")}</hpu-checkbox
                >
                ${missing.map(
                  (item) => html`
                    <hpu-checkbox
                      class="template-item"
                      .checked=${!unchecked.has(item.name)}
                      @hpu-change=${(e: CustomEvent<{ checked: boolean }>) =>
                        this._toggleTemplateItem(
                          tpl,
                          item.name,
                          e.detail.checked,
                        )}
                      >${item.name}</hpu-checkbox
                    >
                  `,
                )}
              </details>
            `
          : nothing}
        ${this._mdButton(
          this._t("template.add_selected", { n: selected.length }),
          {
            variant: "filled",
            disabled: this._templateBusy || selected.length === 0,
            onClick: () => void this._applyTemplate(tpl),
          },
        )}
      </div>
    `;
  }

  private _renderTemplateDialog() {
    return html`
      <div
        class="dialog-backdrop"
        @click=${(e: Event) => {
          if (e.target === e.currentTarget) this._closeTemplates();
        }}
      >
        <div
          class="dialog"
          role="dialog"
          aria-modal="true"
          aria-label=${this._t("dialog.template_title")}
        >
          <div class="dialog-header">
            <h2>${this._t("dialog.template_title")}</h2>
            <hpu-icon-button
          path=${MDI_CLOSE}
          label=${this._t("action.close")}
          @hpu-click=${this._closeTemplates}
        ></hpu-icon-button>
          </div>
          <p class="field-hint">${this._t("template.skip_existing")}</p>
          <div class="template-list">
            ${this._templates.map((tpl) => this._renderTemplateCard(tpl))}
          </div>
          <div class="dialog-actions">
            ${this._mdButton(this._t("action.close"), {
              variant: "text",
              onClick: this._closeTemplates,
            })}
          </div>
        </div>
      </div>
    `;
  }

  private _openAdd = () => {
    if (!this._canWrite()) return;
    this._editing = null;
    this._form = this._blankForm();
    this._fieldErrors = {};
    this._error = "";
    this._barcodeError = "";
    this._dialogOpen = true;
  };

  private _openEdit = (item: InventoryItemDto) => {
    this._editing = item;
    const stockUnit = (STOCK_UNITS as readonly string[]).includes(item.unit)
      ? item.unit
      : "piece";
    let contentsPer = item.contents_per_unit;
    let contentsUnit = item.contents_unit || "";
    let caloriesPerContent = item.calories_per_content;
    if (contentsPer == null && item.liters_per_unit != null) {
      contentsPer = item.liters_per_unit;
      contentsUnit = "liter";
    }
    if (
      caloriesPerContent == null &&
      item.calories_per_unit != null &&
      contentsPer == null
    ) {
      contentsPer = 1;
      contentsUnit = contentsUnit || "gram";
      caloriesPerContent = item.calories_per_unit;
    }
    this._form = {
      name: item.name,
      quantity: String(item.quantity),
      desired_quantity: String(item.desired_quantity),
      unit: stockUnit,
      location: item.location,
      category: item.category,
      priority: item.priority,
      notes: item.notes || "",
      barcode: item.barcode || "",
      expiry_date: item.expiry_date || "",
      contents_per_unit: contentsPer != null ? String(contentsPer) : "",
      contents_unit: contentsUnit,
      calories_per_content:
        caloriesPerContent != null ? String(caloriesPerContent) : "",
    };
    this._fieldErrors = {};
    this._error = "";
    this._barcodeError = "";
    this._dialogOpen = true;
  };

  private _closeDialog = () => {
    this._abortScan();
    this._dialogOpen = false;
    this._fieldErrors = {};
    this._error = "";
    this._barcodeError = "";
  };

  private _onWindowKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "Escape") return;
    if (this._moreOpen) {
      e.preventDefault();
      this._closeMore();
      return;
    }
    if (this._readinessOpen) {
      e.preventDefault();
      this._closeReadiness();
      return;
    }
    if (this._householdModal) {
      e.preventDefault();
      this._closeHousehold();
      return;
    }
    if (this._completenessOpen) {
      e.preventDefault();
      this._closeCompleteness();
      return;
    }
    if (!this._dialogOpen) return;
    e.preventDefault();
    this._closeDialog();
  };

  private _abortScan() {
    const handle = this._scanHandle;
    this._scanHandle = null;
    handle?.abort();
  }

  private async _remove(item: InventoryItemDto) {
    if (!this._canWrite()) return;
    if (this._isRemovePending(item.id)) return;
    if (!confirm(`Remove “${item.name}”?`)) return;
    this._pendingRemoveIds = [...this._pendingRemoveIds, item.id];
    this._error = "";
    try {
      await this.hass.callService("ready_home", "remove_item", {
        item_id: item.id,
      });
    } catch (err) {
      this._pendingRemoveIds = this._pendingRemoveIds.filter(
        (id) => id !== item.id,
      );
      this._error = formatHassError(err);
    }
  }

  private async _save() {
    if (!this._canWrite()) return;
    const errors = this._validateForm();
    this._fieldErrors = errors;
    if (Object.keys(errors).length) {
      return;
    }

    const f = this._form;
    const name = (f.name || "").trim();
    const kind = this._formReadiness();
    const payload: Record<string, unknown> = {
      quantity: this._parseDecimal(f.quantity || "0"),
      desired_quantity: this._parseDecimal(f.desired_quantity || "0"),
      unit: f.unit || "piece",
      location: f.location || "",
      category: f.category || "",
      priority: f.priority || "important",
      barcode: f.barcode || "",
      notes: f.notes || "",
    };
    if (f.expiry_date) payload.expiry_date = f.expiry_date;

    Object.assign(
      payload,
      measurePayload(kind, {
        contents_per_unit: f.contents_per_unit || "",
        contents_unit: f.contents_unit || "",
        calories_per_content: f.calories_per_content || "",
      }),
    );

    this._saving = true;
    this._error = "";
    try {
      if (this._editing) {
        await this.hass.callService("ready_home", "update_item", {
          item_id: this._editing.id,
          new_name: name,
          ...payload,
        });
      } else {
        await this.hass.callService("ready_home", "add_item", {
          name,
          ...payload,
        });
      }
      this._dialogOpen = false;
      this._fieldErrors = {};
      this._barcodeError = "";
    } catch (err) {
      this._error = formatHassError(err);
    } finally {
      this._saving = false;
    }
  }

  private async _lookupBarcode() {
    if (!this._canWrite()) return;
    const code = this._form.barcode?.trim();
    if (!code) return;
    this._scanning = true;
    this._barcodeError = "";
    this._error = "";
    try {
      const result = await lookupBarcode(this.hass, code);
      const fallback =
        this._settings?.food_categories?.[0]?.trim() || "Food";
      this._form = applyBarcodeLookupToForm(this._form, result, fallback);
    } catch (err) {
      this._barcodeError = isBarcodeNotFound(err)
        ? BARCODE_NOT_FOUND_MESSAGE
        : `Barcode lookup failed: ${formatHassError(err)}`;
    } finally {
      this._scanning = false;
    }
  }

  /** Header / empty-state Scan: camera first; open add dialog only when needed. */
  private async _scanFromPanel() {
    if (!this._canWrite()) return;
    if (!hasCompanionBarcodeScanner(this.hass)) {
      this._openAdd();
      this._barcodeError = this._t("companion.scan_needed");
      return;
    }

    this._scanning = true;
    this._error = "";
    this._barcodeError = "";
    this._abortScan();
    const handle = scanProductBarcode(this.hass);
    this._scanHandle = handle;
    try {
      const code = await handle.done;
      if (this._scanHandle === handle) this._scanHandle = null;
      if (!code) return;
      this._openAdd();
      this._form = { ...this._form, barcode: code };
      this._scanning = false;
      await this._lookupBarcode();
    } catch (err) {
      if (this._scanHandle === handle) this._scanHandle = null;
      this._openAdd();
      this._barcodeError = `Camera scan failed: ${formatHassError(err)}`;
    } finally {
      this._scanning = false;
    }
  }

  /** Dialog Scan button. */
  private async _scanBarcode() {
    if (!this._canWrite()) return;
    if (!hasCompanionBarcodeScanner(this.hass)) {
      this._barcodeError = this._t("companion.scan_needed");
      return;
    }

    this._scanning = true;
    this._barcodeError = "";
    this._error = "";
    this._abortScan();
    const handle = scanProductBarcode(this.hass);
    this._scanHandle = handle;
    try {
      const code = await handle.done;
      if (this._scanHandle === handle) this._scanHandle = null;
      if (!code) return;
      this._form = { ...this._form, barcode: code };
      this._scanning = false;
      await this._lookupBarcode();
    } catch (err) {
      if (this._scanHandle === handle) this._scanHandle = null;
      this._barcodeError = `Camera scan failed: ${formatHassError(err)}`;
    } finally {
      this._scanning = false;
    }
  }

  static styles = css`
    :host {
      display: block;
      height: 100%;
      color: var(--primary-text-color);
      background: var(--primary-background-color, transparent);
      font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
      --rh-ready-color: #4ca448;
    }
    .page {
      height: 100%;
      overflow: auto;
      box-sizing: border-box;
    }
    .header {
      max-width: 1100px;
      margin: 0 auto;
      padding: 20px 24px 4px;
      box-sizing: border-box;
    }
    .header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }
    .brand-heading {
      margin: 0;
      line-height: 0;
      min-width: 0;
    }
    .brand-logo {
      display: block;
      height: 40px;
      width: auto;
      max-width: min(280px, 100%);
      object-fit: contain;
    }
    .more {
      position: relative;
      flex-shrink: 0;
    }
    .more-menu {
      position: absolute;
      top: calc(100% + 4px);
      right: 0;
      z-index: 20;
      display: flex;
      flex-direction: column;
      min-width: 12rem;
      padding: 4px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 12px;
      background: var(--card-background-color, #fff);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    }
    .more-item {
      padding: 10px 12px;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: var(--primary-text-color);
      text-align: left;
      cursor: pointer;
    }
    .more-item:hover,
    .more-item:focus-visible {
      background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.06);
      outline: none;
    }
    .more-item[disabled] {
      opacity: 0.5;
      cursor: default;
    }
    .content {
      max-width: 1100px;
      margin: 0 auto;
      padding: 20px 24px 40px;
      box-sizing: border-box;
    }
    h2 {
      margin: 0 0 12px;
      font-size: 1.3rem;
      font-weight: 500;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      margin-bottom: 16px;
    }
    .stat {
      padding: 16px;
      border-radius: var(--ha-border-radius-md, 8px);
      border-left: 3px solid var(--divider-color);
      background: var(--card-background-color, #fff);
      box-shadow: var(--ha-card-box-shadow, none);
    }
    .stat.stat-ok {
      border-left-color: var(--rh-ready-color);
    }
    .stat.stat-warn {
      border-left-color: var(--warning-color, #f57c00);
    }
    .stat.stat-bad {
      border-left-color: var(--error-color, #c62828);
    }
    button.stat-button {
      font: inherit;
      color: inherit;
      text-align: left;
      border-top: none;
      border-right: none;
      border-bottom: none;
      cursor: pointer;
    }
    button.stat-button:hover {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    }
    button.stat-button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    .completeness-overall {
      font-size: 1.1rem;
    }
    .completeness-category-head {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      font-weight: 500;
    }
    .completeness-check {
      color: var(--rh-ready-color);
      margin-left: 6px;
    }
    .completeness-missing {
      list-style: none;
      margin: 6px 0 0;
      padding: 0 0 0 12px;
    }
    .completeness-missing li {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 4px 0;
      border-bottom: 1px solid var(--divider-color);
    }
    .completeness-item-name {
      min-width: 0;
      overflow-wrap: anywhere;
    }
    .completeness-reason {
      flex-shrink: 0;
      color: var(--secondary-text-color);
    }
    .completeness-reason-expired {
      color: var(--error-color, #c62828);
    }
    .stat-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.85rem;
      color: var(--secondary-text-color);
      margin-bottom: 4px;
    }
    .stat-icon {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
      color: var(--secondary-text-color);
    }
    .stat.stat-ok .stat-icon {
      color: var(--rh-ready-color);
    }
    .stat.stat-warn .stat-icon {
      color: var(--warning-color, #f57c00);
    }
    .stat.stat-bad .stat-icon {
      color: var(--error-color, #c62828);
    }
    .stat-value {
      display: block;
      font-size: 1.5rem;
      font-weight: 600;
    }
    .stat-meta,
    .stat-duration {
      display: block;
      margin-top: 4px;
      font-size: 0.85rem;
      color: var(--secondary-text-color);
    }
    .stat-duration.duration-warn {
      color: var(--warning-color, #f57c00);
    }
    .stat-duration.duration-bad {
      color: var(--error-color, #c62828);
    }
    .attention {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 16px;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      border-radius: 999px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color, transparent);
      color: var(--primary-text-color);
      cursor: pointer;
      font: inherit;
      font-size: 0.9rem;
    }
    .chip.active {
      border-color: var(--primary-color);
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .chip-count {
      font-weight: 600;
      min-width: 1.2em;
      text-align: center;
    }
    .inventory {
      background: var(--card-background-color, #fff);
      border-radius: var(--ha-card-border-radius, 12px);
      border: 1px solid var(--divider-color);
      box-shadow: var(--ha-card-box-shadow, none);
      padding: 16px;
      box-sizing: border-box;
    }
    .toolbar {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 16px;
    }
    .toolbar-row {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      gap: 10px;
    }
    .search {
      flex: 1 1 auto;
      min-width: 0;
      box-sizing: border-box;
    }
    .sort {
      flex: 0 0 auto;
      max-width: 10.5rem;
    }
    .inventory-meta {
      display: flex;
      justify-content: flex-end;
    }
    .item-count {
      font-size: 0.8rem;
      color: var(--secondary-text-color);
    }
    .filters {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 10px;
    }
    select,
    input,
    button {
      font: inherit;
    }
    select,
    input {
      padding: 8px 10px;
      border-radius: var(--ha-border-radius-lg, 12px);
      border: 1px solid var(--divider-color);
      background: var(--card-background-color, var(--primary-background-color));
      color: var(--primary-text-color);
    }
    .table-wrap {
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 1rem;
    }
    th,
    td {
      text-align: left;
      padding: 12px 14px;
      border-bottom: 1px solid var(--divider-color);
      vertical-align: middle;
    }
    th.actions-col,
    td.actions {
      text-align: right;
    }
    .status-col {
      white-space: nowrap;
    }
    .measure-col {
      white-space: nowrap;
      color: var(--secondary-text-color);
      font-size: 0.9rem;
    }
    .expiry-col {
      white-space: nowrap;
    }
    tbody tr:last-child td {
      border-bottom: none;
    }
    .card-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .item-card {
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-border-radius-lg, 12px);
      padding: 16px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.03));
      cursor: pointer;
    }
    .item-card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 8px;
    }
    .item-card-title {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
      min-width: 0;
    }
    .item-name {
      font-weight: 500;
      font-size: 1.05rem;
    }
    .item-card-bottom {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      gap: 8px;
    }
    .meta {
      font-size: 0.85rem;
      color: var(--secondary-text-color);
      margin-top: 4px;
      display: flex;
      gap: 6px;
      align-items: center;
      flex-wrap: wrap;
    }
    .expiry-expired {
      color: var(--error-color, #c62828);
      font-weight: 600;
    }
    .expiry-warn {
      color: var(--warning-color, #f57c00);
      font-weight: 600;
    }
    .qty-text {
      white-space: nowrap;
    }
    .actions {
      white-space: nowrap;
      display: flex;
      gap: 6px;
      align-items: center;
      justify-content: flex-end;
    }
    .empty {
      text-align: center;
      color: var(--secondary-text-color);
      padding: 28px 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .empty-actions {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .error {
      color: var(--error-color, #c62828);
      font-size: 0.9rem;
      margin-bottom: 10px;
    }
    .dialog-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 16px;
      box-sizing: border-box;
    }
    .dialog {
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      padding: 20px;
      border-radius: var(--ha-dialog-border-radius, var(--ha-border-radius-lg, 12px));
      width: min(520px, 100%);
      max-height: 90vh;
      overflow: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      box-sizing: border-box;
    }
    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .dialog-header h2 {
      margin: 0;
      flex: 1;
      min-width: 0;
    }
    .dialog-close {
      flex-shrink: 0;
      margin: -8px -8px -8px 0;
    }
    .dialog.dialog-narrow {
      width: 100%;
      max-height: 100%;
      border-radius: var(--ha-dialog-border-radius, var(--ha-border-radius-lg, 12px));
      padding: 20px;
      padding-bottom: calc(20px + env(safe-area-inset-bottom, 0px));
    }
    .dialog-backdrop:has(.dialog-narrow) {
      align-items: stretch;
      padding-top: max(12px, env(safe-area-inset-top, 0px));
      padding-right: max(12px, env(safe-area-inset-right, 0px));
      padding-bottom: max(12px, env(safe-area-inset-bottom, 0px));
      padding-left: max(12px, env(safe-area-inset-left, 0px));
    }
    .form-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 12px;
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-border-radius-md, 8px);
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.02));
    }
    .form-section-title {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--primary-color);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .row2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .row3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12px;
    }
    .field-hint {
      color: var(--secondary-text-color);
      font-size: 0.75rem;
      margin-top: 4px;
      line-height: 1.35;
    }
    .template-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .template-card {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 12px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 8px;
    }
    .template-items summary {
      cursor: pointer;
      color: var(--primary-color);
    }
    .dialog .template-item {
      flex-direction: row;
      align-items: center;
      gap: 10px;
      padding: 4px 0;
      font-size: 1rem;
      line-height: 1.3;
      text-align: left;
      overflow-wrap: anywhere;
      cursor: pointer;
    }
    .template-items summary {
      padding: 2px 0;
    }
    .dialog .template-select-all {
      font-weight: 500;
      padding-bottom: 6px;
      margin-bottom: 2px;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
    }
    .template-card-body {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .template-card-body p {
      margin: 0;
      color: var(--secondary-text-color);
      font-size: 0.9rem;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 4px;
    }
    .barcode-row {
      display: flex;
      gap: 6px;
      align-items: center;
    }
    .barcode-row hpu-input {
      flex: 1;
      min-width: 0;
    }
    @media (max-width: 720px) {
      .header-row {
        flex-wrap: nowrap;
        gap: 8px;
      }
      .header-actions {
        gap: 4px;
      }
      .brand-logo {
        height: 36px;
        max-width: min(200px, 42vw);
        min-width: 0;
        object-fit: contain;
      }
      .stats {
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 6px;
        margin-bottom: 12px;
      }
      .stat {
        padding: 8px 6px;
      }
      .stat-label {
        font-size: 0.7rem;
        gap: 4px;
        margin-bottom: 2px;
      }
      .stat-icon {
        width: 14px;
        height: 14px;
      }
      .stat-value {
        font-size: 1.15rem;
      }
      .stat-meta,
      .stat-duration {
        font-size: 0.7rem;
        margin-top: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .header,
      .content {
        padding-left: 12px;
        padding-right: 12px;
      }
      .content {
        padding-bottom: 28px;
      }
      .toolbar-row {
        flex-wrap: nowrap;
      }
      .search {
        flex: 1 1 auto;
        min-width: 0;
      }
      .sort {
        max-width: 8.5rem;
      }
      .filters-btn {
        flex: 0 0 auto;
        padding: 0 10px;
      }
      .actions {
        flex-direction: column;
        align-items: stretch;
      }
      .row2,
      .row3 {
        grid-template-columns: 1fr;
      }
    }
    /* Smallest phones: keep menu icon, logo, Add item and the more button on one row. */
    @media (max-width: 400px) {
      .brand-logo {
        max-width: 28vw;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "ready-home-panel": ReadyHomePanel;
  }
}

// Always define on the current registry (HA may use a scoped one).
// get() can see a global registration and skip define here, leaving the
// panel host unupgraded and blank. Retrying define is safe via try/catch.
try {
  customElements.define(PANEL_TAG, ReadyHomePanel);
} catch {
  // Already defined in this registry.
}
