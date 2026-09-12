/** Ready Home sidebar management panel. */

import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import {
  type InventoryItemDto,
  type SettingsDto,
  type Snapshot,
  getSettings,
  lookupBarcode,
  subscribeInventory,
} from "./api";
import type { HomeAssistant } from "./types";

const PANEL_TAG = "ready-home-panel";

const UNITS = [
  "piece",
  "pack",
  "box",
  "gram",
  "kilogram",
  "liter",
  "milliliter",
] as const;

/** mdi:plus path — avoids bundling @mdi/js. */
const MDI_PLUS =
  "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z";

/** mdi:filter-variant */
const MDI_FILTER =
  "M6,13H18V11H6M3,6V8H21V6M10,18H14V16H10V18Z";

/** mdi:shield-check */
const MDI_SHIELD =
  "M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z";

/** mdi:water */
const MDI_WATER =
  "M12,20A6,6 0 0,1 6,14C6,10 12,3.25 12,3.25C12,3.25 18,10 18,14A6,6 0 0,1 12,20Z";

/** mdi:food-apple */
const MDI_FOOD =
  "M20,10C22,13 17,22 15,22C13,22 13,21 12,21C11,21 11,22 9,22C7,22 2,13 4,10C6,7 9,7 11,8V5C11,3.9 11.9,3 13,3H14V5H13V8C15,7 18,7 20,10Z";

const STATUS_LABELS: Record<string, string> = {
  expired: "Expired",
  urgent: "Urgent",
  expiring: "Expiring",
  low: "Low stock",
};

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
  @state() private _sort: "name" | "expiry" | "quantity" = "name";
  @state() private _dialogOpen = false;
  @state() private _editing: InventoryItemDto | null = null;
  @state() private _form: Record<string, string> = {};
  @state() private _error = "";
  @state() private _busy = false;

  private _unsub: (() => void) | null = null;
  private _connected = false;

  connectedCallback(): void {
    super.connectedCallback();
    this._connected = true;
    void this._connect();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._connected = false;
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
        this._snapshot = snap;
      });
      this._error = "";
    } catch (err) {
      this._error = String(err);
    }
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

  private _readinessKind(category: string): "food" | "water" | "none" {
    const key = category.trim().toLowerCase();
    if (!key || !this._settings) return "none";
    if (
      (this._settings.water_categories ?? []).some(
        (c) => c.trim().toLowerCase() === key,
      )
    ) {
      return "water";
    }
    if (
      (this._settings.food_categories ?? []).some(
        (c) => c.trim().toLowerCase() === key,
      )
    ) {
      return "food";
    }
    return "none";
  }

  private get _items(): InventoryItemDto[] {
    let items = [...(this._snapshot?.items ?? [])];
    const q = this._search.trim().toLowerCase();
    if (q) {
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.location.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q) ||
          (i.barcode || "").toLowerCase().includes(q) ||
          (i.notes || "").toLowerCase().includes(q),
      );
    }
    if (this._filterLocation) {
      items = items.filter(
        (i) => i.location.toLowerCase() === this._filterLocation.toLowerCase(),
      );
    }
    if (this._filterCategory) {
      items = items.filter(
        (i) => i.category.toLowerCase() === this._filterCategory.toLowerCase(),
      );
    }
    if (this._filterReadiness) {
      items = items.filter(
        (i) => this._readinessKind(i.category) === this._filterReadiness,
      );
    }
    if (this._filterStatus !== "all") {
      const b = this._snapshot?.buckets;
      const ids = new Set<string>();
      if (this._filterStatus === "expired") {
        b?.expired.forEach((i) => ids.add(i.id));
      } else if (this._filterStatus === "expiring") {
        b?.within_urgent.forEach((i) => ids.add(i.id));
        b?.within_expiring.forEach((i) => ids.add(i.id));
      } else if (this._filterStatus === "low_stock") {
        b?.low_stock.forEach((i) => ids.add(i.id));
      }
      items = items.filter((i) => ids.has(i.id));
    }
    items.sort((a, b) => {
      if (this._sort === "quantity") return a.quantity - b.quantity;
      if (this._sort === "expiry") {
        return (a.expiry_date || "9999").localeCompare(b.expiry_date || "9999");
      }
      return a.name.localeCompare(b.name);
    });
    return items;
  }

  private _itemStatus(item: InventoryItemDto): string {
    const b = this._snapshot?.buckets;
    if (!b) return "";
    if (b.expired.some((i) => i.id === item.id)) return "expired";
    if (b.within_urgent.some((i) => i.id === item.id)) return "urgent";
    if (b.within_expiring.some((i) => i.id === item.id)) return "expiring";
    if (b.low_stock.some((i) => i.id === item.id)) return "low";
    return "";
  }

  private _statusLabel(status: string): string {
    return STATUS_LABELS[status] || status;
  }

  private _setStatusFilter(status: string) {
    this._filterStatus = this._filterStatus === status ? "all" : status;
  }

  private _pct(value: number | null | undefined): string {
    if (value == null || Number.isNaN(Number(value))) return "—";
    return `${Math.round(Number(value))}%`;
  }

  private _formatHours(hours: number | null | undefined): string {
    if (hours == null || Number.isNaN(Number(hours))) return "—";
    const h = Math.max(0, Math.round(Number(hours)));
    if (h < 48) return `${h} hour${h === 1 ? "" : "s"}`;
    const days = Math.round(h / 24);
    return `${days} day${days === 1 ? "" : "s"}`;
  }

  private _formatAmount(value: number | null | undefined, unit: string): string {
    if (value == null || Number.isNaN(Number(value))) return "—";
    const n = Number(value);
    const rounded = Math.abs(n - Math.round(n)) < 0.05 ? Math.round(n) : Math.round(n * 10) / 10;
    return `${rounded} ${unit}`;
  }

  private _durationClass(hours: number | null | undefined): string {
    const duration = this._assessment.duration_hours ?? this._settings?.duration_hours ?? 72;
    if (hours == null || Number.isNaN(Number(hours))) return "";
    if (Number(hours) <= 0) return "duration-bad";
    if (Number(hours) < Number(duration)) return "duration-warn";
    return "duration-ok";
  }

  protected render() {
    const items = this._items;
    const a = this._assessment;
    const locations = this._settings?.locations ?? [];
    const categories = this._settings?.categories ?? [];
    const overall = a.overall_percent;
    const water = a.water_percent;
    const food = a.food_percent;
    const counts = this._bucketCounts;
    const duration = a.duration_hours ?? this._settings?.duration_hours ?? 72;
    const supply = a.supply_hours;
    const waterSupply = a.water_supply_hours;
    const foodSupply = a.food_supply_hours;

    return html`
      <ha-top-app-bar-fixed>
        <ha-menu-button
          slot="navigationIcon"
          .hass=${this.hass}
          .narrow=${this.narrow}
        ></ha-menu-button>
        <div slot="title">Ready Home</div>
        <ha-icon-button
          slot="actionItems"
          .path=${MDI_PLUS}
          .label=${"Add item"}
          ?disabled=${this._busy}
          @click=${this._openAdd}
        ></ha-icon-button>

        <div class="content">
          <div class="section-head">
            <h1>Home readiness</h1>
            <p class="subtitle">${duration}-hour readiness</p>
          </div>

          <div class="stats">
            <ha-card class="stat-card">
              <div class="stat-inner">
                <div class="stat-title">
                  <ha-svg-icon .path=${MDI_SHIELD}></ha-svg-icon>
                  Overall readiness
                </div>
                <div class="stat-value">${this._pct(overall)}</div>
                <div class="stat-duration ${this._durationClass(supply)}">
                  Lasts ${this._formatHours(supply)}
                  · Lowest of food and water
                </div>
              </div>
            </ha-card>
            <ha-card class="stat-card">
              <div class="stat-inner">
                <div class="stat-title">
                  <ha-svg-icon .path=${MDI_WATER}></ha-svg-icon>
                  Water
                </div>
                <div class="stat-row">
                  <span class="stat-value"
                    >${this._formatAmount(a.water_on_hand, "L")}</span
                  >
                  <span class="stat-goal"
                    >Goal ${this._formatAmount(a.water_target, "L")}</span
                  >
                </div>
                <div class="stat-meta">${this._pct(water)} ready</div>
                <div class="stat-duration ${this._durationClass(waterSupply)}">
                  Lasts ${this._formatHours(waterSupply)}
                </div>
              </div>
            </ha-card>
            <ha-card class="stat-card">
              <div class="stat-inner">
                <div class="stat-title">
                  <ha-svg-icon .path=${MDI_FOOD}></ha-svg-icon>
                  Food
                </div>
                <div class="stat-row">
                  <span class="stat-value"
                    >${this._formatAmount(a.food_on_hand, "kcal")}</span
                  >
                  <span class="stat-goal"
                    >Goal ${this._formatAmount(a.food_target, "kcal")}</span
                  >
                </div>
                <div class="stat-meta">${this._pct(food)} ready</div>
                <div class="stat-duration ${this._durationClass(foodSupply)}">
                  Lasts ${this._formatHours(foodSupply)}
                </div>
              </div>
            </ha-card>
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

          <div class="toolbar">
            <input
              class="search"
              type="search"
              placeholder="Search name, location, barcode…"
              .value=${this._search}
              @input=${(e: Event) => {
                this._search = (e.target as HTMLInputElement).value;
              }}
            />
            <div class="toolbar-row">
              <select
                class="sort"
                .value=${this._sort}
                @change=${(e: Event) => {
                  this._sort = (e.target as HTMLSelectElement)
                    .value as typeof this._sort;
                }}
              >
                <option value="name">Sort: name</option>
                <option value="expiry">Sort: expiry</option>
                <option value="quantity">Sort: quantity</option>
              </select>
              <button
                type="button"
                class="filters-btn ${this._filtersOpen || this._activeFilterCount ? "active" : ""}"
                @click=${() => {
                  this._filtersOpen = !this._filtersOpen;
                }}
              >
                <ha-svg-icon .path=${MDI_FILTER}></ha-svg-icon>
                Filters
                ${this._activeFilterCount
                  ? html`<span class="filter-badge">${this._activeFilterCount}</span>`
                  : nothing}
              </button>
              <span class="item-count"
                >${items.length} of ${this._snapshot?.items.length ?? 0}</span
              >
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
                      }}
                    >
                      <option value="">All readiness</option>
                      <option value="water">Water</option>
                      <option value="food">Food</option>
                      <option value="none">Neither</option>
                    </select>
                    ${this._activeFilterCount
                      ? html`<button
                          type="button"
                          class="link"
                          @click=${() => {
                            this._filterLocation = "";
                            this._filterCategory = "";
                            this._filterReadiness = "";
                          }}
                        >
                          Clear filters
                        </button>`
                      : nothing}
                  </div>
                `
              : nothing}
          </div>

          ${this._error
            ? html`<div class="error" role="alert">${this._error}</div>`
            : nothing}

          ${this.narrow
            ? this._renderCardList(items)
            : this._renderTable(items)}
        </div>
      </ha-top-app-bar-fixed>

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
        <button class="link" @click=${this._openAdd}>Add an item</button>
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

  private _expiryClass(status: string): string {
    if (status === "expired") return "expiry-expired";
    if (status === "urgent" || status === "expiring") return "expiry-warn";
    return "";
  }

  private _renderTable(items: InventoryItemDto[]) {
    return html`
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Location</th>
              <th>Category</th>
              <th>Expiry</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${items.map((item) => this._renderRow(item))}
            ${items.length === 0
              ? html`<tr>
                  <td colspan="6">${this._renderEmpty()}</td>
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
    return html`
      <tr class=${status ? `row-${status}` : ""}>
        <td>
          <button class="link" @click=${() => this._openEdit(item)}>
            ${item.name}
          </button>
          <div class="meta">
            ${status
              ? html`<span class="badge badge-${status}"
                  >${this._statusLabel(status)}</span
                >`
              : nothing}
          </div>
        </td>
        <td>${this._renderQtyText(item)}</td>
        <td>${item.location || "—"}</td>
        <td>${item.category || "—"}</td>
        <td class=${this._expiryClass(status)}>
          ${item.expiry_date || "—"}
        </td>
        <td class="actions">
          <button type="button" @click=${() => this._openEdit(item)}>
            Edit
          </button>
          <button
            type="button"
            class="danger"
            ?disabled=${this._busy}
            @click=${() => this._remove(item)}
          >
            Remove
          </button>
        </td>
      </tr>
    `;
  }

  private _renderItemCard(item: InventoryItemDto) {
    const status = this._itemStatus(item);
    const meta = [item.location, item.category]
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
            ${status
              ? html`<span class="badge badge-${status}"
                  >${this._statusLabel(status)}</span
                >`
              : nothing}
          </div>
          <button
            type="button"
            class="danger link-danger"
            ?disabled=${this._busy}
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
            ? html`<span class="expiry ${this._expiryClass(status)}"
                >${item.expiry_date}</span
              >`
            : nothing}
        </div>
      </article>
    `;
  }

  private _formReadiness(): "food" | "water" | "none" {
    return this._readinessKind(this._form.category || "");
  }

  private _showLitersField(): boolean {
    if (this._formReadiness() !== "water") return false;
    const unit = this._form.unit || "piece";
    return unit !== "liter" && unit !== "milliliter";
  }

  private _showCaloriesField(): boolean {
    return this._formReadiness() === "food";
  }

  private _renderDialog() {
    const f = this._form;
    const locations = this._settings?.locations ?? [];
    const categories = this._settings?.categories ?? [];
    return html`
      <div class="dialog-backdrop" @click=${this._closeDialog}>
        <div
          class="dialog ${this.narrow ? "dialog-narrow" : ""}"
          role="dialog"
          aria-modal="true"
          @click=${(e: Event) => e.stopPropagation()}
        >
          <h2>${this._editing ? "Edit item" : "Add item"}</h2>

          <section class="form-section">
            <h3>Details</h3>
            <label
              >Name
              <input
                required
                .value=${f.name || ""}
                @input=${this._onField("name")}
              />
            </label>
            <div class="row2">
              <label
                >Location
                <input
                  list="rh-locations"
                  .value=${f.location || ""}
                  @input=${this._onField("location")}
                />
                <datalist id="rh-locations">
                  ${locations.map((l) => html`<option value=${l}></option>`)}
                </datalist>
              </label>
              <label
                >Category
                <input
                  list="rh-categories"
                  .value=${f.category || ""}
                  @input=${this._onField("category")}
                />
                <datalist id="rh-categories">
                  ${categories.map((c) => html`<option value=${c}></option>`)}
                </datalist>
              </label>
            </div>
            <label
              >Priority
              <select
                .value=${f.priority || "important"}
                @change=${this._onField("priority")}
              >
                <option value="essential">essential</option>
                <option value="important">important</option>
                <option value="optional">optional</option>
              </select>
            </label>
            <label
              >Notes
              <textarea
                rows="2"
                .value=${f.notes || ""}
                @input=${this._onField("notes")}
              ></textarea>
            </label>
            <label
              >Barcode
              <div class="barcode-row">
                <input
                  .value=${f.barcode || ""}
                  @input=${this._onField("barcode")}
                />
                <button
                  type="button"
                  ?disabled=${this._busy}
                  @click=${this._scanBarcode}
                >
                  Scan
                </button>
                <button
                  type="button"
                  ?disabled=${this._busy}
                  @click=${this._lookupBarcode}
                >
                  Lookup
                </button>
              </div>
            </label>
          </section>

          <section class="form-section">
            <h3>Stock</h3>
            <div class="row2">
              <label
                >Quantity
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  .value=${f.quantity || "1"}
                  @input=${this._onField("quantity")}
                />
              </label>
              <label
                >Desired
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  .value=${f.desired_quantity || "0"}
                  @input=${this._onField("desired_quantity")}
                />
              </label>
            </div>
            <label
              >Unit
              <select .value=${f.unit || "piece"} @change=${this._onField("unit")}>
                ${UNITS.map((u) => html`<option value=${u}>${u}</option>`)}
              </select>
            </label>
            ${this._showLitersField()
              ? html`
                  <label
                    >Liters / unit
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      .value=${f.liters_per_unit || ""}
                      @input=${this._onField("liters_per_unit")}
                    />
                    <span class="hint"
                      >Required for water readiness when unit is not
                      liter/milliliter.</span
                    >
                  </label>
                `
              : nothing}
            ${this._showCaloriesField()
              ? html`
                  <label
                    >Calories / unit
                    <input
                      type="number"
                      min="0"
                      step="1"
                      .value=${f.calories_per_unit || ""}
                      @input=${this._onField("calories_per_unit")}
                    />
                    <span class="hint"
                      >Used for food readiness totals.</span
                    >
                  </label>
                `
              : nothing}
          </section>

          <section class="form-section">
            <h3>Dates</h3>
            <label
              >Expiry
              <input
                type="date"
                .value=${f.expiry_date || ""}
                @input=${this._onField("expiry_date")}
              />
            </label>
          </section>

          <div class="dialog-actions">
            <button type="button" @click=${this._closeDialog}>Cancel</button>
            <button
              type="button"
              class="primary"
              ?disabled=${this._busy || !(f.name || "").trim()}
              @click=${this._save}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private _onField(key: string) {
    return (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      this._form = { ...this._form, [key]: target.value };
    };
  }

  private _openAdd = () => {
    this._editing = null;
    this._form = {
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
      liters_per_unit: "",
      calories_per_unit: "",
    };
    this._error = "";
    this._dialogOpen = true;
  };

  private _openEdit = (item: InventoryItemDto) => {
    this._editing = item;
    this._form = {
      name: item.name,
      quantity: String(item.quantity),
      desired_quantity: String(item.desired_quantity),
      unit: item.unit,
      location: item.location,
      category: item.category,
      priority: item.priority,
      notes: item.notes || "",
      barcode: item.barcode || "",
      expiry_date: item.expiry_date || "",
      liters_per_unit:
        item.liters_per_unit != null ? String(item.liters_per_unit) : "",
      calories_per_unit:
        item.calories_per_unit != null ? String(item.calories_per_unit) : "",
    };
    this._error = "";
    this._dialogOpen = true;
  };

  private _closeDialog = () => {
    this._dialogOpen = false;
  };

  private async _run(action: () => Promise<unknown>) {
    this._busy = true;
    this._error = "";
    try {
      await action();
    } catch (err) {
      this._error = String(err);
    } finally {
      this._busy = false;
    }
  }

  private async _remove(item: InventoryItemDto) {
    if (!confirm(`Remove “${item.name}”?`)) return;
    await this._run(() =>
      this.hass.callService("ready_home", "remove_item", { item_id: item.id }),
    );
  }

  private async _save() {
    const f = this._form;
    const name = (f.name || "").trim();
    if (!name) {
      this._error = "Name is required";
      return;
    }

    const kind = this._formReadiness();
    const payload: Record<string, unknown> = {
      quantity: Number(f.quantity || 0),
      desired_quantity: Number(f.desired_quantity || 0),
      unit: f.unit || "piece",
      location: f.location || "",
      category: f.category || "",
      priority: f.priority || "important",
      barcode: f.barcode || "",
      notes: f.notes || "",
    };
    if (f.expiry_date) payload.expiry_date = f.expiry_date;
    if (kind === "water" && this._showLitersField() && f.liters_per_unit !== "") {
      payload.liters_per_unit = Number(f.liters_per_unit);
    } else if (kind !== "water" || !this._showLitersField()) {
      payload.liters_per_unit = null;
    }
    if (kind === "food" && f.calories_per_unit !== "") {
      payload.calories_per_unit = Number(f.calories_per_unit);
    } else if (kind !== "food") {
      payload.calories_per_unit = null;
    }

    await this._run(async () => {
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
    });
  }

  private async _lookupBarcode() {
    const code = this._form.barcode?.trim();
    if (!code) return;
    this._busy = true;
    this._error = "";
    try {
      const result = await lookupBarcode(this.hass, code);
      const name = [result.brand, result.name].filter(Boolean).join(" ").trim();
      const category =
        this._form.category?.trim() ||
        (this._settings?.food_categories?.[0] ?? "Food");
      this._form = {
        ...this._form,
        name: name || this._form.name,
        category,
        calories_per_unit:
          result.calories_per_100g != null
            ? String(result.calories_per_100g)
            : this._form.calories_per_unit,
      };
    } catch (err) {
      this._error = `Barcode lookup failed: ${err}`;
    } finally {
      this._busy = false;
    }
  }

  private async _scanBarcode() {
    if (typeof BarcodeDetector === "undefined") {
      this._error =
        "BarcodeDetector not supported in this browser — enter the code manually.";
      return;
    }
    this._busy = true;
    this._error = "";
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      const video = document.createElement("video");
      video.srcObject = stream;
      await video.play();
      const detector = new BarcodeDetector({
        formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128"],
      });
      await new Promise((r) => setTimeout(r, 700));
      const codes = await detector.detect(video);
      stream.getTracks().forEach((t) => t.stop());
      if (codes[0]?.rawValue) {
        this._form = { ...this._form, barcode: codes[0].rawValue };
        this._busy = false;
        await this._lookupBarcode();
      } else {
        this._error = "No barcode detected — try again or enter manually.";
      }
    } catch (err) {
      this._error = `Camera scan failed: ${err}`;
    } finally {
      this._busy = false;
    }
  }

  static styles = css`
    :host {
      display: block;
      height: 100%;
      color: var(--primary-text-color);
      font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
    }
    ha-top-app-bar-fixed {
      height: 100%;
    }
    .content {
      max-width: 1100px;
      margin: 0 auto;
      padding: 16px 20px 32px;
      box-sizing: border-box;
    }
    .section-head {
      margin-bottom: 12px;
    }
    .section-head h1 {
      margin: 0;
      font-size: 1.35rem;
      font-weight: 500;
    }
    .subtitle {
      margin: 4px 0 0;
      font-size: 0.85rem;
      color: var(--secondary-text-color);
    }
    h2 {
      margin: 0 0 8px;
      font-size: 1.2rem;
      font-weight: 500;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      margin-bottom: 16px;
    }
    .stat-card {
      border-left: 3px solid var(--primary-color);
    }
    .stat-inner {
      padding: 14px 16px;
    }
    .stat-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.8rem;
      color: var(--secondary-text-color);
      margin-bottom: 8px;
    }
    .stat-title ha-svg-icon {
      --mdc-icon-size: 18px;
      color: var(--primary-color);
    }
    .stat-value {
      font-size: 1.6rem;
      font-weight: 600;
      line-height: 1.15;
    }
    .stat-row {
      display: flex;
      align-items: baseline;
      gap: 10px;
      flex-wrap: wrap;
    }
    .stat-goal,
    .stat-meta {
      font-size: 0.8rem;
      color: var(--secondary-text-color);
    }
    .stat-meta {
      margin-top: 4px;
    }
    .stat-duration {
      margin-top: 8px;
      font-size: 0.8rem;
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
      gap: 8px;
      margin-bottom: 12px;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 999px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color, transparent);
      color: var(--primary-text-color);
      cursor: pointer;
      font: inherit;
      font-size: 0.85rem;
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
    .toolbar {
      position: sticky;
      top: 0;
      z-index: 2;
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 12px;
      padding-bottom: 4px;
      background: var(--primary-background-color, var(--card-background-color));
    }
    .search {
      width: 100%;
      box-sizing: border-box;
    }
    .toolbar-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
    }
    .item-count {
      margin-left: auto;
      font-size: 0.8rem;
      color: var(--secondary-text-color);
    }
    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      align-items: center;
    }
    .filters-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .filters-btn ha-svg-icon {
      --mdc-icon-size: 18px;
    }
    .filters-btn.active {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    .filter-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 1.25em;
      height: 1.25em;
      padding: 0 4px;
      border-radius: 999px;
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      font-size: 0.75rem;
      font-weight: 600;
    }
    select,
    input,
    textarea,
    button {
      font: inherit;
    }
    select,
    input,
    textarea {
      padding: 8px 10px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color, var(--primary-background-color));
      color: var(--primary-text-color);
    }
    textarea {
      resize: vertical;
      min-height: 2.5rem;
    }
    button {
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: var(--secondary-background-color, transparent);
      color: var(--primary-text-color);
      cursor: pointer;
    }
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    button.primary {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      border-color: transparent;
    }
    button.danger {
      color: var(--error-color, #c62828);
    }
    button.link {
      border: none;
      background: none;
      padding: 0;
      color: var(--primary-color);
      text-align: left;
    }
    button.link-danger {
      border: none;
      background: none;
      padding: 0;
      font-size: 0.8rem;
    }
    .table-wrap {
      overflow-x: auto;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: var(--card-background-color, transparent);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.92rem;
    }
    th,
    td {
      text-align: left;
      padding: 10px 12px;
      border-bottom: 1px solid var(--divider-color);
      vertical-align: top;
    }
    tbody tr:last-child td {
      border-bottom: none;
    }
    .card-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .item-card {
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      padding: 12px;
      background: var(--card-background-color, var(--primary-background-color));
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
      font-size: 1rem;
    }
    .item-card-bottom {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
    }
    .meta {
      font-size: 0.75rem;
      color: var(--secondary-text-color);
      margin-top: 4px;
      display: flex;
      gap: 6px;
      align-items: center;
      flex-wrap: wrap;
    }
    .badge {
      letter-spacing: 0.02em;
      font-size: 0.65rem;
      font-weight: 600;
      padding: 1px 6px;
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
    .expiry-expired,
    .expiry.expiry-expired {
      color: var(--error-color, #c62828);
      font-weight: 600;
    }
    .expiry-warn,
    .expiry.expiry-warn {
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
    }
    .empty {
      text-align: center;
      color: var(--secondary-text-color);
      padding: 28px 12px;
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
    }
    .dialog {
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      padding: 16px;
      border-radius: 10px;
      width: min(520px, 100%);
      max-height: 90vh;
      overflow: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      box-sizing: border-box;
    }
    .dialog.dialog-narrow {
      width: 100%;
      height: 100%;
      max-height: 100%;
      border-radius: 0;
      padding: 16px;
      padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
    }
    .dialog-backdrop:has(.dialog-narrow) {
      padding: 0;
      align-items: stretch;
    }
    .form-section {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 12px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
    }
    .form-section h3 {
      margin: 0;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--primary-color);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .dialog label {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 0.85rem;
    }
    .hint {
      font-size: 0.75rem;
      color: var(--secondary-text-color);
    }
    .row2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 4px;
    }
    .barcode-row {
      display: flex;
      gap: 6px;
    }
    .barcode-row input {
      flex: 1;
      min-width: 0;
    }
    @media (max-width: 720px) {
      .stats {
        grid-template-columns: 1fr;
      }
      .content {
        padding: 12px 12px 28px;
      }
      .actions {
        flex-direction: column;
      }
      .row2 {
        grid-template-columns: 1fr;
      }
      .item-count {
        margin-left: 0;
        width: 100%;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "ready-home-panel": ReadyHomePanel;
  }
}

// HA (and Nabu Casa) can load the panel module more than once after a
// cache-bust URL change; defining twice throws and leaves the panel blank.
if (!customElements.get(PANEL_TAG)) {
  customElements.define(PANEL_TAG, ReadyHomePanel);
}
