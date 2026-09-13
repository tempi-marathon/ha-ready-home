/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const q=globalThis,W=q.ShadowRoot&&(q.ShadyCSS===void 0||q.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,K=Symbol(),G=new WeakMap;let ht=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==K)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(W&&t===void 0){const i=e!==void 0&&e.length===1;i&&(t=G.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&G.set(e,t))}return t}toString(){return this.cssText}};const gt=s=>new ht(typeof s=="string"?s:s+"",void 0,K),$t=(s,...t)=>{const e=s.length===1?s[0]:t.reduce((i,r,o)=>i+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+s[o+1],s[0]);return new ht(e,s,K)},bt=(s,t)=>{if(W)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const i=document.createElement("style"),r=q.litNonce;r!==void 0&&i.setAttribute("nonce",r),i.textContent=e.cssText,s.appendChild(i)}},X=W?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return gt(e)})(s):s;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:yt,defineProperty:vt,getOwnPropertyDescriptor:xt,getOwnPropertyNames:wt,getOwnPropertySymbols:At,getPrototypeOf:Ct}=Object,z=globalThis,tt=z.trustedTypes,Et=tt?tt.emptyScript:"",St=z.reactiveElementPolyfillSupport,T=(s,t)=>s,B={toAttribute(s,t){switch(t){case Boolean:s=s?Et:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},Z=(s,t)=>!yt(s,t),et={attribute:!0,type:String,converter:B,reflect:!1,useDefault:!1,hasChanged:Z};Symbol.metadata??=Symbol("metadata"),z.litPropertyMetadata??=new WeakMap;let S=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=et){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),r=this.getPropertyDescriptor(t,i,e);r!==void 0&&vt(this.prototype,t,r)}}static getPropertyDescriptor(t,e,i){const{get:r,set:o}=xt(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:r,set(n){const a=r?.call(this);o?.call(this,n),this.requestUpdate(t,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??et}static _$Ei(){if(this.hasOwnProperty(T("elementProperties")))return;const t=Ct(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(T("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(T("properties"))){const e=this.properties,i=[...wt(e),...At(e)];for(const r of i)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[i,r]of e)this.elementProperties.set(i,r)}this._$Eh=new Map;for(const[e,i]of this.elementProperties){const r=this._$Eu(e,i);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const r of i)e.unshift(X(r))}else t!==void 0&&e.push(X(t));return e}static _$Eu(t,e){const i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return bt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,i);if(r!==void 0&&i.reflect===!0){const o=(i.converter?.toAttribute!==void 0?i.converter:B).toAttribute(e,i.type);this._$Em=t,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,r=i._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const o=i.getPropertyOptions(r),n=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:B;this._$Em=r;const a=n.fromAttribute(e,o.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(t,e,i,r=!1,o){if(t!==void 0){const n=this.constructor;if(r===!1&&(o=this[t]),i??=n.getPropertyOptions(t),!((i.hasChanged??Z)(o,e)||i.useDefault&&i.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:r,wrapped:o},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[r,o]of i){const{wrapped:n}=o,a=this[r];n!==!0||this._$AL.has(r)||a===void 0||this.C(r,void 0,o,a)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(e)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};S.elementStyles=[],S.shadowRootOptions={mode:"open"},S[T("elementProperties")]=new Map,S[T("finalized")]=new Map,St?.({ReactiveElement:S}),(z.reactiveElementVersions??=[]).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Q=globalThis,it=s=>s,D=Q.trustedTypes,rt=D?D.createPolicy("lit-html",{createHTML:s=>s}):void 0,ut="$lit$",y=`lit$${Math.random().toFixed(9).slice(2)}$`,pt="?"+y,kt=`<${pt}>`,C=document,O=()=>C.createComment(""),P=s=>s===null||typeof s!="object"&&typeof s!="function",Y=Array.isArray,Lt=s=>Y(s)||typeof s?.[Symbol.iterator]=="function",V=`[ 	
\f\r]`,L=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,st=/-->/g,ot=/>/g,w=RegExp(`>|${V}(?:([^\\s"'>=/]+)(${V}*=${V}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),nt=/'/g,at=/"/g,_t=/^(?:script|style|textarea|title)$/i,Nt=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),h=Nt(1),b=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),lt=new WeakMap,A=C.createTreeWalker(C,129);function ft(s,t){if(!Y(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return rt!==void 0?rt.createHTML(t):t}const Tt=(s,t)=>{const e=s.length-1,i=[];let r,o=t===2?"<svg>":t===3?"<math>":"",n=L;for(let a=0;a<e;a++){const c=s[a];let u,l,p=-1,g=0;for(;g<c.length&&(n.lastIndex=g,l=n.exec(c),l!==null);)g=n.lastIndex,n===L?l[1]==="!--"?n=st:l[1]!==void 0?n=ot:l[2]!==void 0?(_t.test(l[2])&&(r=RegExp("</"+l[2],"g")),n=w):l[3]!==void 0&&(n=w):n===w?l[0]===">"?(n=r??L,p=-1):l[1]===void 0?p=-2:(p=n.lastIndex-l[2].length,u=l[1],n=l[3]===void 0?w:l[3]==='"'?at:nt):n===at||n===nt?n=w:n===st||n===ot?n=L:(n=w,r=void 0);const _=n===w&&s[a+1].startsWith("/>")?" ":"";o+=n===L?c+kt:p>=0?(i.push(u),c.slice(0,p)+ut+c.slice(p)+y+_):c+y+(p===-2?a:_)}return[ft(s,o+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]};class R{constructor({strings:t,_$litType$:e},i){let r;this.parts=[];let o=0,n=0;const a=t.length-1,c=this.parts,[u,l]=Tt(t,e);if(this.el=R.createElement(u,i),A.currentNode=this.el.content,e===2||e===3){const p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(r=A.nextNode())!==null&&c.length<a;){if(r.nodeType===1){if(r.hasAttributes())for(const p of r.getAttributeNames())if(p.endsWith(ut)){const g=l[n++],_=r.getAttribute(p).split(y),v=/([.?@])?(.*)/.exec(g);c.push({type:1,index:o,name:v[2],strings:_,ctor:v[1]==="."?Ot:v[1]==="?"?Pt:v[1]==="@"?Rt:I}),r.removeAttribute(p)}else p.startsWith(y)&&(c.push({type:6,index:o}),r.removeAttribute(p));if(_t.test(r.tagName)){const p=r.textContent.split(y),g=p.length-1;if(g>0){r.textContent=D?D.emptyScript:"";for(let _=0;_<g;_++)r.append(p[_],O()),A.nextNode(),c.push({type:2,index:++o});r.append(p[g],O())}}}else if(r.nodeType===8)if(r.data===pt)c.push({type:2,index:o});else{let p=-1;for(;(p=r.data.indexOf(y,p+1))!==-1;)c.push({type:7,index:o}),p+=y.length-1}o++}}static createElement(t,e){const i=C.createElement("template");return i.innerHTML=t,i}}function k(s,t,e=s,i){if(t===b)return t;let r=i!==void 0?e._$Co?.[i]:e._$Cl;const o=P(t)?void 0:t._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),o===void 0?r=void 0:(r=new o(s),r._$AT(s,e,i)),i!==void 0?(e._$Co??=[])[i]=r:e._$Cl=r),r!==void 0&&(t=k(s,r._$AS(s,t.values),r,i)),t}class Mt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,r=(t?.creationScope??C).importNode(e,!0);A.currentNode=r;let o=A.nextNode(),n=0,a=0,c=i[0];for(;c!==void 0;){if(n===c.index){let u;c.type===2?u=new H(o,o.nextSibling,this,t):c.type===1?u=new c.ctor(o,c.name,c.strings,this,t):c.type===6&&(u=new Ht(o,this,t)),this._$AV.push(u),c=i[++a]}n!==c?.index&&(o=A.nextNode(),n++)}return A.currentNode=C,r}p(t){let e=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class H{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,r){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=k(this,t,e),P(t)?t===d||t==null||t===""?(this._$AH!==d&&this._$AR(),this._$AH=d):t!==this._$AH&&t!==b&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Lt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==d&&P(this._$AH)?this._$AA.nextSibling.data=t:this.T(C.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,r=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=R.createElement(ft(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===r)this._$AH.p(e);else{const o=new Mt(r,this),n=o.u(this.options);o.p(e),this.T(n),this._$AH=o}}_$AC(t){let e=lt.get(t.strings);return e===void 0&&lt.set(t.strings,e=new R(t)),e}k(t){Y(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,r=0;for(const o of t)r===e.length?e.push(i=new H(this.O(O()),this.O(O()),this,this.options)):i=e[r],i._$AI(o),r++;r<e.length&&(this._$AR(i&&i._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const i=it(t).nextSibling;it(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class I{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,r,o){this.type=1,this._$AH=d,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=o,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=d}_$AI(t,e=this,i,r){const o=this.strings;let n=!1;if(o===void 0)t=k(this,t,e,0),n=!P(t)||t!==this._$AH&&t!==b,n&&(this._$AH=t);else{const a=t;let c,u;for(t=o[0],c=0;c<o.length-1;c++)u=k(this,a[i+c],e,c),u===b&&(u=this._$AH[c]),n||=!P(u)||u!==this._$AH[c],u===d?t=d:t!==d&&(t+=(u??"")+o[c+1]),this._$AH[c]=u}n&&!r&&this.j(t)}j(t){t===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Ot extends I{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===d?void 0:t}}class Pt extends I{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==d)}}class Rt extends I{constructor(t,e,i,r,o){super(t,e,i,r,o),this.type=5}_$AI(t,e=this){if((t=k(this,t,e,0)??d)===b)return;const i=this._$AH,r=t===d&&i!==d||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==d&&(i===d||r);r&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class Ht{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){k(this,t)}}const Ut=Q.litHtmlPolyfillSupport;Ut?.(R,H),(Q.litHtmlVersions??=[]).push("3.3.3");const qt=(s,t,e)=>{const i=e?.renderBefore??t;let r=i._$litPart$;if(r===void 0){const o=e?.renderBefore??null;i._$litPart$=r=new H(t.insertBefore(O(),o),o,void 0,e??{})}return r._$AI(s),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const J=globalThis;let M=class extends S{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=qt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return b}};M._$litElement$=!0,M.finalized=!0,J.litElementHydrateSupport?.({LitElement:M});const Bt=J.litElementPolyfillSupport;Bt?.({LitElement:M});(J.litElementVersions??=[]).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const E={ATTRIBUTE:1,PROPERTY:3,BOOLEAN_ATTRIBUTE:4},Dt=s=>(...t)=>({_$litDirective$:s,values:t});class zt{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const It=s=>s.strings===void 0,Ft={},jt=(s,t=Ft)=>s._$AH=t;/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const N=Dt(class extends zt{constructor(s){if(super(s),s.type!==E.PROPERTY&&s.type!==E.ATTRIBUTE&&s.type!==E.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!It(s))throw Error("`live` bindings can only contain a single expression")}render(s){return s}update(s,[t]){if(t===b||t===d)return t;const e=s.element,i=s.name;if(s.type===E.PROPERTY){if(t===e[i])return b}else if(s.type===E.BOOLEAN_ATTRIBUTE){if(!!t===e.hasAttribute(i))return b}else if(s.type===E.ATTRIBUTE&&e.getAttribute(i)===t+"")return b;return jt(s),t}});/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Vt={attribute:!0,type:String,converter:B,reflect:!1,hasChanged:Z},Wt=(s=Vt,t,e)=>{const{kind:i,metadata:r}=e;let o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),i==="setter"&&((s=Object.create(s)).wrapped=!0),o.set(e.name,s),i==="accessor"){const{name:n}=e;return{set(a){const c=t.get.call(this);t.set.call(this,a),this.requestUpdate(n,c,s,!0,a)},init(a){return a!==void 0&&this.C(n,void 0,s,a),a}}}if(i==="setter"){const{name:n}=e;return function(a){const c=this[n];t.call(this,a),this.requestUpdate(n,c,s,!0,a)}}throw Error("Unsupported decorator location: "+i)};function F(s){return(t,e)=>typeof e=="object"?Wt(s,t,e):((i,r,o)=>{const n=r.hasOwnProperty(o);return r.constructor.createProperty(o,i),n?Object.getOwnPropertyDescriptor(r,o):void 0})(s,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function $(s){return F({...s,state:!0,attribute:!1})}async function Kt(s){return s.connection.sendMessagePromise({type:"ready_home/settings"})}async function Zt(s,t){return s.connection.subscribeMessage(t,{type:"ready_home/subscribe"})}async function Qt(s,t){return s.connection.sendMessagePromise({type:"ready_home/barcode/lookup",barcode:t})}function mt(s,t){const e=s.trim().toLowerCase();return!e||!t?"none":(t.water_categories??[]).some(i=>i.trim().toLowerCase()===e)?"water":(t.food_categories??[]).some(i=>i.trim().toLowerCase()===e)?"food":"none"}function Yt(s,t){return t?t.expired.some(e=>e.id===s.id)?"expired":t.within_urgent.some(e=>e.id===s.id)?"urgent":t.within_expiring.some(e=>e.id===s.id)?"expiring":t.low_stock.some(e=>e.id===s.id)?"low":"":""}function Jt(s,t,e,i){let r=[...s];const o=i.search.trim().toLowerCase();if(o&&(r=r.filter(n=>n.name.toLowerCase().includes(o)||n.location.toLowerCase().includes(o)||n.category.toLowerCase().includes(o)||(n.barcode||"").toLowerCase().includes(o)||(n.notes||"").toLowerCase().includes(o))),i.filterLocation&&(r=r.filter(n=>n.location.toLowerCase()===i.filterLocation.toLowerCase())),i.filterCategory&&(r=r.filter(n=>n.category.toLowerCase()===i.filterCategory.toLowerCase())),i.filterReadiness&&(r=r.filter(n=>mt(n.category,e)===i.filterReadiness)),i.filterStatus!=="all"){const n=new Set;i.filterStatus==="expired"?t?.expired.forEach(a=>n.add(a.id)):i.filterStatus==="expiring"?(t?.within_urgent.forEach(a=>n.add(a.id)),t?.within_expiring.forEach(a=>n.add(a.id))):i.filterStatus==="low_stock"&&t?.low_stock.forEach(a=>n.add(a.id)),r=r.filter(a=>n.has(a.id))}return r.sort((n,a)=>i.sort==="quantity"?n.quantity-a.quantity:i.sort==="expiry"?(n.expiry_date||"9999").localeCompare(a.expiry_date||"9999"):n.name.localeCompare(a.name)),r}function ct(s,t){return s==null||Number.isNaN(Number(s))?"":Number(s)<=0?"bad":Number(s)<Number(t)?"warn":"ok"}var Gt=Object.defineProperty,m=(s,t,e,i)=>{for(var r=void 0,o=s.length-1,n;o>=0;o--)(n=s[o])&&(r=n(t,e,r)||r);return r&&Gt(t,e,r),r};const Xt="ready-home-panel",te="/api/ready_home/brand/icon.png",ee="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z",ie="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",re="M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1Z",se="M12,20A6,6 0 0,1 6,14C6,10 12,3.25 12,3.25C12,3.25 18,10 18,14A6,6 0 0,1 12,20Z",oe="M18.06 23H19.72C20.56 23 21.25 22.35 21.35 21.53L23 5.05H18V1H16.03V5.05H11.06L11.36 7.39C13.07 7.86 14.67 8.71 15.63 9.65C17.07 11.07 18.06 12.54 18.06 14.94V23M1 22V21H16.03V22C16.03 22.54 15.58 23 15 23H2C1.45 23 1 22.54 1 22M16.03 15C16.03 7 1 7 1 15H16.03M1 17H16V19H1V17Z",dt=["box","pack","piece"],ne=["gram","kilogram","liter","milliliter"],ae=["essential","important","optional"],le={expired:"Expired",urgent:"Urgent",expiring:"Expiring",low:"Low stock"};function U(s){return s&&s.charAt(0).toUpperCase()+s.slice(1)}class f extends M{constructor(){super(...arguments),this.narrow=!1,this._snapshot=null,this._settings=null,this._search="",this._filterStatus="all",this._filterLocation="",this._filterCategory="",this._filterReadiness="",this._filtersOpen=!1,this._sort="name",this._dialogOpen=!1,this._editing=null,this._form={},this._error="",this._fieldErrors={},this._busy=!1,this._unsub=null,this._connected=!1,this._resetFilters=()=>{this._filterLocation="",this._filterCategory="",this._filterReadiness=""},this._toggleMenu=t=>{t?.stopPropagation(),this.dispatchEvent(new CustomEvent("hass-toggle-menu",{bubbles:!0,composed:!0}))},this._openAdd=()=>{this._editing=null,this._form=this._blankForm(),this._fieldErrors={},this._error="",this._dialogOpen=!0},this._openEdit=t=>{this._editing=t;const e=dt.includes(t.unit)?t.unit:"piece";let i=t.contents_per_unit,r=t.contents_unit||"",o=t.calories_per_content;i==null&&t.liters_per_unit!=null&&(i=t.liters_per_unit,r="liter"),o==null&&t.calories_per_unit!=null&&i==null&&(i=1,r=r||"gram",o=t.calories_per_unit),this._form={name:t.name,quantity:String(t.quantity),desired_quantity:String(t.desired_quantity),unit:e,location:t.location,category:t.category,priority:t.priority,notes:t.notes||"",barcode:t.barcode||"",expiry_date:t.expiry_date||"",contents_per_unit:i!=null?String(i):"",contents_unit:r,calories_per_content:o!=null?String(o):""},this._fieldErrors={},this._error="",this._dialogOpen=!0},this._closeDialog=()=>{this._dialogOpen=!1,this._fieldErrors={},this._error=""},this._onWindowKeyDown=t=>{t.key!=="Escape"||!this._dialogOpen||(t.preventDefault(),this._closeDialog())}}connectedCallback(){super.connectedCallback(),this._connected=!0,window.addEventListener("keydown",this._onWindowKeyDown),this._connect()}disconnectedCallback(){super.disconnectedCallback(),this._connected=!1,window.removeEventListener("keydown",this._onWindowKeyDown),this._unsub?.(),this._unsub=null}updated(t){t.has("hass")&&this.hass&&!this._unsub&&this._connected&&this._connect()}async _connect(){if(!(!this.hass||this._unsub))try{this._settings=await Kt(this.hass),this._unsub=await Zt(this.hass,t=>{this._snapshot=t}),this._error=""}catch(t){this._error=String(t)}}get _assessment(){return this._snapshot?.assessment??{}}get _bucketCounts(){const t=this._snapshot?.buckets;return{expired:t?.expired.length??0,expiring:(t?.within_urgent.length??0)+(t?.within_expiring.length??0),low_stock:t?.low_stock.length??0}}get _activeFilterCount(){let t=0;return this._filterLocation&&(t+=1),this._filterCategory&&(t+=1),this._filterReadiness&&(t+=1),t}_readinessKind(t){return mt(t,this._settings)}get _items(){return Jt(this._snapshot?.items??[],this._snapshot?.buckets,this._settings,{search:this._search,filterStatus:this._filterStatus,filterLocation:this._filterLocation,filterCategory:this._filterCategory,filterReadiness:this._filterReadiness,sort:this._sort})}_itemStatus(t){return Yt(t,this._snapshot?.buckets)}_statusLabel(t){return le[t]||t}_setStatusFilter(t){this._filterStatus=this._filterStatus===t?"all":t}_pct(t){return t==null||Number.isNaN(Number(t))?"—":`${Math.round(Number(t))}%`}_formatHours(t){if(t==null||Number.isNaN(Number(t)))return"—";const e=Math.max(0,Math.round(Number(t)));return e<48?`${e}h`:`${Math.round(e/24)}d`}_formatAmount(t,e){if(t==null||Number.isNaN(Number(t)))return"—";const i=Number(t);return`${Math.abs(i-Math.round(i))<.05?Math.round(i):Math.round(i*10)/10} ${e}`}_durationHours(){return this._assessment.duration_hours??this._settings?.duration_hours??72}_statToneClass(t){const e=ct(t,this._durationHours());return e?`stat-${e}`:""}_durationClass(t){const e=ct(t,this._durationHours());return e==="bad"?"duration-bad":e==="warn"?"duration-warn":""}_expiryClass(t){return t==="expired"?"expiry-expired":t==="urgent"||t==="expiring"?"expiry-warn":""}_formatDate(t){if(!t)return"—";const e=/^(\d{4})-(\d{2})-(\d{2})$/.exec(t.trim());if(!e)return t;const i=new Date(Number(e[1]),Number(e[2])-1,Number(e[3]));if(Number.isNaN(i.getTime()))return t;const r=this.hass?.locale,o=r?.language||this.hass?.language||navigator.language||"en",n=r?.date_format??"language",a=n==="system"?void 0:o,c=new Intl.DateTimeFormat(a,{year:"numeric",month:"numeric",day:"numeric"});if(n==="language"||n==="system")return c.format(i);const u=c.formatToParts(i),l=u.find(x=>x.type==="literal")?.value??"/",p=u.find(x=>x.type==="day")?.value??"",g=u.find(x=>x.type==="month")?.value??"",_=u.find(x=>x.type==="year")?.value??"",v=u[u.length-1],j=v?.type==="literal"?v.value:"";return n==="DMY"?`${p}${l}${g}${l}${_}${j}`:n==="MDY"?`${g}${l}${p}${l}${_}${j}`:`${_}${l}${g}${l}${p}${j}`}_optionList(t,e){const i=new Set,r=[];for(const o of[...t,e]){const n=o?.trim();if(!n)continue;const a=n.toLowerCase();i.has(a)||(i.add(a),r.push(n))}return r}_mdButton(t,e){const i=e.variant??"outlined";return h`
      <button
        type="button"
        class="md-btn md-btn-${i}"
        ?disabled=${e.disabled??!1}
        @click=${e.onClick}
      >
        ${t}
      </button>
    `}render(){const t=this._items,e=this._assessment,i=this._settings?.locations??[],r=this._settings?.categories??[],o=e.overall_percent,n=e.water_percent,a=e.food_percent,c=this._bucketCounts,u=e.duration_hours??this._settings?.duration_hours??72,l=e.supply_hours,p=e.water_supply_hours,g=e.food_supply_hours;return h`
      <div class="page">
        <header class="header">
          <div class="header-row">
            <div class="brand">
              ${this.narrow?h`
                    <button
                      type="button"
                      class="icon-btn"
                      aria-label="Open menu"
                      @click=${this._toggleMenu}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="currentColor" d=${ee} />
                      </svg>
                    </button>
                  `:d}
              <img
                class="brand-icon"
                src=${te}
                alt=""
                width="40"
                height="40"
              />
              <div class="brand-text">
                <h1>Ready Home</h1>
                <p class="subtitle">${u}-hour emergency readiness</p>
              </div>
            </div>
            ${this._mdButton("Add item",{variant:"filled",disabled:this._busy,onClick:this._openAdd})}
          </div>
        </header>

        <div class="content">
          <div class="stats">
            <div class="stat ${this._statToneClass(l)}">
              <span class="stat-label">
                <svg class="stat-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d=${re} />
                </svg>
                Overall
              </span>
              <span class="stat-value">${this._pct(o)}</span>
              <span class="stat-duration ${this._durationClass(l)}"
                >Lasts ${this._formatHours(l)}</span
              >
            </div>
            <div class="stat ${this._statToneClass(p)}">
              <span class="stat-label">
                <svg class="stat-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d=${se} />
                </svg>
                Water
              </span>
              <span class="stat-value"
                >${this._formatAmount(e.water_on_hand,"L")}</span
              >
              <span class="stat-meta"
                >${this._pct(n)} · goal
                ${this._formatAmount(e.water_target,"L")}</span
              >
              <span class="stat-duration ${this._durationClass(p)}"
                >Lasts ${this._formatHours(p)}</span
              >
            </div>
            <div class="stat ${this._statToneClass(g)}">
              <span class="stat-label">
                <svg class="stat-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d=${oe} />
                </svg>
                Food
              </span>
              <span class="stat-value"
                >${this._formatAmount(e.food_on_hand,"kcal")}</span
              >
              <span class="stat-meta"
                >${this._pct(a)} · goal
                ${this._formatAmount(e.food_target,"kcal")}</span
              >
              <span class="stat-duration ${this._durationClass(g)}"
                >Lasts ${this._formatHours(g)}</span
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
              <span class="chip-count">${c.expired}</span>
            </button>
            <button
              type="button"
              class="chip ${this._filterStatus==="expiring"?"active":""}"
              @click=${()=>this._setStatusFilter("expiring")}
            >
              Expiring
              <span class="chip-count">${c.expiring}</span>
            </button>
            <button
              type="button"
              class="chip ${this._filterStatus==="low_stock"?"active":""}"
              @click=${()=>this._setStatusFilter("low_stock")}
            >
              Low stock
              <span class="chip-count">${c.low_stock}</span>
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
                  @input=${_=>{this._search=_.target.value}}
                />
                <select
                  class="sort"
                  .value=${this._sort}
                  @change=${_=>{this._sort=_.target.value}}
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
                  Filters${this._activeFilterCount?h` (${this._activeFilterCount})`:d}
                </button>
              </div>
              ${this._filtersOpen?h`
                    <div class="filters">
                      <select
                        .value=${this._filterLocation}
                        @change=${_=>{this._filterLocation=_.target.value}}
                      >
                        <option value="">All locations</option>
                        ${i.map(_=>h`<option value=${_}>${_}</option>`)}
                      </select>
                      <select
                        .value=${this._filterCategory}
                        @change=${_=>{this._filterCategory=_.target.value}}
                      >
                        <option value="">All categories</option>
                        ${r.map(_=>h`<option value=${_}>${_}</option>`)}
                      </select>
                      <select
                        .value=${this._filterReadiness}
                        @change=${_=>{this._filterReadiness=_.target.value}}
                      >
                        <option value="">All readiness</option>
                        <option value="water">Water</option>
                        <option value="food">Food</option>
                        <option value="none">Neither</option>
                      </select>
                      ${this._activeFilterCount?this._mdButton("Reset",{variant:"text",onClick:this._resetFilters}):d}
                    </div>
                  `:d}
              <div class="inventory-meta">
                <span class="item-count"
                  >${t.length}/${this._snapshot?.items.length??0}</span
                >
              </div>
            </div>

            ${this._error?h`<div class="error" role="alert">${this._error}</div>`:d}

            ${this.narrow?this._renderCardList(t):this._renderTable(t)}
          </section>
        </div>
      </div>

      ${this._dialogOpen?this._renderDialog():d}
    `}_renderEmpty(){return this._snapshot?h`
      <div class="empty">
        No items match.
        ${this._mdButton("Add an item",{variant:"text",onClick:this._openAdd})}
      </div>
    `:h`<div class="empty">Loading inventory…</div>`}_renderQtyText(t){return h`
      <span class="qty-text"
        >${t.quantity}${t.desired_quantity?h` / ${t.desired_quantity}`:d}
        ${t.unit}</span
      >
    `}_renderMeasure(t){const e=this._readinessKind(t.category);if(e==="food"){const i=this._itemCaloriesOnHand(t);return i==null?"":`${this._formatMeasureNumber(i)} kcal`}if(e==="water"){const i=this._itemLitersOnHand(t);return i==null?"":`${this._formatMeasureNumber(i)} L`}return""}_itemLitersOnHand(t){if(t.contents_per_unit!=null&&t.contents_unit){const e=this._contentsToLiters(t.contents_per_unit,t.contents_unit);if(e!=null)return t.quantity*e}return t.unit==="liter"?t.quantity:t.unit==="milliliter"?t.quantity/1e3:t.liters_per_unit!=null?t.quantity*t.liters_per_unit:null}_itemCaloriesOnHand(t){return t.contents_per_unit!=null&&t.calories_per_content!=null?t.quantity*t.contents_per_unit*t.calories_per_content:t.calories_per_unit!=null?t.quantity*t.calories_per_unit:null}_contentsToLiters(t,e){return e==="liter"?t:e==="milliliter"?t/1e3:null}_formatMeasureNumber(t){const e=Number(t);return Number.isNaN(e)?"—":Math.abs(e-Math.round(e))<.05?String(Math.round(e)):String(Math.round(e*100)/100)}_contentsUnitLabel(t){return U(t||"unit")}_formTotalContents(){const t=Number(this._form.quantity||0),e=Number(this._form.contents_per_unit||"");return!this._form.contents_per_unit||Number.isNaN(e)?null:t*e}_formTotalCalories(){const t=this._formTotalContents(),e=Number(this._form.calories_per_content||"");return t==null||!this._form.calories_per_content||Number.isNaN(e)?null:t*e}_formTotalLiters(){const t=this._formTotalContents();return t==null||!this._form.contents_unit?null:this._contentsToLiters(t,this._form.contents_unit)}_fieldLabel(t,e=!1){return h`<span class="field-label"
      >${t}${e?h`<span class="req" aria-hidden="true">*</span>`:d}</span
    >`}_fieldError(t){const e=this._fieldErrors[t];return e?h`<div class="field-error">${e}</div>`:d}_fieldInvalid(t){return!!this._fieldErrors[t]}_validateForm(){const t=this._form,e={};(t.name||"").trim()||(e.name="Name is required"),(t.location||"").trim()||(e.location="Location is required"),(t.category||"").trim()||(e.category="Category is required");const i=Number(t.quantity);(t.quantity===""||Number.isNaN(i)||i<0)&&(e.quantity="Enter a valid quantity"),(t.unit||"").trim()||(e.unit="Unit is required");const r=this._formReadiness();if(r==="food"||r==="water"){const o=Number(t.contents_per_unit);(t.contents_per_unit===""||Number.isNaN(o)||o<=0)&&(e.contents_per_unit="Contents per unit is required"),(t.contents_unit||"").trim()?r==="water"&&t.contents_unit!=="liter"&&t.contents_unit!=="milliliter"&&(e.contents_unit="Water contents must be liter or milliliter"):e.contents_unit="Contents unit is required"}if(r==="food"){const o=Number(t.calories_per_content);(t.calories_per_content===""||Number.isNaN(o)||o<0)&&(e.calories_per_content="Calories per contents unit is required")}return e}_renderStatusBadge(t){return t?h`<span class="badge badge-${t}"
      >${this._statusLabel(t)}</span
    >`:d}_renderTable(t){return h`
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Quantity</th>
              <th>L / kcal</th>
              <th>Location</th>
              <th>Category</th>
              <th>Expiry</th>
              <th class="actions-col"></th>
            </tr>
          </thead>
          <tbody>
            ${t.map(e=>this._renderRow(e))}
            ${t.length===0?h`<tr>
                  <td colspan="8">${this._renderEmpty()}</td>
                </tr>`:d}
          </tbody>
        </table>
      </div>
    `}_renderCardList(t){return t.length===0?this._renderEmpty():h`
      <div class="card-list">
        ${t.map(e=>this._renderItemCard(e))}
      </div>
    `}_renderRow(t){const e=this._itemStatus(t),i=this._renderMeasure(t);return h`
      <tr class=${e?`row-${e}`:""}>
        <td>
          <button class="link" @click=${()=>this._openEdit(t)}>
            ${t.name}
          </button>
        </td>
        <td class="status-col">${this._renderStatusBadge(e)}</td>
        <td>${this._renderQtyText(t)}</td>
        <td class="measure-col">${i}</td>
        <td>${t.location||"—"}</td>
        <td>${t.category||"—"}</td>
        <td class=${this._expiryClass(e)}>
          ${this._formatDate(t.expiry_date)}
        </td>
        <td class="actions">
          ${this._mdButton("Edit",{variant:"outlined",onClick:()=>this._openEdit(t)})}
          ${this._mdButton("Remove",{variant:"danger-text",disabled:this._busy,onClick:()=>void this._remove(t)})}
        </td>
      </tr>
    `}_renderItemCard(t){const e=this._itemStatus(t),i=this._renderMeasure(t),r=[t.location,t.category,i].filter(Boolean).join(" · ");return h`
      <article
        class="item-card ${e?`row-${e}`:""}"
        @click=${()=>this._openEdit(t)}
      >
        <div class="item-card-top">
          <div class="item-card-title">
            <span class="item-name">${t.name}</span>
            ${this._renderStatusBadge(e)}
          </div>
          <button
            type="button"
            class="md-btn md-btn-danger-text"
            ?disabled=${this._busy}
            @click=${o=>{o.stopPropagation(),this._remove(t)}}
          >
            Remove
          </button>
        </div>
        ${r?h`<div class="meta">${r}</div>`:d}
        <div class="item-card-bottom">
          ${this._renderQtyText(t)}
          ${t.expiry_date?h`<span class="${this._expiryClass(e)}"
                >${this._formatDate(t.expiry_date)}</span
              >`:d}
        </div>
      </article>
    `}_formReadiness(){return this._readinessKind(this._form.category||"")}_showContentsFields(){const t=this._formReadiness();return t==="food"||t==="water"}_showCaloriesField(){return this._formReadiness()==="food"}_renderDialog(){const t=this._form,e=this._optionList(this._settings?.locations??[],t.location||""),i=this._optionList(this._settings?.categories??[],t.category||""),r=this._formReadiness(),o=this._formTotalContents(),n=this._formTotalLiters(),a=this._formTotalCalories(),c=this._contentsUnitLabel(t.contents_unit||"unit");let u="";return o!=null&&t.contents_unit&&(u=`Total on hand: ${this._formatMeasureNumber(o)} ${c}`,n!=null&&(u+=` · ${this._formatMeasureNumber(n)} L`),a!=null&&(u+=` · ${this._formatMeasureNumber(a)} kcal`)),h`
      <div class="dialog-backdrop" @click=${this._closeDialog}>
        <div
          class="dialog ${this.narrow?"dialog-narrow":""}"
          role="dialog"
          aria-modal="true"
          aria-label=${this._editing?"Edit item":"Add item"}
          @click=${l=>l.stopPropagation()}
        >
          <div class="dialog-header">
            <h2>${this._editing?"Edit item":"Add item"}</h2>
            <button
              type="button"
              class="icon-btn dialog-close"
              aria-label="Close"
              @click=${this._closeDialog}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d=${ie} />
              </svg>
            </button>
          </div>

          <div class="form-section">
            <div class="form-section-title">Details</div>
            <label
              >${this._fieldLabel("Name",!0)}
              <input
                class=${this._fieldInvalid("name")?"invalid":""}
                .value=${t.name||""}
                @input=${this._onField("name")}
              />
              ${this._fieldError("name")}
            </label>
            <div class="row2">
              <label
                >${this._fieldLabel("Location",!0)}
                <select
                  class=${this._fieldInvalid("location")?"invalid":""}
                  .value=${N(t.location||"")}
                  @change=${this._onField("location")}
                >
                  <option value="" ?selected=${!t.location}>
                    Select location
                  </option>
                  ${e.map(l=>h`<option
                        value=${l}
                        ?selected=${(t.location||"")===l}
                      >
                        ${l}
                      </option>`)}
                </select>
                ${this._fieldError("location")}
              </label>
              <label
                >${this._fieldLabel("Category",!0)}
                <select
                  class=${this._fieldInvalid("category")?"invalid":""}
                  .value=${N(t.category||"")}
                  @change=${this._onField("category")}
                >
                  <option value="" ?selected=${!t.category}>
                    Select category
                  </option>
                  ${i.map(l=>h`<option
                        value=${l}
                        ?selected=${(t.category||"")===l}
                      >
                        ${l}
                      </option>`)}
                </select>
                ${this._fieldError("category")}
              </label>
            </div>
            <label
              >Priority
              <select
                .value=${N(t.priority||"important")}
                @change=${this._onField("priority")}
              >
                ${ae.map(l=>h`<option
                      value=${l}
                      ?selected=${(t.priority||"important")===l}
                    >
                      ${U(l)}
                    </option>`)}
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
            <div class="row3">
              <label
                >${this._fieldLabel("Quantity",!0)}
                <input
                  class=${this._fieldInvalid("quantity")?"invalid":""}
                  type="number"
                  min="0"
                  step="0.01"
                  .value=${t.quantity||"1"}
                  @input=${this._onField("quantity")}
                />
                ${this._fieldError("quantity")}
                ${u?h`<div class="field-hint">${u}</div>`:d}
              </label>
              <label
                >Desired quantity
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  .value=${t.desired_quantity||"0"}
                  @input=${this._onField("desired_quantity")}
                />
              </label>
              <label
                >${this._fieldLabel("Unit",!0)}
                <select
                  class=${this._fieldInvalid("unit")?"invalid":""}
                  .value=${N(t.unit||"piece")}
                  @change=${this._onField("unit")}
                >
                  ${dt.map(l=>h`<option
                        value=${l}
                        ?selected=${(t.unit||"piece")===l}
                      >
                        ${U(l)}
                      </option>`)}
                </select>
                ${this._fieldError("unit")}
              </label>
            </div>
            ${this._showContentsFields()?h`
                  <div class="row2">
                    <label
                      >${this._fieldLabel("Contents per unit",!0)}
                      <input
                        class=${this._fieldInvalid("contents_per_unit")?"invalid":""}
                        type="number"
                        min="0"
                        step="0.01"
                        .value=${t.contents_per_unit||""}
                        @input=${this._onField("contents_per_unit")}
                      />
                      ${this._fieldError("contents_per_unit")}
                      <div class="field-hint">
                        How much is in one bottle, can, or pack?
                      </div>
                    </label>
                    <label
                      >${this._fieldLabel("Contents unit",!0)}
                      <select
                        class=${this._fieldInvalid("contents_unit")?"invalid":""}
                        .value=${N(t.contents_unit||"")}
                        @change=${this._onField("contents_unit")}
                      >
                        <option value="" ?selected=${!t.contents_unit}>
                          Select unit
                        </option>
                        ${ne.map(l=>h`<option
                              value=${l}
                              ?selected=${(t.contents_unit||"")===l}
                            >
                              ${U(l)}
                            </option>`)}
                      </select>
                      ${this._fieldError("contents_unit")}
                      <div class="field-hint">
                        Liter, milliliter, gram, or kilogram for one stock unit.
                      </div>
                    </label>
                  </div>
                `:d}
            ${this._showCaloriesField()?h`
                  <label
                    >${this._fieldLabel(`Calories (kcal) per ${c}`,!0)}
                    <input
                      class=${this._fieldInvalid("calories_per_content")?"invalid":""}
                      type="number"
                      min="0"
                      step="0.01"
                      .value=${t.calories_per_content||""}
                      @input=${this._onField("calories_per_content")}
                    />
                    ${this._fieldError("calories_per_content")}
                    <div class="field-hint">
                      Calories per contents unit${a!=null?h` · Total calories on hand:
                            ${this._formatMeasureNumber(a)} kcal`:d}
                    </div>
                  </label>
                `:d}
            ${r==="none"?h`<div class="field-hint">
                  Category is not mapped to food or water — this item will not
                  count toward readiness.
                </div>`:d}
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

          ${this._error?h`<div class="error" role="alert">${this._error}</div>`:d}

          <div class="dialog-actions">
            ${this._mdButton("Cancel",{variant:"text",onClick:this._closeDialog})}
            ${this._mdButton("Save",{variant:"filled",disabled:this._busy,onClick:()=>void this._save()})}
          </div>
        </div>
      </div>
    `}_onField(t){return e=>{const i=e.target;if(this._form={...this._form,[t]:i.value},this._fieldErrors[t]){const r={...this._fieldErrors};delete r[t],this._fieldErrors=r}}}_blankForm(){return{name:"",quantity:"1",desired_quantity:"0",unit:"piece",location:"",category:"",priority:"important",notes:"",barcode:"",expiry_date:"",contents_per_unit:"",contents_unit:"",calories_per_content:""}}async _run(t){this._busy=!0,this._error="";try{await t()}catch(e){this._error=String(e)}finally{this._busy=!1}}async _remove(t){confirm(`Remove “${t.name}”?`)&&await this._run(()=>this.hass.callService("ready_home","remove_item",{item_id:t.id}))}async _save(){const t=this._validateForm();if(this._fieldErrors=t,Object.keys(t).length)return;const e=this._form,i=(e.name||"").trim(),r=this._formReadiness(),o={quantity:Number(e.quantity||0),desired_quantity:Number(e.desired_quantity||0),unit:e.unit||"piece",location:e.location||"",category:e.category||"",priority:e.priority||"important",barcode:e.barcode||"",notes:e.notes||""};e.expiry_date&&(o.expiry_date=e.expiry_date),r==="food"||r==="water"?(o.contents_per_unit=Number(e.contents_per_unit),o.contents_unit=e.contents_unit):(o.contents_per_unit=null,o.contents_unit=null,o.calories_per_content=null,o.liters_per_unit=null,o.calories_per_unit=null),r==="food"?o.calories_per_content=Number(e.calories_per_content):r==="water"&&(o.calories_per_content=null,o.calories_per_unit=null),await this._run(async()=>{this._editing?await this.hass.callService("ready_home","update_item",{item_id:this._editing.id,new_name:i,...o}):await this.hass.callService("ready_home","add_item",{name:i,...o}),this._dialogOpen=!1,this._fieldErrors={}})}async _lookupBarcode(){const t=this._form.barcode?.trim();if(t){this._busy=!0,this._error="";try{const e=await Qt(this.hass,t),i=[e.brand,e.name].filter(Boolean).join(" ").trim(),r=this._form.category?.trim()||(this._settings?.food_categories?.[0]??"Food");this._form={...this._form,name:i||this._form.name,category:r,contents_unit:this._form.contents_unit||"gram",calories_per_content:e.calories_per_100g!=null?String(Math.round(e.calories_per_100g/100*1e4)/1e4):this._form.calories_per_content}}catch(e){this._error=`Barcode lookup failed: ${e}`}finally{this._busy=!1}}}async _scanBarcode(){if(typeof BarcodeDetector>"u"){this._error="BarcodeDetector not supported in this browser — enter the code manually.";return}this._busy=!0,this._error="";try{const t=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}}),e=document.createElement("video");e.srcObject=t,await e.play();const i=new BarcodeDetector({formats:["ean_13","ean_8","upc_a","upc_e","code_128"]});await new Promise(o=>setTimeout(o,700));const r=await i.detect(e);t.getTracks().forEach(o=>o.stop()),r[0]?.rawValue?(this._form={...this._form,barcode:r[0].rawValue},this._busy=!1,await this._lookupBarcode()):this._error="No barcode detected — try again or enter manually."}catch(t){this._error=`Camera scan failed: ${t}`}finally{this._busy=!1}}static{this.styles=$t`
    :host {
      display: block;
      height: 100%;
      color: var(--primary-text-color);
      background: var(--primary-background-color, transparent);
      font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
      --rh-ready-color: #4ca448;
    }
    .page {
      height: 100%;
      overflow: auto;
      box-sizing: border-box;
    }
    .header {
      max-width: 1100px;
      margin: 0 auto;
      padding: 20px 24px 4px;
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
      gap: 14px;
      min-width: 0;
    }
    .brand-icon {
      width: 40px;
      height: 40px;
      border-radius: 6px;
      flex-shrink: 0;
      object-fit: contain;
    }
    .brand-text {
      min-width: 0;
    }
    .header h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 500;
      line-height: 1.2;
    }
    .subtitle {
      margin: 4px 0 0;
      font-size: 0.9rem;
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
      padding: 20px 24px 40px;
      box-sizing: border-box;
    }
    h2 {
      margin: 0 0 12px;
      font-size: 1.3rem;
      font-weight: 500;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      margin-bottom: 16px;
    }
    .stat {
      padding: 16px;
      border-radius: 8px;
      border-left: 3px solid var(--divider-color);
      background: var(--card-background-color, #fff);
      box-shadow: var(--ha-card-box-shadow, none);
    }
    .stat.stat-ok {
      border-left-color: var(--rh-ready-color);
    }
    .stat.stat-warn {
      border-left-color: var(--warning-color, #f57c00);
    }
    .stat.stat-bad {
      border-left-color: var(--error-color, #c62828);
    }
    .stat-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.85rem;
      color: var(--secondary-text-color);
      margin-bottom: 4px;
    }
    .stat-icon {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
      color: var(--secondary-text-color);
    }
    .stat.stat-ok .stat-icon {
      color: var(--rh-ready-color);
    }
    .stat.stat-warn .stat-icon {
      color: var(--warning-color, #f57c00);
    }
    .stat.stat-bad .stat-icon {
      color: var(--error-color, #c62828);
    }
    .stat-value {
      display: block;
      font-size: 1.5rem;
      font-weight: 600;
    }
    .stat-meta,
    .stat-duration {
      display: block;
      margin-top: 4px;
      font-size: 0.85rem;
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
      gap: 10px;
      margin-bottom: 16px;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      border-radius: 999px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color, transparent);
      color: var(--primary-text-color);
      cursor: pointer;
      font: inherit;
      font-size: 0.9rem;
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
      padding: 16px;
      box-sizing: border-box;
    }
    .toolbar {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 16px;
    }
    .toolbar-row {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      gap: 10px;
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
      align-items: center;
      gap: 10px;
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
      font-size: 1rem;
    }
    th,
    td {
      text-align: left;
      padding: 12px 14px;
      border-bottom: 1px solid var(--divider-color);
      vertical-align: middle;
    }
    th.actions-col,
    td.actions {
      text-align: right;
    }
    .status-col {
      white-space: nowrap;
    }
    .measure-col {
      white-space: nowrap;
      color: var(--secondary-text-color);
      font-size: 0.9rem;
    }
    tbody tr:last-child td {
      border-bottom: none;
    }
    .card-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .item-card {
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      padding: 16px;
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
      font-size: 1.05rem;
    }
    .item-card-bottom {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      gap: 8px;
    }
    .meta {
      font-size: 0.85rem;
      color: var(--secondary-text-color);
      margin-top: 4px;
      display: flex;
      gap: 6px;
      align-items: center;
      flex-wrap: wrap;
    }
    .badge {
      letter-spacing: 0.02em;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 2px 8px;
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
      justify-content: flex-end;
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
      padding: 20px;
      border-radius: 12px;
      width: min(520px, 100%);
      max-height: 90vh;
      overflow: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      box-sizing: border-box;
    }
    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .dialog-header h2 {
      margin: 0;
      flex: 1;
      min-width: 0;
    }
    .dialog-close {
      flex-shrink: 0;
      margin: -8px -8px -8px 0;
    }
    .dialog.dialog-narrow {
      width: 100%;
      max-height: 100%;
      border-radius: 12px;
      padding: 20px;
      padding-bottom: calc(20px + env(safe-area-inset-bottom, 0px));
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
      gap: 12px;
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
      font-size: 0.9rem;
    }
    .field-label {
      display: block;
      line-height: 1.3;
    }
    .row2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .row3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12px;
    }
    .req {
      color: var(--error-color, #c62828);
      margin-left: 2px;
    }
    .field-error {
      color: var(--error-color, #c62828);
      font-size: 0.75rem;
      margin-top: 2px;
    }
    .dialog input.invalid,
    .dialog select.invalid {
      border-color: var(--error-color, #c62828);
    }
    .dialog input.invalid:focus,
    .dialog select.invalid:focus {
      outline: none;
      border-color: var(--error-color, #c62828);
      box-shadow: 0 0 0 1px var(--error-color, #c62828);
    }
    .field-hint {
      color: var(--secondary-text-color);
      font-size: 0.75rem;
      margin-top: 4px;
      line-height: 1.35;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
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
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 6px;
        margin-bottom: 12px;
      }
      .stat {
        padding: 8px 6px;
      }
      .stat-label {
        font-size: 0.7rem;
        gap: 4px;
        margin-bottom: 2px;
      }
      .stat-icon {
        width: 14px;
        height: 14px;
      }
      .stat-value {
        font-size: 1.15rem;
      }
      .stat-meta,
      .stat-duration {
        font-size: 0.7rem;
        margin-top: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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
      .row2,
      .row3 {
        grid-template-columns: 1fr;
      }
    }
  `}}m([F({attribute:!1})],f.prototype,"hass");m([F({type:Boolean})],f.prototype,"narrow");m([F({attribute:!1})],f.prototype,"panel");m([$()],f.prototype,"_snapshot");m([$()],f.prototype,"_settings");m([$()],f.prototype,"_search");m([$()],f.prototype,"_filterStatus");m([$()],f.prototype,"_filterLocation");m([$()],f.prototype,"_filterCategory");m([$()],f.prototype,"_filterReadiness");m([$()],f.prototype,"_filtersOpen");m([$()],f.prototype,"_sort");m([$()],f.prototype,"_dialogOpen");m([$()],f.prototype,"_editing");m([$()],f.prototype,"_form");m([$()],f.prototype,"_error");m([$()],f.prototype,"_fieldErrors");m([$()],f.prototype,"_busy");try{customElements.define(Xt,f)}catch{}
//# sourceMappingURL=ready-home-panel.js.map
