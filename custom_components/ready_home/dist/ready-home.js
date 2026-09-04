import{i as g,n as p,a as f,b as a,t as v,r as l,g as b,s as x,A as y,l as $}from"./chunks/api-D5nTOiE9.js";var w=Object.defineProperty,k=Object.getOwnPropertyDescriptor,u=(t,e,r,i)=>{for(var o=i>1?void 0:i?k(e,r):e,d=t.length-1,c;d>=0;d--)(c=t[d])&&(o=(i?c(e,r,o):c(o))||o);return i&&o&&w(e,r,o),o};let _=class extends f{setConfig(t){this._config={...t}}getCardSize(){return 4}static getConfigElement(){return document.createElement("ready-home-readiness-card-editor")}static getStubConfig(){return{type:"custom:ready-home-readiness-card"}}_state(t,e){const r=t||e;return this.hass?.states?.[r]}_num(t,e){const r=this._state(t,e);if(!r||r.state==="unknown"||r.state==="unavailable")return null;const i=Number(r.state);return Number.isFinite(i)?i:null}render(){if(!this.hass||!this._config)return a``;const t=this._num(this._config.entity,"sensor.ready_home_readiness"),e=this._num(this._config.water_entity,"sensor.ready_home_water_readiness"),r=this._num(this._config.food_entity,"sensor.ready_home_food_readiness"),i=this._num(this._config.expired_entity,"sensor.ready_home_expired_items")??0,o=this._num(this._config.expiring_entity,"sensor.ready_home_expiring_items")??0,d=this._num(this._config.low_stock_entity,"sensor.ready_home_low_stock_items")??0,c=this._state(this._config.attention_entity,"binary_sensor.ready_home_needs_attention"),m=this._state(this._config.entity,"sensor.ready_home_readiness")?.attributes?.supply_hours;return a`
      <ha-card class=${c?.state==="on"?"attention":""}>
        <div class="header">
          <div class="title">Ready Home</div>
          <div class="subtitle">Emergency readiness</div>
        </div>
        <div class="overall">
          <div class="overall-value">
            ${t===null?"—":`${Math.round(t)}%`}
          </div>
          <div class="overall-label">Overall</div>
          ${m!=null?a`<div class="supply">~${Math.round(Number(m))}h supply</div>`:null}
        </div>
        <div class="bars">
          ${this._bar("Water",e,"var(--info-color, #0288d1)")}
          ${this._bar("Food",r,"var(--success-color, #388e3c)")}
        </div>
        <div class="counts">
          <div><span>${i}</span> expired</div>
          <div><span>${o}</span> expiring</div>
          <div><span>${d}</span> low stock</div>
        </div>
      </ha-card>
    `}_bar(t,e,r){const i=e===null?0:Math.max(0,Math.min(100,e));return a`
      <div class="bar-row">
        <div class="bar-label">
          <span>${t}</span>
          <span>${e===null?"—":`${Math.round(e)}%`}</span>
        </div>
        <div class="bar-track">
          <div class="bar-fill" style="width:${i}%;background:${r}"></div>
        </div>
      </div>
    `}};_.styles=g`
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
  `;u([p({attribute:!1})],_.prototype,"hass",2);u([p({attribute:!1})],_.prototype,"_config",2);_=u([v("ready-home-readiness-card")],_);let h=class extends f{setConfig(t){this._config={...t}}render(){return this._config?a`
      <div class="editor">
        <p>Optional entity overrides (defaults use Ready Home sensors).</p>
        ${this._field("entity","Overall readiness")}
        ${this._field("water_entity","Water readiness")}
        ${this._field("food_entity","Food readiness")}
      </div>
    `:a``}_field(t,e){const r=this._config[t]||"";return a`
      <label>
        ${e}
        <input
          .value=${r}
          @change=${i=>{const o=i.target.value;this._config={...this._config,[t]:o||void 0},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config}}))}}
        />
      </label>
    `}};h.styles=g`
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
  `;u([p({attribute:!1})],h.prototype,"hass",2);u([p({attribute:!1})],h.prototype,"_config",2);h=u([v("ready-home-readiness-card-editor")],h);var C=Object.defineProperty,S=Object.getOwnPropertyDescriptor,n=(t,e,r,i)=>{for(var o=i>1?void 0:i?S(e,r):e,d=t.length-1,c;d>=0;d--)(c=t[d])&&(o=(i?c(e,r,o):c(o))||o);return i&&o&&C(e,r,o),o};let s=class extends f{constructor(){super(...arguments),this._snapshot=null,this._settings=null,this._filterStatus="all",this._filterLocation="",this._filterCategory="",this._sort="name",this._dialogOpen=!1,this._editing=null,this._form={},this._error="",this._unsub=null,this._openAdd=()=>{this._editing=null,this._form={name:"",quantity:"1",desired_quantity:"0",unit:"piece",resource:"none",priority:"important"},this._dialogOpen=!0},this._openEdit=t=>{this._editing=t,this._form={name:t.name,quantity:String(t.quantity),desired_quantity:String(t.desired_quantity),unit:t.unit,location:t.location,category:t.category,resource:t.resource,priority:t.priority,expiry_date:t.expiry_date||"",barcode:t.barcode||"",liters_per_unit:t.liters_per_unit!=null?String(t.liters_per_unit):"",calories_per_unit:t.calories_per_unit!=null?String(t.calories_per_unit):""},this._dialogOpen=!0},this._closeDialog=()=>{this._dialogOpen=!1}}setConfig(t){this._config={...t}}getCardSize(){return 8}static getStubConfig(){return{type:"custom:ready-home-inventory-card"}}async updated(t){if(t.has("hass")&&this.hass&&!this._unsub)try{this._settings=await b(this.hass),this._unsub=await x(this.hass,e=>{this._snapshot=e})}catch(e){this._error=String(e)}}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),this._unsub=null}get _items(){let t=[...this._snapshot?.items??[]];if(this._filterLocation&&(t=t.filter(e=>e.location.toLowerCase()===this._filterLocation.toLowerCase())),this._filterCategory&&(t=t.filter(e=>e.category.toLowerCase()===this._filterCategory.toLowerCase())),this._filterStatus!=="all"){const e=this._snapshot?.buckets,r=new Set;this._filterStatus==="expired"?e?.expired.forEach(i=>r.add(i.id)):this._filterStatus==="expiring"?(e?.within_urgent.forEach(i=>r.add(i.id)),e?.within_expiring.forEach(i=>r.add(i.id))):this._filterStatus==="low_stock"&&e?.low_stock.forEach(i=>r.add(i.id)),t=t.filter(i=>r.has(i.id))}return t.sort((e,r)=>this._sort==="quantity"?e.quantity-r.quantity:this._sort==="expiry"?(e.expiry_date||"9999").localeCompare(r.expiry_date||"9999"):e.name.localeCompare(r.name)),t}render(){if(!this._config)return a``;const t=this._items,e=this._settings?.locations??[],r=this._settings?.categories??[];return a`
      <ha-card>
        <div class="toolbar">
          <div class="title">Inventory</div>
          <button class="primary" @click=${this._openAdd}>Add item</button>
        </div>
        <div class="filters">
          <select
            .value=${this._filterStatus}
            @change=${i=>{this._filterStatus=i.target.value}}
          >
            <option value="all">All</option>
            <option value="expired">Expired</option>
            <option value="expiring">Expiring</option>
            <option value="low_stock">Low stock</option>
          </select>
          <select
            .value=${this._filterLocation}
            @change=${i=>{this._filterLocation=i.target.value}}
          >
            <option value="">All locations</option>
            ${e.map(i=>a`<option value=${i}>${i}</option>`)}
          </select>
          <select
            .value=${this._filterCategory}
            @change=${i=>{this._filterCategory=i.target.value}}
          >
            <option value="">All categories</option>
            ${r.map(i=>a`<option value=${i}>${i}</option>`)}
          </select>
          <select
            .value=${this._sort}
            @change=${i=>{this._sort=i.target.value}}
          >
            <option value="name">Sort: name</option>
            <option value="expiry">Sort: expiry</option>
            <option value="quantity">Sort: quantity</option>
          </select>
        </div>
        ${this._error?a`<div class="error">${this._error}</div>`:y}
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
              ${t.map(i=>a`
                  <tr>
                    <td>
                      <button class="link" @click=${()=>this._openEdit(i)}>
                        ${i.name}
                      </button>
                      <div class="meta">
                        ${i.category||"—"} · ${i.resource}
                      </div>
                    </td>
                    <td class="qty">
                      <button @click=${()=>this._adjust(i,-1)}>−</button>
                      <span>${i.quantity} ${i.unit}</span>
                      <button @click=${()=>this._adjust(i,1)}>+</button>
                    </td>
                    <td>${i.location||"—"}</td>
                    <td>${i.expiry_date||"—"}</td>
                    <td>
                      <button class="danger" @click=${()=>this._remove(i)}>
                        ×
                      </button>
                    </td>
                  </tr>
                `)}
              ${t.length===0?a`<tr>
                    <td colspan="5" class="empty">No items yet</td>
                  </tr>`:y}
            </tbody>
          </table>
        </div>
        ${this._dialogOpen?this._renderDialog():y}
      </ha-card>
    `}_renderDialog(){const t=this._form;return a`
      <div class="dialog-backdrop" @click=${this._closeDialog}>
        <div class="dialog" @click=${e=>e.stopPropagation()}>
          <h3>${this._editing?"Edit item":"Add item"}</h3>
          <label>Name <input .value=${t.name||""} @input=${this._onField("name")} /></label>
          <label
            >Quantity
            <input
              type="number"
              step="0.01"
              .value=${t.quantity||"1"}
              @input=${this._onField("quantity")}
            />
          </label>
          <label
            >Desired
            <input
              type="number"
              step="0.01"
              .value=${t.desired_quantity||"0"}
              @input=${this._onField("desired_quantity")}
            />
          </label>
          <label
            >Unit
            <select .value=${t.unit||"piece"} @change=${this._onField("unit")}>
              ${["piece","pack","box","gram","kilogram","liter","milliliter"].map(e=>a`<option value=${e}>${e}</option>`)}
            </select>
          </label>
          <label
            >Location
            <input .value=${t.location||""} @input=${this._onField("location")} />
          </label>
          <label
            >Category
            <input .value=${t.category||""} @input=${this._onField("category")} />
          </label>
          <label
            >Resource
            <select .value=${t.resource||"none"} @change=${this._onField("resource")}>
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
              .value=${t.liters_per_unit||""}
              @input=${this._onField("liters_per_unit")}
            />
          </label>
          <label
            >Calories / unit
            <input
              type="number"
              step="1"
              .value=${t.calories_per_unit||""}
              @input=${this._onField("calories_per_unit")}
            />
          </label>
          <label
            >Expiry
            <input
              type="date"
              .value=${t.expiry_date||""}
              @input=${this._onField("expiry_date")}
            />
          </label>
          <label
            >Barcode
            <div class="barcode-row">
              <input .value=${t.barcode||""} @input=${this._onField("barcode")} />
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
    `}_onField(t){return e=>{const r=e.target;this._form={...this._form,[t]:r.value}}}async _adjust(t,e){await this.hass.callService("ready_home","adjust_quantity",{item_id:t.id,delta:e})}async _remove(t){confirm(`Remove ${t.name}?`)&&await this.hass.callService("ready_home","remove_item",{item_id:t.id})}async _save(){const t=this._form,e={name:t.name,quantity:Number(t.quantity||0),desired_quantity:Number(t.desired_quantity||0),unit:t.unit||"piece",location:t.location||"",category:t.category||"",resource:t.resource||"none",priority:t.priority||"important",barcode:t.barcode||""};t.expiry_date&&(e.expiry_date=t.expiry_date),t.liters_per_unit&&(e.liters_per_unit=Number(t.liters_per_unit)),t.calories_per_unit&&(e.calories_per_unit=Number(t.calories_per_unit)),this._editing?await this.hass.callService("ready_home","update_item",{item_id:this._editing.id,new_name:e.name,...e}):await this.hass.callService("ready_home","add_item",e),this._dialogOpen=!1}async _lookupBarcode(){const t=this._form.barcode?.trim();if(t)try{const e=await $(this.hass,t),r=[e.brand,e.name].filter(Boolean).join(" ").trim();this._form={...this._form,name:r||this._form.name,resource:this._form.resource==="none"?"food":this._form.resource,calories_per_unit:e.calories_per_100g!=null?String(e.calories_per_100g):this._form.calories_per_unit}}catch(e){this._error=`Barcode lookup failed: ${e}`}}async _scanBarcode(){if(typeof BarcodeDetector>"u"){this._error="BarcodeDetector not supported in this browser — enter code manually.";return}try{const t=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}}),e=document.createElement("video");e.srcObject=t,await e.play();const r=new BarcodeDetector({formats:["ean_13","ean_8","upc_a","upc_e","code_128"]});await new Promise(o=>setTimeout(o,700));const i=await r.detect(e);t.getTracks().forEach(o=>o.stop()),i[0]?.rawValue?(this._form={...this._form,barcode:i[0].rawValue},await this._lookupBarcode()):this._error="No barcode detected — try again or enter manually."}catch(t){this._error=`Camera scan failed: ${t}`}}};s.styles=g`
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
  `;n([p({attribute:!1})],s.prototype,"hass",2);n([p({attribute:!1})],s.prototype,"_config",2);n([l()],s.prototype,"_snapshot",2);n([l()],s.prototype,"_settings",2);n([l()],s.prototype,"_filterStatus",2);n([l()],s.prototype,"_filterLocation",2);n([l()],s.prototype,"_filterCategory",2);n([l()],s.prototype,"_sort",2);n([l()],s.prototype,"_dialogOpen",2);n([l()],s.prototype,"_editing",2);n([l()],s.prototype,"_form",2);n([l()],s.prototype,"_error",2);s=n([v("ready-home-inventory-card")],s);window.customCards=window.customCards||[];window.customCards.push({type:"ready-home-readiness-card",name:"Ready Home Readiness",description:"Water and food readiness gauges with attention counts",preview:!0},{type:"ready-home-inventory-card",name:"Ready Home Inventory",description:"Manage emergency supply inventory",preview:!0});
//# sourceMappingURL=ready-home.js.map
