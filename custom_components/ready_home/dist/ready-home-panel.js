/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const H=globalThis,F=H.ShadowRoot&&(H.ShadyCSS===void 0||H.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,B=Symbol(),Z=new WeakMap;let st=class{constructor(t,i,r){if(this._$cssResult$=!0,r!==B)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=i}get styleSheet(){let t=this.o;const i=this.t;if(F&&t===void 0){const r=i!==void 0&&i.length===1;r&&(t=Z.get(i)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&Z.set(i,t))}return t}toString(){return this.cssText}};const ct=e=>new st(typeof e=="string"?e:e+"",void 0,B),dt=(e,...t)=>{const i=e.length===1?e[0]:t.reduce((r,s,o)=>r+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+e[o+1],e[0]);return new st(i,e,B)},ht=(e,t)=>{if(F)e.adoptedStyleSheets=t.map(i=>i instanceof CSSStyleSheet?i:i.styleSheet);else for(const i of t){const r=document.createElement("style"),s=H.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=i.cssText,e.appendChild(r)}},K=F?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let i="";for(const r of t.cssRules)i+=r.cssText;return ct(i)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:pt,defineProperty:ut,getOwnPropertyDescriptor:_t,getOwnPropertyNames:ft,getOwnPropertySymbols:gt,getPrototypeOf:mt}=Object,T=globalThis,Q=T.trustedTypes,yt=Q?Q.emptyScript:"",$t=T.reactiveElementPolyfillSupport,E=(e,t)=>e,R={toAttribute(e,t){switch(t){case Boolean:e=e?yt:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=e!==null;break;case Number:i=e===null?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch{i=null}}return i}},j=(e,t)=>!pt(e,t),G={attribute:!0,type:String,converter:R,reflect:!1,useDefault:!1,hasChanged:j};Symbol.metadata??=Symbol("metadata"),T.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,i=G){if(i.state&&(i.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((i=Object.create(i)).wrapped=!0),this.elementProperties.set(t,i),!i.noAccessor){const r=Symbol(),s=this.getPropertyDescriptor(t,r,i);s!==void 0&&ut(this.prototype,t,s)}}static getPropertyDescriptor(t,i,r){const{get:s,set:o}=_t(this.prototype,t)??{get(){return this[i]},set(a){this[i]=a}};return{get:s,set(a){const l=s?.call(this);o?.call(this,a),this.requestUpdate(t,l,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??G}static _$Ei(){if(this.hasOwnProperty(E("elementProperties")))return;const t=mt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(E("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(E("properties"))){const i=this.properties,r=[...ft(i),...gt(i)];for(const s of r)this.createProperty(s,i[s])}const t=this[Symbol.metadata];if(t!==null){const i=litPropertyMetadata.get(t);if(i!==void 0)for(const[r,s]of i)this.elementProperties.set(r,s)}this._$Eh=new Map;for(const[i,r]of this.elementProperties){const s=this._$Eu(i,r);s!==void 0&&this._$Eh.set(s,i)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const i=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const s of r)i.unshift(K(s))}else t!==void 0&&i.push(K(t));return i}static _$Eu(t,i){const r=i.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,i=this.constructor.elementProperties;for(const r of i.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ht(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,i,r){this._$AK(t,r)}_$ET(t,i){const r=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,r);if(s!==void 0&&r.reflect===!0){const o=(r.converter?.toAttribute!==void 0?r.converter:R).toAttribute(i,r.type);this._$Em=t,o==null?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,i){const r=this.constructor,s=r._$Eh.get(t);if(s!==void 0&&this._$Em!==s){const o=r.getPropertyOptions(s),a=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:R;this._$Em=s;const l=a.fromAttribute(i,o.type);this[s]=l??this._$Ej?.get(s)??l,this._$Em=null}}requestUpdate(t,i,r,s=!1,o){if(t!==void 0){const a=this.constructor;if(s===!1&&(o=this[t]),r??=a.getPropertyOptions(t),!((r.hasChanged??j)(o,i)||r.useDefault&&r.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,r))))return;this.C(t,i,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,i,{useDefault:r,reflect:s,wrapped:o},a){r&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??i??this[t]),o!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(i=void 0),this._$AL.set(t,i)),s===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(i){Promise.reject(i)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[s,o]of this._$Ep)this[s]=o;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[s,o]of r){const{wrapped:a}=o,l=this[s];a!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,o,l)}}let t=!1;const i=this._$AL;try{t=this.shouldUpdate(i),t?(this.willUpdate(i),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(i)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(i)}willUpdate(t){}_$AE(t){this._$EO?.forEach(i=>i.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(i=>this._$ET(i,this[i])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[E("elementProperties")]=new Map,w[E("finalized")]=new Map,$t?.({ReactiveElement:w}),(T.reactiveElementVersions??=[]).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const I=globalThis,J=e=>e,U=I.trustedTypes,X=U?U.createPolicy("lit-html",{createHTML:e=>e}):void 0,ot="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,at="?"+$,bt=`<${at}>`,x=document,L=()=>x.createComment(""),N=e=>e===null||typeof e!="object"&&typeof e!="function",V=Array.isArray,vt=e=>V(e)||typeof e?.[Symbol.iterator]=="function",q=`[ 	
\f\r]`,S=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Y=/-->/g,tt=/>/g,b=RegExp(`>|${q}(?:([^\\s"'>=/]+)(${q}*=${q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),et=/'/g,it=/"/g,nt=/^(?:script|style|textarea|title)$/i,xt=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),h=xt(1),A=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),rt=new WeakMap,v=x.createTreeWalker(x,129);function lt(e,t){if(!V(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return X!==void 0?X.createHTML(t):t}const wt=(e,t)=>{const i=e.length-1,r=[];let s,o=t===2?"<svg>":t===3?"<math>":"",a=S;for(let l=0;l<i;l++){const n=e[l];let u,f,d=-1,p=0;for(;p<n.length&&(a.lastIndex=p,f=a.exec(n),f!==null);)p=a.lastIndex,a===S?f[1]==="!--"?a=Y:f[1]!==void 0?a=tt:f[2]!==void 0?(nt.test(f[2])&&(s=RegExp("</"+f[2],"g")),a=b):f[3]!==void 0&&(a=b):a===b?f[0]===">"?(a=s??S,d=-1):f[1]===void 0?d=-2:(d=a.lastIndex-f[2].length,u=f[1],a=f[3]===void 0?b:f[3]==='"'?it:et):a===it||a===et?a=b:a===Y||a===tt?a=S:(a=b,s=void 0);const y=a===b&&e[l+1].startsWith("/>")?" ":"";o+=a===S?n+bt:d>=0?(r.push(u),n.slice(0,d)+ot+n.slice(d)+$+y):n+$+(d===-2?l:y)}return[lt(e,o+(e[i]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};class P{constructor({strings:t,_$litType$:i},r){let s;this.parts=[];let o=0,a=0;const l=t.length-1,n=this.parts,[u,f]=wt(t,i);if(this.el=P.createElement(u,r),v.currentNode=this.el.content,i===2||i===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(s=v.nextNode())!==null&&n.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(const d of s.getAttributeNames())if(d.endsWith(ot)){const p=f[a++],y=s.getAttribute(d).split($),O=/([.?@])?(.*)/.exec(p);n.push({type:1,index:o,name:O[2],strings:y,ctor:O[1]==="."?Ct:O[1]==="?"?St:O[1]==="@"?Et:z}),s.removeAttribute(d)}else d.startsWith($)&&(n.push({type:6,index:o}),s.removeAttribute(d));if(nt.test(s.tagName)){const d=s.textContent.split($),p=d.length-1;if(p>0){s.textContent=U?U.emptyScript:"";for(let y=0;y<p;y++)s.append(d[y],L()),v.nextNode(),n.push({type:2,index:++o});s.append(d[p],L())}}}else if(s.nodeType===8)if(s.data===at)n.push({type:2,index:o});else{let d=-1;for(;(d=s.data.indexOf($,d+1))!==-1;)n.push({type:7,index:o}),d+=$.length-1}o++}}static createElement(t,i){const r=x.createElement("template");return r.innerHTML=t,r}}function C(e,t,i=e,r){if(t===A)return t;let s=r!==void 0?i._$Co?.[r]:i._$Cl;const o=N(t)?void 0:t._$litDirective$;return s?.constructor!==o&&(s?._$AO?.(!1),o===void 0?s=void 0:(s=new o(e),s._$AT(e,i,r)),r!==void 0?(i._$Co??=[])[r]=s:i._$Cl=s),s!==void 0&&(t=C(e,s._$AS(e,t.values),s,r)),t}class At{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:r}=this._$AD,s=(t?.creationScope??x).importNode(i,!0);v.currentNode=s;let o=v.nextNode(),a=0,l=0,n=r[0];for(;n!==void 0;){if(a===n.index){let u;n.type===2?u=new M(o,o.nextSibling,this,t):n.type===1?u=new n.ctor(o,n.name,n.strings,this,t):n.type===6&&(u=new kt(o,this,t)),this._$AV.push(u),n=r[++l]}a!==n?.index&&(o=v.nextNode(),a++)}return v.currentNode=x,s}p(t){let i=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,i),i+=r.strings.length-2):r._$AI(t[i])),i++}}class M{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,r,s){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=r,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return i!==void 0&&t?.nodeType===11&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=C(this,t,i),N(t)?t===c||t==null||t===""?(this._$AH!==c&&this._$AR(),this._$AH=c):t!==this._$AH&&t!==A&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):vt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==c&&N(this._$AH)?this._$AA.nextSibling.data=t:this.T(x.createTextNode(t)),this._$AH=t}$(t){const{values:i,_$litType$:r}=t,s=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=P.createElement(lt(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===s)this._$AH.p(i);else{const o=new At(s,this),a=o.u(this.options);o.p(i),this.T(a),this._$AH=o}}_$AC(t){let i=rt.get(t.strings);return i===void 0&&rt.set(t.strings,i=new P(t)),i}k(t){V(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let r,s=0;for(const o of t)s===i.length?i.push(r=new M(this.O(L()),this.O(L()),this,this.options)):r=i[s],r._$AI(o),s++;s<i.length&&(this._$AR(r&&r._$AB.nextSibling,s),i.length=s)}_$AR(t=this._$AA.nextSibling,i){for(this._$AP?.(!1,!0,i);t!==this._$AB;){const r=J(t).nextSibling;J(t).remove(),t=r}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class z{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,r,s,o){this.type=1,this._$AH=c,this._$AN=void 0,this.element=t,this.name=i,this._$AM=s,this.options=o,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=c}_$AI(t,i=this,r,s){const o=this.strings;let a=!1;if(o===void 0)t=C(this,t,i,0),a=!N(t)||t!==this._$AH&&t!==A,a&&(this._$AH=t);else{const l=t;let n,u;for(t=o[0],n=0;n<o.length-1;n++)u=C(this,l[r+n],i,n),u===A&&(u=this._$AH[n]),a||=!N(u)||u!==this._$AH[n],u===c?t=c:t!==c&&(t+=(u??"")+o[n+1]),this._$AH[n]=u}a&&!s&&this.j(t)}j(t){t===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Ct extends z{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===c?void 0:t}}class St extends z{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==c)}}class Et extends z{constructor(t,i,r,s,o){super(t,i,r,s,o),this.type=5}_$AI(t,i=this){if((t=C(this,t,i,0)??c)===A)return;const r=this._$AH,s=t===c&&r!==c||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,o=t!==c&&(r===c||s);s&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class kt{constructor(t,i,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){C(this,t)}}const Lt=I.litHtmlPolyfillSupport;Lt?.(P,M),(I.litHtmlVersions??=[]).push("3.3.3");const Nt=(e,t,i)=>{const r=i?.renderBefore??t;let s=r._$litPart$;if(s===void 0){const o=i?.renderBefore??null;r._$litPart$=s=new M(t.insertBefore(L(),o),o,void 0,i??{})}return s._$AI(e),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const W=globalThis;class k extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Nt(i,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return A}}k._$litElement$=!0,k.finalized=!0,W.litElementHydrateSupport?.({LitElement:k});const Pt=W.litElementPolyfillSupport;Pt?.({LitElement:k});(W.litElementVersions??=[]).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Mt=e=>(t,i)=>{i!==void 0?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ot={attribute:!0,type:String,converter:R,reflect:!1,hasChanged:j},Ht=(e=Ot,t,i)=>{const{kind:r,metadata:s}=i;let o=globalThis.litPropertyMetadata.get(s);if(o===void 0&&globalThis.litPropertyMetadata.set(s,o=new Map),r==="setter"&&((e=Object.create(e)).wrapped=!0),o.set(i.name,e),r==="accessor"){const{name:a}=i;return{set(l){const n=t.get.call(this);t.set.call(this,l),this.requestUpdate(a,n,e,!0,l)},init(l){return l!==void 0&&this.C(a,void 0,e,l),l}}}if(r==="setter"){const{name:a}=i;return function(l){const n=this[a];t.call(this,l),this.requestUpdate(a,n,e,!0,l)}}throw Error("Unsupported decorator location: "+r)};function D(e){return(t,i)=>typeof i=="object"?Ht(e,t,i):((r,s,o)=>{const a=s.hasOwnProperty(o);return s.constructor.createProperty(o,r),a?Object.getOwnPropertyDescriptor(s,o):void 0})(e,t,i)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function m(e){return D({...e,state:!0,attribute:!1})}async function Rt(e){return e.connection.sendMessagePromise({type:"ready_home/settings"})}async function Ut(e,t){return e.connection.subscribeMessage(t,{type:"ready_home/subscribe"})}async function Tt(e,t){return e.connection.sendMessagePromise({type:"ready_home/barcode/lookup",barcode:t})}var zt=Object.defineProperty,Dt=Object.getOwnPropertyDescriptor,g=(e,t,i,r)=>{for(var s=r>1?void 0:r?Dt(t,i):t,o=e.length-1,a;o>=0;o--)(a=e[o])&&(s=(r?a(t,i,s):a(s))||s);return r&&s&&zt(t,i,s),s};const qt=["piece","pack","box","gram","kilogram","liter","milliliter"],Ft="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z",Bt="M6,13H18V11H6M3,6V8H21V6M10,18H14V16H10V18Z",jt="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z",It="M12,20A6,6 0 0,1 6,14C6,10 12,3.25 12,3.25C12,3.25 18,10 18,14A6,6 0 0,1 12,20Z",Vt="M20,10C22,13 17,22 15,22C13,22 13,21 12,21C11,21 11,22 9,22C7,22 2,13 4,10C6,7 9,7 11,8V5C11,3.9 11.9,3 13,3H14V5H13V8C15,7 18,7 20,10Z",Wt={expired:"Expired",urgent:"Urgent",expiring:"Expiring",low:"Low stock"};let _=class extends k{constructor(){super(...arguments),this.narrow=!1,this._snapshot=null,this._settings=null,this._search="",this._filterStatus="all",this._filterLocation="",this._filterCategory="",this._filterReadiness="",this._filtersOpen=!1,this._sort="name",this._dialogOpen=!1,this._editing=null,this._form={},this._error="",this._busy=!1,this._unsub=null,this._connected=!1,this._openAdd=()=>{this._editing=null,this._form={name:"",quantity:"1",desired_quantity:"0",unit:"piece",location:"",category:"",priority:"important",notes:"",barcode:"",expiry_date:"",liters_per_unit:"",calories_per_unit:""},this._error="",this._dialogOpen=!0},this._openEdit=e=>{this._editing=e,this._form={name:e.name,quantity:String(e.quantity),desired_quantity:String(e.desired_quantity),unit:e.unit,location:e.location,category:e.category,priority:e.priority,notes:e.notes||"",barcode:e.barcode||"",expiry_date:e.expiry_date||"",liters_per_unit:e.liters_per_unit!=null?String(e.liters_per_unit):"",calories_per_unit:e.calories_per_unit!=null?String(e.calories_per_unit):""},this._error="",this._dialogOpen=!0},this._closeDialog=()=>{this._dialogOpen=!1}}connectedCallback(){super.connectedCallback(),this._connected=!0,this._connect()}disconnectedCallback(){super.disconnectedCallback(),this._connected=!1,this._unsub?.(),this._unsub=null}updated(e){e.has("hass")&&this.hass&&!this._unsub&&this._connected&&this._connect()}async _connect(){if(!(!this.hass||this._unsub))try{this._settings=await Rt(this.hass),this._unsub=await Ut(this.hass,e=>{this._snapshot=e}),this._error=""}catch(e){this._error=String(e)}}get _assessment(){return this._snapshot?.assessment??{}}get _bucketCounts(){const e=this._snapshot?.buckets;return{expired:e?.expired.length??0,expiring:(e?.within_urgent.length??0)+(e?.within_expiring.length??0),low_stock:e?.low_stock.length??0}}get _activeFilterCount(){let e=0;return this._filterLocation&&(e+=1),this._filterCategory&&(e+=1),this._filterReadiness&&(e+=1),e}_readinessKind(e){const t=e.trim().toLowerCase();return!t||!this._settings?"none":(this._settings.water_categories??[]).some(i=>i.trim().toLowerCase()===t)?"water":(this._settings.food_categories??[]).some(i=>i.trim().toLowerCase()===t)?"food":"none"}get _items(){let e=[...this._snapshot?.items??[]];const t=this._search.trim().toLowerCase();if(t&&(e=e.filter(i=>i.name.toLowerCase().includes(t)||i.location.toLowerCase().includes(t)||i.category.toLowerCase().includes(t)||(i.barcode||"").toLowerCase().includes(t)||(i.notes||"").toLowerCase().includes(t))),this._filterLocation&&(e=e.filter(i=>i.location.toLowerCase()===this._filterLocation.toLowerCase())),this._filterCategory&&(e=e.filter(i=>i.category.toLowerCase()===this._filterCategory.toLowerCase())),this._filterReadiness&&(e=e.filter(i=>this._readinessKind(i.category)===this._filterReadiness)),this._filterStatus!=="all"){const i=this._snapshot?.buckets,r=new Set;this._filterStatus==="expired"?i?.expired.forEach(s=>r.add(s.id)):this._filterStatus==="expiring"?(i?.within_urgent.forEach(s=>r.add(s.id)),i?.within_expiring.forEach(s=>r.add(s.id))):this._filterStatus==="low_stock"&&i?.low_stock.forEach(s=>r.add(s.id)),e=e.filter(s=>r.has(s.id))}return e.sort((i,r)=>this._sort==="quantity"?i.quantity-r.quantity:this._sort==="expiry"?(i.expiry_date||"9999").localeCompare(r.expiry_date||"9999"):i.name.localeCompare(r.name)),e}_itemStatus(e){const t=this._snapshot?.buckets;return t?t.expired.some(i=>i.id===e.id)?"expired":t.within_urgent.some(i=>i.id===e.id)?"urgent":t.within_expiring.some(i=>i.id===e.id)?"expiring":t.low_stock.some(i=>i.id===e.id)?"low":"":""}_statusLabel(e){return Wt[e]||e}_setStatusFilter(e){this._filterStatus=this._filterStatus===e?"all":e}_pct(e){return e==null||Number.isNaN(Number(e))?"—":`${Math.round(Number(e))}%`}_formatHours(e){if(e==null||Number.isNaN(Number(e)))return"—";const t=Math.max(0,Math.round(Number(e)));if(t<48)return`${t} hour${t===1?"":"s"}`;const i=Math.round(t/24);return`${i} day${i===1?"":"s"}`}_formatAmount(e,t){if(e==null||Number.isNaN(Number(e)))return"—";const i=Number(e);return`${Math.abs(i-Math.round(i))<.05?Math.round(i):Math.round(i*10)/10} ${t}`}_durationClass(e){const t=this._assessment.duration_hours??this._settings?.duration_hours??72;return e==null||Number.isNaN(Number(e))?"":Number(e)<=0?"duration-bad":Number(e)<Number(t)?"duration-warn":"duration-ok"}render(){const e=this._items,t=this._assessment,i=this._settings?.locations??[],r=this._settings?.categories??[],s=t.overall_percent,o=t.water_percent,a=t.food_percent,l=this._bucketCounts,n=t.duration_hours??this._settings?.duration_hours??72,u=t.supply_hours,f=t.water_supply_hours,d=t.food_supply_hours;return h`
      <ha-top-app-bar-fixed>
        <ha-menu-button
          slot="navigationIcon"
          .hass=${this.hass}
          .narrow=${this.narrow}
        ></ha-menu-button>
        <div slot="title">Ready Home</div>
        <ha-icon-button
          slot="actionItems"
          .path=${Ft}
          .label=${"Add item"}
          ?disabled=${this._busy}
          @click=${this._openAdd}
        ></ha-icon-button>

        <div class="content">
          <div class="section-head">
            <h1>Home readiness</h1>
            <p class="subtitle">${n}-hour readiness</p>
          </div>

          <div class="stats">
            <ha-card class="stat-card">
              <div class="stat-inner">
                <div class="stat-title">
                  <ha-svg-icon .path=${jt}></ha-svg-icon>
                  Overall readiness
                </div>
                <div class="stat-value">${this._pct(s)}</div>
                <div class="stat-duration ${this._durationClass(u)}">
                  Lasts ${this._formatHours(u)}
                  · Lowest of food and water
                </div>
              </div>
            </ha-card>
            <ha-card class="stat-card">
              <div class="stat-inner">
                <div class="stat-title">
                  <ha-svg-icon .path=${It}></ha-svg-icon>
                  Water
                </div>
                <div class="stat-row">
                  <span class="stat-value"
                    >${this._formatAmount(t.water_on_hand,"L")}</span
                  >
                  <span class="stat-goal"
                    >Goal ${this._formatAmount(t.water_target,"L")}</span
                  >
                </div>
                <div class="stat-meta">${this._pct(o)} ready</div>
                <div class="stat-duration ${this._durationClass(f)}">
                  Lasts ${this._formatHours(f)}
                </div>
              </div>
            </ha-card>
            <ha-card class="stat-card">
              <div class="stat-inner">
                <div class="stat-title">
                  <ha-svg-icon .path=${Vt}></ha-svg-icon>
                  Food
                </div>
                <div class="stat-row">
                  <span class="stat-value"
                    >${this._formatAmount(t.food_on_hand,"kcal")}</span
                  >
                  <span class="stat-goal"
                    >Goal ${this._formatAmount(t.food_target,"kcal")}</span
                  >
                </div>
                <div class="stat-meta">${this._pct(a)} ready</div>
                <div class="stat-duration ${this._durationClass(d)}">
                  Lasts ${this._formatHours(d)}
                </div>
              </div>
            </ha-card>
          </div>

          <div class="attention" role="group" aria-label="Attention filters">
            <button
              type="button"
              class="chip ${this._filterStatus==="expired"?"active":""}"
              @click=${()=>this._setStatusFilter("expired")}
            >
              Expired
              <span class="chip-count">${l.expired}</span>
            </button>
            <button
              type="button"
              class="chip ${this._filterStatus==="expiring"?"active":""}"
              @click=${()=>this._setStatusFilter("expiring")}
            >
              Expiring
              <span class="chip-count">${l.expiring}</span>
            </button>
            <button
              type="button"
              class="chip ${this._filterStatus==="low_stock"?"active":""}"
              @click=${()=>this._setStatusFilter("low_stock")}
            >
              Low stock
              <span class="chip-count">${l.low_stock}</span>
            </button>
          </div>

          <div class="toolbar">
            <input
              class="search"
              type="search"
              placeholder="Search name, location, barcode…"
              .value=${this._search}
              @input=${p=>{this._search=p.target.value}}
            />
            <div class="toolbar-row">
              <select
                class="sort"
                .value=${this._sort}
                @change=${p=>{this._sort=p.target.value}}
              >
                <option value="name">Sort: name</option>
                <option value="expiry">Sort: expiry</option>
                <option value="quantity">Sort: quantity</option>
              </select>
              <button
                type="button"
                class="filters-btn ${this._filtersOpen||this._activeFilterCount?"active":""}"
                @click=${()=>{this._filtersOpen=!this._filtersOpen}}
              >
                <ha-svg-icon .path=${Bt}></ha-svg-icon>
                Filters
                ${this._activeFilterCount?h`<span class="filter-badge">${this._activeFilterCount}</span>`:c}
              </button>
              <span class="item-count"
                >${e.length} of ${this._snapshot?.items.length??0}</span
              >
            </div>
            ${this._filtersOpen?h`
                  <div class="filters">
                    <select
                      .value=${this._filterLocation}
                      @change=${p=>{this._filterLocation=p.target.value}}
                    >
                      <option value="">All locations</option>
                      ${i.map(p=>h`<option value=${p}>${p}</option>`)}
                    </select>
                    <select
                      .value=${this._filterCategory}
                      @change=${p=>{this._filterCategory=p.target.value}}
                    >
                      <option value="">All categories</option>
                      ${r.map(p=>h`<option value=${p}>${p}</option>`)}
                    </select>
                    <select
                      .value=${this._filterReadiness}
                      @change=${p=>{this._filterReadiness=p.target.value}}
                    >
                      <option value="">All readiness</option>
                      <option value="water">Water</option>
                      <option value="food">Food</option>
                      <option value="none">Neither</option>
                    </select>
                    ${this._activeFilterCount?h`<button
                          type="button"
                          class="link"
                          @click=${()=>{this._filterLocation="",this._filterCategory="",this._filterReadiness=""}}
                        >
                          Clear filters
                        </button>`:c}
                  </div>
                `:c}
          </div>

          ${this._error?h`<div class="error" role="alert">${this._error}</div>`:c}

          ${this.narrow?this._renderCardList(e):this._renderTable(e)}
        </div>
      </ha-top-app-bar-fixed>

      ${this._dialogOpen?this._renderDialog():c}
    `}_renderEmpty(){return this._snapshot?h`
      <div class="empty">
        No items match.
        <button class="link" @click=${this._openAdd}>Add an item</button>
      </div>
    `:h`<div class="empty">Loading inventory…</div>`}_renderQtyText(e){return h`
      <span class="qty-text"
        >${e.quantity}${e.desired_quantity?h` / ${e.desired_quantity}`:c}
        ${e.unit}</span
      >
    `}_expiryClass(e){return e==="expired"?"expiry-expired":e==="urgent"||e==="expiring"?"expiry-warn":""}_renderTable(e){return h`
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
            ${e.map(t=>this._renderRow(t))}
            ${e.length===0?h`<tr>
                  <td colspan="6">${this._renderEmpty()}</td>
                </tr>`:c}
          </tbody>
        </table>
      </div>
    `}_renderCardList(e){return e.length===0?this._renderEmpty():h`
      <div class="card-list">
        ${e.map(t=>this._renderItemCard(t))}
      </div>
    `}_renderRow(e){const t=this._itemStatus(e);return h`
      <tr class=${t?`row-${t}`:""}>
        <td>
          <button class="link" @click=${()=>this._openEdit(e)}>
            ${e.name}
          </button>
          <div class="meta">
            ${t?h`<span class="badge badge-${t}"
                  >${this._statusLabel(t)}</span
                >`:c}
          </div>
        </td>
        <td>${this._renderQtyText(e)}</td>
        <td>${e.location||"—"}</td>
        <td>${e.category||"—"}</td>
        <td class=${this._expiryClass(t)}>
          ${e.expiry_date||"—"}
        </td>
        <td class="actions">
          <button type="button" @click=${()=>this._openEdit(e)}>
            Edit
          </button>
          <button
            type="button"
            class="danger"
            ?disabled=${this._busy}
            @click=${()=>this._remove(e)}
          >
            Remove
          </button>
        </td>
      </tr>
    `}_renderItemCard(e){const t=this._itemStatus(e),i=[e.location,e.category].filter(Boolean).join(" · ");return h`
      <article
        class="item-card ${t?`row-${t}`:""}"
        @click=${()=>this._openEdit(e)}
      >
        <div class="item-card-top">
          <div class="item-card-title">
            <span class="item-name">${e.name}</span>
            ${t?h`<span class="badge badge-${t}"
                  >${this._statusLabel(t)}</span
                >`:c}
          </div>
          <button
            type="button"
            class="danger link-danger"
            ?disabled=${this._busy}
            @click=${r=>{r.stopPropagation(),this._remove(e)}}
          >
            Remove
          </button>
        </div>
        ${i?h`<div class="meta">${i}</div>`:c}
        <div class="item-card-bottom">
          ${this._renderQtyText(e)}
          ${e.expiry_date?h`<span class="expiry ${this._expiryClass(t)}"
                >${e.expiry_date}</span
              >`:c}
        </div>
      </article>
    `}_formReadiness(){return this._readinessKind(this._form.category||"")}_showLitersField(){if(this._formReadiness()!=="water")return!1;const e=this._form.unit||"piece";return e!=="liter"&&e!=="milliliter"}_showCaloriesField(){return this._formReadiness()==="food"}_renderDialog(){const e=this._form,t=this._settings?.locations??[],i=this._settings?.categories??[];return h`
      <div class="dialog-backdrop" @click=${this._closeDialog}>
        <div
          class="dialog ${this.narrow?"dialog-narrow":""}"
          role="dialog"
          aria-modal="true"
          @click=${r=>r.stopPropagation()}
        >
          <h2>${this._editing?"Edit item":"Add item"}</h2>

          <section class="form-section">
            <h3>Details</h3>
            <label
              >Name
              <input
                required
                .value=${e.name||""}
                @input=${this._onField("name")}
              />
            </label>
            <div class="row2">
              <label
                >Location
                <input
                  list="rh-locations"
                  .value=${e.location||""}
                  @input=${this._onField("location")}
                />
                <datalist id="rh-locations">
                  ${t.map(r=>h`<option value=${r}></option>`)}
                </datalist>
              </label>
              <label
                >Category
                <input
                  list="rh-categories"
                  .value=${e.category||""}
                  @input=${this._onField("category")}
                />
                <datalist id="rh-categories">
                  ${i.map(r=>h`<option value=${r}></option>`)}
                </datalist>
              </label>
            </div>
            <label
              >Priority
              <select
                .value=${e.priority||"important"}
                @change=${this._onField("priority")}
              >
                <option value="essential">essential</option>
                <option value="important">important</option>
                <option value="optional">optional</option>
              </select>
            </label>
            <label
              >Notes
              <textarea
                rows="2"
                .value=${e.notes||""}
                @input=${this._onField("notes")}
              ></textarea>
            </label>
            <label
              >Barcode
              <div class="barcode-row">
                <input
                  .value=${e.barcode||""}
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
          </section>

          <section class="form-section">
            <h3>Stock</h3>
            <div class="row2">
              <label
                >Quantity
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  .value=${e.quantity||"1"}
                  @input=${this._onField("quantity")}
                />
              </label>
              <label
                >Desired
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  .value=${e.desired_quantity||"0"}
                  @input=${this._onField("desired_quantity")}
                />
              </label>
            </div>
            <label
              >Unit
              <select .value=${e.unit||"piece"} @change=${this._onField("unit")}>
                ${qt.map(r=>h`<option value=${r}>${r}</option>`)}
              </select>
            </label>
            ${this._showLitersField()?h`
                  <label
                    >Liters / unit
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      .value=${e.liters_per_unit||""}
                      @input=${this._onField("liters_per_unit")}
                    />
                    <span class="hint"
                      >Required for water readiness when unit is not
                      liter/milliliter.</span
                    >
                  </label>
                `:c}
            ${this._showCaloriesField()?h`
                  <label
                    >Calories / unit
                    <input
                      type="number"
                      min="0"
                      step="1"
                      .value=${e.calories_per_unit||""}
                      @input=${this._onField("calories_per_unit")}
                    />
                    <span class="hint"
                      >Used for food readiness totals.</span
                    >
                  </label>
                `:c}
          </section>

          <section class="form-section">
            <h3>Dates</h3>
            <label
              >Expiry
              <input
                type="date"
                .value=${e.expiry_date||""}
                @input=${this._onField("expiry_date")}
              />
            </label>
          </section>

          <div class="dialog-actions">
            <button type="button" @click=${this._closeDialog}>Cancel</button>
            <button
              type="button"
              class="primary"
              ?disabled=${this._busy||!(e.name||"").trim()}
              @click=${this._save}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    `}_onField(e){return t=>{const i=t.target;this._form={...this._form,[e]:i.value}}}async _run(e){this._busy=!0,this._error="";try{await e()}catch(t){this._error=String(t)}finally{this._busy=!1}}async _remove(e){confirm(`Remove “${e.name}”?`)&&await this._run(()=>this.hass.callService("ready_home","remove_item",{item_id:e.id}))}async _save(){const e=this._form,t=(e.name||"").trim();if(!t){this._error="Name is required";return}const i=this._formReadiness(),r={quantity:Number(e.quantity||0),desired_quantity:Number(e.desired_quantity||0),unit:e.unit||"piece",location:e.location||"",category:e.category||"",priority:e.priority||"important",barcode:e.barcode||"",notes:e.notes||""};e.expiry_date&&(r.expiry_date=e.expiry_date),i==="water"&&this._showLitersField()&&e.liters_per_unit!==""?r.liters_per_unit=Number(e.liters_per_unit):(i!=="water"||!this._showLitersField())&&(r.liters_per_unit=null),i==="food"&&e.calories_per_unit!==""?r.calories_per_unit=Number(e.calories_per_unit):i!=="food"&&(r.calories_per_unit=null),await this._run(async()=>{this._editing?await this.hass.callService("ready_home","update_item",{item_id:this._editing.id,new_name:t,...r}):await this.hass.callService("ready_home","add_item",{name:t,...r}),this._dialogOpen=!1})}async _lookupBarcode(){const e=this._form.barcode?.trim();if(e){this._busy=!0,this._error="";try{const t=await Tt(this.hass,e),i=[t.brand,t.name].filter(Boolean).join(" ").trim(),r=this._form.category?.trim()||(this._settings?.food_categories?.[0]??"Food");this._form={...this._form,name:i||this._form.name,category:r,calories_per_unit:t.calories_per_100g!=null?String(t.calories_per_100g):this._form.calories_per_unit}}catch(t){this._error=`Barcode lookup failed: ${t}`}finally{this._busy=!1}}}async _scanBarcode(){if(typeof BarcodeDetector>"u"){this._error="BarcodeDetector not supported in this browser — enter the code manually.";return}this._busy=!0,this._error="";try{const e=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}}),t=document.createElement("video");t.srcObject=e,await t.play();const i=new BarcodeDetector({formats:["ean_13","ean_8","upc_a","upc_e","code_128"]});await new Promise(s=>setTimeout(s,700));const r=await i.detect(t);e.getTracks().forEach(s=>s.stop()),r[0]?.rawValue?(this._form={...this._form,barcode:r[0].rawValue},this._busy=!1,await this._lookupBarcode()):this._error="No barcode detected — try again or enter manually."}catch(e){this._error=`Camera scan failed: ${e}`}finally{this._busy=!1}}};_.styles=dt`
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
    .section-head {
      margin-bottom: 12px;
    }
    .section-head h1 {
      margin: 0;
      font-size: 1.35rem;
      font-weight: 500;
    }
    .subtitle {
      margin: 4px 0 0;
      font-size: 0.85rem;
      color: var(--secondary-text-color);
    }
    h2 {
      margin: 0 0 8px;
      font-size: 1.2rem;
      font-weight: 500;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      margin-bottom: 16px;
    }
    .stat-card {
      border-left: 3px solid var(--primary-color);
    }
    .stat-inner {
      padding: 14px 16px;
    }
    .stat-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.8rem;
      color: var(--secondary-text-color);
      margin-bottom: 8px;
    }
    .stat-title ha-svg-icon {
      --mdc-icon-size: 18px;
      color: var(--primary-color);
    }
    .stat-value {
      font-size: 1.6rem;
      font-weight: 600;
      line-height: 1.15;
    }
    .stat-row {
      display: flex;
      align-items: baseline;
      gap: 10px;
      flex-wrap: wrap;
    }
    .stat-goal,
    .stat-meta {
      font-size: 0.8rem;
      color: var(--secondary-text-color);
    }
    .stat-meta {
      margin-top: 4px;
    }
    .stat-duration {
      margin-top: 8px;
      font-size: 0.8rem;
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
    .toolbar-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
    }
    .item-count {
      margin-left: auto;
      font-size: 0.8rem;
      color: var(--secondary-text-color);
    }
    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      align-items: center;
    }
    .filters-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .filters-btn ha-svg-icon {
      --mdc-icon-size: 18px;
    }
    .filters-btn.active {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    .filter-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 1.25em;
      height: 1.25em;
      padding: 0 4px;
      border-radius: 999px;
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      font-size: 0.75rem;
      font-weight: 600;
    }
    select,
    input,
    textarea,
    button {
      font: inherit;
    }
    select,
    input,
    textarea {
      padding: 8px 10px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color, var(--primary-background-color));
      color: var(--primary-text-color);
    }
    textarea {
      resize: vertical;
      min-height: 2.5rem;
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
      background: var(--card-background-color, transparent);
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
      display: flex;
      justify-content: space-between;
      align-items: center;
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
    .expiry-expired,
    .expiry.expiry-expired {
      color: var(--error-color, #c62828);
      font-weight: 600;
    }
    .expiry-warn,
    .expiry.expiry-warn {
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
      width: min(520px, 100%);
      max-height: 90vh;
      overflow: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
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
    .form-section {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 12px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
    }
    .form-section h3 {
      margin: 0;
      font-size: 0.85rem;
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
    .hint {
      font-size: 0.75rem;
      color: var(--secondary-text-color);
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
        grid-template-columns: 1fr;
      }
      .content {
        padding: 12px 12px 28px;
      }
      .actions {
        flex-direction: column;
      }
      .row2 {
        grid-template-columns: 1fr;
      }
      .item-count {
        margin-left: 0;
        width: 100%;
      }
    }
  `;g([D({attribute:!1})],_.prototype,"hass",2);g([D({type:Boolean})],_.prototype,"narrow",2);g([D({attribute:!1})],_.prototype,"panel",2);g([m()],_.prototype,"_snapshot",2);g([m()],_.prototype,"_settings",2);g([m()],_.prototype,"_search",2);g([m()],_.prototype,"_filterStatus",2);g([m()],_.prototype,"_filterLocation",2);g([m()],_.prototype,"_filterCategory",2);g([m()],_.prototype,"_filterReadiness",2);g([m()],_.prototype,"_filtersOpen",2);g([m()],_.prototype,"_sort",2);g([m()],_.prototype,"_dialogOpen",2);g([m()],_.prototype,"_editing",2);g([m()],_.prototype,"_form",2);g([m()],_.prototype,"_error",2);g([m()],_.prototype,"_busy",2);_=g([Mt("ready-home-panel")],_);
//# sourceMappingURL=ready-home-panel.js.map
