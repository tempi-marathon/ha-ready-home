/** Ready Home sidebar management panel. */

import { LitElement, css, html, nothing } from "lit";
import { live } from "lit/directives/live.js";
import { property, state } from "lit/decorators.js";
import {
  type InventoryItemDto,
  type SettingsDto,
  type Snapshot,
  getSettings,
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
  showCaloriesField,
  validateMeasureFields,
  contentsToLiters,
} from "./inventory_view";
import {
  loadPanelViewState,
  savePanelViewState,
  sortedOptionList,
  type PanelSort,
} from "./panel_view_state";
import { readinessTone } from "./readiness_tone";
import type { HomeAssistant } from "./types";

const COMPANION_SCAN_MESSAGE =
  "Scanning needs the Home Assistant Companion app. Enter the barcode and tap Lookup.";

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

const STOCK_UNITS = ["box", "pack", "piece"] as const;
const CONTENTS_UNITS = ["gram", "kilogram", "liter", "milliliter"] as const;
const PRIORITIES = ["essential", "important", "optional"] as const;

const STATUS_LABELS: Record<string, string> = {
  expired: "Expired",
  urgent: "Urgent",
  expiring: "Expiring",
  low: "Low stock",
};

function ucfirst(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
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

  private _unsub: (() => void) | null = null;
  private _connected = false;
  private _scanHandle: ScanHandle | null = null;
  private _viewHydrated = false;

  connectedCallback(): void {
    super.connectedCallback();
    this._connected = true;
    this._restoreViewState();
    window.addEventListener("keydown", this._onWindowKeyDown);
    void this._connect();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._connected = false;
    window.removeEventListener("keydown", this._onWindowKeyDown);
    this._abortScan();
    this._unsub?.();
    this._unsub = null;
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

  private _readinessKind(category: string): "food" | "water" | "none" {
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

  private _statusLabel(status: string): string {
    return STATUS_LABELS[status] || status;
  }

  private _setStatusFilter(status: string) {
    this._filterStatus = this._filterStatus === status ? "all" : status;
    this._persistViewState();
  }

  private _pct(value: number | null | undefined): string {
    if (value == null || Number.isNaN(Number(value))) return "—";
    return `${Math.round(Number(value))}%`;
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

  private _mdButton(
    label: string,
    opts: {
      variant?: "filled" | "outlined" | "text" | "danger-text";
      disabled?: boolean;
      onClick: (e: Event) => void;
    },
  ) {
    const variant = opts.variant ?? "outlined";
    return html`
      <button
        type="button"
        class="md-btn md-btn-${variant}"
        ?disabled=${opts.disabled ?? false}
        @click=${opts.onClick}
      >
        ${label}
      </button>
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
    const counts = this._bucketCounts;
    const supply = a.supply_hours;
    const waterSupply = a.water_supply_hours;
    const foodSupply = a.food_supply_hours;
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
                    <button
                      type="button"
                      class="icon-btn"
                      aria-label="Open menu"
                      @click=${this._toggleMenu}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="currentColor" d=${MDI_MENU} />
                      </svg>
                    </button>
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
            <div class="header-actions">
              ${this._canWrite()
                ? html`
                    ${this._mdButton("Scan", {
                      variant: "outlined",
                      disabled: this._scanning,
                      onClick: () => void this._scanFromPanel(),
                    })}
                    ${this._mdButton("Add item", {
                      variant: "filled",
                      onClick: this._openAdd,
                    })}
                  `
                : nothing}
            </div>
          </div>
        </header>

        <div class="content">
          <div class="stats">
            <div class="stat ${this._statToneClass(supply)}">
              <span class="stat-label">
                <svg class="stat-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d=${MDI_SHIELD_CHECK} />
                </svg>
                Overall
              </span>
              <span class="stat-value">${this._pct(overall)}</span>
              <span class="stat-duration ${this._durationClass(supply)}"
                >Lasts ${this._formatHours(supply)}</span
              >
            </div>
            <div class="stat ${this._statToneClass(waterSupply)}">
              <span class="stat-label">
                <svg class="stat-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d=${MDI_WATER} />
                </svg>
                Water
              </span>
              <span class="stat-value"
                >${this._formatAmount(a.water_on_hand, "L")}</span
              >
              <span class="stat-meta"
                >${this._pct(water)} · goal
                ${this._formatAmount(a.water_target, "L")}</span
              >
              <span class="stat-duration ${this._durationClass(waterSupply)}"
                >Lasts ${this._formatHours(waterSupply)}</span
              >
            </div>
            <div class="stat ${this._statToneClass(foodSupply)}">
              <span class="stat-label">
                <svg class="stat-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d=${MDI_FOOD} />
                </svg>
                Food
              </span>
              <span class="stat-value"
                >${this._formatAmount(a.food_on_hand, "kcal")}</span
              >
              <span class="stat-meta"
                >${this._pct(food)} · goal
                ${this._formatAmount(a.food_target, "kcal")}</span
              >
              <span class="stat-duration ${this._durationClass(foodSupply)}"
                >Lasts ${this._formatHours(foodSupply)}</span
              >
            </div>
          </div>

          <div class="attention" role="group" aria-label="Attention filters">
            <button
              type="button"
              class="chip ${this._filterStatus === "expired" ? "active" : ""}"
              @click=${() => this._setStatusFilter("expired")}
            >
              Expired
              <span class="chip-count">${counts.expired}</span>
            </button>
            <button
              type="button"
              class="chip ${this._filterStatus === "expiring" ? "active" : ""}"
              @click=${() => this._setStatusFilter("expiring")}
            >
              Expiring
              <span class="chip-count">${counts.expiring}</span>
            </button>
            <button
              type="button"
              class="chip ${this._filterStatus === "low_stock" ? "active" : ""}"
              @click=${() => this._setStatusFilter("low_stock")}
            >
              Low stock
              <span class="chip-count">${counts.low_stock}</span>
            </button>
          </div>

          <section class="inventory">
            <div class="toolbar">
              <div class="toolbar-row">
                <input
                  class="search"
                  type="search"
                  placeholder="Search name, location, barcode…"
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
                  <option value="name">Sort: name</option>
                  <option value="expiry">Sort: expiry</option>
                  <option value="quantity">Sort: quantity</option>
                </select>
                <button
                  type="button"
                  class="md-btn md-btn-outlined filters-btn ${this
                    ._filtersOpen || this._activeFilterCount
                    ? "active"
                    : ""}"
                  @click=${() => {
                    this._filtersOpen = !this._filtersOpen;
                    this._persistViewState();
                  }}
                >
                  Filters${this._activeFilterCount
                    ? html` (${this._activeFilterCount})`
                    : nothing}
                </button>
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
                        <option value="">All locations</option>
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
                        <option value="">All categories</option>
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
                        <option value="">All readiness</option>
                        <option value="water">Water</option>
                        <option value="food">Food</option>
                        <option value="none">Neither</option>
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

  private _fieldLabel(text: string, required = false) {
    return html`<span class="field-label"
      >${text}${required
        ? html`<span class="req" aria-hidden="true">*</span>`
        : nothing}</span
    >`;
  }

  private _fieldError(key: string) {
    const msg = this._fieldErrors[key];
    return msg ? html`<div class="field-error">${msg}</div>` : nothing;
  }

  private _fieldInvalid(key: string): boolean {
    return Boolean(this._fieldErrors[key]);
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
    return html`<span class="badge badge-${status}"
      >${this._statusLabel(status)}</span
    >`;
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
          <button class="link" @click=${() => this._openEdit(item)}>
            ${item.name}
          </button>
        </td>
        <td class="status-col">${this._renderStatusBadge(status)}</td>
        <td>${this._renderQtyText(item)}</td>
        <td class="measure-col">${measure}</td>
        <td>${item.location || "—"}</td>
        <td>${item.category || "—"}</td>
        <td class=${this._expiryClass(status)}>
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
          <button
            type="button"
            class="md-btn md-btn-danger-text"
            ?disabled=${this._isRemovePending(item.id)}
            ?hidden=${!this._canWrite()}
            @click=${(e: Event) => {
              e.stopPropagation();
              void this._remove(item);
            }}
          >
            Remove
          </button>
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

  private _formReadiness(): "food" | "water" | "none" {
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
        ? "Edit item"
        : "View item"
      : "Add item";

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
            <button
              type="button"
              class="icon-btn dialog-close"
              aria-label="Close"
              @click=${this._closeDialog}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d=${MDI_CLOSE} />
              </svg>
            </button>
          </div>

          <div class="form-section">
            <div class="form-section-title">Details</div>
            <label
              >Barcode
              <div class="barcode-row">
                <input
                  .value=${f.barcode || ""}
                  ?disabled=${!write}
                  @input=${this._onField("barcode")}
                />
                ${write
                  ? html`
                      ${this._mdButton("Scan", {
                        variant: "outlined",
                        disabled: this._scanning,
                        onClick: () => void this._scanBarcode(),
                      })}
                      ${this._mdButton("Lookup", {
                        variant: "outlined",
                        disabled: this._scanning || !(f.barcode || "").trim(),
                        onClick: () => void this._lookupBarcode(),
                      })}
                    `
                  : nothing}
              </div>
              ${this._barcodeError
                ? html`<div class="field-error" role="alert">
                    ${this._barcodeError}
                  </div>`
                : nothing}
            </label>
            <label
              >${this._fieldLabel("Name", write)}
              <input
                class=${this._fieldInvalid("name") ? "invalid" : ""}
                .value=${f.name || ""}
                ?disabled=${!write}
                @input=${this._onField("name")}
              />
              ${this._fieldError("name")}
            </label>
            <div class="row2">
              <label
                >${this._fieldLabel("Location", write)}
                <select
                  class=${this._fieldInvalid("location") ? "invalid" : ""}
                  .value=${live(f.location || "")}
                  ?disabled=${!write}
                  @change=${this._onField("location")}
                >
                  <option value="" ?selected=${!(f.location || "")}>
                    Select location
                  </option>
                  ${locations.map(
                    (l) =>
                      html`<option
                        value=${l}
                        ?selected=${(f.location || "") === l}
                      >
                        ${l}
                      </option>`,
                  )}
                </select>
                ${this._fieldError("location")}
              </label>
              <label
                >${this._fieldLabel("Category", write)}
                <select
                  class=${this._fieldInvalid("category") ? "invalid" : ""}
                  .value=${live(f.category || "")}
                  ?disabled=${!write}
                  @change=${this._onField("category")}
                >
                  <option value="" ?selected=${!(f.category || "")}>
                    Select category
                  </option>
                  ${categories.map(
                    (c) =>
                      html`<option
                        value=${c}
                        ?selected=${(f.category || "") === c}
                      >
                        ${c}
                      </option>`,
                  )}
                </select>
                ${this._fieldError("category")}
              </label>
            </div>
            <label
              >Priority
              <select
                .value=${live(f.priority || "important")}
                ?disabled=${!write}
                @change=${this._onField("priority")}
              >
                ${PRIORITIES.map(
                  (p) =>
                    html`<option
                      value=${p}
                      ?selected=${(f.priority || "important") === p}
                    >
                      ${ucfirst(p)}
                    </option>`,
                )}
              </select>
            </label>
            <label
              >Notes
              <input
                .value=${f.notes || ""}
                ?disabled=${!write}
                @input=${this._onField("notes")}
              />
            </label>
          </div>

          <div class="form-section">
            <div class="form-section-title">Stock</div>
            <div class="row3">
              <label
                >${this._fieldLabel("Quantity", write)}
                <input
                  class=${this._fieldInvalid("quantity") ? "invalid" : ""}
                  type="text"
                  inputmode="decimal"
                  .value=${live(f.quantity || "1")}
                  ?disabled=${!write}
                  @input=${this._onField("quantity")}
                />
                ${this._fieldError("quantity")}
                ${qtyHint
                  ? html`<div class="field-hint">${qtyHint}</div>`
                  : nothing}
              </label>
              <label
                >Desired quantity
                <input
                  type="text"
                  inputmode="decimal"
                  .value=${live(f.desired_quantity || "0")}
                  ?disabled=${!write}
                  @input=${this._onField("desired_quantity")}
                />
              </label>
              <label
                >${this._fieldLabel("Unit", write)}
                <select
                  class=${this._fieldInvalid("unit") ? "invalid" : ""}
                  .value=${live(f.unit || "piece")}
                  ?disabled=${!write}
                  @change=${this._onField("unit")}
                >
                  ${STOCK_UNITS.map(
                    (u) =>
                      html`<option
                        value=${u}
                        ?selected=${(f.unit || "piece") === u}
                      >
                        ${ucfirst(u)}
                      </option>`,
                  )}
                </select>
                ${this._fieldError("unit")}
              </label>
            </div>
            <div class="row2">
              <label
                >${this._fieldLabel(
                  "Contents per unit",
                  write && (kind === "food" || kind === "water"),
                )}
                <input
                  class=${this._fieldInvalid("contents_per_unit")
                    ? "invalid"
                    : ""}
                  type="text"
                  inputmode="decimal"
                  .value=${live(f.contents_per_unit || "")}
                  ?disabled=${!write}
                  @input=${this._onField("contents_per_unit")}
                />
                ${this._fieldError("contents_per_unit")}
                <div class="field-hint">
                  How much is in one bottle, can, or pack?
                </div>
              </label>
              <label
                >${this._fieldLabel(
                  "Contents unit",
                  write && (kind === "food" || kind === "water"),
                )}
                <select
                  class=${this._fieldInvalid("contents_unit") ? "invalid" : ""}
                  .value=${live(f.contents_unit || "")}
                  ?disabled=${!write}
                  @change=${this._onField("contents_unit")}
                >
                  <option value="" ?selected=${!(f.contents_unit || "")}>
                    Select unit
                  </option>
                  ${CONTENTS_UNITS.map(
                    (u) =>
                      html`<option
                        value=${u}
                        ?selected=${(f.contents_unit || "") === u}
                      >
                        ${ucfirst(u)}
                      </option>`,
                  )}
                </select>
                ${this._fieldError("contents_unit")}
                <div class="field-hint">
                  Liter, milliliter, gram, or kilogram for one stock unit.
                </div>
              </label>
            </div>
            ${this._showCaloriesField()
              ? html`
                  <label
                    >${this._fieldLabel(
                      `Calories (kcal) per ${contentsLabel}`,
                      write && kind === "food",
                    )}
                    <input
                      class=${this._fieldInvalid("calories_per_content")
                        ? "invalid"
                        : ""}
                      type="text"
                      inputmode="decimal"
                      .value=${live(f.calories_per_content || "")}
                      ?disabled=${!write}
                      @input=${this._onField("calories_per_content")}
                    />
                    ${this._fieldError("calories_per_content")}
                    <div class="field-hint">
                      Calories per contents unit${totalCalories != null
                        ? html` · Total calories on hand:
                            ${this._formatMeasureNumber(totalCalories)} kcal`
                        : nothing}
                    </div>
                  </label>
                `
              : nothing}
            ${kind === "none"
              ? html`<div class="field-hint">
                  Category is not mapped to food or water — this item will not
                  count toward readiness.
                </div>`
              : nothing}
          </div>

          <div class="form-section">
            <div class="form-section-title">Dates</div>
            <label
              >Expiry
              <input
                type="date"
                .value=${f.expiry_date || ""}
                ?disabled=${!write}
                @input=${this._onField("expiry_date")}
              />
            </label>
          </div>

          ${this._error
            ? html`<div class="error" role="alert">${this._error}</div>`
            : nothing}

          <div class="dialog-actions">
            ${this._mdButton(write ? "Cancel" : "Close", {
              variant: "text",
              onClick: this._closeDialog,
            })}
            ${write
              ? this._mdButton("Save", {
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

  private _onField(key: string) {
    return (e: Event) => {
      const target = e.target as
        | HTMLInputElement
        | HTMLSelectElement
        | HTMLTextAreaElement;
      this._form = { ...this._form, [key]: target.value };
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
    if (e.key !== "Escape" || !this._dialogOpen) return;
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
      this._barcodeError = COMPANION_SCAN_MESSAGE;
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
      this._barcodeError = COMPANION_SCAN_MESSAGE;
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
    .icon-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: transparent;
      color: var(--primary-text-color);
      cursor: pointer;
      flex-shrink: 0;
    }
    .icon-btn:hover {
      background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.06);
    }
    .icon-btn svg {
      width: 24px;
      height: 24px;
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
      border-radius: 8px;
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
    .filters-btn.active {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    select,
    input,
    button {
      font: inherit;
    }
    select,
    input {
      padding: 8px 10px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color, var(--primary-background-color));
      color: var(--primary-text-color);
    }
    .md-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 36px;
      padding: 0 16px;
      border-radius: var(--ha-button-border-radius, 4px);
      border: none;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      white-space: nowrap;
      box-sizing: border-box;
      background: transparent;
      color: var(--primary-color);
    }
    .md-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .md-btn-filled {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .md-btn-outlined {
      border: 1px solid var(--primary-color);
      color: var(--primary-color);
      background: transparent;
    }
    .md-btn-text {
      color: var(--primary-color);
      background: transparent;
      padding: 0 8px;
    }
    .md-btn-danger-text {
      color: var(--error-color, #c62828);
      background: transparent;
      padding: 0 8px;
      text-transform: none;
      letter-spacing: normal;
      font-size: 0.8rem;
      height: auto;
    }
    button.link {
      border: none;
      background: none;
      padding: 0;
      color: var(--primary-color);
      text-align: left;
      cursor: pointer;
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
      border-radius: 10px;
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
    .badge {
      letter-spacing: 0.02em;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 999px;
      border: 1px solid var(--divider-color);
    }
    .badge-expired {
      color: var(--error-color, #c62828);
      border-color: currentColor;
    }
    .badge-urgent,
    .badge-expiring {
      color: var(--warning-color, #f57c00);
      border-color: currentColor;
    }
    .badge-low {
      color: var(--info-color, #1976d2);
      border-color: currentColor;
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
      border-radius: 12px;
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
      border-radius: 12px;
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
      border-radius: 8px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.02));
    }
    .form-section-title {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--primary-color);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .dialog label {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 0.9rem;
    }
    .field-label {
      display: block;
      line-height: 1.3;
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
    .req {
      color: var(--error-color, #c62828);
      margin-left: 2px;
    }
    .field-error {
      color: var(--error-color, #c62828);
      font-size: 0.75rem;
      margin-top: 2px;
    }
    .dialog input.invalid,
    .dialog select.invalid {
      border-color: var(--error-color, #c62828);
    }
    .dialog input.invalid:focus,
    .dialog select.invalid:focus {
      outline: none;
      border-color: var(--error-color, #c62828);
      box-shadow: 0 0 0 1px var(--error-color, #c62828);
    }
    .field-hint {
      color: var(--secondary-text-color);
      font-size: 0.75rem;
      margin-top: 4px;
      line-height: 1.35;
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
    .barcode-row input {
      flex: 1;
      min-width: 0;
    }
    @media (max-width: 720px) {
      .brand-logo {
        height: 36px;
        max-width: min(200px, 42vw);
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
