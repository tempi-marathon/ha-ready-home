/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const R=globalThis,j=R.ShadowRoot&&(R.ShadyCSS===void 0||R.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,B=Symbol(),Q=new WeakMap;let rt=class{constructor(t,i,s){if(this._$cssResult$=!0,s!==B)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=i}get styleSheet(){let t=this.o;const i=this.t;if(j&&t===void 0){const s=i!==void 0&&i.length===1;s&&(t=Q.get(i)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Q.set(i,t))}return t}toString(){return this.cssText}};const ct=e=>new rt(typeof e=="string"?e:e+"",void 0,B),dt=(e,...t)=>{const i=e.length===1?e[0]:t.reduce((s,r,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+e[o+1],e[0]);return new rt(i,e,B)},pt=(e,t)=>{if(j)e.adoptedStyleSheets=t.map(i=>i instanceof CSSStyleSheet?i:i.styleSheet);else for(const i of t){const s=document.createElement("style"),r=R.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=i.cssText,e.appendChild(s)}},Z=j?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let i="";for(const s of t.cssRules)i+=s.cssText;return ct(i)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:ht,defineProperty:ut,getOwnPropertyDescriptor:_t,getOwnPropertyNames:ft,getOwnPropertySymbols:gt,getPrototypeOf:$t}=Object,T=globalThis,J=T.trustedTypes,bt=J?J.emptyScript:"",yt=T.reactiveElementPolyfillSupport,k=(e,t)=>e,M={toAttribute(e,t){switch(t){case Boolean:e=e?bt:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=e!==null;break;case Number:i=e===null?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch{i=null}}return i}},I=(e,t)=>!ht(e,t),K={attribute:!0,type:String,converter:M,reflect:!1,useDefault:!1,hasChanged:I};Symbol.metadata??=Symbol("metadata"),T.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,i=K){if(i.state&&(i.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((i=Object.create(i)).wrapped=!0),this.elementProperties.set(t,i),!i.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,i);r!==void 0&&ut(this.prototype,t,r)}}static getPropertyDescriptor(t,i,s){const{get:r,set:o}=_t(this.prototype,t)??{get(){return this[i]},set(n){this[i]=n}};return{get:r,set(n){const l=r?.call(this);o?.call(this,n),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??K}static _$Ei(){if(this.hasOwnProperty(k("elementProperties")))return;const t=$t(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(k("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(k("properties"))){const i=this.properties,s=[...ft(i),...gt(i)];for(const r of s)this.createProperty(r,i[r])}const t=this[Symbol.metadata];if(t!==null){const i=litPropertyMetadata.get(t);if(i!==void 0)for(const[s,r]of i)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[i,s]of this.elementProperties){const r=this._$Eu(i,s);r!==void 0&&this._$Eh.set(r,i)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const i=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)i.unshift(Z(r))}else t!==void 0&&i.push(Z(t));return i}static _$Eu(t,i){const s=i.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,i=this.constructor.elementProperties;for(const s of i.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return pt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,i,s){this._$AK(t,s)}_$ET(t,i){const s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){const o=(s.converter?.toAttribute!==void 0?s.converter:M).toAttribute(i,s.type);this._$Em=t,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(t,i){const s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const o=s.getPropertyOptions(r),n=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:M;this._$Em=r;const l=n.fromAttribute(i,o.type);this[r]=l??this._$Ej?.get(r)??l,this._$Em=null}}requestUpdate(t,i,s,r=!1,o){if(t!==void 0){const n=this.constructor;if(r===!1&&(o=this[t]),s??=n.getPropertyOptions(t),!((s.hasChanged??I)(o,i)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,i,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,i,{useDefault:s,reflect:r,wrapped:o},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??i??this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(i=void 0),this._$AL.set(t,i)),r===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(i){Promise.reject(i)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[r,o]of s){const{wrapped:n}=o,l=this[r];n!==!0||this._$AL.has(r)||l===void 0||this.C(r,void 0,o,l)}}let t=!1;const i=this._$AL;try{t=this.shouldUpdate(i),t?(this.willUpdate(i),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(i)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(i)}willUpdate(t){}_$AE(t){this._$EO?.forEach(i=>i.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(i=>this._$ET(i,this[i])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[k("elementProperties")]=new Map,w[k("finalized")]=new Map,yt?.({ReactiveElement:w}),(T.reactiveElementVersions??=[]).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const F=globalThis,G=e=>e,H=F.trustedTypes,X=H?H.createPolicy("lit-html",{createHTML:e=>e}):void 0,ot="$lit$",y=`lit$${Math.random().toFixed(9).slice(2)}$`,nt="?"+y,mt=`<${nt}>`,x=document,P=()=>x.createComment(""),O=e=>e===null||typeof e!="object"&&typeof e!="function",V=Array.isArray,vt=e=>V(e)||typeof e?.[Symbol.iterator]=="function",D=`[ 	
\f\r]`,E=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Y=/-->/g,tt=/>/g,m=RegExp(`>|${D}(?:([^\\s"'>=/]+)(${D}*=${D}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),et=/'/g,it=/"/g,at=/^(?:script|style|textarea|title)$/i,xt=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),p=xt(1),A=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),st=new WeakMap,v=x.createTreeWalker(x,129);function lt(e,t){if(!V(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return X!==void 0?X.createHTML(t):t}const wt=(e,t)=>{const i=e.length-1,s=[];let r,o=t===2?"<svg>":t===3?"<math>":"",n=E;for(let l=0;l<i;l++){const a=e[l];let u,f,d=-1,$=0;for(;$<a.length&&(n.lastIndex=$,f=n.exec(a),f!==null);)$=n.lastIndex,n===E?f[1]==="!--"?n=Y:f[1]!==void 0?n=tt:f[2]!==void 0?(at.test(f[2])&&(r=RegExp("</"+f[2],"g")),n=m):f[3]!==void 0&&(n=m):n===m?f[0]===">"?(n=r??E,d=-1):f[1]===void 0?d=-2:(d=n.lastIndex-f[2].length,u=f[1],n=f[3]===void 0?m:f[3]==='"'?it:et):n===it||n===et?n=m:n===Y||n===tt?n=E:(n=m,r=void 0);const b=n===m&&e[l+1].startsWith("/>")?" ":"";o+=n===E?a+mt:d>=0?(s.push(u),a.slice(0,d)+ot+a.slice(d)+y+b):a+y+(d===-2?l:b)}return[lt(e,o+(e[i]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class U{constructor({strings:t,_$litType$:i},s){let r;this.parts=[];let o=0,n=0;const l=t.length-1,a=this.parts,[u,f]=wt(t,i);if(this.el=U.createElement(u,s),v.currentNode=this.el.content,i===2||i===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(r=v.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const d of r.getAttributeNames())if(d.endsWith(ot)){const $=f[n++],b=r.getAttribute(d).split(y),L=/([.?@])?(.*)/.exec($);a.push({type:1,index:o,name:L[2],strings:b,ctor:L[1]==="."?St:L[1]==="?"?Et:L[1]==="@"?kt:q}),r.removeAttribute(d)}else d.startsWith(y)&&(a.push({type:6,index:o}),r.removeAttribute(d));if(at.test(r.tagName)){const d=r.textContent.split(y),$=d.length-1;if($>0){r.textContent=H?H.emptyScript:"";for(let b=0;b<$;b++)r.append(d[b],P()),v.nextNode(),a.push({type:2,index:++o});r.append(d[$],P())}}}else if(r.nodeType===8)if(r.data===nt)a.push({type:2,index:o});else{let d=-1;for(;(d=r.data.indexOf(y,d+1))!==-1;)a.push({type:7,index:o}),d+=y.length-1}o++}}static createElement(t,i){const s=x.createElement("template");return s.innerHTML=t,s}}function S(e,t,i=e,s){if(t===A)return t;let r=s!==void 0?i._$Co?.[s]:i._$Cl;const o=O(t)?void 0:t._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),o===void 0?r=void 0:(r=new o(e),r._$AT(e,i,s)),s!==void 0?(i._$Co??=[])[s]=r:i._$Cl=r),r!==void 0&&(t=S(e,r._$AS(e,t.values),r,s)),t}class At{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,r=(t?.creationScope??x).importNode(i,!0);v.currentNode=r;let o=v.nextNode(),n=0,l=0,a=s[0];for(;a!==void 0;){if(n===a.index){let u;a.type===2?u=new N(o,o.nextSibling,this,t):a.type===1?u=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(u=new Ct(o,this,t)),this._$AV.push(u),a=s[++l]}n!==a?.index&&(o=v.nextNode(),n++)}return v.currentNode=x,r}p(t){let i=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++}}class N{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,r){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return i!==void 0&&t?.nodeType===11&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=S(this,t,i),O(t)?t===c||t==null||t===""?(this._$AH!==c&&this._$AR(),this._$AH=c):t!==this._$AH&&t!==A&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):vt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==c&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(x.createTextNode(t)),this._$AH=t}$(t){const{values:i,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=U.createElement(lt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===r)this._$AH.p(i);else{const o=new At(r,this),n=o.u(this.options);o.p(i),this.T(n),this._$AH=o}}_$AC(t){let i=st.get(t.strings);return i===void 0&&st.set(t.strings,i=new U(t)),i}k(t){V(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,r=0;for(const o of t)r===i.length?i.push(s=new N(this.O(P()),this.O(P()),this,this.options)):s=i[r],s._$AI(o),r++;r<i.length&&(this._$AR(s&&s._$AB.nextSibling,r),i.length=r)}_$AR(t=this._$AA.nextSibling,i){for(this._$AP?.(!1,!0,i);t!==this._$AB;){const s=G(t).nextSibling;G(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,r,o){this.type=1,this._$AH=c,this._$AN=void 0,this.element=t,this.name=i,this._$AM=r,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=c}_$AI(t,i=this,s,r){const o=this.strings;let n=!1;if(o===void 0)t=S(this,t,i,0),n=!O(t)||t!==this._$AH&&t!==A,n&&(this._$AH=t);else{const l=t;let a,u;for(t=o[0],a=0;a<o.length-1;a++)u=S(this,l[s+a],i,a),u===A&&(u=this._$AH[a]),n||=!O(u)||u!==this._$AH[a],u===c?t=c:t!==c&&(t+=(u??"")+o[a+1]),this._$AH[a]=u}n&&!r&&this.j(t)}j(t){t===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class St extends q{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===c?void 0:t}}class Et extends q{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==c)}}class kt extends q{constructor(t,i,s,r,o){super(t,i,s,r,o),this.type=5}_$AI(t,i=this){if((t=S(this,t,i,0)??c)===A)return;const s=this._$AH,r=t===c&&s!==c||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==c&&(s===c||r);r&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class Ct{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){S(this,t)}}const Pt=F.litHtmlPolyfillSupport;Pt?.(U,N),(F.litHtmlVersions??=[]).push("3.3.3");const Ot=(e,t,i)=>{const s=i?.renderBefore??t;let r=s._$litPart$;if(r===void 0){const o=i?.renderBefore??null;s._$litPart$=r=new N(t.insertBefore(P(),o),o,void 0,i??{})}return r._$AI(e),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const W=globalThis;class C extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ot(i,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return A}}C._$litElement$=!0,C.finalized=!0,W.litElementHydrateSupport?.({LitElement:C});const Ut=W.litElementPolyfillSupport;Ut?.({LitElement:C});(W.litElementVersions??=[]).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Nt=e=>(t,i)=>{i!==void 0?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Lt={attribute:!0,type:String,converter:M,reflect:!1,hasChanged:I},Rt=(e=Lt,t,i)=>{const{kind:s,metadata:r}=i;let o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),s==="setter"&&((e=Object.create(e)).wrapped=!0),o.set(i.name,e),s==="accessor"){const{name:n}=i;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(n,a,e,!0,l)},init(l){return l!==void 0&&this.C(n,void 0,e,l),l}}}if(s==="setter"){const{name:n}=i;return function(l){const a=this[n];t.call(this,l),this.requestUpdate(n,a,e,!0,l)}}throw Error("Unsupported decorator location: "+s)};function z(e){return(t,i)=>typeof i=="object"?Rt(e,t,i):((s,r,o)=>{const n=r.hasOwnProperty(o);return r.constructor.createProperty(o,s),n?Object.getOwnPropertyDescriptor(r,o):void 0})(e,t,i)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function g(e){return z({...e,state:!0,attribute:!1})}async function Mt(e){return e.connection.sendMessagePromise({type:"ready_home/settings"})}async function Ht(e,t){return e.connection.subscribeMessage(t,{type:"ready_home/subscribe"})}async function Tt(e,t){return e.connection.sendMessagePromise({type:"ready_home/barcode/lookup",barcode:t})}var qt=Object.defineProperty,zt=Object.getOwnPropertyDescriptor,_=(e,t,i,s)=>{for(var r=s>1?void 0:s?zt(t,i):t,o=e.length-1,n;o>=0;o--)(n=e[o])&&(r=(s?n(t,i,r):n(r))||r);return s&&r&&qt(t,i,r),r};const Dt=["piece","pack","box","gram","kilogram","liter","milliliter"],jt="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z",Bt={expired:"Expired",urgent:"Urgent",expiring:"Expiring",low:"Low stock"};let h=class extends C{constructor(){super(...arguments),this.narrow=!1,this._snapshot=null,this._settings=null,this._search="",this._filterStatus="all",this._filterLocation="",this._filterCategory="",this._filterResource="",this._sort="name",this._dialogOpen=!1,this._editing=null,this._form={},this._error="",this._busy=!1,this._unsub=null,this._connected=!1,this._openAdd=()=>{this._editing=null,this._form={name:"",quantity:"1",desired_quantity:"0",unit:"piece",location:"",category:"",resource:"none",priority:"important",notes:"",barcode:"",expiry_date:"",liters_per_unit:"",calories_per_unit:""},this._error="",this._dialogOpen=!0},this._openEdit=e=>{this._editing=e,this._form={name:e.name,quantity:String(e.quantity),desired_quantity:String(e.desired_quantity),unit:e.unit,location:e.location,category:e.category,resource:e.resource,priority:e.priority,notes:e.notes||"",barcode:e.barcode||"",expiry_date:e.expiry_date||"",liters_per_unit:e.liters_per_unit!=null?String(e.liters_per_unit):"",calories_per_unit:e.calories_per_unit!=null?String(e.calories_per_unit):""},this._error="",this._dialogOpen=!0},this._closeDialog=()=>{this._dialogOpen=!1}}connectedCallback(){super.connectedCallback(),this._connected=!0,this._connect()}disconnectedCallback(){super.disconnectedCallback(),this._connected=!1,this._unsub?.(),this._unsub=null}updated(e){e.has("hass")&&this.hass&&!this._unsub&&this._connected&&this._connect()}async _connect(){if(!(!this.hass||this._unsub))try{this._settings=await Mt(this.hass),this._unsub=await Ht(this.hass,e=>{this._snapshot=e}),this._error=""}catch(e){this._error=String(e)}}get _assessment(){return this._snapshot?.assessment??{}}get _bucketCounts(){const e=this._snapshot?.buckets;return{expired:e?.expired.length??0,expiring:(e?.within_urgent.length??0)+(e?.within_expiring.length??0),low_stock:e?.low_stock.length??0}}get _items(){let e=[...this._snapshot?.items??[]];const t=this._search.trim().toLowerCase();if(t&&(e=e.filter(i=>i.name.toLowerCase().includes(t)||i.location.toLowerCase().includes(t)||i.category.toLowerCase().includes(t)||(i.barcode||"").toLowerCase().includes(t)||(i.notes||"").toLowerCase().includes(t))),this._filterLocation&&(e=e.filter(i=>i.location.toLowerCase()===this._filterLocation.toLowerCase())),this._filterCategory&&(e=e.filter(i=>i.category.toLowerCase()===this._filterCategory.toLowerCase())),this._filterResource&&(e=e.filter(i=>i.resource===this._filterResource)),this._filterStatus!=="all"){const i=this._snapshot?.buckets,s=new Set;this._filterStatus==="expired"?i?.expired.forEach(r=>s.add(r.id)):this._filterStatus==="expiring"?(i?.within_urgent.forEach(r=>s.add(r.id)),i?.within_expiring.forEach(r=>s.add(r.id))):this._filterStatus==="low_stock"&&i?.low_stock.forEach(r=>s.add(r.id)),e=e.filter(r=>s.has(r.id))}return e.sort((i,s)=>this._sort==="quantity"?i.quantity-s.quantity:this._sort==="expiry"?(i.expiry_date||"9999").localeCompare(s.expiry_date||"9999"):i.name.localeCompare(s.name)),e}_itemStatus(e){const t=this._snapshot?.buckets;return t?t.expired.some(i=>i.id===e.id)?"expired":t.within_urgent.some(i=>i.id===e.id)?"urgent":t.within_expiring.some(i=>i.id===e.id)?"expiring":t.low_stock.some(i=>i.id===e.id)?"low":"":""}_statusLabel(e){return Bt[e]||e}_setStatusFilter(e){this._filterStatus=this._filterStatus===e?"all":e}render(){const e=this._items,t=this._assessment,i=this._settings?.locations??[],s=this._settings?.categories??[],r=t.overall_percent,o=t.water_percent,n=t.food_percent,l=this._bucketCounts;return p`
      <ha-top-app-bar-fixed>
        <ha-menu-button
          slot="navigationIcon"
          .hass=${this.hass}
          .narrow=${this.narrow}
        ></ha-menu-button>
        <div slot="title">Ready Home</div>
        <ha-icon-button
          slot="actionItems"
          .path=${jt}
          .label=${"Add item"}
          ?disabled=${this._busy}
          @click=${this._openAdd}
        ></ha-icon-button>

        <div class="content">
          <div class="stats">
            <div class="stat">
              <span class="stat-label">Overall</span>
              <span class="stat-value">${this._pct(r)}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Water</span>
              <span class="stat-value">${this._pct(o)}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Food</span>
              <span class="stat-value">${this._pct(n)}</span>
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
                ${i.map(a=>p`<option value=${a}>${a}</option>`)}
              </select>
              <select
                .value=${this._filterCategory}
                @change=${a=>{this._filterCategory=a.target.value}}
              >
                <option value="">All categories</option>
                ${s.map(a=>p`<option value=${a}>${a}</option>`)}
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

          ${this._error?p`<div class="error" role="alert">${this._error}</div>`:c}

          ${this.narrow?this._renderCardList(e):this._renderTable(e)}
        </div>
      </ha-top-app-bar-fixed>

      ${this._dialogOpen?this._renderDialog():c}
    `}_pct(e){return e==null||Number.isNaN(Number(e))?"—":`${Math.round(Number(e))}%`}_renderEmpty(){return this._snapshot?p`
      <div class="empty">
        No items match.
        <button class="link" @click=${this._openAdd}>Add an item</button>
      </div>
    `:p`<div class="empty">Loading inventory…</div>`}_renderTable(e){return p`
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
            ${e.map(t=>this._renderRow(t))}
            ${e.length===0?p`<tr>
                  <td colspan="6">${this._renderEmpty()}</td>
                </tr>`:c}
          </tbody>
        </table>
      </div>
    `}_renderCardList(e){return e.length===0?this._renderEmpty():p`
      <div class="card-list">
        ${e.map(t=>this._renderItemCard(t))}
      </div>
    `}_renderQty(e){return p`
      <div class="qty" @click=${t=>t.stopPropagation()}>
        <button
          type="button"
          title="Decrease"
          ?disabled=${this._busy||e.quantity<=0}
          @click=${()=>this._adjust(e,-1)}
        >
          −
        </button>
        <span
          >${e.quantity}${e.desired_quantity?p` / ${e.desired_quantity}`:c}
          ${e.unit}</span
        >
        <button
          type="button"
          title="Increase"
          ?disabled=${this._busy}
          @click=${()=>this._adjust(e,1)}
        >
          +
        </button>
      </div>
    `}_renderRow(e){const t=this._itemStatus(e);return p`
      <tr class=${t?`row-${t}`:""}>
        <td>
          <button class="link" @click=${()=>this._openEdit(e)}>
            ${e.name}
          </button>
          <div class="meta">
            ${e.category||"—"}
            ${t?p`<span class="badge badge-${t}"
                  >${this._statusLabel(t)}</span
                >`:c}
          </div>
        </td>
        <td>${this._renderQty(e)}</td>
        <td>${e.location||"—"}</td>
        <td>${e.resource}</td>
        <td>${e.expiry_date||"—"}</td>
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
    `}_renderItemCard(e){const t=this._itemStatus(e),i=[e.location,e.category,e.expiry_date].filter(Boolean).join(" · ");return p`
      <article
        class="item-card ${t?`row-${t}`:""}"
        @click=${()=>this._openEdit(e)}
      >
        <div class="item-card-top">
          <div class="item-card-title">
            <span class="item-name">${e.name}</span>
            ${t?p`<span class="badge badge-${t}"
                  >${this._statusLabel(t)}</span
                >`:c}
          </div>
          <button
            type="button"
            class="danger link-danger"
            ?disabled=${this._busy}
            @click=${s=>{s.stopPropagation(),this._remove(e)}}
          >
            Remove
          </button>
        </div>
        ${i?p`<div class="meta">${i}</div>`:c}
        <div class="item-card-bottom">${this._renderQty(e)}</div>
      </article>
    `}_renderDialog(){const e=this._form,t=this._settings?.locations??[],i=this._settings?.categories??[];return p`
      <div class="dialog-backdrop" @click=${this._closeDialog}>
        <div
          class="dialog ${this.narrow?"dialog-narrow":""}"
          role="dialog"
          aria-modal="true"
          @click=${s=>s.stopPropagation()}
        >
          <h2>${this._editing?"Edit item":"Add item"}</h2>
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
              ${Dt.map(s=>p`<option value=${s}>${s}</option>`)}
            </select>
          </label>
          <label
            >Location
            <input
              list="rh-locations"
              .value=${e.location||""}
              @input=${this._onField("location")}
            />
            <datalist id="rh-locations">
              ${t.map(s=>p`<option value=${s}></option>`)}
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
              ${i.map(s=>p`<option value=${s}></option>`)}
            </datalist>
          </label>
          <label
            >Resource
            <select
              .value=${e.resource||"none"}
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
                .value=${e.liters_per_unit||""}
                @input=${this._onField("liters_per_unit")}
              />
            </label>
            <label
              >Calories / unit
              <input
                type="number"
                min="0"
                step="1"
                .value=${e.calories_per_unit||""}
                @input=${this._onField("calories_per_unit")}
              />
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
            >Expiry
            <input
              type="date"
              .value=${e.expiry_date||""}
              @input=${this._onField("expiry_date")}
            />
          </label>
          <label
            >Notes
            <input .value=${e.notes||""} @input=${this._onField("notes")} />
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
    `}_onField(e){return t=>{const i=t.target;this._form={...this._form,[e]:i.value}}}async _run(e){this._busy=!0,this._error="";try{await e()}catch(t){this._error=String(t)}finally{this._busy=!1}}async _adjust(e,t){await this._run(()=>this.hass.callService("ready_home","adjust_quantity",{item_id:e.id,delta:t}))}async _remove(e){confirm(`Remove “${e.name}”?`)&&await this._run(()=>this.hass.callService("ready_home","remove_item",{item_id:e.id}))}async _save(){const e=this._form,t=(e.name||"").trim();if(!t){this._error="Name is required";return}const i={quantity:Number(e.quantity||0),desired_quantity:Number(e.desired_quantity||0),unit:e.unit||"piece",location:e.location||"",category:e.category||"",resource:e.resource||"none",priority:e.priority||"important",barcode:e.barcode||"",notes:e.notes||""};e.expiry_date&&(i.expiry_date=e.expiry_date),e.liters_per_unit!==""&&(i.liters_per_unit=Number(e.liters_per_unit)),e.calories_per_unit!==""&&(i.calories_per_unit=Number(e.calories_per_unit)),await this._run(async()=>{this._editing?await this.hass.callService("ready_home","update_item",{item_id:this._editing.id,new_name:t,...i}):await this.hass.callService("ready_home","add_item",{name:t,...i}),this._dialogOpen=!1})}async _lookupBarcode(){const e=this._form.barcode?.trim();if(e){this._busy=!0,this._error="";try{const t=await Tt(this.hass,e),i=[t.brand,t.name].filter(Boolean).join(" ").trim();this._form={...this._form,name:i||this._form.name,resource:this._form.resource==="none"?"food":this._form.resource,calories_per_unit:t.calories_per_100g!=null?String(t.calories_per_100g):this._form.calories_per_unit}}catch(t){this._error=`Barcode lookup failed: ${t}`}finally{this._busy=!1}}}async _scanBarcode(){if(typeof BarcodeDetector>"u"){this._error="BarcodeDetector not supported in this browser — enter the code manually.";return}this._busy=!0,this._error="";try{const e=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}}),t=document.createElement("video");t.srcObject=e,await t.play();const i=new BarcodeDetector({formats:["ean_13","ean_8","upc_a","upc_e","code_128"]});await new Promise(r=>setTimeout(r,700));const s=await i.detect(t);e.getTracks().forEach(r=>r.stop()),s[0]?.rawValue?(this._form={...this._form,barcode:s[0].rawValue},this._busy=!1,await this._lookupBarcode()):this._error="No barcode detected — try again or enter manually."}catch(e){this._error=`Camera scan failed: ${e}`}finally{this._busy=!1}}};h.styles=dt`
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
  `;_([z({attribute:!1})],h.prototype,"hass",2);_([z({type:Boolean})],h.prototype,"narrow",2);_([z({attribute:!1})],h.prototype,"panel",2);_([g()],h.prototype,"_snapshot",2);_([g()],h.prototype,"_settings",2);_([g()],h.prototype,"_search",2);_([g()],h.prototype,"_filterStatus",2);_([g()],h.prototype,"_filterLocation",2);_([g()],h.prototype,"_filterCategory",2);_([g()],h.prototype,"_filterResource",2);_([g()],h.prototype,"_sort",2);_([g()],h.prototype,"_dialogOpen",2);_([g()],h.prototype,"_editing",2);_([g()],h.prototype,"_form",2);_([g()],h.prototype,"_error",2);_([g()],h.prototype,"_busy",2);h=_([Nt("ready-home-panel")],h);
//# sourceMappingURL=ready-home-panel.js.map
