import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  type InventoryItemDto,
  type SettingsDto,
  type Snapshot,
  getSettings,
  lookupBarcode,
  subscribeInventory,
} from "../api";
import type { HomeAssistant, LovelaceCardConfig } from "../types";

export interface InventoryCardConfig extends LovelaceCardConfig {
  type: "custom:ready-home-inventory-card";
}

@customElement("ready-home-inventory-card")
export class ReadyHomeInventoryCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) private _config!: InventoryCardConfig;

  @state() private _snapshot: Snapshot | null = null;
  @state() private _settings: SettingsDto | null = null;
  @state() private _filterStatus = "all";
  @state() private _filterLocation = "";
  @state() private _filterCategory = "";
  @state() private _sort: "name" | "expiry" | "quantity" = "name";
  @state() private _dialogOpen = false;
  @state() private _editing: InventoryItemDto | null = null;
  @state() private _form: Record<string, string> = {};
  @state() private _error = "";

  private _unsub: (() => void) | null = null;

  public setConfig(config: InventoryCardConfig): void {
    this._config = { ...config };
  }

  public getCardSize(): number {
    return 8;
  }

  public static getStubConfig(): InventoryCardConfig {
    return { type: "custom:ready-home-inventory-card" };
  }

  protected async updated(changed: Map<string, unknown>) {
    if (changed.has("hass") && this.hass && !this._unsub) {
      try {
        this._settings = await getSettings(this.hass);
        this._unsub = await subscribeInventory(this.hass, (snap) => {
          this._snapshot = snap;
        });
      } catch (err) {
        this._error = String(err);
      }
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unsub?.();
    this._unsub = null;
  }

  private get _items(): InventoryItemDto[] {
    let items = [...(this._snapshot?.items ?? [])];
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

  protected render() {
    if (!this._config) return html``;
    const items = this._items;
    const locations = this._settings?.locations ?? [];
    const categories = this._settings?.categories ?? [];

    return html`
      <ha-card>
        <div class="toolbar">
          <div class="title">Inventory</div>
          <button class="primary" @click=${this._openAdd}>Add item</button>
        </div>
        <div class="filters">
          <select
            .value=${this._filterStatus}
            @change=${(e: Event) => {
              this._filterStatus = (e.target as HTMLSelectElement).value;
            }}
          >
            <option value="all">All</option>
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
            .value=${this._sort}
            @change=${(e: Event) => {
              this._sort = (e.target as HTMLSelectElement).value as typeof this._sort;
            }}
          >
            <option value="name">Sort: name</option>
            <option value="expiry">Sort: expiry</option>
            <option value="quantity">Sort: quantity</option>
          </select>
        </div>
        ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Qty</th>
                <th>Location</th>
                <th>Expiry</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${items.map(
                (item) => html`
                  <tr>
                    <td>
                      <button class="link" @click=${() => this._openEdit(item)}>
                        ${item.name}
                      </button>
                      <div class="meta">
                        ${item.category || "—"} · ${item.resource}
                      </div>
                    </td>
                    <td class="qty">
                      <button @click=${() => this._adjust(item, -1)}>−</button>
                      <span>${item.quantity} ${item.unit}</span>
                      <button @click=${() => this._adjust(item, 1)}>+</button>
                    </td>
                    <td>${item.location || "—"}</td>
                    <td>${item.expiry_date || "—"}</td>
                    <td>
                      <button class="danger" @click=${() => this._remove(item)}>
                        ×
                      </button>
                    </td>
                  </tr>
                `,
              )}
              ${items.length === 0
                ? html`<tr>
                    <td colspan="5" class="empty">No items yet</td>
                  </tr>`
                : nothing}
            </tbody>
          </table>
        </div>
        ${this._dialogOpen ? this._renderDialog() : nothing}
      </ha-card>
    `;
  }

  private _renderDialog() {
    const f = this._form;
    return html`
      <div class="dialog-backdrop" @click=${this._closeDialog}>
        <div class="dialog" @click=${(e: Event) => e.stopPropagation()}>
          <h3>${this._editing ? "Edit item" : "Add item"}</h3>
          <label>Name <input .value=${f.name || ""} @input=${this._onField("name")} /></label>
          <label
            >Quantity
            <input
              type="number"
              step="0.01"
              .value=${f.quantity || "1"}
              @input=${this._onField("quantity")}
            />
          </label>
          <label
            >Desired
            <input
              type="number"
              step="0.01"
              .value=${f.desired_quantity || "0"}
              @input=${this._onField("desired_quantity")}
            />
          </label>
          <label
            >Unit
            <select .value=${f.unit || "piece"} @change=${this._onField("unit")}>
              ${["piece", "pack", "box", "gram", "kilogram", "liter", "milliliter"].map(
                (u) => html`<option value=${u}>${u}</option>`,
              )}
            </select>
          </label>
          <label
            >Location
            <input .value=${f.location || ""} @input=${this._onField("location")} />
          </label>
          <label
            >Category
            <input .value=${f.category || ""} @input=${this._onField("category")} />
          </label>
          <label
            >Resource
            <select .value=${f.resource || "none"} @change=${this._onField("resource")}>
              <option value="none">none</option>
              <option value="water">water</option>
              <option value="food">food</option>
            </select>
          </label>
          <label
            >Liters / unit
            <input
              type="number"
              step="0.01"
              .value=${f.liters_per_unit || ""}
              @input=${this._onField("liters_per_unit")}
            />
          </label>
          <label
            >Calories / unit
            <input
              type="number"
              step="1"
              .value=${f.calories_per_unit || ""}
              @input=${this._onField("calories_per_unit")}
            />
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
            >Barcode
            <div class="barcode-row">
              <input .value=${f.barcode || ""} @input=${this._onField("barcode")} />
              <button type="button" @click=${this._scanBarcode}>Scan</button>
              <button type="button" @click=${this._lookupBarcode}>Lookup</button>
            </div>
          </label>
          <div class="dialog-actions">
            <button @click=${this._closeDialog}>Cancel</button>
            <button class="primary" @click=${this._save}>Save</button>
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
      resource: "none",
      priority: "important",
    };
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
      expiry_date: item.expiry_date || "",
      barcode: item.barcode || "",
      liters_per_unit:
        item.liters_per_unit != null ? String(item.liters_per_unit) : "",
      calories_per_unit:
        item.calories_per_unit != null ? String(item.calories_per_unit) : "",
    };
    this._dialogOpen = true;
  };

  private _closeDialog = () => {
    this._dialogOpen = false;
  };

  private async _adjust(item: InventoryItemDto, delta: number) {
    await this.hass.callService("ready_home", "adjust_quantity", {
      item_id: item.id,
      delta,
    });
  }

  private async _remove(item: InventoryItemDto) {
    if (!confirm(`Remove ${item.name}?`)) return;
    await this.hass.callService("ready_home", "remove_item", { item_id: item.id });
  }

  private async _save() {
    const f = this._form;
    const data: Record<string, unknown> = {
      name: f.name,
      quantity: Number(f.quantity || 0),
      desired_quantity: Number(f.desired_quantity || 0),
      unit: f.unit || "piece",
      location: f.location || "",
      category: f.category || "",
      resource: f.resource || "none",
      priority: f.priority || "important",
      barcode: f.barcode || "",
    };
    if (f.expiry_date) data.expiry_date = f.expiry_date;
    if (f.liters_per_unit) data.liters_per_unit = Number(f.liters_per_unit);
    if (f.calories_per_unit) data.calories_per_unit = Number(f.calories_per_unit);

    if (this._editing) {
      await this.hass.callService("ready_home", "update_item", {
        item_id: this._editing.id,
        new_name: data.name,
        ...data,
      });
    } else {
      await this.hass.callService("ready_home", "add_item", data);
    }
    this._dialogOpen = false;
  }

  private async _lookupBarcode() {
    const code = this._form.barcode?.trim();
    if (!code) return;
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
    }
  }

  private async _scanBarcode() {
    if (typeof BarcodeDetector === "undefined") {
      this._error = "BarcodeDetector not supported in this browser — enter code manually.";
      return;
    }
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
      // Single-shot capture after a short settle
      await new Promise((r) => setTimeout(r, 700));
      const codes = await detector.detect(video);
      stream.getTracks().forEach((t) => t.stop());
      if (codes[0]?.rawValue) {
        this._form = { ...this._form, barcode: codes[0].rawValue };
        await this._lookupBarcode();
      } else {
        this._error = "No barcode detected — try again or enter manually.";
      }
    } catch (err) {
      this._error = `Camera scan failed: ${err}`;
    }
  }

  static styles = css`
    ha-card {
      padding: 12px 16px 16px;
    }
    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .title {
      font-size: 1.1rem;
      font-weight: 600;
    }
    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 10px;
    }
    select,
    input,
    button {
      font: inherit;
    }
    select,
    input {
      padding: 6px 8px;
      border-radius: 4px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    button {
      padding: 6px 10px;
      border-radius: 4px;
      border: 1px solid var(--divider-color);
      background: var(--secondary-background-color, transparent);
      color: var(--primary-text-color);
      cursor: pointer;
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
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.9rem;
    }
    th,
    td {
      text-align: left;
      padding: 8px 4px;
      border-bottom: 1px solid var(--divider-color);
      vertical-align: top;
    }
    .meta {
      font-size: 0.75rem;
      color: var(--secondary-text-color);
    }
    .qty {
      white-space: nowrap;
    }
    .qty button {
      padding: 2px 8px;
    }
    .empty {
      text-align: center;
      color: var(--secondary-text-color);
      padding: 20px !important;
    }
    .error {
      color: var(--error-color, #c62828);
      font-size: 0.85rem;
      margin-bottom: 8px;
    }
    .dialog-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .dialog {
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      padding: 16px;
      border-radius: 8px;
      width: min(420px, 92vw);
      max-height: 90vh;
      overflow: auto;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .dialog label {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 0.85rem;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 8px;
    }
    .barcode-row {
      display: flex;
      gap: 6px;
    }
    .barcode-row input {
      flex: 1;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "ready-home-inventory-card": ReadyHomeInventoryCard;
  }
}
