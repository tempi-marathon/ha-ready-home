import{i as d,n as l,a as h,b as c,t as f}from"./chunks/property-BFfdbcwJ.js";var m=Object.defineProperty,v=Object.getOwnPropertyDescriptor,s=(p,a,t,o)=>{for(var e=o>1?void 0:o?v(a,t):a,i=p.length-1,n;i>=0;i--)(n=p[i])&&(e=(o?n(a,t,e):n(e))||e);return o&&e&&m(a,t,e),e};let r=class extends h{constructor(){super(...arguments),this.narrow=!1}render(){return c`
      <div class="page">
        <header class="header">
          <h1>Ready Home</h1>
          <p class="sub">
            Inventory management will live here. Use the readiness card on your
            dashboard for status; this panel is the admin surface.
          </p>
        </header>
        <section class="shell" aria-live="polite">
          <p>Panel shell is connected${this.hass?"":" (waiting for Home Assistant)"}.</p>
        </section>
      </div>
    `}};r.styles=d`
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
  `;s([l({attribute:!1})],r.prototype,"hass",2);s([l({type:Boolean})],r.prototype,"narrow",2);s([l({attribute:!1})],r.prototype,"panel",2);r=s([f("ready-home-panel")],r);
//# sourceMappingURL=ready-home-panel.js.map
