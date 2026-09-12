/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const R=globalThis,D=R.ShadowRoot&&(R.ShadyCSS===void 0||R.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,F=Symbol(),K=new WeakMap;let st=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==F)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(D&&t===void 0){const i=e!==void 0&&e.length===1;i&&(t=K.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&K.set(e,t))}return t}toString(){return this.cssText}};const ct=s=>new st(typeof s=="string"?s:s+"",void 0,F),dt=(s,...t)=>{const e=s.length===1?s[0]:t.reduce((i,r,o)=>i+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+s[o+1],s[0]);return new st(e,s,F)},pt=(s,t)=>{if(D)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const i=document.createElement("style"),r=R.litNonce;r!==void 0&&i.setAttribute("nonce",r),i.textContent=e.cssText,s.appendChild(i)}},Q=D?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return ct(e)})(s):s;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:ht,defineProperty:ut,getOwnPropertyDescriptor:_t,getOwnPropertyNames:ft,getOwnPropertySymbols:gt,getPrototypeOf:mt}=Object,T=globalThis,Z=T.trustedTypes,bt=Z?Z.emptyScript:"",yt=T.reactiveElementPolyfillSupport,E=(s,t)=>s,U={toAttribute(s,t){switch(t){case Boolean:s=s?bt:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},j=(s,t)=>!ht(s,t),J={attribute:!0,type:String,converter:U,reflect:!1,useDefault:!1,hasChanged:j};Symbol.metadata??=Symbol("metadata"),T.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=J){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),r=this.getPropertyDescriptor(t,i,e);r!==void 0&&ut(this.prototype,t,r)}}static getPropertyDescriptor(t,e,i){const{get:r,set:o}=_t(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:r,set(n){const l=r?.call(this);o?.call(this,n),this.requestUpdate(t,l,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??J}static _$Ei(){if(this.hasOwnProperty(E("elementProperties")))return;const t=mt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(E("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(E("properties"))){const e=this.properties,i=[...ft(e),...gt(e)];for(const r of i)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[i,r]of e)this.elementProperties.set(i,r)}this._$Eh=new Map;for(const[e,i]of this.elementProperties){const r=this._$Eu(e,i);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const r of i)e.unshift(Q(r))}else t!==void 0&&e.push(Q(t));return e}static _$Eu(t,e){const i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return pt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,i);if(r!==void 0&&i.reflect===!0){const o=(i.converter?.toAttribute!==void 0?i.converter:U).toAttribute(e,i.type);this._$Em=t,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,r=i._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const o=i.getPropertyOptions(r),n=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:U;this._$Em=r;const l=n.fromAttribute(e,o.type);this[r]=l??this._$Ej?.get(r)??l,this._$Em=null}}requestUpdate(t,e,i,r=!1,o){if(t!==void 0){const n=this.constructor;if(r===!1&&(o=this[t]),i??=n.getPropertyOptions(t),!((i.hasChanged??j)(o,e)||i.useDefault&&i.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:r,wrapped:o},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[r,o]of i){const{wrapped:n}=o,l=this[r];n!==!0||this._$AL.has(r)||l===void 0||this.C(r,void 0,o,l)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(e)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[E("elementProperties")]=new Map,w[E("finalized")]=new Map,yt?.({ReactiveElement:w}),(T.reactiveElementVersions??=[]).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const I=globalThis,G=s=>s,H=I.trustedTypes,X=H?H.createPolicy("lit-html",{createHTML:s=>s}):void 0,ot="$lit$",y=`lit$${Math.random().toFixed(9).slice(2)}$`,nt="?"+y,$t=`<${nt}>`,x=document,N=()=>x.createComment(""),P=s=>s===null||typeof s!="object"&&typeof s!="function",V=Array.isArray,vt=s=>V(s)||typeof s?.[Symbol.iterator]=="function",q=`[ 	
\f\r]`,C=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Y=/-->/g,tt=/>/g,$=RegExp(`>|${q}(?:([^\\s"'>=/]+)(${q}*=${q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),et=/'/g,it=/"/g,at=/^(?:script|style|textarea|title)$/i,xt=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),p=xt(1),A=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),rt=new WeakMap,v=x.createTreeWalker(x,129);function lt(s,t){if(!V(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return X!==void 0?X.createHTML(t):t}const wt=(s,t)=>{const e=s.length-1,i=[];let r,o=t===2?"<svg>":t===3?"<math>":"",n=C;for(let l=0;l<e;l++){const a=s[l];let u,_,d=-1,b=0;for(;b<a.length&&(n.lastIndex=b,_=n.exec(a),_!==null);)b=n.lastIndex,n===C?_[1]==="!--"?n=Y:_[1]!==void 0?n=tt:_[2]!==void 0?(at.test(_[2])&&(r=RegExp("</"+_[2],"g")),n=$):_[3]!==void 0&&(n=$):n===$?_[0]===">"?(n=r??C,d=-1):_[1]===void 0?d=-2:(d=n.lastIndex-_[2].length,u=_[1],n=_[3]===void 0?$:_[3]==='"'?it:et):n===it||n===et?n=$:n===Y||n===tt?n=C:(n=$,r=void 0);const h=n===$&&s[l+1].startsWith("/>")?" ":"";o+=n===C?a+$t:d>=0?(i.push(u),a.slice(0,d)+ot+a.slice(d)+y+h):a+y+(d===-2?l:h)}return[lt(s,o+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]};class L{constructor({strings:t,_$litType$:e},i){let r;this.parts=[];let o=0,n=0;const l=t.length-1,a=this.parts,[u,_]=wt(t,e);if(this.el=L.createElement(u,i),v.currentNode=this.el.content,e===2||e===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(r=v.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const d of r.getAttributeNames())if(d.endsWith(ot)){const b=_[n++],h=r.getAttribute(d).split(y),M=/([.?@])?(.*)/.exec(b);a.push({type:1,index:o,name:M[2],strings:h,ctor:M[1]==="."?St:M[1]==="?"?Ct:M[1]==="@"?Et:z}),r.removeAttribute(d)}else d.startsWith(y)&&(a.push({type:6,index:o}),r.removeAttribute(d));if(at.test(r.tagName)){const d=r.textContent.split(y),b=d.length-1;if(b>0){r.textContent=H?H.emptyScript:"";for(let h=0;h<b;h++)r.append(d[h],N()),v.nextNode(),a.push({type:2,index:++o});r.append(d[b],N())}}}else if(r.nodeType===8)if(r.data===nt)a.push({type:2,index:o});else{let d=-1;for(;(d=r.data.indexOf(y,d+1))!==-1;)a.push({type:7,index:o}),d+=y.length-1}o++}}static createElement(t,e){const i=x.createElement("template");return i.innerHTML=t,i}}function S(s,t,e=s,i){if(t===A)return t;let r=i!==void 0?e._$Co?.[i]:e._$Cl;const o=P(t)?void 0:t._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),o===void 0?r=void 0:(r=new o(s),r._$AT(s,e,i)),i!==void 0?(e._$Co??=[])[i]=r:e._$Cl=r),r!==void 0&&(t=S(s,r._$AS(s,t.values),r,i)),t}class At{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,r=(t?.creationScope??x).importNode(e,!0);v.currentNode=r;let o=v.nextNode(),n=0,l=0,a=i[0];for(;a!==void 0;){if(n===a.index){let u;a.type===2?u=new O(o,o.nextSibling,this,t):a.type===1?u=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(u=new kt(o,this,t)),this._$AV.push(u),a=i[++l]}n!==a?.index&&(o=v.nextNode(),n++)}return v.currentNode=x,r}p(t){let e=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class O{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,r){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=S(this,t,e),P(t)?t===c||t==null||t===""?(this._$AH!==c&&this._$AR(),this._$AH=c):t!==this._$AH&&t!==A&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):vt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==c&&P(this._$AH)?this._$AA.nextSibling.data=t:this.T(x.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,r=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=L.createElement(lt(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===r)this._$AH.p(e);else{const o=new At(r,this),n=o.u(this.options);o.p(e),this.T(n),this._$AH=o}}_$AC(t){let e=rt.get(t.strings);return e===void 0&&rt.set(t.strings,e=new L(t)),e}k(t){V(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,r=0;for(const o of t)r===e.length?e.push(i=new O(this.O(N()),this.O(N()),this,this.options)):i=e[r],i._$AI(o),r++;r<e.length&&(this._$AR(i&&i._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const i=G(t).nextSibling;G(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class z{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,r,o){this.type=1,this._$AH=c,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=o,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=c}_$AI(t,e=this,i,r){const o=this.strings;let n=!1;if(o===void 0)t=S(this,t,e,0),n=!P(t)||t!==this._$AH&&t!==A,n&&(this._$AH=t);else{const l=t;let a,u;for(t=o[0],a=0;a<o.length-1;a++)u=S(this,l[i+a],e,a),u===A&&(u=this._$AH[a]),n||=!P(u)||u!==this._$AH[a],u===c?t=c:t!==c&&(t+=(u??"")+o[a+1]),this._$AH[a]=u}n&&!r&&this.j(t)}j(t){t===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class St extends z{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===c?void 0:t}}class Ct extends z{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==c)}}class Et extends z{constructor(t,e,i,r,o){super(t,e,i,r,o),this.type=5}_$AI(t,e=this){if((t=S(this,t,e,0)??c)===A)return;const i=this._$AH,r=t===c&&i!==c||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==c&&(i===c||r);r&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class kt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){S(this,t)}}const Nt=I.litHtmlPolyfillSupport;Nt?.(L,O),(I.litHtmlVersions??=[]).push("3.3.3");const Pt=(s,t,e)=>{const i=e?.renderBefore??t;let r=i._$litPart$;if(r===void 0){const o=e?.renderBefore??null;i._$litPart$=r=new O(t.insertBefore(N(),o),o,void 0,e??{})}return r._$AI(s),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const W=globalThis;class k extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Pt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return A}}k._$litElement$=!0,k.finalized=!0,W.litElementHydrateSupport?.({LitElement:k});const Lt=W.litElementPolyfillSupport;Lt?.({LitElement:k});(W.litElementVersions??=[]).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ot={attribute:!0,type:String,converter:U,reflect:!1,hasChanged:j},Mt=(s=Ot,t,e)=>{const{kind:i,metadata:r}=e;let o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),i==="setter"&&((s=Object.create(s)).wrapped=!0),o.set(e.name,s),i==="accessor"){const{name:n}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(n,a,s,!0,l)},init(l){return l!==void 0&&this.C(n,void 0,s,l),l}}}if(i==="setter"){const{name:n}=e;return function(l){const a=this[n];t.call(this,l),this.requestUpdate(n,a,s,!0,l)}}throw Error("Unsupported decorator location: "+i)};function B(s){return(t,e)=>typeof e=="object"?Mt(s,t,e):((i,r,o)=>{const n=r.hasOwnProperty(o);return r.constructor.createProperty(o,i),n?Object.getOwnPropertyDescriptor(r,o):void 0})(s,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function m(s){return B({...s,state:!0,attribute:!1})}async function Rt(s){return s.connection.sendMessagePromise({type:"ready_home/settings"})}async function Ut(s,t){return s.connection.subscribeMessage(t,{type:"ready_home/subscribe"})}async function Ht(s,t){return s.connection.sendMessagePromise({type:"ready_home/barcode/lookup",barcode:t})}var Tt=Object.defineProperty,g=(s,t,e,i)=>{for(var r=void 0,o=s.length-1,n;o>=0;o--)(n=s[o])&&(r=n(t,e,r)||r);return r&&Tt(t,e,r),r};const zt="ready-home-panel",Bt="/api/ready_home/brand/icon.png",qt="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z",Dt=["piece","pack","box","gram","kilogram","liter","milliliter"],Ft={expired:"Expired",urgent:"Urgent",expiring:"Expiring",low:"Low stock"};class f extends k{constructor(){super(...arguments),this.narrow=!1,this._snapshot=null,this._settings=null,this._search="",this._filterStatus="all",this._filterLocation="",this._filterCategory="",this._filterReadiness="",this._filtersOpen=!1,this._sort="name",this._dialogOpen=!1,this._editing=null,this._form={},this._error="",this._busy=!1,this._unsub=null,this._connected=!1,this._toggleMenu=t=>{t?.stopPropagation(),this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))},this._openAdd=()=>{this._editing=null,this._form={name:"",quantity:"1",desired_quantity:"0",unit:"piece",location:this._settings?.locations?.[0]??"",category:this._settings?.categories?.[0]??"",priority:"important",notes:"",barcode:"",expiry_date:"",liters_per_unit:"",calories_per_unit:""},this._error="",this._dialogOpen=!0},this._openEdit=t=>{this._editing=t,this._form={name:t.name,quantity:String(t.quantity),desired_quantity:String(t.desired_quantity),unit:t.unit,location:t.location,category:t.category,priority:t.priority,notes:t.notes||"",barcode:t.barcode||"",expiry_date:t.expiry_date||"",liters_per_unit:t.liters_per_unit!=null?String(t.liters_per_unit):"",calories_per_unit:t.calories_per_unit!=null?String(t.calories_per_unit):""},this._error="",this._dialogOpen=!0},this._closeDialog=()=>{this._dialogOpen=!1}}connectedCallback(){super.connectedCallback(),this._connected=!0,this._connect()}disconnectedCallback(){super.disconnectedCallback(),this._connected=!1,this._unsub?.(),this._unsub=null}updated(t){t.has("hass")&&this.hass&&!this._unsub&&this._connected&&this._connect()}async _connect(){if(!(!this.hass||this._unsub))try{this._settings=await Rt(this.hass),this._unsub=await Ut(this.hass,t=>{this._snapshot=t}),this._error=""}catch(t){this._error=String(t)}}get _assessment(){return this._snapshot?.assessment??{}}get _bucketCounts(){const t=this._snapshot?.buckets;return{expired:t?.expired.length??0,expiring:(t?.within_urgent.length??0)+(t?.within_expiring.length??0),low_stock:t?.low_stock.length??0}}get _activeFilterCount(){let t=0;return this._filterLocation&&(t+=1),this._filterCategory&&(t+=1),this._filterReadiness&&(t+=1),t}_readinessKind(t){const e=t.trim().toLowerCase();return!e||!this._settings?"none":(this._settings.water_categories??[]).some(i=>i.trim().toLowerCase()===e)?"water":(this._settings.food_categories??[]).some(i=>i.trim().toLowerCase()===e)?"food":"none"}get _items(){let t=[...this._snapshot?.items??[]];const e=this._search.trim().toLowerCase();if(e&&(t=t.filter(i=>i.name.toLowerCase().includes(e)||i.location.toLowerCase().includes(e)||i.category.toLowerCase().includes(e)||(i.barcode||"").toLowerCase().includes(e)||(i.notes||"").toLowerCase().includes(e))),this._filterLocation&&(t=t.filter(i=>i.location.toLowerCase()===this._filterLocation.toLowerCase())),this._filterCategory&&(t=t.filter(i=>i.category.toLowerCase()===this._filterCategory.toLowerCase())),this._filterReadiness&&(t=t.filter(i=>this._readinessKind(i.category)===this._filterReadiness)),this._filterStatus!=="all"){const i=this._snapshot?.buckets,r=new Set;this._filterStatus==="expired"?i?.expired.forEach(o=>r.add(o.id)):this._filterStatus==="expiring"?(i?.within_urgent.forEach(o=>r.add(o.id)),i?.within_expiring.forEach(o=>r.add(o.id))):this._filterStatus==="low_stock"&&i?.low_stock.forEach(o=>r.add(o.id)),t=t.filter(o=>r.has(o.id))}return t.sort((i,r)=>this._sort==="quantity"?i.quantity-r.quantity:this._sort==="expiry"?(i.expiry_date||"9999").localeCompare(r.expiry_date||"9999"):i.name.localeCompare(r.name)),t}_itemStatus(t){const e=this._snapshot?.buckets;return e?e.expired.some(i=>i.id===t.id)?"expired":e.within_urgent.some(i=>i.id===t.id)?"urgent":e.within_expiring.some(i=>i.id===t.id)?"expiring":e.low_stock.some(i=>i.id===t.id)?"low":"":""}_statusLabel(t){return Ft[t]||t}_setStatusFilter(t){this._filterStatus=this._filterStatus===t?"all":t}_pct(t){return t==null||Number.isNaN(Number(t))?"—":`${Math.round(Number(t))}%`}_formatHours(t){if(t==null||Number.isNaN(Number(t)))return"—";const e=Math.max(0,Math.round(Number(t)));return e<48?`${e}h`:`${Math.round(e/24)}d`}_formatAmount(t,e){if(t==null||Number.isNaN(Number(t)))return"—";const i=Number(t);return`${Math.abs(i-Math.round(i))<.05?Math.round(i):Math.round(i*10)/10} ${e}`}_durationClass(t){const e=this._assessment.duration_hours??this._settings?.duration_hours??72;return t==null||Number.isNaN(Number(t))?"":Number(t)<=0?"duration-bad":Number(t)<Number(e)?"duration-warn":""}_expiryClass(t){return t==="expired"?"expiry-expired":t==="urgent"||t==="expiring"?"expiry-warn":""}_optionList(t,e){const i=new Set,r=[];for(const o of[...t,e]){const n=o?.trim();if(!n)continue;const l=n.toLowerCase();i.has(l)||(i.add(l),r.push(n))}return r}_mdButton(t,e){const i=e.variant??"outlined";return p`
      <button
        type="button"
        class="md-btn md-btn-${i}"
        ?disabled=${e.disabled??!1}
        @click=${e.onClick}
      >
        ${t}
      </button>
    `}render(){const t=this._items,e=this._assessment,i=this._settings?.locations??[],r=this._settings?.categories??[],o=e.overall_percent,n=e.water_percent,l=e.food_percent,a=this._bucketCounts,u=e.duration_hours??this._settings?.duration_hours??72,_=e.supply_hours,d=e.water_supply_hours,b=e.food_supply_hours;return p`
      <div class="page">
        <header class="header">
          <div class="header-row">
            <div class="brand">
              ${this.narrow?p`
                    <button
                      type="button"
                      class="icon-btn"
                      aria-label="Open menu"
                      @click=${this._toggleMenu}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="currentColor" d=${qt} />
                      </svg>
                    </button>
                  `:c}
              <img
                class="brand-icon"
                src=${Bt}
                alt=""
                width="32"
                height="32"
              />
              <div class="brand-text">
                <h1>Ready Home</h1>
                <p class="subtitle">${u}-hour readiness</p>
              </div>
            </div>
            ${this._mdButton("Add item",{variant:"filled",disabled:this._busy,onClick:this._openAdd})}
          </div>
        </header>

        <div class="content">
          <div class="stats">
            <div class="stat">
              <span class="stat-label">Overall</span>
              <span class="stat-value">${this._pct(o)}</span>
              <span class="stat-duration ${this._durationClass(_)}"
                >Lasts ${this._formatHours(_)}</span
              >
            </div>
            <div class="stat">
              <span class="stat-label">Water</span>
              <span class="stat-value"
                >${this._formatAmount(e.water_on_hand,"L")}</span
              >
              <span class="stat-meta"
                >${this._pct(n)} · goal
                ${this._formatAmount(e.water_target,"L")}</span
              >
              <span class="stat-duration ${this._durationClass(d)}"
                >Lasts ${this._formatHours(d)}</span
              >
            </div>
            <div class="stat">
              <span class="stat-label">Food</span>
              <span class="stat-value"
                >${this._formatAmount(e.food_on_hand,"kcal")}</span
              >
              <span class="stat-meta"
                >${this._pct(l)} · goal
                ${this._formatAmount(e.food_target,"kcal")}</span
              >
              <span class="stat-duration ${this._durationClass(b)}"
                >Lasts ${this._formatHours(b)}</span
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
              <span class="chip-count">${a.expired}</span>
            </button>
            <button
              type="button"
              class="chip ${this._filterStatus==="expiring"?"active":""}"
              @click=${()=>this._setStatusFilter("expiring")}
            >
              Expiring
              <span class="chip-count">${a.expiring}</span>
            </button>
            <button
              type="button"
              class="chip ${this._filterStatus==="low_stock"?"active":""}"
              @click=${()=>this._setStatusFilter("low_stock")}
            >
              Low stock
              <span class="chip-count">${a.low_stock}</span>
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
                  @input=${h=>{this._search=h.target.value}}
                />
                <select
                  class="sort"
                  .value=${this._sort}
                  @change=${h=>{this._sort=h.target.value}}
                >
                  <option value="name">Sort: name</option>
                  <option value="expiry">Sort: expiry</option>
                  <option value="quantity">Sort: quantity</option>
                </select>
                <button
                  type="button"
                  class="md-btn md-btn-outlined filters-btn ${this._filtersOpen||this._activeFilterCount?"active":""}"
                  @click=${()=>{this._filtersOpen=!this._filtersOpen}}
                >
                  Filters${this._activeFilterCount?p` (${this._activeFilterCount})`:c}
                </button>
              </div>
              ${this._filtersOpen?p`
                    <div class="filters">
                      <select
                        .value=${this._filterLocation}
                        @change=${h=>{this._filterLocation=h.target.value}}
                      >
                        <option value="">All locations</option>
                        ${i.map(h=>p`<option value=${h}>${h}</option>`)}
                      </select>
                      <select
                        .value=${this._filterCategory}
                        @change=${h=>{this._filterCategory=h.target.value}}
                      >
                        <option value="">All categories</option>
                        ${r.map(h=>p`<option value=${h}>${h}</option>`)}
                      </select>
                      <select
                        .value=${this._filterReadiness}
                        @change=${h=>{this._filterReadiness=h.target.value}}
                      >
                        <option value="">All readiness</option>
                        <option value="water">Water</option>
                        <option value="food">Food</option>
                        <option value="none">Neither</option>
                      </select>
                    </div>
                  `:c}
              <div class="inventory-meta">
                <span class="item-count"
                  >${t.length}/${this._snapshot?.items.length??0}</span
                >
              </div>
            </div>

            ${this._error?p`<div class="error" role="alert">${this._error}</div>`:c}

            ${this.narrow?this._renderCardList(t):this._renderTable(t)}
          </section>
        </div>
      </div>

      ${this._dialogOpen?this._renderDialog():c}
    `}_renderEmpty(){return this._snapshot?p`
      <div class="empty">
        No items match.
        ${this._mdButton("Add an item",{variant:"text",onClick:this._openAdd})}
      </div>
    `:p`<div class="empty">Loading inventory…</div>`}_renderQtyText(t){return p`
      <span class="qty-text"
        >${t.quantity}${t.desired_quantity?p` / ${t.desired_quantity}`:c}
        ${t.unit}</span
      >
    `}_renderTable(t){return p`
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
            ${t.map(e=>this._renderRow(e))}
            ${t.length===0?p`<tr>
                  <td colspan="6">${this._renderEmpty()}</td>
                </tr>`:c}
          </tbody>
        </table>
      </div>
    `}_renderCardList(t){return t.length===0?this._renderEmpty():p`
      <div class="card-list">
        ${t.map(e=>this._renderItemCard(e))}
      </div>
    `}_renderRow(t){const e=this._itemStatus(t);return p`
      <tr class=${e?`row-${e}`:""}>
        <td>
          <button class="link" @click=${()=>this._openEdit(t)}>
            ${t.name}
          </button>
          <div class="meta">
            ${e?p`<span class="badge badge-${e}"
                  >${this._statusLabel(e)}</span
                >`:c}
          </div>
        </td>
        <td>${this._renderQtyText(t)}</td>
        <td>${t.location||"—"}</td>
        <td>${t.category||"—"}</td>
        <td class=${this._expiryClass(e)}>
          ${t.expiry_date||"—"}
        </td>
        <td class="actions">
          ${this._mdButton("Edit",{variant:"outlined",onClick:()=>this._openEdit(t)})}
          ${this._mdButton("Remove",{variant:"danger-text",disabled:this._busy,onClick:()=>void this._remove(t)})}
        </td>
      </tr>
    `}_renderItemCard(t){const e=this._itemStatus(t),i=[t.location,t.category].filter(Boolean).join(" · ");return p`
      <article
        class="item-card ${e?`row-${e}`:""}"
        @click=${()=>this._openEdit(t)}
      >
        <div class="item-card-top">
          <div class="item-card-title">
            <span class="item-name">${t.name}</span>
            ${e?p`<span class="badge badge-${e}"
                  >${this._statusLabel(e)}</span
                >`:c}
          </div>
          <button
            type="button"
            class="md-btn md-btn-danger-text"
            ?disabled=${this._busy}
            @click=${r=>{r.stopPropagation(),this._remove(t)}}
          >
            Remove
          </button>
        </div>
        ${i?p`<div class="meta">${i}</div>`:c}
        <div class="item-card-bottom">
          ${this._renderQtyText(t)}
          ${t.expiry_date?p`<span class="${this._expiryClass(e)}"
                >${t.expiry_date}</span
              >`:c}
        </div>
      </article>
    `}_formReadiness(){return this._readinessKind(this._form.category||"")}_showLitersField(){if(this._formReadiness()!=="water")return!1;const t=this._form.unit||"piece";return t!=="liter"&&t!=="milliliter"}_showCaloriesField(){return this._formReadiness()==="food"}_renderDialog(){const t=this._form,e=this._optionList(this._settings?.locations??[],t.location||""),i=this._optionList(this._settings?.categories??[],t.category||"");return p`
      <div class="dialog-backdrop" @click=${this._closeDialog}>
        <div
          class="dialog ${this.narrow?"dialog-narrow":""}"
          role="dialog"
          aria-modal="true"
          @click=${r=>r.stopPropagation()}
        >
          <h2>${this._editing?"Edit item":"Add item"}</h2>

          <div class="form-section">
            <div class="form-section-title">Details</div>
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
                >Location
                <select
                  .value=${t.location||""}
                  @change=${this._onField("location")}
                >
                  <option value="">Select location</option>
                  ${e.map(r=>p`<option value=${r}>${r}</option>`)}
                </select>
              </label>
              <label
                >Category
                <select
                  .value=${t.category||""}
                  @change=${this._onField("category")}
                >
                  <option value="">Select category</option>
                  ${i.map(r=>p`<option value=${r}>${r}</option>`)}
                </select>
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
                ${this._mdButton("Scan",{variant:"outlined",disabled:this._busy,onClick:()=>void this._scanBarcode()})}
                ${this._mdButton("Lookup",{variant:"outlined",disabled:this._busy,onClick:()=>void this._lookupBarcode()})}
              </div>
            </label>
          </div>

          <div class="form-section">
            <div class="form-section-title">Stock</div>
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
              <select
                .value=${t.unit||"piece"}
                @change=${this._onField("unit")}
              >
                ${Dt.map(r=>p`<option value=${r}>${r}</option>`)}
              </select>
            </label>
            ${this._showLitersField()?p`
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
                `:c}
            ${this._showCaloriesField()?p`
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
                `:c}
          </div>

          <div class="form-section">
            <div class="form-section-title">Dates</div>
            <label
              >Expiry
              <input
                type="date"
                .value=${t.expiry_date||""}
                @input=${this._onField("expiry_date")}
              />
            </label>
          </div>

          <div class="dialog-actions">
            ${this._mdButton("Cancel",{variant:"text",onClick:this._closeDialog})}
            ${this._mdButton("Save",{variant:"filled",disabled:this._busy||!(t.name||"").trim(),onClick:()=>void this._save()})}
          </div>
        </div>
      </div>
    `}_onField(t){return e=>{const i=e.target;this._form={...this._form,[t]:i.value}}}async _run(t){this._busy=!0,this._error="";try{await t()}catch(e){this._error=String(e)}finally{this._busy=!1}}async _remove(t){confirm(`Remove “${t.name}”?`)&&await this._run(()=>this.hass.callService("ready_home","remove_item",{item_id:t.id}))}async _save(){const t=this._form,e=(t.name||"").trim();if(!e){this._error="Name is required";return}const i=this._formReadiness(),r={quantity:Number(t.quantity||0),desired_quantity:Number(t.desired_quantity||0),unit:t.unit||"piece",location:t.location||"",category:t.category||"",priority:t.priority||"important",barcode:t.barcode||"",notes:t.notes||""};t.expiry_date&&(r.expiry_date=t.expiry_date),i==="water"&&this._showLitersField()&&t.liters_per_unit!==""?r.liters_per_unit=Number(t.liters_per_unit):(i!=="water"||!this._showLitersField())&&(r.liters_per_unit=null),i==="food"&&t.calories_per_unit!==""?r.calories_per_unit=Number(t.calories_per_unit):i!=="food"&&(r.calories_per_unit=null),await this._run(async()=>{this._editing?await this.hass.callService("ready_home","update_item",{item_id:this._editing.id,new_name:e,...r}):await this.hass.callService("ready_home","add_item",{name:e,...r}),this._dialogOpen=!1})}async _lookupBarcode(){const t=this._form.barcode?.trim();if(t){this._busy=!0,this._error="";try{const e=await Ht(this.hass,t),i=[e.brand,e.name].filter(Boolean).join(" ").trim(),r=this._form.category?.trim()||(this._settings?.food_categories?.[0]??"Food");this._form={...this._form,name:i||this._form.name,category:r,calories_per_unit:e.calories_per_100g!=null?String(e.calories_per_100g):this._form.calories_per_unit}}catch(e){this._error=`Barcode lookup failed: ${e}`}finally{this._busy=!1}}}async _scanBarcode(){if(typeof BarcodeDetector>"u"){this._error="BarcodeDetector not supported in this browser — enter the code manually.";return}this._busy=!0,this._error="";try{const t=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}}),e=document.createElement("video");e.srcObject=t,await e.play();const i=new BarcodeDetector({formats:["ean_13","ean_8","upc_a","upc_e","code_128"]});await new Promise(o=>setTimeout(o,700));const r=await i.detect(e);t.getTracks().forEach(o=>o.stop()),r[0]?.rawValue?(this._form={...this._form,barcode:r[0].rawValue},this._busy=!1,await this._lookupBarcode()):this._error="No barcode detected — try again or enter manually."}catch(t){this._error=`Camera scan failed: ${t}`}finally{this._busy=!1}}static{this.styles=dt`
    :host {
      display: block;
      height: 100%;
      color: var(--primary-text-color);
      background: var(--primary-background-color, transparent);
      font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
    }
    .page {
      height: 100%;
      overflow: auto;
      box-sizing: border-box;
    }
    .header {
      max-width: 1100px;
      margin: 0 auto;
      padding: 16px 20px 0;
      box-sizing: border-box;
    }
    .header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }
    .brand-icon {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      flex-shrink: 0;
      object-fit: contain;
      background: #111;
    }
    .brand-text {
      min-width: 0;
    }
    .header h1 {
      margin: 0;
      font-size: 1.35rem;
      font-weight: 500;
      line-height: 1.2;
    }
    .subtitle {
      margin: 2px 0 0;
      font-size: 0.8rem;
      color: var(--secondary-text-color);
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
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px;
      margin-bottom: 12px;
    }
    .stat {
      padding: 12px;
      border-radius: 8px;
      border-left: 3px solid var(--primary-color);
      background: var(--card-background-color, #fff);
      box-shadow: var(--ha-card-box-shadow, none);
    }
    .stat-label {
      display: block;
      font-size: 0.75rem;
      color: var(--secondary-text-color);
      margin-bottom: 4px;
    }
    .stat-value {
      display: block;
      font-size: 1.35rem;
      font-weight: 600;
    }
    .stat-meta,
    .stat-duration {
      display: block;
      margin-top: 4px;
      font-size: 0.75rem;
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
    .inventory {
      background: var(--card-background-color, #fff);
      border-radius: var(--ha-card-border-radius, 12px);
      border: 1px solid var(--divider-color);
      box-shadow: var(--ha-card-box-shadow, none);
      padding: 12px;
      box-sizing: border-box;
    }
    .toolbar {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 12px;
    }
    .toolbar-row {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      gap: 8px;
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
      gap: 6px;
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
      font-size: 1rem;
    }
    .item-card-bottom {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
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
      padding: 16px;
      border-radius: 12px;
      width: min(520px, 100%);
      max-height: 90vh;
      overflow: auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
      box-sizing: border-box;
    }
    .dialog.dialog-narrow {
      width: 100%;
      max-height: 100%;
      border-radius: 12px;
      padding: 16px;
      padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
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
      gap: 10px;
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
      align-items: center;
    }
    .barcode-row input {
      flex: 1;
      min-width: 0;
    }
    @media (max-width: 720px) {
      .stats {
        grid-template-columns: 1fr;
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
      .row2 {
        grid-template-columns: 1fr;
      }
    }
  `}}g([B({attribute:!1})],f.prototype,"hass");g([B({type:Boolean})],f.prototype,"narrow");g([B({attribute:!1})],f.prototype,"panel");g([m()],f.prototype,"_snapshot");g([m()],f.prototype,"_settings");g([m()],f.prototype,"_search");g([m()],f.prototype,"_filterStatus");g([m()],f.prototype,"_filterLocation");g([m()],f.prototype,"_filterCategory");g([m()],f.prototype,"_filterReadiness");g([m()],f.prototype,"_filtersOpen");g([m()],f.prototype,"_sort");g([m()],f.prototype,"_dialogOpen");g([m()],f.prototype,"_editing");g([m()],f.prototype,"_form");g([m()],f.prototype,"_error");g([m()],f.prototype,"_busy");try{customElements.define(zt,f)}catch{}
//# sourceMappingURL=ready-home-panel.js.map
