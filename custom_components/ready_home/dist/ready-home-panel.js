import{i as h,n as _,r as c,a as b,g,s as y,A as u,b as l,l as f,t as m}from"./chunks/api-D5nTOiE9.js";var v=Object.defineProperty,x=Object.getOwnPropertyDescriptor,n=(t,e,o,i)=>{for(var r=i>1?void 0:i?x(e,o):e,d=t.length-1,p;d>=0;d--)(p=t[d])&&(r=(i?p(e,o,r):p(r))||r);return i&&r&&v(e,o,r),r};const $=["piece","pack","box","gram","kilogram","liter","milliliter"];let s=class extends b{constructor(){super(...arguments),this.narrow=!1,this._snapshot=null,this._settings=null,this._search="",this._filterStatus="all",this._filterLocation="",this._filterCategory="",this._filterResource="",this._sort="name",this._dialogOpen=!1,this._editing=null,this._form={},this._error="",this._busy=!1,this._unsub=null,this._connected=!1,this._openAdd=()=>{this._editing=null,this._form={name:"",quantity:"1",desired_quantity:"0",unit:"piece",location:"",category:"",resource:"none",priority:"important",notes:"",barcode:"",expiry_date:"",liters_per_unit:"",calories_per_unit:""},this._error="",this._dialogOpen=!0},this._openEdit=t=>{this._editing=t,this._form={name:t.name,quantity:String(t.quantity),desired_quantity:String(t.desired_quantity),unit:t.unit,location:t.location,category:t.category,resource:t.resource,priority:t.priority,notes:t.notes||"",barcode:t.barcode||"",expiry_date:t.expiry_date||"",liters_per_unit:t.liters_per_unit!=null?String(t.liters_per_unit):"",calories_per_unit:t.calories_per_unit!=null?String(t.calories_per_unit):""},this._error="",this._dialogOpen=!0},this._closeDialog=()=>{this._dialogOpen=!1}}connectedCallback(){super.connectedCallback(),this._connected=!0,this._connect()}disconnectedCallback(){super.disconnectedCallback(),this._connected=!1,this._unsub?.(),this._unsub=null}updated(t){t.has("hass")&&this.hass&&!this._unsub&&this._connected&&this._connect()}async _connect(){if(!(!this.hass||this._unsub))try{this._settings=await g(this.hass),this._unsub=await y(this.hass,t=>{this._snapshot=t}),this._error=""}catch(t){this._error=String(t)}}get _assessment(){return this._snapshot?.assessment??{}}get _items(){let t=[...this._snapshot?.items??[]];const e=this._search.trim().toLowerCase();if(e&&(t=t.filter(o=>o.name.toLowerCase().includes(e)||o.location.toLowerCase().includes(e)||o.category.toLowerCase().includes(e)||(o.barcode||"").toLowerCase().includes(e)||(o.notes||"").toLowerCase().includes(e))),this._filterLocation&&(t=t.filter(o=>o.location.toLowerCase()===this._filterLocation.toLowerCase())),this._filterCategory&&(t=t.filter(o=>o.category.toLowerCase()===this._filterCategory.toLowerCase())),this._filterResource&&(t=t.filter(o=>o.resource===this._filterResource)),this._filterStatus!=="all"){const o=this._snapshot?.buckets,i=new Set;this._filterStatus==="expired"?o?.expired.forEach(r=>i.add(r.id)):this._filterStatus==="expiring"?(o?.within_urgent.forEach(r=>i.add(r.id)),o?.within_expiring.forEach(r=>i.add(r.id))):this._filterStatus==="low_stock"&&o?.low_stock.forEach(r=>i.add(r.id)),t=t.filter(r=>i.has(r.id))}return t.sort((o,i)=>this._sort==="quantity"?o.quantity-i.quantity:this._sort==="expiry"?(o.expiry_date||"9999").localeCompare(i.expiry_date||"9999"):o.name.localeCompare(i.name)),t}_itemStatus(t){const e=this._snapshot?.buckets;return e?e.expired.some(o=>o.id===t.id)?"expired":e.within_urgent.some(o=>o.id===t.id)?"urgent":e.within_expiring.some(o=>o.id===t.id)?"expiring":e.low_stock.some(o=>o.id===t.id)?"low":"":""}render(){const t=this._items,e=this._assessment,o=this._settings?.locations??[],i=this._settings?.categories??[],r=e.overall_percent,d=e.water_percent,p=e.food_percent;return l`
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
              <span class="stat-value">${this._pct(r)}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Water</span>
              <span class="stat-value">${this._pct(d)}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Food</span>
              <span class="stat-value">${this._pct(p)}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Items</span>
              <span class="stat-value">${this._snapshot?.items.length??0}</span>
            </div>
          </div>
        </header>

        <div class="toolbar">
          <input
            class="search"
            type="search"
            placeholder="Search name, location, barcode…"
            .value=${this._search}
            @input=${a=>{this._search=a.target.value}}
          />
          <div class="filters">
            <select
              .value=${this._filterStatus}
              @change=${a=>{this._filterStatus=a.target.value}}
            >
              <option value="all">All statuses</option>
              <option value="expired">Expired</option>
              <option value="expiring">Expiring</option>
              <option value="low_stock">Low stock</option>
            </select>
            <select
              .value=${this._filterLocation}
              @change=${a=>{this._filterLocation=a.target.value}}
            >
              <option value="">All locations</option>
              ${o.map(a=>l`<option value=${a}>${a}</option>`)}
            </select>
            <select
              .value=${this._filterCategory}
              @change=${a=>{this._filterCategory=a.target.value}}
            >
              <option value="">All categories</option>
              ${i.map(a=>l`<option value=${a}>${a}</option>`)}
            </select>
            <select
              .value=${this._filterResource}
              @change=${a=>{this._filterResource=a.target.value}}
            >
              <option value="">All resources</option>
              <option value="water">Water</option>
              <option value="food">Food</option>
              <option value="none">None</option>
            </select>
            <select
              .value=${this._sort}
              @change=${a=>{this._sort=a.target.value}}
            >
              <option value="name">Sort: name</option>
              <option value="expiry">Sort: expiry</option>
              <option value="quantity">Sort: quantity</option>
            </select>
          </div>
        </div>

        ${this._error?l`<div class="error" role="alert">${this._error}</div>`:u}

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
              ${t.map(a=>this._renderRow(a))}
              ${t.length===0?l`<tr>
                    <td colspan="6" class="empty">
                      ${this._snapshot?l`No items match. <button class="link" @click=${this._openAdd}>Add an item</button>`:"Loading inventory…"}
                    </td>
                  </tr>`:u}
            </tbody>
          </table>
        </div>

        ${this._dialogOpen?this._renderDialog():u}
      </div>
    `}_pct(t){return t==null||Number.isNaN(Number(t))?"—":`${Math.round(Number(t))}%`}_renderRow(t){const e=this._itemStatus(t);return l`
      <tr class=${e?`row-${e}`:""}>
        <td>
          <button class="link" @click=${()=>this._openEdit(t)}>
            ${t.name}
          </button>
          <div class="meta">
            ${t.category||"—"}
            ${e?l`<span class="badge badge-${e}">${e}</span>`:u}
          </div>
        </td>
        <td class="qty">
          <button
            type="button"
            title="Decrease"
            ?disabled=${this._busy||t.quantity<=0}
            @click=${()=>this._adjust(t,-1)}
          >
            −
          </button>
          <span
            >${t.quantity}${t.desired_quantity?l` / ${t.desired_quantity}`:u}
            ${t.unit}</span
          >
          <button
            type="button"
            title="Increase"
            ?disabled=${this._busy}
            @click=${()=>this._adjust(t,1)}
          >
            +
          </button>
        </td>
        <td>${t.location||"—"}</td>
        <td>${t.resource}</td>
        <td>${t.expiry_date||"—"}</td>
        <td class="actions">
          <button type="button" @click=${()=>this._openEdit(t)}>Edit</button>
          <button
            type="button"
            class="danger"
            ?disabled=${this._busy}
            @click=${()=>this._remove(t)}
          >
            Remove
          </button>
        </td>
      </tr>
    `}_renderDialog(){const t=this._form,e=this._settings?.locations??[],o=this._settings?.categories??[];return l`
      <div class="dialog-backdrop" @click=${this._closeDialog}>
        <div
          class="dialog"
          role="dialog"
          aria-modal="true"
          @click=${i=>i.stopPropagation()}
        >
          <h2>${this._editing?"Edit item":"Add item"}</h2>
          <label
            >Name
            <input required .value=${t.name||""} @input=${this._onField("name")} />
          </label>
          <div class="row2">
            <label
              >Quantity
              <input
                type="number"
                min="0"
                step="0.01"
                .value=${t.quantity||"1"}
                @input=${this._onField("quantity")}
              />
            </label>
            <label
              >Desired
              <input
                type="number"
                min="0"
                step="0.01"
                .value=${t.desired_quantity||"0"}
                @input=${this._onField("desired_quantity")}
              />
            </label>
          </div>
          <label
            >Unit
            <select .value=${t.unit||"piece"} @change=${this._onField("unit")}>
              ${$.map(i=>l`<option value=${i}>${i}</option>`)}
            </select>
          </label>
          <label
            >Location
            <input
              list="rh-locations"
              .value=${t.location||""}
              @input=${this._onField("location")}
            />
            <datalist id="rh-locations">
              ${e.map(i=>l`<option value=${i}></option>`)}
            </datalist>
          </label>
          <label
            >Category
            <input
              list="rh-categories"
              .value=${t.category||""}
              @input=${this._onField("category")}
            />
            <datalist id="rh-categories">
              ${o.map(i=>l`<option value=${i}></option>`)}
            </datalist>
          </label>
          <label
            >Resource
            <select .value=${t.resource||"none"} @change=${this._onField("resource")}>
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
                .value=${t.liters_per_unit||""}
                @input=${this._onField("liters_per_unit")}
              />
            </label>
            <label
              >Calories / unit
              <input
                type="number"
                min="0"
                step="1"
                .value=${t.calories_per_unit||""}
                @input=${this._onField("calories_per_unit")}
              />
            </label>
          </div>
          <label
            >Priority
            <select
              .value=${t.priority||"important"}
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
              .value=${t.expiry_date||""}
              @input=${this._onField("expiry_date")}
            />
          </label>
          <label
            >Notes
            <input .value=${t.notes||""} @input=${this._onField("notes")} />
          </label>
          <label
            >Barcode
            <div class="barcode-row">
              <input .value=${t.barcode||""} @input=${this._onField("barcode")} />
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
              ?disabled=${this._busy||!(t.name||"").trim()}
              @click=${this._save}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    `}_onField(t){return e=>{const o=e.target;this._form={...this._form,[t]:o.value}}}async _run(t){this._busy=!0,this._error="";try{await t()}catch(e){this._error=String(e)}finally{this._busy=!1}}async _adjust(t,e){await this._run(()=>this.hass.callService("ready_home","adjust_quantity",{item_id:t.id,delta:e}))}async _remove(t){confirm(`Remove “${t.name}”?`)&&await this._run(()=>this.hass.callService("ready_home","remove_item",{item_id:t.id}))}async _save(){const t=this._form,e=(t.name||"").trim();if(!e){this._error="Name is required";return}const o={quantity:Number(t.quantity||0),desired_quantity:Number(t.desired_quantity||0),unit:t.unit||"piece",location:t.location||"",category:t.category||"",resource:t.resource||"none",priority:t.priority||"important",barcode:t.barcode||"",notes:t.notes||""};t.expiry_date&&(o.expiry_date=t.expiry_date),t.liters_per_unit!==""&&(o.liters_per_unit=Number(t.liters_per_unit)),t.calories_per_unit!==""&&(o.calories_per_unit=Number(t.calories_per_unit)),await this._run(async()=>{this._editing?await this.hass.callService("ready_home","update_item",{item_id:this._editing.id,new_name:e,...o}):await this.hass.callService("ready_home","add_item",{name:e,...o}),this._dialogOpen=!1})}async _lookupBarcode(){const t=this._form.barcode?.trim();if(t){this._busy=!0,this._error="";try{const e=await f(this.hass,t),o=[e.brand,e.name].filter(Boolean).join(" ").trim();this._form={...this._form,name:o||this._form.name,resource:this._form.resource==="none"?"food":this._form.resource,calories_per_unit:e.calories_per_100g!=null?String(e.calories_per_100g):this._form.calories_per_unit}}catch(e){this._error=`Barcode lookup failed: ${e}`}finally{this._busy=!1}}}async _scanBarcode(){if(typeof BarcodeDetector>"u"){this._error="BarcodeDetector not supported in this browser — enter the code manually.";return}this._busy=!0,this._error="";try{const t=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}}),e=document.createElement("video");e.srcObject=t,await e.play();const o=new BarcodeDetector({formats:["ean_13","ean_8","upc_a","upc_e","code_128"]});await new Promise(r=>setTimeout(r,700));const i=await o.detect(e);t.getTracks().forEach(r=>r.stop()),i[0]?.rawValue?(this._form={...this._form,barcode:i[0].rawValue},this._busy=!1,await this._lookupBarcode()):this._error="No barcode detected — try again or enter manually."}catch(t){this._error=`Camera scan failed: ${t}`}finally{this._busy=!1}}};s.styles=h`
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
  `;n([_({attribute:!1})],s.prototype,"hass",2);n([_({type:Boolean})],s.prototype,"narrow",2);n([_({attribute:!1})],s.prototype,"panel",2);n([c()],s.prototype,"_snapshot",2);n([c()],s.prototype,"_settings",2);n([c()],s.prototype,"_search",2);n([c()],s.prototype,"_filterStatus",2);n([c()],s.prototype,"_filterLocation",2);n([c()],s.prototype,"_filterCategory",2);n([c()],s.prototype,"_filterResource",2);n([c()],s.prototype,"_sort",2);n([c()],s.prototype,"_dialogOpen",2);n([c()],s.prototype,"_editing",2);n([c()],s.prototype,"_form",2);n([c()],s.prototype,"_error",2);n([c()],s.prototype,"_busy",2);s=n([m("ready-home-panel")],s);
//# sourceMappingURL=ready-home-panel.js.map
