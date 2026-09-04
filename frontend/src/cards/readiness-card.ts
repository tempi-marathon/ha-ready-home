import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { HomeAssistant, LovelaceCardConfig } from "../types";

export interface ReadinessCardConfig extends LovelaceCardConfig {
  type: "custom:ready-home-readiness-card";
  entity?: string;
  water_entity?: string;
  food_entity?: string;
  expired_entity?: string;
  expiring_entity?: string;
  low_stock_entity?: string;
  attention_entity?: string;
}

@customElement("ready-home-readiness-card")
export class ReadyHomeReadinessCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) private _config!: ReadinessCardConfig;

  public setConfig(config: ReadinessCardConfig): void {
    this._config = { ...config };
  }

  public getCardSize(): number {
    return 4;
  }

  public static getConfigElement() {
    return document.createElement("ready-home-readiness-card-editor");
  }

  public static getStubConfig(): ReadinessCardConfig {
    return { type: "custom:ready-home-readiness-card" };
  }

  private _state(entityId: string | undefined, fallback: string) {
    const id = entityId || fallback;
    return this.hass?.states?.[id];
  }

  private _num(entityId: string | undefined, fallback: string): number | null {
    const st = this._state(entityId, fallback);
    if (!st || st.state === "unknown" || st.state === "unavailable") return null;
    const n = Number(st.state);
    return Number.isFinite(n) ? n : null;
  }

  protected render() {
    if (!this.hass || !this._config) return html``;

    const overall = this._num(this._config.entity, "sensor.ready_home_readiness");
    const water = this._num(
      this._config.water_entity,
      "sensor.ready_home_water_readiness",
    );
    const food = this._num(
      this._config.food_entity,
      "sensor.ready_home_food_readiness",
    );
    const expired =
      this._num(this._config.expired_entity, "sensor.ready_home_expired_items") ?? 0;
    const expiring =
      this._num(this._config.expiring_entity, "sensor.ready_home_expiring_items") ?? 0;
    const low =
      this._num(this._config.low_stock_entity, "sensor.ready_home_low_stock_items") ??
      0;
    const attention = this._state(
      this._config.attention_entity,
      "binary_sensor.ready_home_needs_attention",
    );
    const overallEntity = this._state(
      this._config.entity,
      "sensor.ready_home_readiness",
    );
    const supplyHours = overallEntity?.attributes?.supply_hours as
      | number
      | undefined;

    return html`
      <ha-card class=${attention?.state === "on" ? "attention" : ""}>
        <div class="header">
          <div class="title">Ready Home</div>
          <div class="subtitle">Emergency readiness</div>
        </div>
        <div class="overall">
          <div class="overall-value">
            ${overall === null ? "—" : `${Math.round(overall)}%`}
          </div>
          <div class="overall-label">Overall</div>
          ${supplyHours != null
            ? html`<div class="supply">~${Math.round(Number(supplyHours))}h supply</div>`
            : null}
        </div>
        <div class="bars">
          ${this._bar("Water", water, "var(--info-color, #0288d1)")}
          ${this._bar("Food", food, "var(--success-color, #388e3c)")}
        </div>
        <div class="counts">
          <div><span>${expired}</span> expired</div>
          <div><span>${expiring}</span> expiring</div>
          <div><span>${low}</span> low stock</div>
        </div>
      </ha-card>
    `;
  }

  private _bar(label: string, value: number | null, color: string) {
    const pct = value === null ? 0 : Math.max(0, Math.min(100, value));
    return html`
      <div class="bar-row">
        <div class="bar-label">
          <span>${label}</span>
          <span>${value === null ? "—" : `${Math.round(value)}%`}</span>
        </div>
        <div class="bar-track">
          <div class="bar-fill" style="width:${pct}%;background:${color}"></div>
        </div>
      </div>
    `;
  }

  static styles = css`
    ha-card {
      padding: 16px;
      background: var(--ha-card-background, var(--card-background-color));
    }
    ha-card.attention {
      border-left: 3px solid var(--warning-color, #f57c00);
    }
    .header {
      margin-bottom: 12px;
    }
    .title {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .subtitle {
      font-size: 0.85rem;
      color: var(--secondary-text-color);
    }
    .overall {
      text-align: center;
      margin: 8px 0 16px;
    }
    .overall-value {
      font-size: 2.4rem;
      font-weight: 700;
      line-height: 1.1;
      color: var(--primary-text-color);
    }
    .overall-label,
    .supply {
      color: var(--secondary-text-color);
      font-size: 0.85rem;
    }
    .bars {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 16px;
    }
    .bar-label {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      margin-bottom: 4px;
      color: var(--primary-text-color);
    }
    .bar-track {
      height: 8px;
      border-radius: 4px;
      background: var(--divider-color, rgba(127, 127, 127, 0.2));
      overflow: hidden;
    }
    .bar-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.3s ease;
    }
    .counts {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      text-align: center;
      font-size: 0.8rem;
      color: var(--secondary-text-color);
    }
    .counts span {
      display: block;
      font-size: 1.2rem;
      font-weight: 600;
      color: var(--primary-text-color);
    }
  `;
}

@customElement("ready-home-readiness-card-editor")
export class ReadyHomeReadinessCardEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) private _config!: ReadinessCardConfig;

  public setConfig(config: ReadinessCardConfig): void {
    this._config = { ...config };
  }

  protected render() {
    if (!this._config) return html``;
    return html`
      <div class="editor">
        <p>Optional entity overrides (defaults use Ready Home sensors).</p>
        ${this._field("entity", "Overall readiness")}
        ${this._field("water_entity", "Water readiness")}
        ${this._field("food_entity", "Food readiness")}
      </div>
    `;
  }

  private _field(key: keyof ReadinessCardConfig, label: string) {
    const value = (this._config[key] as string) || "";
    return html`
      <label>
        ${label}
        <input
          .value=${value}
          @change=${(e: Event) => {
            const v = (e.target as HTMLInputElement).value;
            this._config = { ...this._config, [key]: v || undefined };
            this.dispatchEvent(
              new CustomEvent("config-changed", {
                detail: { config: this._config },
              }),
            );
          }}
        />
      </label>
    `;
  }

  static styles = css`
    .editor {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 8px;
    }
    label {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 0.9rem;
    }
    input {
      padding: 8px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "ready-home-readiness-card": ReadyHomeReadinessCard;
    "ready-home-readiness-card-editor": ReadyHomeReadinessCardEditor;
  }
}
