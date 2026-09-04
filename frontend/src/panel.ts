/** Ready Home sidebar management panel. */

import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  type InventoryItemDto,
  type SettingsDto,
  type Snapshot,
  getSettings,
  lookupBarcode,
  subscribeInventory,
} from "./api";
import type { HomeAssistant } from "./types";

const UNITS = [
  "piece",
  "pack",
  "box",
  "gram",
  "kilogram",
  "liter",
  "milliliter",
] as const;

@customElement("ready-home-panel")
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
  @state() private _filterResource = "";
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
    if (this._filterResource) {
      items = items.filter((i) => i.resource === this._filterResource);
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

  protected render() {
    const items = this._items;
    const a = this._assessment;
    const locations = this._settings?.locations ?? [];
    const categories = this._settings?.categories ?? [];
    const overall = a.overall_percent;
    const water = a.water_percent;
    const food = a.food_percent;

    return html`
      <div class="page">
        <header class="header">
          <div class="header-row">
            <div>
              <h1>Ready Home</h1>
              <p class="sub">Manage emergency inventory and track readiness.</p>
            </div>
            <button class="primary" ?disabled=${this._busy} @click=${this._openAdd}>
              Add item
            </button>
          </div>
          <div class="stats">
            <div class="stat">
              <span class="stat-label">Overall</span>
              <span class="stat-value">${this._pct(overall)}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Water</span>
              <span class="stat-value">${this._pct(water)}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Food</span>
              <span class="stat-value">${this._pct(food)}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Items</span>
              <span class="stat-value">${this._snapshot?.items.length ?? 0}</span>
            </div>
          </div>
        </header>

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
          <div class="filters">
            <select
              .value=${this._filterStatus}
              @change=${(e: Event) => {
                this._filterStatus = (e.target as HTMLSelectElement).value;
              }}
            >
              <option value="all">All statuses</option>
              <option value="expired">Expired</option>
              <option value="expiring">Expiring</option>
              <option value="low_stock">Low stock</option>
            </select>
            <select
              .value=${this._filterLocation}
              @change=${(e: Event) => {
                this._filterLocation = (e.target as HTMLSelectElement).value;
              }}
            >
              <option value="">All locations</option>
              ${locations.map((l) => html`<option value=${l}>${l}</option>`)}
            </select>
            <select
              .value=${this._filterCategory}
              @change=${(e: Event) => {
                this._filterCategory = (e.target as HTMLSelectElement).value;
              }}
            >
              <option value="">All categories</option>
              ${categories.map((c) => html`<option value=${c}>${c}</option>`)}
            </select>
            <select
              .value=${this._filterResource}
              @change=${(e: Event) => {
                this._filterResource = (e.target as HTMLSelectElement).value;
              }}
            >
              <option value="">All resources</option>
              <option value="water">Water</option>
              <option value="food">Food</option>
              <option value="none">None</option>
            </select>
            <select
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
          </div>
        </div>

        ${this._error
          ? html`<div class="error" role="alert">${this._error}</div>`
          : nothing}

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Location</th>
                <th>Resource</th>
                <th>Expiry</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${items.map((item) => this._renderRow(item))}
              ${items.length === 0
                ? html`<tr>
                    <td colspan="6" class="empty">
                      ${this._snapshot
                        ? html`No items match. <button class="link" @click=${this._openAdd}>Add an item</button>`
                        : "Loading inventory…"}
                    </td>
                  </tr>`
                : nothing}
            </tbody>
          </table>
        </div>

        ${this._dialogOpen ? this._renderDialog() : nothing}
      </div>
    `;
  }

  private _pct(value: number | null | undefined): string {
    if (value == null || Number.isNaN(Number(value))) return "—";
    return `${Math.round(Number(value))}%`;
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
            ${item.category || "—"}
            ${status
              ? html`<span class="badge badge-${status}">${status}</span>`
              : nothing}
          </div>
        </td>
        <td class="qty">
          <button
            type="button"
            title="Decrease"
            ?disabled=${this._busy || item.quantity <= 0}
            @click=${() => this._adjust(item, -1)}
          >
            −
          </button>
          <span
            >${item.quantity}${item.desired_quantity
              ? html` / ${item.desired_quantity}`
              : nothing}
            ${item.unit}</span
          >
          <button
            type="button"
            title="Increase"
            ?disabled=${this._busy}
            @click=${() => this._adjust(item, 1)}
          >
            +
          </button>
        </td>
        <td>${item.location || "—"}</td>
        <td>${item.resource}</td>
        <td>${item.expiry_date || "—"}</td>
        <td class="actions">
          <button type="button" @click=${() => this._openEdit(item)}>Edit</button>
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

  private _renderDialog() {
    const f = this._form;
    const locations = this._settings?.locations ?? [];
    const categories = this._settings?.categories ?? [];
    return html`
      <div class="dialog-backdrop" @click=${this._closeDialog}>
        <div
          class="dialog"
          role="dialog"
          aria-modal="true"
          @click=${(e: Event) => e.stopPropagation()}
        >
          <h2>${this._editing ? "Edit item" : "Add item"}</h2>
          <label
            >Name
            <input required .value=${f.name || ""} @input=${this._onField("name")} />
          </label>
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
          <label
            >Resource
            <select .value=${f.resource || "none"} @change=${this._onField("resource")}>
              <option value="none">none</option>
              <option value="water">water</option>
              <option value="food">food</option>
            </select>
          </label>
          <div class="row2">
            <label
              >Liters / unit
              <input
                type="number"
                min="0"
                step="0.01"
                .value=${f.liters_per_unit || ""}
                @input=${this._onField("liters_per_unit")}
              />
            </label>
            <label
              >Calories / unit
              <input
                type="number"
                min="0"
                step="1"
                .value=${f.calories_per_unit || ""}
                @input=${this._onField("calories_per_unit")}
              />
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
            >Expiry
            <input
              type="date"
              .value=${f.expiry_date || ""}
              @input=${this._onField("expiry_date")}
            />
          </label>
          <label
            >Notes
            <input .value=${f.notes || ""} @input=${this._onField("notes")} />
          </label>
          <label
            >Barcode
            <div class="barcode-row">
              <input .value=${f.barcode || ""} @input=${this._onField("barcode")} />
              <button type="button" ?disabled=${this._busy} @click=${this._scanBarcode}>
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
      const target = e.target as HTMLInputElement | HTMLSelectElement;
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
      resource: "none",
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
      resource: item.resource,
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

  private async _adjust(item: InventoryItemDto, delta: number) {
    await this._run(() =>
      this.hass.callService("ready_home", "adjust_quantity", {
        item_id: item.id,
        delta,
      }),
    );
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

    const payload: Record<string, unknown> = {
      quantity: Number(f.quantity || 0),
      desired_quantity: Number(f.desired_quantity || 0),
      unit: f.unit || "piece",
      location: f.location || "",
      category: f.category || "",
      resource: f.resource || "none",
      priority: f.priority || "important",
      barcode: f.barcode || "",
      notes: f.notes || "",
    };
    if (f.expiry_date) payload.expiry_date = f.expiry_date;
    if (f.liters_per_unit !== "") {
      payload.liters_per_unit = Number(f.liters_per_unit);
    }
    if (f.calories_per_unit !== "") {
      payload.calories_per_unit = Number(f.calories_per_unit);
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
      this._form = {
        ...this._form,
        name: name || this._form.name,
        resource: this._form.resource === "none" ? "food" : this._form.resource,
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
      box-sizing: border-box;
      padding: 16px 20px 32px;
      color: var(--primary-text-color);
      font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
    }
    .page {
      max-width: 1100px;
      margin: 0 auto;
    }
    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 16px;
    }
    h1 {
      margin: 0 0 4px;
      font-size: 1.75rem;
      font-weight: 500;
    }
    h2 {
      margin: 0 0 8px;
      font-size: 1.2rem;
      font-weight: 500;
    }
    .sub {
      margin: 0;
      color: var(--secondary-text-color);
      line-height: 1.4;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 8px;
      margin-bottom: 16px;
    }
    .stat {
      padding: 12px;
      border-radius: 8px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    }
    .stat-label {
      display: block;
      font-size: 0.75rem;
      color: var(--secondary-text-color);
      margin-bottom: 4px;
    }
    .stat-value {
      font-size: 1.35rem;
      font-weight: 600;
    }
    .toolbar {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 12px;
    }
    .search {
      width: 100%;
      box-sizing: border-box;
    }
    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
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
    .table-wrap {
      overflow-x: auto;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
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
    .meta {
      font-size: 0.75rem;
      color: var(--secondary-text-color);
      margin-top: 2px;
      display: flex;
      gap: 6px;
      align-items: center;
      flex-wrap: wrap;
    }
    .badge {
      text-transform: uppercase;
      letter-spacing: 0.02em;
      font-size: 0.65rem;
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
    .qty {
      white-space: nowrap;
    }
    .qty button {
      padding: 2px 8px;
    }
    .actions {
      white-space: nowrap;
      display: flex;
      gap: 6px;
    }
    .empty {
      text-align: center;
      color: var(--secondary-text-color);
      padding: 28px 12px !important;
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
      width: min(480px, 100%);
      max-height: 90vh;
      overflow: auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
      box-sizing: border-box;
    }
    .dialog label {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 0.85rem;
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
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .header-row {
        flex-direction: column;
      }
      .actions {
        flex-direction: column;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "ready-home-panel": ReadyHomePanel;
  }
}
