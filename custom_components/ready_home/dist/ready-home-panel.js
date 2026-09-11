import{i as b,n as _,r as c,a as g,g as y,s as f,A as d,b as a,l as m,t as v}from"./chunks/api-D5nTOiE9.js";var x=Object.defineProperty,$=Object.getOwnPropertyDescriptor,l=(t,e,i,r)=>{for(var o=r>1?void 0:r?$(e,i):e,p=t.length-1,u;p>=0;p--)(u=t[p])&&(o=(r?u(e,i,o):u(o))||o);return r&&o&&x(e,i,o),o};const w=["piece","pack","box","gram","kilogram","liter","milliliter"],k="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z",S={expired:"Expired",urgent:"Urgent",expiring:"Expiring",low:"Low stock"};let s=class extends g{constructor(){super(...arguments),this.narrow=!1,this._snapshot=null,this._settings=null,this._search="",this._filterStatus="all",this._filterLocation="",this._filterCategory="",this._filterResource="",this._sort="name",this._dialogOpen=!1,this._editing=null,this._form={},this._error="",this._busy=!1,this._unsub=null,this._connected=!1,this._openAdd=()=>{this._editing=null,this._form={name:"",quantity:"1",desired_quantity:"0",unit:"piece",location:"",category:"",resource:"none",priority:"important",notes:"",barcode:"",expiry_date:"",liters_per_unit:"",calories_per_unit:""},this._error="",this._dialogOpen=!0},this._openEdit=t=>{this._editing=t,this._form={name:t.name,quantity:String(t.quantity),desired_quantity:String(t.desired_quantity),unit:t.unit,location:t.location,category:t.category,resource:t.resource,priority:t.priority,notes:t.notes||"",barcode:t.barcode||"",expiry_date:t.expiry_date||"",liters_per_unit:t.liters_per_unit!=null?String(t.liters_per_unit):"",calories_per_unit:t.calories_per_unit!=null?String(t.calories_per_unit):""},this._error="",this._dialogOpen=!0},this._closeDialog=()=>{this._dialogOpen=!1}}connectedCallback(){super.connectedCallback(),this._connected=!0,this._connect()}disconnectedCallback(){super.disconnectedCallback(),this._connected=!1,this._unsub?.(),this._unsub=null}updated(t){t.has("hass")&&this.hass&&!this._unsub&&this._connected&&this._connect()}async _connect(){if(!(!this.hass||this._unsub))try{this._settings=await y(this.hass),this._unsub=await f(this.hass,t=>{this._snapshot=t}),this._error=""}catch(t){this._error=String(t)}}get _assessment(){return this._snapshot?.assessment??{}}get _bucketCounts(){const t=this._snapshot?.buckets;return{expired:t?.expired.length??0,expiring:(t?.within_urgent.length??0)+(t?.within_expiring.length??0),low_stock:t?.low_stock.length??0}}get _items(){let t=[...this._snapshot?.items??[]];const e=this._search.trim().toLowerCase();if(e&&(t=t.filter(i=>i.name.toLowerCase().includes(e)||i.location.toLowerCase().includes(e)||i.category.toLowerCase().includes(e)||(i.barcode||"").toLowerCase().includes(e)||(i.notes||"").toLowerCase().includes(e))),this._filterLocation&&(t=t.filter(i=>i.location.toLowerCase()===this._filterLocation.toLowerCase())),this._filterCategory&&(t=t.filter(i=>i.category.toLowerCase()===this._filterCategory.toLowerCase())),this._filterResource&&(t=t.filter(i=>i.resource===this._filterResource)),this._filterStatus!=="all"){const i=this._snapshot?.buckets,r=new Set;this._filterStatus==="expired"?i?.expired.forEach(o=>r.add(o.id)):this._filterStatus==="expiring"?(i?.within_urgent.forEach(o=>r.add(o.id)),i?.within_expiring.forEach(o=>r.add(o.id))):this._filterStatus==="low_stock"&&i?.low_stock.forEach(o=>r.add(o.id)),t=t.filter(o=>r.has(o.id))}return t.sort((i,r)=>this._sort==="quantity"?i.quantity-r.quantity:this._sort==="expiry"?(i.expiry_date||"9999").localeCompare(r.expiry_date||"9999"):i.name.localeCompare(r.name)),t}_itemStatus(t){const e=this._snapshot?.buckets;return e?e.expired.some(i=>i.id===t.id)?"expired":e.within_urgent.some(i=>i.id===t.id)?"urgent":e.within_expiring.some(i=>i.id===t.id)?"expiring":e.low_stock.some(i=>i.id===t.id)?"low":"":""}_statusLabel(t){return S[t]||t}_setStatusFilter(t){this._filterStatus=this._filterStatus===t?"all":t}render(){const t=this._items,e=this._assessment,i=this._settings?.locations??[],r=this._settings?.categories??[],o=e.overall_percent,p=e.water_percent,u=e.food_percent,h=this._bucketCounts;return a`
      <ha-top-app-bar-fixed>
        <ha-menu-button
          slot="navigationIcon"
          .hass=${this.hass}
          .narrow=${this.narrow}
        ></ha-menu-button>
        <div slot="title">Ready Home</div>
        <ha-icon-button
          slot="actionItems"
          .path=${k}
          .label=${"Add item"}
          ?disabled=${this._busy}
          @click=${this._openAdd}
        ></ha-icon-button>

        <div class="content">
          <div class="stats">
            <div class="stat">
              <span class="stat-label">Overall</span>
              <span class="stat-value">${this._pct(o)}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Water</span>
              <span class="stat-value">${this._pct(p)}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Food</span>
              <span class="stat-value">${this._pct(u)}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Items</span>
              <span class="stat-value"
                >${this._snapshot?.items.length??0}</span
              >
            </div>
          </div>

          <div class="attention" role="group" aria-label="Attention filters">
            <button
              type="button"
              class="chip ${this._filterStatus==="expired"?"active":""}"
              @click=${()=>this._setStatusFilter("expired")}
            >
              Expired
              <span class="chip-count">${h.expired}</span>
            </button>
            <button
              type="button"
              class="chip ${this._filterStatus==="expiring"?"active":""}"
              @click=${()=>this._setStatusFilter("expiring")}
            >
              Expiring
              <span class="chip-count">${h.expiring}</span>
            </button>
            <button
              type="button"
              class="chip ${this._filterStatus==="low_stock"?"active":""}"
              @click=${()=>this._setStatusFilter("low_stock")}
            >
              Low stock
              <span class="chip-count">${h.low_stock}</span>
            </button>
          </div>

          <div class="toolbar">
            <input
              class="search"
              type="search"
              placeholder="Search name, location, barcode…"
              .value=${this._search}
              @input=${n=>{this._search=n.target.value}}
            />
            <div class="filters">
              <select
                .value=${this._filterStatus}
                @change=${n=>{this._filterStatus=n.target.value}}
              >
                <option value="all">All statuses</option>
                <option value="expired">Expired</option>
                <option value="expiring">Expiring</option>
                <option value="low_stock">Low stock</option>
              </select>
              <select
                .value=${this._filterLocation}
                @change=${n=>{this._filterLocation=n.target.value}}
              >
                <option value="">All locations</option>
                ${i.map(n=>a`<option value=${n}>${n}</option>`)}
              </select>
              <select
                .value=${this._filterCategory}
                @change=${n=>{this._filterCategory=n.target.value}}
              >
                <option value="">All categories</option>
                ${r.map(n=>a`<option value=${n}>${n}</option>`)}
              </select>
              <select
                .value=${this._filterResource}
                @change=${n=>{this._filterResource=n.target.value}}
              >
                <option value="">All resources</option>
                <option value="water">Water</option>
                <option value="food">Food</option>
                <option value="none">None</option>
              </select>
              <select
                .value=${this._sort}
                @change=${n=>{this._sort=n.target.value}}
              >
                <option value="name">Sort: name</option>
                <option value="expiry">Sort: expiry</option>
                <option value="quantity">Sort: quantity</option>
              </select>
            </div>
          </div>

          ${this._error?a`<div class="error" role="alert">${this._error}</div>`:d}

          ${this.narrow?this._renderCardList(t):this._renderTable(t)}
        </div>
      </ha-top-app-bar-fixed>

      ${this._dialogOpen?this._renderDialog():d}
    `}_pct(t){return t==null||Number.isNaN(Number(t))?"—":`${Math.round(Number(t))}%`}_renderEmpty(){return this._snapshot?a`
      <div class="empty">
        No items match.
        <button class="link" @click=${this._openAdd}>Add an item</button>
      </div>
    `:a`<div class="empty">Loading inventory…</div>`}_renderTable(t){return a`
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
            ${t.map(e=>this._renderRow(e))}
            ${t.length===0?a`<tr>
                  <td colspan="6">${this._renderEmpty()}</td>
                </tr>`:d}
          </tbody>
        </table>
      </div>
    `}_renderCardList(t){return t.length===0?this._renderEmpty():a`
      <div class="card-list">
        ${t.map(e=>this._renderItemCard(e))}
      </div>
    `}_renderQty(t){return a`
      <div class="qty" @click=${e=>e.stopPropagation()}>
        <button
          type="button"
          title="Decrease"
          ?disabled=${this._busy||t.quantity<=0}
          @click=${()=>this._adjust(t,-1)}
        >
          −
        </button>
        <span
          >${t.quantity}${t.desired_quantity?a` / ${t.desired_quantity}`:d}
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
      </div>
    `}_renderRow(t){const e=this._itemStatus(t);return a`
      <tr class=${e?`row-${e}`:""}>
        <td>
          <button class="link" @click=${()=>this._openEdit(t)}>
            ${t.name}
          </button>
          <div class="meta">
            ${t.category||"—"}
            ${e?a`<span class="badge badge-${e}"
                  >${this._statusLabel(e)}</span
                >`:d}
          </div>
        </td>
        <td>${this._renderQty(t)}</td>
        <td>${t.location||"—"}</td>
        <td>${t.resource}</td>
        <td>${t.expiry_date||"—"}</td>
        <td class="actions">
          <button type="button" @click=${()=>this._openEdit(t)}>
            Edit
          </button>
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
    `}_renderItemCard(t){const e=this._itemStatus(t),i=[t.location,t.category,t.expiry_date].filter(Boolean).join(" · ");return a`
      <article
        class="item-card ${e?`row-${e}`:""}"
        @click=${()=>this._openEdit(t)}
      >
        <div class="item-card-top">
          <div class="item-card-title">
            <span class="item-name">${t.name}</span>
            ${e?a`<span class="badge badge-${e}"
                  >${this._statusLabel(e)}</span
                >`:d}
          </div>
          <button
            type="button"
            class="danger link-danger"
            ?disabled=${this._busy}
            @click=${r=>{r.stopPropagation(),this._remove(t)}}
          >
            Remove
          </button>
        </div>
        ${i?a`<div class="meta">${i}</div>`:d}
        <div class="item-card-bottom">${this._renderQty(t)}</div>
      </article>
    `}_renderDialog(){const t=this._form,e=this._settings?.locations??[],i=this._settings?.categories??[];return a`
      <div class="dialog-backdrop" @click=${this._closeDialog}>
        <div
          class="dialog ${this.narrow?"dialog-narrow":""}"
          role="dialog"
          aria-modal="true"
          @click=${r=>r.stopPropagation()}
        >
          <h2>${this._editing?"Edit item":"Add item"}</h2>
          <label
            >Name
            <input
              required
              .value=${t.name||""}
              @input=${this._onField("name")}
            />
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
              ${w.map(r=>a`<option value=${r}>${r}</option>`)}
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
              ${e.map(r=>a`<option value=${r}></option>`)}
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
              ${i.map(r=>a`<option value=${r}></option>`)}
            </datalist>
          </label>
          <label
            >Resource
            <select
              .value=${t.resource||"none"}
              @change=${this._onField("resource")}
            >
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
              <input
                .value=${t.barcode||""}
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
    `}_onField(t){return e=>{const i=e.target;this._form={...this._form,[t]:i.value}}}async _run(t){this._busy=!0,this._error="";try{await t()}catch(e){this._error=String(e)}finally{this._busy=!1}}async _adjust(t,e){await this._run(()=>this.hass.callService("ready_home","adjust_quantity",{item_id:t.id,delta:e}))}async _remove(t){confirm(`Remove “${t.name}”?`)&&await this._run(()=>this.hass.callService("ready_home","remove_item",{item_id:t.id}))}async _save(){const t=this._form,e=(t.name||"").trim();if(!e){this._error="Name is required";return}const i={quantity:Number(t.quantity||0),desired_quantity:Number(t.desired_quantity||0),unit:t.unit||"piece",location:t.location||"",category:t.category||"",resource:t.resource||"none",priority:t.priority||"important",barcode:t.barcode||"",notes:t.notes||""};t.expiry_date&&(i.expiry_date=t.expiry_date),t.liters_per_unit!==""&&(i.liters_per_unit=Number(t.liters_per_unit)),t.calories_per_unit!==""&&(i.calories_per_unit=Number(t.calories_per_unit)),await this._run(async()=>{this._editing?await this.hass.callService("ready_home","update_item",{item_id:this._editing.id,new_name:e,...i}):await this.hass.callService("ready_home","add_item",{name:e,...i}),this._dialogOpen=!1})}async _lookupBarcode(){const t=this._form.barcode?.trim();if(t){this._busy=!0,this._error="";try{const e=await m(this.hass,t),i=[e.brand,e.name].filter(Boolean).join(" ").trim();this._form={...this._form,name:i||this._form.name,resource:this._form.resource==="none"?"food":this._form.resource,calories_per_unit:e.calories_per_100g!=null?String(e.calories_per_100g):this._form.calories_per_unit}}catch(e){this._error=`Barcode lookup failed: ${e}`}finally{this._busy=!1}}}async _scanBarcode(){if(typeof BarcodeDetector>"u"){this._error="BarcodeDetector not supported in this browser — enter the code manually.";return}this._busy=!0,this._error="";try{const t=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}}),e=document.createElement("video");e.srcObject=t,await e.play();const i=new BarcodeDetector({formats:["ean_13","ean_8","upc_a","upc_e","code_128"]});await new Promise(o=>setTimeout(o,700));const r=await i.detect(e);t.getTracks().forEach(o=>o.stop()),r[0]?.rawValue?(this._form={...this._form,barcode:r[0].rawValue},this._busy=!1,await this._lookupBarcode()):this._error="No barcode detected — try again or enter manually."}catch(t){this._error=`Camera scan failed: ${t}`}finally{this._busy=!1}}};s.styles=b`
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
    h2 {
      margin: 0 0 8px;
      font-size: 1.2rem;
      font-weight: 500;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 8px;
      margin-bottom: 12px;
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
    .qty {
      white-space: nowrap;
      display: inline-flex;
      align-items: center;
      gap: 4px;
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
      width: min(480px, 100%);
      max-height: 90vh;
      overflow: auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
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
      .content {
        padding: 12px 12px 28px;
      }
      .actions {
        flex-direction: column;
      }
    }
  `;l([_({attribute:!1})],s.prototype,"hass",2);l([_({type:Boolean})],s.prototype,"narrow",2);l([_({attribute:!1})],s.prototype,"panel",2);l([c()],s.prototype,"_snapshot",2);l([c()],s.prototype,"_settings",2);l([c()],s.prototype,"_search",2);l([c()],s.prototype,"_filterStatus",2);l([c()],s.prototype,"_filterLocation",2);l([c()],s.prototype,"_filterCategory",2);l([c()],s.prototype,"_filterResource",2);l([c()],s.prototype,"_sort",2);l([c()],s.prototype,"_dialogOpen",2);l([c()],s.prototype,"_editing",2);l([c()],s.prototype,"_form",2);l([c()],s.prototype,"_error",2);l([c()],s.prototype,"_busy",2);s=l([v("ready-home-panel")],s);
//# sourceMappingURL=ready-home-panel.js.map
