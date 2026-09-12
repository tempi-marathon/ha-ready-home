/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const H=globalThis,F=H.ShadowRoot&&(H.ShadyCSS===void 0||H.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,B=Symbol(),Z=new WeakMap;let ot=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==B)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(F&&t===void 0){const i=e!==void 0&&e.length===1;i&&(t=Z.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&Z.set(e,t))}return t}toString(){return this.cssText}};const dt=s=>new ot(typeof s=="string"?s:s+"",void 0,B),ht=(s,...t)=>{const e=s.length===1?s[0]:t.reduce((i,r,o)=>i+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+s[o+1],s[0]);return new ot(e,s,B)},pt=(s,t)=>{if(F)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const i=document.createElement("style"),r=H.litNonce;r!==void 0&&i.setAttribute("nonce",r),i.textContent=e.cssText,s.appendChild(i)}},K=F?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return dt(e)})(s):s;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:ut,defineProperty:_t,getOwnPropertyDescriptor:ft,getOwnPropertyNames:gt,getOwnPropertySymbols:mt,getPrototypeOf:yt}=Object,T=globalThis,Q=T.trustedTypes,$t=Q?Q.emptyScript:"",bt=T.reactiveElementPolyfillSupport,E=(s,t)=>s,R={toAttribute(s,t){switch(t){case Boolean:s=s?$t:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},j=(s,t)=>!ut(s,t),G={attribute:!0,type:String,converter:R,reflect:!1,useDefault:!1,hasChanged:j};Symbol.metadata??=Symbol("metadata"),T.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=G){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),r=this.getPropertyDescriptor(t,i,e);r!==void 0&&_t(this.prototype,t,r)}}static getPropertyDescriptor(t,e,i){const{get:r,set:o}=ft(this.prototype,t)??{get(){return this[e]},set(a){this[e]=a}};return{get:r,set(a){const l=r?.call(this);o?.call(this,a),this.requestUpdate(t,l,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??G}static _$Ei(){if(this.hasOwnProperty(E("elementProperties")))return;const t=yt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(E("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(E("properties"))){const e=this.properties,i=[...gt(e),...mt(e)];for(const r of i)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[i,r]of e)this.elementProperties.set(i,r)}this._$Eh=new Map;for(const[e,i]of this.elementProperties){const r=this._$Eu(e,i);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const r of i)e.unshift(K(r))}else t!==void 0&&e.push(K(t));return e}static _$Eu(t,e){const i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return pt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,i);if(r!==void 0&&i.reflect===!0){const o=(i.converter?.toAttribute!==void 0?i.converter:R).toAttribute(e,i.type);this._$Em=t,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,r=i._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const o=i.getPropertyOptions(r),a=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:R;this._$Em=r;const l=a.fromAttribute(e,o.type);this[r]=l??this._$Ej?.get(r)??l,this._$Em=null}}requestUpdate(t,e,i,r=!1,o){if(t!==void 0){const a=this.constructor;if(r===!1&&(o=this[t]),i??=a.getPropertyOptions(t),!((i.hasChanged??j)(o,e)||i.useDefault&&i.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,i))))return;this.C(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:r,wrapped:o},a){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),o!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[r,o]of i){const{wrapped:a}=o,l=this[r];a!==!0||this._$AL.has(r)||l===void 0||this.C(r,void 0,o,l)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(e)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[E("elementProperties")]=new Map,w[E("finalized")]=new Map,bt?.({ReactiveElement:w}),(T.reactiveElementVersions??=[]).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const I=globalThis,J=s=>s,U=I.trustedTypes,X=U?U.createPolicy("lit-html",{createHTML:s=>s}):void 0,at="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,nt="?"+$,vt=`<${nt}>`,x=document,L=()=>x.createComment(""),N=s=>s===null||typeof s!="object"&&typeof s!="function",V=Array.isArray,xt=s=>V(s)||typeof s?.[Symbol.iterator]=="function",q=`[ 	
\f\r]`,S=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Y=/-->/g,tt=/>/g,b=RegExp(`>|${q}(?:([^\\s"'>=/]+)(${q}*=${q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),et=/'/g,it=/"/g,lt=/^(?:script|style|textarea|title)$/i,wt=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),h=wt(1),A=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),rt=new WeakMap,v=x.createTreeWalker(x,129);function ct(s,t){if(!V(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return X!==void 0?X.createHTML(t):t}const At=(s,t)=>{const e=s.length-1,i=[];let r,o=t===2?"<svg>":t===3?"<math>":"",a=S;for(let l=0;l<e;l++){const n=s[l];let u,_,d=-1,y=0;for(;y<n.length&&(a.lastIndex=y,_=a.exec(n),_!==null);)y=a.lastIndex,a===S?_[1]==="!--"?a=Y:_[1]!==void 0?a=tt:_[2]!==void 0?(lt.test(_[2])&&(r=RegExp("</"+_[2],"g")),a=b):_[3]!==void 0&&(a=b):a===b?_[0]===">"?(a=r??S,d=-1):_[1]===void 0?d=-2:(d=a.lastIndex-_[2].length,u=_[1],a=_[3]===void 0?b:_[3]==='"'?it:et):a===it||a===et?a=b:a===Y||a===tt?a=S:(a=b,r=void 0);const p=a===b&&s[l+1].startsWith("/>")?" ":"";o+=a===S?n+vt:d>=0?(i.push(u),n.slice(0,d)+at+n.slice(d)+$+p):n+$+(d===-2?l:p)}return[ct(s,o+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]};class P{constructor({strings:t,_$litType$:e},i){let r;this.parts=[];let o=0,a=0;const l=t.length-1,n=this.parts,[u,_]=At(t,e);if(this.el=P.createElement(u,i),v.currentNode=this.el.content,e===2||e===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(r=v.nextNode())!==null&&n.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const d of r.getAttributeNames())if(d.endsWith(at)){const y=_[a++],p=r.getAttribute(d).split($),O=/([.?@])?(.*)/.exec(y);n.push({type:1,index:o,name:O[2],strings:p,ctor:O[1]==="."?St:O[1]==="?"?Et:O[1]==="@"?kt:z}),r.removeAttribute(d)}else d.startsWith($)&&(n.push({type:6,index:o}),r.removeAttribute(d));if(lt.test(r.tagName)){const d=r.textContent.split($),y=d.length-1;if(y>0){r.textContent=U?U.emptyScript:"";for(let p=0;p<y;p++)r.append(d[p],L()),v.nextNode(),n.push({type:2,index:++o});r.append(d[y],L())}}}else if(r.nodeType===8)if(r.data===nt)n.push({type:2,index:o});else{let d=-1;for(;(d=r.data.indexOf($,d+1))!==-1;)n.push({type:7,index:o}),d+=$.length-1}o++}}static createElement(t,e){const i=x.createElement("template");return i.innerHTML=t,i}}function C(s,t,e=s,i){if(t===A)return t;let r=i!==void 0?e._$Co?.[i]:e._$Cl;const o=N(t)?void 0:t._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),o===void 0?r=void 0:(r=new o(s),r._$AT(s,e,i)),i!==void 0?(e._$Co??=[])[i]=r:e._$Cl=r),r!==void 0&&(t=C(s,r._$AS(s,t.values),r,i)),t}class Ct{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,r=(t?.creationScope??x).importNode(e,!0);v.currentNode=r;let o=v.nextNode(),a=0,l=0,n=i[0];for(;n!==void 0;){if(a===n.index){let u;n.type===2?u=new M(o,o.nextSibling,this,t):n.type===1?u=new n.ctor(o,n.name,n.strings,this,t):n.type===6&&(u=new Lt(o,this,t)),this._$AV.push(u),n=i[++l]}a!==n?.index&&(o=v.nextNode(),a++)}return v.currentNode=x,r}p(t){let e=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class M{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,r){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=C(this,t,e),N(t)?t===c||t==null||t===""?(this._$AH!==c&&this._$AR(),this._$AH=c):t!==this._$AH&&t!==A&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):xt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==c&&N(this._$AH)?this._$AA.nextSibling.data=t:this.T(x.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,r=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=P.createElement(ct(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===r)this._$AH.p(e);else{const o=new Ct(r,this),a=o.u(this.options);o.p(e),this.T(a),this._$AH=o}}_$AC(t){let e=rt.get(t.strings);return e===void 0&&rt.set(t.strings,e=new P(t)),e}k(t){V(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,r=0;for(const o of t)r===e.length?e.push(i=new M(this.O(L()),this.O(L()),this,this.options)):i=e[r],i._$AI(o),r++;r<e.length&&(this._$AR(i&&i._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const i=J(t).nextSibling;J(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class z{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,r,o){this.type=1,this._$AH=c,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=o,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=c}_$AI(t,e=this,i,r){const o=this.strings;let a=!1;if(o===void 0)t=C(this,t,e,0),a=!N(t)||t!==this._$AH&&t!==A,a&&(this._$AH=t);else{const l=t;let n,u;for(t=o[0],n=0;n<o.length-1;n++)u=C(this,l[i+n],e,n),u===A&&(u=this._$AH[n]),a||=!N(u)||u!==this._$AH[n],u===c?t=c:t!==c&&(t+=(u??"")+o[n+1]),this._$AH[n]=u}a&&!r&&this.j(t)}j(t){t===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class St extends z{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===c?void 0:t}}class Et extends z{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==c)}}class kt extends z{constructor(t,e,i,r,o){super(t,e,i,r,o),this.type=5}_$AI(t,e=this){if((t=C(this,t,e,0)??c)===A)return;const i=this._$AH,r=t===c&&i!==c||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==c&&(i===c||r);r&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class Lt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){C(this,t)}}const Nt=I.litHtmlPolyfillSupport;Nt?.(P,M),(I.litHtmlVersions??=[]).push("3.3.3");const Pt=(s,t,e)=>{const i=e?.renderBefore??t;let r=i._$litPart$;if(r===void 0){const o=e?.renderBefore??null;i._$litPart$=r=new M(t.insertBefore(L(),o),o,void 0,e??{})}return r._$AI(s),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const W=globalThis;class k extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Pt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return A}}k._$litElement$=!0,k.finalized=!0,W.litElementHydrateSupport?.({LitElement:k});const Mt=W.litElementPolyfillSupport;Mt?.({LitElement:k});(W.litElementVersions??=[]).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ot={attribute:!0,type:String,converter:R,reflect:!1,hasChanged:j},Ht=(s=Ot,t,e)=>{const{kind:i,metadata:r}=e;let o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),i==="setter"&&((s=Object.create(s)).wrapped=!0),o.set(e.name,s),i==="accessor"){const{name:a}=e;return{set(l){const n=t.get.call(this);t.set.call(this,l),this.requestUpdate(a,n,s,!0,l)},init(l){return l!==void 0&&this.C(a,void 0,s,l),l}}}if(i==="setter"){const{name:a}=e;return function(l){const n=this[a];t.call(this,l),this.requestUpdate(a,n,s,!0,l)}}throw Error("Unsupported decorator location: "+i)};function D(s){return(t,e)=>typeof e=="object"?Ht(s,t,e):((i,r,o)=>{const a=r.hasOwnProperty(o);return r.constructor.createProperty(o,i),a?Object.getOwnPropertyDescriptor(r,o):void 0})(s,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function m(s){return D({...s,state:!0,attribute:!1})}async function Rt(s){return s.connection.sendMessagePromise({type:"ready_home/settings"})}async function Ut(s,t){return s.connection.subscribeMessage(t,{type:"ready_home/subscribe"})}async function Tt(s,t){return s.connection.sendMessagePromise({type:"ready_home/barcode/lookup",barcode:t})}var zt=Object.defineProperty,g=(s,t,e,i)=>{for(var r=void 0,o=s.length-1,a;o>=0;o--)(a=s[o])&&(r=a(t,e,r)||r);return r&&zt(t,e,r),r};const st="ready-home-panel",Dt=["piece","pack","box","gram","kilogram","liter","milliliter"],qt="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z",Ft="M6,13H18V11H6M3,6V8H21V6M10,18H14V16H10V18Z",Bt="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z",jt="M12,20A6,6 0 0,1 6,14C6,10 12,3.25 12,3.25C12,3.25 18,10 18,14A6,6 0 0,1 12,20Z",It="M20,10C22,13 17,22 15,22C13,22 13,21 12,21C11,21 11,22 9,22C7,22 2,13 4,10C6,7 9,7 11,8V5C11,3.9 11.9,3 13,3H14V5H13V8C15,7 18,7 20,10Z",Vt={expired:"Expired",urgent:"Urgent",expiring:"Expiring",low:"Low stock"};class f extends k{constructor(){super(...arguments),this.narrow=!1,this._snapshot=null,this._settings=null,this._search="",this._filterStatus="all",this._filterLocation="",this._filterCategory="",this._filterReadiness="",this._filtersOpen=!1,this._sort="name",this._dialogOpen=!1,this._editing=null,this._form={},this._error="",this._busy=!1,this._unsub=null,this._connected=!1,this._openAdd=()=>{this._editing=null,this._form={name:"",quantity:"1",desired_quantity:"0",unit:"piece",location:"",category:"",priority:"important",notes:"",barcode:"",expiry_date:"",liters_per_unit:"",calories_per_unit:""},this._error="",this._dialogOpen=!0},this._openEdit=t=>{this._editing=t,this._form={name:t.name,quantity:String(t.quantity),desired_quantity:String(t.desired_quantity),unit:t.unit,location:t.location,category:t.category,priority:t.priority,notes:t.notes||"",barcode:t.barcode||"",expiry_date:t.expiry_date||"",liters_per_unit:t.liters_per_unit!=null?String(t.liters_per_unit):"",calories_per_unit:t.calories_per_unit!=null?String(t.calories_per_unit):""},this._error="",this._dialogOpen=!0},this._closeDialog=()=>{this._dialogOpen=!1}}connectedCallback(){super.connectedCallback(),this._connected=!0,this._connect()}disconnectedCallback(){super.disconnectedCallback(),this._connected=!1,this._unsub?.(),this._unsub=null}updated(t){t.has("hass")&&this.hass&&!this._unsub&&this._connected&&this._connect()}async _connect(){if(!(!this.hass||this._unsub))try{this._settings=await Rt(this.hass),this._unsub=await Ut(this.hass,t=>{this._snapshot=t}),this._error=""}catch(t){this._error=String(t)}}get _assessment(){return this._snapshot?.assessment??{}}get _bucketCounts(){const t=this._snapshot?.buckets;return{expired:t?.expired.length??0,expiring:(t?.within_urgent.length??0)+(t?.within_expiring.length??0),low_stock:t?.low_stock.length??0}}get _activeFilterCount(){let t=0;return this._filterLocation&&(t+=1),this._filterCategory&&(t+=1),this._filterReadiness&&(t+=1),t}_readinessKind(t){const e=t.trim().toLowerCase();return!e||!this._settings?"none":(this._settings.water_categories??[]).some(i=>i.trim().toLowerCase()===e)?"water":(this._settings.food_categories??[]).some(i=>i.trim().toLowerCase()===e)?"food":"none"}get _items(){let t=[...this._snapshot?.items??[]];const e=this._search.trim().toLowerCase();if(e&&(t=t.filter(i=>i.name.toLowerCase().includes(e)||i.location.toLowerCase().includes(e)||i.category.toLowerCase().includes(e)||(i.barcode||"").toLowerCase().includes(e)||(i.notes||"").toLowerCase().includes(e))),this._filterLocation&&(t=t.filter(i=>i.location.toLowerCase()===this._filterLocation.toLowerCase())),this._filterCategory&&(t=t.filter(i=>i.category.toLowerCase()===this._filterCategory.toLowerCase())),this._filterReadiness&&(t=t.filter(i=>this._readinessKind(i.category)===this._filterReadiness)),this._filterStatus!=="all"){const i=this._snapshot?.buckets,r=new Set;this._filterStatus==="expired"?i?.expired.forEach(o=>r.add(o.id)):this._filterStatus==="expiring"?(i?.within_urgent.forEach(o=>r.add(o.id)),i?.within_expiring.forEach(o=>r.add(o.id))):this._filterStatus==="low_stock"&&i?.low_stock.forEach(o=>r.add(o.id)),t=t.filter(o=>r.has(o.id))}return t.sort((i,r)=>this._sort==="quantity"?i.quantity-r.quantity:this._sort==="expiry"?(i.expiry_date||"9999").localeCompare(r.expiry_date||"9999"):i.name.localeCompare(r.name)),t}_itemStatus(t){const e=this._snapshot?.buckets;return e?e.expired.some(i=>i.id===t.id)?"expired":e.within_urgent.some(i=>i.id===t.id)?"urgent":e.within_expiring.some(i=>i.id===t.id)?"expiring":e.low_stock.some(i=>i.id===t.id)?"low":"":""}_statusLabel(t){return Vt[t]||t}_setStatusFilter(t){this._filterStatus=this._filterStatus===t?"all":t}_pct(t){return t==null||Number.isNaN(Number(t))?"—":`${Math.round(Number(t))}%`}_formatHours(t){if(t==null||Number.isNaN(Number(t)))return"—";const e=Math.max(0,Math.round(Number(t)));if(e<48)return`${e} hour${e===1?"":"s"}`;const i=Math.round(e/24);return`${i} day${i===1?"":"s"}`}_formatAmount(t,e){if(t==null||Number.isNaN(Number(t)))return"—";const i=Number(t);return`${Math.abs(i-Math.round(i))<.05?Math.round(i):Math.round(i*10)/10} ${e}`}_durationClass(t){const e=this._assessment.duration_hours??this._settings?.duration_hours??72;return t==null||Number.isNaN(Number(t))?"":Number(t)<=0?"duration-bad":Number(t)<Number(e)?"duration-warn":"duration-ok"}render(){const t=this._items,e=this._assessment,i=this._settings?.locations??[],r=this._settings?.categories??[],o=e.overall_percent,a=e.water_percent,l=e.food_percent,n=this._bucketCounts,u=e.duration_hours??this._settings?.duration_hours??72,_=e.supply_hours,d=e.water_supply_hours,y=e.food_supply_hours;return h`
      <ha-top-app-bar-fixed>
        <ha-menu-button
          slot="navigationIcon"
          .hass=${this.hass}
          .narrow=${this.narrow}
        ></ha-menu-button>
        <div slot="title">Ready Home</div>
        <ha-icon-button
          slot="actionItems"
          .path=${qt}
          .label=${"Add item"}
          ?disabled=${this._busy}
          @click=${this._openAdd}
        ></ha-icon-button>

        <div class="content">
          <div class="section-head">
            <h1>Home readiness</h1>
            <p class="subtitle">${u}-hour readiness</p>
          </div>

          <div class="stats">
            <ha-card class="stat-card">
              <div class="stat-inner">
                <div class="stat-title">
                  <ha-svg-icon .path=${Bt}></ha-svg-icon>
                  Overall readiness
                </div>
                <div class="stat-value">${this._pct(o)}</div>
                <div class="stat-duration ${this._durationClass(_)}">
                  Lasts ${this._formatHours(_)}
                  · Lowest of food and water
                </div>
              </div>
            </ha-card>
            <ha-card class="stat-card">
              <div class="stat-inner">
                <div class="stat-title">
                  <ha-svg-icon .path=${jt}></ha-svg-icon>
                  Water
                </div>
                <div class="stat-row">
                  <span class="stat-value"
                    >${this._formatAmount(e.water_on_hand,"L")}</span
                  >
                  <span class="stat-goal"
                    >Goal ${this._formatAmount(e.water_target,"L")}</span
                  >
                </div>
                <div class="stat-meta">${this._pct(a)} ready</div>
                <div class="stat-duration ${this._durationClass(d)}">
                  Lasts ${this._formatHours(d)}
                </div>
              </div>
            </ha-card>
            <ha-card class="stat-card">
              <div class="stat-inner">
                <div class="stat-title">
                  <ha-svg-icon .path=${It}></ha-svg-icon>
                  Food
                </div>
                <div class="stat-row">
                  <span class="stat-value"
                    >${this._formatAmount(e.food_on_hand,"kcal")}</span
                  >
                  <span class="stat-goal"
                    >Goal ${this._formatAmount(e.food_target,"kcal")}</span
                  >
                </div>
                <div class="stat-meta">${this._pct(l)} ready</div>
                <div class="stat-duration ${this._durationClass(y)}">
                  Lasts ${this._formatHours(y)}
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
              <span class="chip-count">${n.expired}</span>
            </button>
            <button
              type="button"
              class="chip ${this._filterStatus==="expiring"?"active":""}"
              @click=${()=>this._setStatusFilter("expiring")}
            >
              Expiring
              <span class="chip-count">${n.expiring}</span>
            </button>
            <button
              type="button"
              class="chip ${this._filterStatus==="low_stock"?"active":""}"
              @click=${()=>this._setStatusFilter("low_stock")}
            >
              Low stock
              <span class="chip-count">${n.low_stock}</span>
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
                <ha-svg-icon .path=${Ft}></ha-svg-icon>
                Filters
                ${this._activeFilterCount?h`<span class="filter-badge">${this._activeFilterCount}</span>`:c}
              </button>
              <span class="item-count"
                >${t.length} of ${this._snapshot?.items.length??0}</span
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

          ${this.narrow?this._renderCardList(t):this._renderTable(t)}
        </div>
      </ha-top-app-bar-fixed>

      ${this._dialogOpen?this._renderDialog():c}
    `}_renderEmpty(){return this._snapshot?h`
      <div class="empty">
        No items match.
        <button class="link" @click=${this._openAdd}>Add an item</button>
      </div>
    `:h`<div class="empty">Loading inventory…</div>`}_renderQtyText(t){return h`
      <span class="qty-text"
        >${t.quantity}${t.desired_quantity?h` / ${t.desired_quantity}`:c}
        ${t.unit}</span
      >
    `}_expiryClass(t){return t==="expired"?"expiry-expired":t==="urgent"||t==="expiring"?"expiry-warn":""}_renderTable(t){return h`
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
            ${t.length===0?h`<tr>
                  <td colspan="6">${this._renderEmpty()}</td>
                </tr>`:c}
          </tbody>
        </table>
      </div>
    `}_renderCardList(t){return t.length===0?this._renderEmpty():h`
      <div class="card-list">
        ${t.map(e=>this._renderItemCard(e))}
      </div>
    `}_renderRow(t){const e=this._itemStatus(t);return h`
      <tr class=${e?`row-${e}`:""}>
        <td>
          <button class="link" @click=${()=>this._openEdit(t)}>
            ${t.name}
          </button>
          <div class="meta">
            ${e?h`<span class="badge badge-${e}"
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
    `}_renderItemCard(t){const e=this._itemStatus(t),i=[t.location,t.category].filter(Boolean).join(" · ");return h`
      <article
        class="item-card ${e?`row-${e}`:""}"
        @click=${()=>this._openEdit(t)}
      >
        <div class="item-card-top">
          <div class="item-card-title">
            <span class="item-name">${t.name}</span>
            ${e?h`<span class="badge badge-${e}"
                  >${this._statusLabel(e)}</span
                >`:c}
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
        ${i?h`<div class="meta">${i}</div>`:c}
        <div class="item-card-bottom">
          ${this._renderQtyText(t)}
          ${t.expiry_date?h`<span class="expiry ${this._expiryClass(e)}"
                >${t.expiry_date}</span
              >`:c}
        </div>
      </article>
    `}_formReadiness(){return this._readinessKind(this._form.category||"")}_showLitersField(){if(this._formReadiness()!=="water")return!1;const t=this._form.unit||"piece";return t!=="liter"&&t!=="milliliter"}_showCaloriesField(){return this._formReadiness()==="food"}_renderDialog(){const t=this._form,e=this._settings?.locations??[],i=this._settings?.categories??[];return h`
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
                .value=${t.name||""}
                @input=${this._onField("name")}
              />
            </label>
            <div class="row2">
              <label
                >Location
                <input
                  list="rh-locations"
                  .value=${t.location||""}
                  @input=${this._onField("location")}
                />
                <datalist id="rh-locations">
                  ${e.map(r=>h`<option value=${r}></option>`)}
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
                  ${i.map(r=>h`<option value=${r}></option>`)}
                </datalist>
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
              <textarea
                rows="2"
                .value=${t.notes||""}
                @input=${this._onField("notes")}
              ></textarea>
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
                ${Dt.map(r=>h`<option value=${r}>${r}</option>`)}
              </select>
            </label>
            ${this._showLitersField()?h`
                  <label
                    >Liters / unit
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      .value=${t.liters_per_unit||""}
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
                      .value=${t.calories_per_unit||""}
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
                .value=${t.expiry_date||""}
                @input=${this._onField("expiry_date")}
              />
            </label>
          </section>

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
    `}_onField(t){return e=>{const i=e.target;this._form={...this._form,[t]:i.value}}}async _run(t){this._busy=!0,this._error="";try{await t()}catch(e){this._error=String(e)}finally{this._busy=!1}}async _remove(t){confirm(`Remove “${t.name}”?`)&&await this._run(()=>this.hass.callService("ready_home","remove_item",{item_id:t.id}))}async _save(){const t=this._form,e=(t.name||"").trim();if(!e){this._error="Name is required";return}const i=this._formReadiness(),r={quantity:Number(t.quantity||0),desired_quantity:Number(t.desired_quantity||0),unit:t.unit||"piece",location:t.location||"",category:t.category||"",priority:t.priority||"important",barcode:t.barcode||"",notes:t.notes||""};t.expiry_date&&(r.expiry_date=t.expiry_date),i==="water"&&this._showLitersField()&&t.liters_per_unit!==""?r.liters_per_unit=Number(t.liters_per_unit):(i!=="water"||!this._showLitersField())&&(r.liters_per_unit=null),i==="food"&&t.calories_per_unit!==""?r.calories_per_unit=Number(t.calories_per_unit):i!=="food"&&(r.calories_per_unit=null),await this._run(async()=>{this._editing?await this.hass.callService("ready_home","update_item",{item_id:this._editing.id,new_name:e,...r}):await this.hass.callService("ready_home","add_item",{name:e,...r}),this._dialogOpen=!1})}async _lookupBarcode(){const t=this._form.barcode?.trim();if(t){this._busy=!0,this._error="";try{const e=await Tt(this.hass,t),i=[e.brand,e.name].filter(Boolean).join(" ").trim(),r=this._form.category?.trim()||(this._settings?.food_categories?.[0]??"Food");this._form={...this._form,name:i||this._form.name,category:r,calories_per_unit:e.calories_per_100g!=null?String(e.calories_per_100g):this._form.calories_per_unit}}catch(e){this._error=`Barcode lookup failed: ${e}`}finally{this._busy=!1}}}async _scanBarcode(){if(typeof BarcodeDetector>"u"){this._error="BarcodeDetector not supported in this browser — enter the code manually.";return}this._busy=!0,this._error="";try{const t=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}}),e=document.createElement("video");e.srcObject=t,await e.play();const i=new BarcodeDetector({formats:["ean_13","ean_8","upc_a","upc_e","code_128"]});await new Promise(o=>setTimeout(o,700));const r=await i.detect(e);t.getTracks().forEach(o=>o.stop()),r[0]?.rawValue?(this._form={...this._form,barcode:r[0].rawValue},this._busy=!1,await this._lookupBarcode()):this._error="No barcode detected — try again or enter manually."}catch(t){this._error=`Camera scan failed: ${t}`}finally{this._busy=!1}}static{this.styles=ht`
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
  `}}g([D({attribute:!1})],f.prototype,"hass");g([D({type:Boolean})],f.prototype,"narrow");g([D({attribute:!1})],f.prototype,"panel");g([m()],f.prototype,"_snapshot");g([m()],f.prototype,"_settings");g([m()],f.prototype,"_search");g([m()],f.prototype,"_filterStatus");g([m()],f.prototype,"_filterLocation");g([m()],f.prototype,"_filterCategory");g([m()],f.prototype,"_filterReadiness");g([m()],f.prototype,"_filtersOpen");g([m()],f.prototype,"_sort");g([m()],f.prototype,"_dialogOpen");g([m()],f.prototype,"_editing");g([m()],f.prototype,"_form");g([m()],f.prototype,"_error");g([m()],f.prototype,"_busy");customElements.get(st)||customElements.define(st,f);
//# sourceMappingURL=ready-home-panel.js.map
