/** Ready Home sidebar management panel (shell). */

import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { HomeAssistant } from "./types";

@customElement("ready-home-panel")
export class ReadyHomePanel extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ type: Boolean }) public narrow = false;
  @property({ attribute: false }) public panel?: {
    config?: Record<string, unknown>;
  };

  protected render() {
    return html`
      <div class="page">
        <header class="header">
          <h1>Ready Home</h1>
          <p class="sub">
            Inventory management will live here. Use the readiness card on your
            dashboard for status; this panel is the admin surface.
          </p>
        </header>
        <section class="shell" aria-live="polite">
          <p>Panel shell is connected${this.hass ? "" : " (waiting for Home Assistant)"}.</p>
        </section>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      box-sizing: border-box;
      padding: 16px;
      max-width: 960px;
      margin: 0 auto;
      color: var(--primary-text-color);
      font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
    }
    .header h1 {
      margin: 0 0 8px;
      font-size: 1.75rem;
      font-weight: 500;
    }
    .sub {
      margin: 0 0 24px;
      color: var(--secondary-text-color);
      line-height: 1.4;
    }
    .shell {
      padding: 20px;
      border: 1px dashed var(--divider-color);
      border-radius: 8px;
      color: var(--secondary-text-color);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "ready-home-panel": ReadyHomePanel;
  }
}
