var e=globalThis,t=e.ShadowRoot&&(e.ShadyCSS===void 0||e.ShadyCSS.nativeShadow)&&`adoptedStyleSheets`in Document.prototype&&`replace`in CSSStyleSheet.prototype,n=Symbol(),r=new WeakMap,i=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,n=this.t;if(t&&e===void 0){let t=n!==void 0&&n.length===1;t&&(e=r.get(n)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&r.set(n,e))}return e}toString(){return this.cssText}},a=e=>new i(typeof e==`string`?e:e+``,void 0,n),o=(e,...t)=>new i(e.length===1?e[0]:t.reduce((t,n,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if(typeof e==`number`)return e;throw Error(`Value passed to 'css' function must be a 'css' function result: `+e+`. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`)})(n)+e[r+1],e[0]),e,n),s=(n,r)=>{if(t)n.adoptedStyleSheets=r.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let t of r){let r=document.createElement(`style`),i=e.litNonce;i!==void 0&&r.setAttribute(`nonce`,i),r.textContent=t.cssText,n.appendChild(r)}},c=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t=``;for(let n of e.cssRules)t+=n.cssText;return a(t)})(e):e,{is:l,defineProperty:u,getOwnPropertyDescriptor:d,getOwnPropertyNames:f,getOwnPropertySymbols:p,getPrototypeOf:m}=Object,ee=globalThis,te=ee.trustedTypes,ne=te?te.emptyScript:``,re=ee.reactiveElementPolyfillSupport,ie=(e,t)=>e,ae={toAttribute(e,t){switch(t){case Boolean:e=e?ne:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},oe=(e,t)=>!l(e,t),se={attribute:!0,type:String,converter:ae,reflect:!1,useDefault:!1,hasChanged:oe};Symbol.metadata??=Symbol(`metadata`),ee.litPropertyMetadata??=new WeakMap;var ce=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=se){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol(),r=this.getPropertyDescriptor(e,n,t);r!==void 0&&u(this.prototype,e,r)}}static getPropertyDescriptor(e,t,n){let{get:r,set:i}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(t){let a=r?.call(this);i?.call(this,t),this.requestUpdate(e,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??se}static _$Ei(){if(this.hasOwnProperty(ie(`elementProperties`)))return;let e=m(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(ie(`finalized`)))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ie(`properties`))){let e=this.properties,t=[...f(e),...p(e)];for(let n of t)this.createProperty(n,e[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[e,n]of t)this.elementProperties.set(e,n)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let n=this._$Eu(e,t);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let e of n)t.unshift(c(e))}else e!==void 0&&t.push(c(e));return t}static _$Eu(e,t){let n=t.attribute;return!1===n?void 0:typeof n==`string`?n:typeof e==`string`?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return s(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){let n=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,n);if(r!==void 0&&!0===n.reflect){let i=(n.converter?.toAttribute===void 0?ae:n.converter).toAttribute(t,n.type);this._$Em=e,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(e,t){let n=this.constructor,r=n._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let e=n.getPropertyOptions(r),i=typeof e.converter==`function`?{fromAttribute:e.converter}:e.converter?.fromAttribute===void 0?ae:e.converter;this._$Em=r;let a=i.fromAttribute(t,e.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(e,t,n,r=!1,i){if(e!==void 0){let a=this.constructor;if(!1===r&&(i=this[e]),n??=a.getPropertyOptions(e),!((n.hasChanged??oe)(i,t)||n.useDefault&&n.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,n))))return;this.C(e,t,n)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:r,wrapped:i},a){n&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==i||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),!0===r&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[t,n]of e){let{wrapped:e}=n,r=this[t];!0!==e||this._$AL.has(t)||r===void 0||this.C(t,void 0,n,r)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};ce.elementStyles=[],ce.shadowRootOptions={mode:`open`},ce[ie(`elementProperties`)]=new Map,ce[ie(`finalized`)]=new Map,re?.({ReactiveElement:ce}),(ee.reactiveElementVersions??=[]).push(`2.1.2`);var le=globalThis,ue=e=>e,de=le.trustedTypes,fe=de?de.createPolicy(`lit-html`,{createHTML:e=>e}):void 0,pe=`$lit$`,h=`lit$${Math.random().toFixed(9).slice(2)}$`,me=`?`+h,he=`<${me}>`,g=document,ge=()=>g.createComment(``),_e=e=>e===null||typeof e!=`object`&&typeof e!=`function`,ve=Array.isArray,ye=e=>ve(e)||typeof e?.[Symbol.iterator]==`function`,be=`[ 	
\f\r]`,xe=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Se=/-->/g,Ce=/>/g,_=RegExp(`>|${be}(?:([^\\s"'>=/]+)(${be}*=${be}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,`g`),we=/'/g,Te=/"/g,Ee=/^(?:script|style|textarea|title)$/i,v=(e=>(t,...n)=>({_$litType$:e,strings:t,values:n}))(1),y=Symbol.for(`lit-noChange`),b=Symbol.for(`lit-nothing`),De=new WeakMap,x=g.createTreeWalker(g,129);function Oe(e,t){if(!ve(e)||!e.hasOwnProperty(`raw`))throw Error(`invalid template strings array`);return fe===void 0?t:fe.createHTML(t)}var ke=(e,t)=>{let n=e.length-1,r=[],i,a=t===2?`<svg>`:t===3?`<math>`:``,o=xe;for(let t=0;t<n;t++){let n=e[t],s,c,l=-1,u=0;for(;u<n.length&&(o.lastIndex=u,c=o.exec(n),c!==null);)u=o.lastIndex,o===xe?c[1]===`!--`?o=Se:c[1]===void 0?c[2]===void 0?c[3]!==void 0&&(o=_):(Ee.test(c[2])&&(i=RegExp(`</`+c[2],`g`)),o=_):o=Ce:o===_?c[0]===`>`?(o=i??xe,l=-1):c[1]===void 0?l=-2:(l=o.lastIndex-c[2].length,s=c[1],o=c[3]===void 0?_:c[3]===`"`?Te:we):o===Te||o===we?o=_:o===Se||o===Ce?o=xe:(o=_,i=void 0);let d=o===_&&e[t+1].startsWith(`/>`)?` `:``;a+=o===xe?n+he:l>=0?(r.push(s),n.slice(0,l)+pe+n.slice(l)+h+d):n+h+(l===-2?t:d)}return[Oe(e,a+(e[n]||`<?>`)+(t===2?`</svg>`:t===3?`</math>`:``)),r]},Ae=class e{constructor({strings:t,_$litType$:n},r){let i;this.parts=[];let a=0,o=0,s=t.length-1,c=this.parts,[l,u]=ke(t,n);if(this.el=e.createElement(l,r),x.currentNode=this.el.content,n===2||n===3){let e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;(i=x.nextNode())!==null&&c.length<s;){if(i.nodeType===1){if(i.hasAttributes())for(let e of i.getAttributeNames())if(e.endsWith(pe)){let t=u[o++],n=i.getAttribute(e).split(h),r=/([.?@])?(.*)/.exec(t);c.push({type:1,index:a,name:r[2],strings:n,ctor:r[1]===`.`?Pe:r[1]===`?`?Fe:r[1]===`@`?Ie:Ne}),i.removeAttribute(e)}else e.startsWith(h)&&(c.push({type:6,index:a}),i.removeAttribute(e));if(Ee.test(i.tagName)){let e=i.textContent.split(h),t=e.length-1;if(t>0){i.textContent=de?de.emptyScript:``;for(let n=0;n<t;n++)i.append(e[n],ge()),x.nextNode(),c.push({type:2,index:++a});i.append(e[t],ge())}}}else if(i.nodeType===8){if(i.data===me)c.push({type:2,index:a});else{let e=-1;for(;(e=i.data.indexOf(h,e+1))!==-1;)c.push({type:7,index:a}),e+=h.length-1}}a++}}static createElement(e,t){let n=g.createElement(`template`);return n.innerHTML=e,n}};function S(e,t,n=e,r){if(t===y)return t;let i=r===void 0?n._$Cl:n._$Co?.[r],a=_e(t)?void 0:t._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(e),i._$AT(e,n,r)),r===void 0?n._$Cl=i:(n._$Co??=[])[r]=i),i!==void 0&&(t=S(e,i._$AS(e,t.values),i,r)),t}var je=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,r=(e?.creationScope??g).importNode(t,!0);x.currentNode=r;let i=x.nextNode(),a=0,o=0,s=n[0];for(;s!==void 0;){if(a===s.index){let t;s.type===2?t=new Me(i,i.nextSibling,this,e):s.type===1?t=new s.ctor(i,s.name,s.strings,this,e):s.type===6&&(t=new Le(i,this,e)),this._$AV.push(t),s=n[++o]}a!==s?.index&&(i=x.nextNode(),a++)}return x.currentNode=g,r}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings===void 0?n._$AI(e[t]):(n._$AI(e,n,t),t+=n.strings.length-2)),t++}},Me=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,r){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=S(this,e,t),_e(e)?e===b||e==null||e===``?(this._$AH!==b&&this._$AR(),this._$AH=b):e!==this._$AH&&e!==y&&this._(e):e._$litType$===void 0?e.nodeType===void 0?ye(e)?this.k(e):this._(e):this.T(e):this.$(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==b&&_e(this._$AH)?this._$AA.nextSibling.data=e:this.T(g.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,r=typeof n==`number`?this._$AC(e):(n.el===void 0&&(n.el=Ae.createElement(Oe(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===r)this._$AH.p(t);else{let e=new je(r,this),n=e.u(this.options);e.p(t),this.T(n),this._$AH=e}}_$AC(e){let t=De.get(e.strings);return t===void 0&&De.set(e.strings,t=new Ae(e)),t}k(t){ve(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,r,i=0;for(let a of t)i===n.length?n.push(r=new e(this.O(ge()),this.O(ge()),this,this.options)):r=n[i],r._$AI(a),i++;i<n.length&&(this._$AR(r&&r._$AB.nextSibling,i),n.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let t=ue(e).nextSibling;ue(e).remove(),e=t}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},Ne=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,r,i){this.type=1,this._$AH=b,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=i,n.length>2||n[0]!==``||n[1]!==``?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=b}_$AI(e,t=this,n,r){let i=this.strings,a=!1;if(i===void 0)e=S(this,e,t,0),a=!_e(e)||e!==this._$AH&&e!==y,a&&(this._$AH=e);else{let r=e,o,s;for(e=i[0],o=0;o<i.length-1;o++)s=S(this,r[n+o],t,o),s===y&&(s=this._$AH[o]),a||=!_e(s)||s!==this._$AH[o],s===b?e=b:e!==b&&(e+=(s??``)+i[o+1]),this._$AH[o]=s}a&&!r&&this.j(e)}j(e){e===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??``)}},Pe=class extends Ne{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===b?void 0:e}},Fe=class extends Ne{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==b)}},Ie=class extends Ne{constructor(e,t,n,r,i){super(e,t,n,r,i),this.type=5}_$AI(e,t=this){if((e=S(this,e,t,0)??b)===y)return;let n=this._$AH,r=e===b&&n!==b||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==b&&(n===b||r);r&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH==`function`?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Le=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){S(this,e)}},Re={M:pe,P:h,A:me,C:1,L:ke,R:je,D:ye,V:S,I:Me,H:Ne,N:Fe,U:Ie,B:Pe,F:Le},ze=le.litHtmlPolyfillSupport;ze?.(Ae,Me),(le.litHtmlVersions??=[]).push(`3.3.3`);var Be=(e,t,n)=>{let r=n?.renderBefore??t,i=r._$litPart$;if(i===void 0){let e=n?.renderBefore??null;r._$litPart$=i=new Me(t.insertBefore(ge(),e),e,void 0,n??{})}return i._$AI(e),i},Ve=globalThis,C=class extends ce{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Be(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return y}};C._$litElement$=!0,C.finalized=!0,Ve.litElementHydrateSupport?.({LitElement:C});var He=Ve.litElementPolyfillSupport;He?.({LitElement:C}),(Ve.litElementVersions??=[]).push(`4.2.2`);var Ue={attribute:!0,type:String,converter:ae,reflect:!1,hasChanged:oe},We=(e=Ue,t,n)=>{let{kind:r,metadata:i}=n,a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),r===`setter`&&((e=Object.create(e)).wrapped=!0),a.set(n.name,e),r===`accessor`){let{name:r}=n;return{set(n){let i=t.get.call(this);t.set.call(this,n),this.requestUpdate(r,i,e,!0,n)},init(t){return t!==void 0&&this.C(r,void 0,e,t),t}}}if(r===`setter`){let{name:r}=n;return function(n){let i=this[r];t.call(this,n),this.requestUpdate(r,i,e,!0,n)}}throw Error(`Unsupported decorator location: `+r)};function w(e){return(t,n)=>typeof n==`object`?We(e,t,n):((e,t,n)=>{let r=t.hasOwnProperty(n);return t.constructor.createProperty(n,e),r?Object.getOwnPropertyDescriptor(t,n):void 0})(e,t,n)}function T(e){return w({...e,state:!0,attribute:!1})}var Ge=(e,t,n)=>(n.configurable=!0,n.enumerable=!0,Reflect.decorate&&typeof t!=`object`&&Object.defineProperty(e,t,n),n);function Ke(e,t){return(n,r,i)=>{let a=t=>t.renderRoot?.querySelector(e)??null;if(t){let{get:e,set:t}=typeof r==`object`?n:i??(()=>{let e=Symbol();return{get(){return this[e]},set(t){this[e]=t}}})();return Ge(n,r,{get(){let n=e.call(this);return n===void 0&&(n=a(this),(n!==null||this.hasUpdated)&&t.call(this,n)),n}})}return Ge(n,r,{get(){return a(this)}})}}var qe=[`primary`,`gray`,`success`,`warning`,`danger`,`info`],Je=[`xs`,`sm`,`md`,`lg`,`xl`],Ye={xs:[24,8,12,14],sm:[32,12,13,16],md:[40,16,14,20],lg:[48,20,16,24],xl:[56,24,18,28]},Xe={danger:`var(--error-color, #db4437)`,warning:`var(--warning-color, #ffa600)`,success:`var(--success-color, #43a047)`,info:`var(--info-color, #039be5)`};function Ze(e,t){return`
  --hpu-${e}: ${t};
  --hpu-${e}-tint: color-mix(in srgb, var(--hpu-${e}) var(--_hpu-tint), var(--hpu-surface-raised));
  --hpu-${e}-border: color-mix(in srgb, var(--hpu-${e}) var(--_hpu-tint-border), var(--hpu-surface-raised));
  --hpu-${e}-text: color-mix(in srgb, var(--hpu-${e}) var(--_hpu-tone-text), var(--hpu-text));
  --hpu-${e}-solid: var(--hpu-${e});
  --hpu-${e}-on: var(--hpu-surface-raised);`}function Qe(e=`:root, :host, .hpu-root`){let t=e.split(`,`).map(e=>`${e.trim()}[data-theme='dark']`).join(`, `),n=Object.entries(Ye).map(([e,[t,n,r,i]])=>`
  --hpu-size-${e}-height: ${t}px;
  --hpu-size-${e}-padding: ${n}px;
  --hpu-size-${e}-font: ${r}px;
  --hpu-size-${e}-icon: ${i}px;`).join(``);return`
${e} {
  --_hpu-tint: 12%;
  --_hpu-tint-border: 40%;
  --_hpu-tone-text: 45%;

  /* Surface and text */
  --hpu-surface: var(--primary-background-color, #fafafa);
  --hpu-surface-raised: var(--card-background-color, #ffffff);
  /* Fallbacks derive from the surface and text, so a dark theme that omits these stays dark. */
  --hpu-surface-sunken: var(
    --secondary-background-color,
    color-mix(in srgb, var(--hpu-text) 9%, var(--hpu-surface))
  );
  --hpu-border: var(
    --divider-color,
    color-mix(in srgb, var(--hpu-text) 14%, var(--hpu-surface-raised))
  );
  --hpu-border-strong: color-mix(in srgb, var(--hpu-text) 50%, var(--hpu-surface-raised));
  --hpu-text: var(--primary-text-color, #212121);
  /* Nudged toward the primary text so muted text keeps AA contrast on sunken surfaces. */
  --hpu-text-muted: color-mix(in srgb, var(--secondary-text-color, #727272) 80%, var(--hpu-text));

  /* Accent. On-accent picks black or white from the accent's lightness so text stays legible. */
  --hpu-accent: var(--primary-color, #03a9f4);
  --hpu-on-accent: var(--text-primary-color, #ffffff);

  /* Status and gray tones */${[Ze(`primary`,`var(--hpu-accent)`),Ze(`gray`,`var(--hpu-text-muted)`),...Object.entries(Xe).map(([e,t])=>Ze(e,t))].join(``)}

  /* Interaction states */
  --hpu-hover: color-mix(in srgb, var(--hpu-text) 6%, transparent);
  --hpu-pressed: color-mix(in srgb, var(--hpu-text) 12%, transparent);
  --hpu-selected: color-mix(in srgb, var(--hpu-accent) 14%, transparent);

  /* Container surfaces (cards, sections, tables): border and shadow are one look decision. */
  --hpu-surface-border: 1px solid var(--hpu-border);
  --hpu-surface-shadow: none;

  /* Shape */
  --hpu-radius-sm: 4px;
  --hpu-radius-md: 8px;
  --hpu-radius-lg: 12px;
  --hpu-radius-pill: 999px;

  /* Spacing: 4px base, 8px rhythm */
  --hpu-space-1: 4px;
  --hpu-space-2: 8px;
  --hpu-space-3: 12px;
  --hpu-space-4: 16px;
  --hpu-space-5: 24px;
  --hpu-space-6: 32px;
  --hpu-space-7: 48px;
  --hpu-space-8: 64px;

  /* Type: font comes from HA, scale is ours */
  --hpu-font: var(--ha-font-family-body, var(--paper-font-body1_-_font-family, inherit));
  --hpu-text-xs: 12px;
  --hpu-text-sm: 14px;
  --hpu-text-md: 16px;
  --hpu-text-lg: 20px;
  --hpu-text-xl: 28px;
  --hpu-weight-regular: 400;
  --hpu-weight-medium: 500;
  --hpu-weight-bold: 600;
  --hpu-leading-tight: 1.25;
  --hpu-leading-normal: 1.5;

  /* Elevation (flat-leaning) */
  --hpu-shadow-1: 0 1px 2px color-mix(in srgb, var(--hpu-text) 12%, transparent);
  --hpu-shadow-2: 0 4px 12px color-mix(in srgb, var(--hpu-text) 16%, transparent);

  /* Motion */
  --hpu-duration-fast: 100ms;
  --hpu-duration: 180ms;
  --hpu-ease: cubic-bezier(0.2, 0, 0, 1);

  /* Focus and touch */
  --hpu-focus-color: color-mix(in srgb, var(--hpu-accent) 60%, var(--hpu-text));
  --hpu-focus-ring: 2px solid var(--hpu-focus-color);
  --hpu-touch-target: 44px;

  /* Size scale (md is the default) */${n}

  /* Page width */
  --hpu-width-md: 768px;
  --hpu-width-lg: 1024px;
  --hpu-width-xl: 1280px;
  --hpu-width-full: 100%;
}

@supports (color: oklch(from red l c h)) {
  ${e} {
    /* Text on the exact accent: white on dark accents, a dark shade of the accent on light ones. */
    --hpu-on-accent: oklch(from var(--hpu-accent) calc(0.99 - 0.74 * clamp(0, (l - 0.56) * 1000, 1)) calc(c * 0.6 * clamp(0, (l - 0.56) * 1000, 1)) h);${qe.map(e=>`
    /* Solid fill: dark tones and light tones keep their color; mid-tones, where neither white
       nor dark text reads well, are deepened to lightness 0.48 for white text. */
    --hpu-${e}-solid: oklch(from var(--hpu-${e}) calc(clamp(0, (l - 0.77) * 1000, 1) * l + (1 - clamp(0, (l - 0.77) * 1000, 1)) * min(l, 0.48)) c h);
    /* On a dark solid: near white. On a light solid: a dark shade of the same hue (not black). */
    --hpu-${e}-on: oklch(from var(--hpu-${e}-solid) calc(0.99 - 0.74 * clamp(0, (l - 0.7) * 1000, 1)) calc(c * 0.6 * clamp(0, (l - 0.7) * 1000, 1)) h);`).join(``)}
  }
}

${t} {
  --_hpu-tint: 22%;
  --_hpu-tint-border: 50%;
}

@media (prefers-reduced-motion: reduce) {
  ${e} {
    --hpu-duration-fast: 0ms;
    --hpu-duration: 0ms;
  }
}
`}var $e=Qe();function et(e=document){let t=new CSSStyleSheet;return t.replaceSync($e),e.adoptedStyleSheets=[...e.adoptedStyleSheets,t],t}var E=a(`
  :host {
    --_c: var(--hpu-primary);
    --_solid: var(--hpu-primary-solid);
    --_on: var(--hpu-primary-on);
    --_tint: var(--hpu-primary-tint);
    --_border: var(--hpu-primary-border);
    --_text: var(--hpu-primary-text);
  }
  ${qe.map(e=>`:host([tone='${e}']) {
    --_c: var(--hpu-${e});
    --_solid: var(--hpu-${e}-solid);
    --_on: var(--hpu-${e}-on);
    --_tint: var(--hpu-${e}-tint);
    --_border: var(--hpu-${e}-border);
    --_text: var(--hpu-${e}-text);
  }`).join(`
`)}
`),D=a(`
  :host {
    --_h: var(--hpu-size-md-height);
    --_pad: var(--hpu-size-md-padding);
    --_font: var(--hpu-size-md-font);
    --_icon: var(--hpu-size-md-icon);
  }
  ${Je.map(e=>`:host([size='${e}']) {
    --_h: var(--hpu-size-${e}-height);
    --_pad: var(--hpu-size-${e}-padding);
    --_font: var(--hpu-size-${e}-font);
    --_icon: var(--hpu-size-${e}-icon);
  }`).join(`
`)}
`),tt=o`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  .control {
    position: relative;
    font-family: var(--hpu-font);
  }
  .control:focus-visible {
    outline: var(--hpu-focus-ring);
    outline-offset: 2px;
  }
  /*
   * xs and sm stay visually small but get a 44px hit area (both directions) on touch devices.
   * It is centered on the control by its start corner and translated back (mirrored in
   * right-to-left); the extra 2px makes up for a 1px border, as the box starts at the padding edge.
   */
  @media (pointer: coarse) {
    .control::after {
      content: '';
      position: absolute;
      inset-block-start: 50%;
      inset-inline-start: 50%;
      inline-size: max(calc(100% + 2px), var(--hpu-touch-target));
      block-size: max(calc(100% + 2px), var(--hpu-touch-target));
      translate: -50% -50%;
    }
    :host(:dir(rtl)) .control::after {
      translate: 50% -50%;
    }
  }
  @media (forced-colors: active) {
    .control:focus-visible {
      outline: 2px solid Highlight;
    }
  }
`;o`
  .visually-hidden {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
`;var nt=`0.2.0`,rt=e=>e.split(`.`)[0],it=new Set;function at(e,t,n=nt){let r=customElements.get(e);if(!r){Object.defineProperty(t,"libVersion",{value:n}),customElements.define(e,t);return}let i=r.libVersion??`unknown`;rt(i)!==rt(n)&&!it.has(`${i}>${n}`)&&(it.add(`${i}>${n}`),console.warn(`ha-panel-ui ${n} found version ${i} already registered (<${e}>). The older copy is used by both panels. Align the versions to avoid surprises.`))}var O=e=>t=>{at(e,t)};function k(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}var ot=class extends C{constructor(...e){super(...e),this.tone=`gray`,this.size=`md`}static{this.styles=[E,D,o`
      :host {
        /* Long unbroken text wraps instead of overflowing the component. */
        overflow-wrap: anywhere;
        display: inline-flex;
        align-items: center;
        gap: var(--hpu-space-1);
        padding-inline: calc(var(--_pad) * 0.75);
        padding-block: 2px;
        min-block-size: calc(var(--_h) * 0.6);
        font: var(--hpu-weight-medium) var(--_font) / var(--hpu-leading-tight) var(--hpu-font);
        color: var(--_text);
        background: var(--_tint);
        border: 1px solid var(--_border);
        border-radius: var(--hpu-radius-pill);
        max-inline-size: 100%;
        box-sizing: border-box;
      }
      slot[name='icon']::slotted(*) {
        inline-size: var(--_icon);
        block-size: var(--_icon);
      }
    `]}render(){return v`<slot name="icon"></slot><slot></slot>`}};k([w({reflect:!0})],ot.prototype,`tone`,void 0),k([w({reflect:!0})],ot.prototype,`size`,void 0),ot=k([O(`hpu-badge`)],ot);var st={"common.close":`Close`,"common.cancel":`Cancel`,"common.confirm":`Confirm`,"common.save":`Save`,"common.delete":`Delete`,"common.reset":`Reset`,"common.loading":`Loading`,"common.search":`Search`,"common.clear":`Clear`,"common.dismiss":`Dismiss`,"common.undo":`Undo`,"common.more":`More actions`,"common.required":`Required`,"table.empty":`Nothing to show`,"table.sort_ascending":`Sorted ascending`,"table.sort_descending":`Sorted descending`,"table.page_of":`{from}–{to} of {total}`,"table.previous":`Previous page`,"table.next":`Next page`,"table.sort_by":`Sort by`,"table.select_row":`Select row`,"table.select_all":`Select all rows`,"filter.title":`Filters`,"filter.apply":`Apply filters`,"filter.advanced":`More filters`,"filter.active_count":`{count} active`,"filter.no_results":`No results match your filters`,"page.menu":`Open menu`,"toast.region":`Notifications`,"select.no_results":`No results`,"select.loading":`Loading options`,"select.clear":`Clear selection`,"select.remove":`Remove {label}`,"connection.lost":`Connection to Home Assistant lost`,"connection.reconnecting":`Reconnecting to Home Assistant`},ct={"common.close":`Sluiten`,"common.cancel":`Annuleren`,"common.confirm":`Bevestigen`,"common.save":`Opslaan`,"common.delete":`Verwijderen`,"common.reset":`Herstellen`,"common.loading":`Laden`,"common.search":`Zoeken`,"common.clear":`Wissen`,"common.dismiss":`Negeren`,"common.undo":`Ongedaan maken`,"common.more":`Meer acties`,"common.required":`Verplicht`,"table.empty":`Niets om te tonen`,"table.sort_ascending":`Oplopend gesorteerd`,"table.sort_descending":`Aflopend gesorteerd`,"table.page_of":`{from}–{to} van {total}`,"table.previous":`Vorige pagina`,"table.next":`Volgende pagina`,"table.sort_by":`Sorteren op`,"table.select_row":`Rij selecteren`,"table.select_all":`Alle rijen selecteren`,"filter.title":`Filters`,"filter.apply":`Filters toepassen`,"filter.advanced":`Meer filters`,"filter.active_count":`{count} actief`,"filter.no_results":`Geen resultaten voor deze filters`,"page.menu":`Menu openen`,"toast.region":`Meldingen`,"select.no_results":`Geen resultaten`,"select.loading":`Opties laden`,"select.clear":`Selectie wissen`,"select.remove":`{label} verwijderen`,"connection.lost":`Verbinding met Home Assistant verbroken`,"connection.reconnecting":`Opnieuw verbinden met Home Assistant`};function lt(e,t){return t?e.replace(/\{(\w+)\}/g,(e,n)=>n in t?String(t[n]):e):e}function ut(e,t){let n=t.fallback??`en`;return(r,i)=>{let a=t.language(),o=[a,a.split(`-`)[0]??a,n];for(let n of o){let a=t.overrides?.[n]?.[r]??e[n]?.[r];if(a!==void 0)return lt(a,i)}return r}}function dt(e,t){return ut({en:st,nl:ct,...t?.tables},{language:e,overrides:t?.overrides})}var ft=``,pt,mt;function ht(e={}){e.language!==void 0&&(ft=e.language),pt=e,mt=void 0}function A(e,t){return mt??=dt(()=>ft||document.documentElement.lang||navigator.language||`en`,pt),mt(e,t)}var gt=class extends C{constructor(...e){super(...e),this.tone=`primary`,this.size=`md`,this.label=``}static{this.styles=[E,D,o`
      :host {
        display: inline-flex;
        inline-size: var(--_icon);
        block-size: var(--_icon);
        color: var(--_text);
      }
      svg {
        inline-size: 100%;
        block-size: 100%;
        animation: spin 0.9s linear infinite;
      }
      circle {
        fill: none;
        stroke: currentColor;
        stroke-width: 3;
        stroke-linecap: round;
        stroke-dasharray: 40 100;
      }
      /* Essential progress feedback: slowed rather than removed under reduced motion. */
      @media (prefers-reduced-motion: reduce) {
        svg {
          animation-duration: 2.4s;
        }
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `]}render(){return v`<svg viewBox="0 0 24 24" role="img" aria-label=${this.label||A(`common.loading`)}>
      <circle cx="12" cy="12" r="9"></circle>
    </svg>`}};k([w({reflect:!0})],gt.prototype,`tone`,void 0),k([w({reflect:!0})],gt.prototype,`size`,void 0),k([w()],gt.prototype,`label`,void 0),gt=k([O(`hpu-spinner`)],gt);var j=e=>e??b,M=class extends C{constructor(...e){super(...e),this.#e=this.attachInternals(),this.variant=`filled`,this.tone=`primary`,this.size=`md`,this.loading=!1,this.disabled=!1,this.type=`button`}static{this.shadowRootOptions={...C.shadowRootOptions,delegatesFocus:!0}}static{this.formAssociated=!0}#e;static{this.styles=[E,D,tt,o`
      :host {
        display: inline-flex;
      }
      :host([hidden]) {
        display: none;
      }
      .control {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--hpu-space-2);
        min-block-size: var(--_h);
        padding-inline: var(--_pad);
        font-size: var(--_font);
        font-weight: var(--hpu-weight-medium);
        line-height: var(--hpu-leading-tight);
        border: 1px solid transparent;
        border-radius: var(--hpu-radius-md);
        background: transparent;
        color: var(--_text);
        cursor: pointer;
        transition:
          background-color var(--hpu-duration-fast) var(--hpu-ease),
          border-color var(--hpu-duration-fast) var(--hpu-ease);
      }
      .control::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background: transparent;
        pointer-events: none;
        transition: background-color var(--hpu-duration-fast) var(--hpu-ease);
      }
      .control:hover:not(:disabled)::before {
        background: var(--hpu-hover);
      }
      .control:active:not(:disabled)::before {
        background: var(--hpu-pressed);
      }
      :host([variant='filled']) .control {
        background: var(--_solid);
        color: var(--_on);
      }
      :host([variant='tonal']) .control {
        background: var(--_tint);
        color: var(--_text);
      }
      :host([variant='outlined']) .control {
        border-color: var(--_border);
      }
      .control:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      :host([loading]) .control {
        cursor: progress;
      }
      .label,
      ::slotted(*) {
        position: relative;
      }
      .content {
        display: inline-flex;
        align-items: center;
        gap: var(--hpu-space-2);
      }
      :host([loading]) .content {
        visibility: hidden;
      }
      hpu-spinner {
        position: absolute;
        inset: 0;
        margin: auto;
        --_icon: var(--_font);
        color: inherit;
      }
      slot[name='icon']::slotted(*) {
        inline-size: var(--_icon);
        block-size: var(--_icon);
      }
    `]}render(){let e=this.disabled||this.loading;return v`<button
      class="control"
      part="control"
      type="button"
      ?disabled=${this.disabled}
      aria-disabled=${e?`true`:b}
      aria-busy=${this.loading?`true`:b}
      aria-expanded=${j(this.expanded)}
      aria-haspopup=${j(this.haspopup)}
      @click=${this.#t}
    >
      <span class="content"><slot name="icon"></slot><slot></slot></span>
      ${this.loading?v`<hpu-spinner tone=${this.tone}></hpu-spinner>`:b}
    </button>`}#t(e){this.disabled||this.loading?(e.stopImmediatePropagation(),e.preventDefault()):(this.dispatchEvent(new CustomEvent(`hpu-click`,{bubbles:!0,composed:!0})),this.type===`submit`?this.#e.form?.requestSubmit():this.type===`reset`&&this.#e.form?.reset())}};k([w()],M.prototype,`expanded`,void 0),k([w()],M.prototype,`haspopup`,void 0),k([w({reflect:!0})],M.prototype,`variant`,void 0),k([w({reflect:!0})],M.prototype,`tone`,void 0),k([w({reflect:!0})],M.prototype,`size`,void 0),k([w({type:Boolean,reflect:!0})],M.prototype,`loading`,void 0),k([w({type:Boolean,reflect:!0})],M.prototype,`disabled`,void 0),k([w()],M.prototype,`type`,void 0),M=k([O(`hpu-button`)],M);var _t=new Map,N=class extends C{constructor(...e){super(...e),this.path=``,this.name=``,this.label=``,this.size=`md`,this.mirrorRtl=!1}static{this.styles=[D,o`
      :host {
        display: inline-flex;
        inline-size: var(--_icon);
        block-size: var(--_icon);
        flex: none;
        color: inherit;
      }
      svg {
        inline-size: 100%;
        block-size: 100%;
        fill: currentColor;
      }
      :host([mirror-rtl]:dir(rtl)) svg {
        transform: scaleX(-1);
      }
    `]}render(){let e=this.path||_t.get(this.name)||``;return v`<svg
      viewBox="0 0 24 24"
      role=${this.label?`img`:b}
      aria-label=${this.label||b}
      aria-hidden=${this.label?b:`true`}
    >
      <path d=${e}></path>
    </svg>`}};k([w()],N.prototype,`path`,void 0),k([w()],N.prototype,`name`,void 0),k([w()],N.prototype,`label`,void 0),k([w({reflect:!0})],N.prototype,`size`,void 0),k([w({type:Boolean,attribute:`mirror-rtl`,reflect:!0})],N.prototype,`mirrorRtl`,void 0),N=k([O(`hpu-icon`)],N);var vt=`M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z`,yt=`M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z`,bt=`M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z`,xt=`M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z`,St=`M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z`,Ct=`M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z`,wt=`M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z`,Tt=`M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z`,Et=`M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z`,Dt=`M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z`,Ot=`M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z`,kt=`M6,13H18V11H6M3,6V8H21V6M10,18H14V16H10V18Z`,At=`M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z`,jt=`M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z`,Mt=`M19,13H5V11H19V13Z`,Nt=`M9,3L5,7H8V14H10V7H13M16,17V10H14V17H11L15,21L19,17H16Z`,Pt=`M22.11 21.46L2.39 1.73L1.11 3L3.22 5.11C3.08 5.38 3 5.68 3 6V18C3 19.11 3.9 20 5 20H18.11L20.84 22.73L22.11 21.46M10.11 12H5V8H6.11L10.11 12M11 18H5V14H11V18M13 18V14.89L16.11 18H13M13 9.8L7.2 4H19C20.11 4 21 4.89 21 6V17.8L19 15.8V14H17.2L15.2 12H19V8H13V9.8Z`,Ft=0,P=class extends C{constructor(...e){super(...e),this.internals=this.attachInternals(),this.uid=`hpu-toggle-${Ft++}`,this.checked=!1,this.disabled=!1,this.required=!1,this.compact=!1,this.name=``,this.value=`on`,this.label=``,this.hint=``,this.error=``}static{this.formAssociated=!0}get input(){return this.renderRoot.querySelector(`input`)}extraInputProps(){return{}}render(){let e=`${this.uid}-hint`,t=`${this.uid}-error`,n=[this.hint?e:``,this.error?t:``].filter(Boolean).join(` `)||void 0,r=`${this.uid}-label`,i=`${this.uid}-text`;return v`
      ${this.label?v`<span class="field-label" id=${r}
              >${this.label}${this.required?v`<span class="required" aria-hidden="true">*</span>`:b}</span
            >`:b}
      <label class="row">
        <input
          type="checkbox"
          role=${j(this.role_)}
          .checked=${this.checked}
          .indeterminate=${this.extraInputProps().indeterminate??!1}
          ?disabled=${this.disabled}
          ?required=${this.required}
          aria-labelledby=${this.label?`${r} ${i}`:b}
          aria-invalid=${this.error?`true`:b}
          aria-describedby=${j(n)}
          @change=${this.onChange}
        />
        ${this.renderVisual()}
        <span class="text" id=${i}
          ><slot></slot>${this.required&&!this.label?v`<span class="required" aria-hidden="true">*</span>`:b}</span
        >
      </label>
      ${this.hint?v`<p class="hint" id=${e}>${this.hint}</p>`:b}
      ${this.error?v`<p class="error" id=${t} role="alert">
              <hpu-icon .path=${yt} size="xs"></hpu-icon>${this.error}
            </p>`:b}
    `}onChange(e){this.checked=e.target.checked,this.afterChange(),this.dispatchEvent(new CustomEvent(`hpu-change`,{detail:{checked:this.checked},bubbles:!0,composed:!0}))}afterChange(){}updated(){this.internals.setFormValue(this.checked?this.value:null);let e=this.input??void 0;this.error?this.internals.setValidity({customError:!0},this.error,e):this.required&&!this.checked&&!this.disabled?this.internals.setValidity({valueMissing:!0},A(`common.required`),e):this.internals.setValidity({})}get validity(){return this.internals.validity}get validationMessage(){return this.internals.validationMessage}checkValidity(){return this.internals.checkValidity()}reportValidity(){return this.internals.reportValidity()}focus(e){this.input?.focus(e)}formDisabledCallback(e){this.disabled=e}formResetCallback(){this.checked=this.hasAttribute(`checked`)}};k([w({type:Boolean,reflect:!0})],P.prototype,`checked`,void 0),k([w({type:Boolean,reflect:!0})],P.prototype,`disabled`,void 0),k([w({type:Boolean,reflect:!0})],P.prototype,`required`,void 0),k([w({type:Boolean,reflect:!0})],P.prototype,`compact`,void 0),k([w()],P.prototype,`name`,void 0),k([w()],P.prototype,`value`,void 0),k([w()],P.prototype,`label`,void 0),k([w()],P.prototype,`hint`,void 0),k([w()],P.prototype,`error`,void 0);var It=o`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  :host {
    --_line: calc(var(--hpu-text-md) * var(--hpu-leading-normal));
    --_gap: var(--hpu-space-3);
    display: inline-block;
    vertical-align: top;
    max-inline-size: 100%;
    font-family: var(--hpu-font);
    color: var(--hpu-text);
  }
  :host([hidden]) {
    display: none;
  }
  .row {
    position: relative;
    display: inline-flex;
    align-items: flex-start;
    gap: var(--_gap);
    max-inline-size: 100%;
    /* 44px touch row for a single line of text. */
    padding-block: calc((var(--hpu-touch-target) - var(--_line)) / 2);
    font-size: var(--hpu-text-md);
    line-height: var(--hpu-leading-normal);
    cursor: pointer;
  }
  :host([compact]) .row {
    padding-block: 0;
    font-size: var(--hpu-text-sm);
    --_line: calc(var(--hpu-text-sm) * var(--hpu-leading-normal));
  }
  /* Compact toggles stay small to look at but keep a 44px hit area on touch devices. */
  @media (pointer: coarse) {
    :host([compact]) .row::after {
      content: '';
      position: absolute;
      inset-inline: 0;
      inset-block: calc((var(--_line) - var(--hpu-touch-target)) / 2);
    }
  }
  :host([disabled]) .row {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .visual {
    flex: none;
    /* Centre the control on the first line of text. */
    margin-block: calc((var(--_line) - var(--_visual-h)) / 2);
  }
  .field-label {
    display: block;
    margin-block-end: var(--hpu-space-1);
    font-size: var(--hpu-text-sm);
    font-weight: var(--hpu-weight-medium);
  }
  .text {
    min-inline-size: 0;
    overflow-wrap: anywhere;
  }
  input {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    margin: 0;
    opacity: 0;
  }
  input:focus-visible + .visual {
    outline: var(--hpu-focus-ring);
    outline-offset: 2px;
  }
  .hint,
  .error {
    margin: 0;
    margin-inline-start: calc(var(--_visual-w) + var(--_gap));
    font-size: var(--hpu-text-xs);
  }
  .hint {
    color: var(--hpu-text-muted);
  }
  .error {
    display: flex;
    align-items: center;
    gap: var(--hpu-space-1);
    color: var(--hpu-danger-text);
  }
  .required {
    margin-inline-start: 2px;
    color: var(--hpu-danger-text);
  }
`,Lt=class extends P{constructor(...e){super(...e),this.indeterminate=!1}static{this.styles=[It,o`
      :host {
        --_visual-w: 20px;
        --_visual-h: 20px;
      }
      .visual {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        inline-size: var(--_visual-w);
        block-size: var(--_visual-h);
        border: 2px solid var(--hpu-border-strong);
        border-radius: var(--hpu-radius-sm);
        background: var(--hpu-surface-raised);
        color: var(--hpu-on-accent);
      }
      .visual hpu-icon {
        --_icon: 16px;
        visibility: hidden;
      }
      input:checked + .visual,
      input:indeterminate + .visual {
        background: var(--hpu-accent);
        border-color: var(--hpu-focus-color);
      }
      input:checked + .visual hpu-icon,
      input:indeterminate + .visual hpu-icon {
        visibility: visible;
      }
    `]}extraInputProps(){return{indeterminate:this.indeterminate}}afterChange(){this.indeterminate=!1}renderVisual(){return v`<span class="visual"
      ><hpu-icon .path=${this.indeterminate?Mt:St}></hpu-icon
    ></span>`}};k([w({type:Boolean,reflect:!0})],Lt.prototype,`indeterminate`,void 0),Lt=k([O(`hpu-checkbox`)],Lt);function Rt(e){if(typeof e==`string`&&e)return e;if(e instanceof Error&&e.message)return e.message;if(e&&typeof e==`object`){let t=e.message;if(typeof t==`string`&&t)return t;let n=e.code;if(typeof n==`string`&&n)return n}return`Unknown error`}function zt(e,t,n,r,i=6){if(r<=0||n<=0)return{start:0,end:0,before:0,after:0};let a=Math.floor(Math.max(0,e)/n),o=Math.ceil(Math.max(0,t)/n),s=Math.min(r-1,Math.max(0,a-i)),c=Math.min(r,a+o+i);return{start:s,end:c,before:s*n,after:(r-c)*n}}var F=class extends C{constructor(...e){super(...e),this.path=``,this.name=``,this.label=``,this.variant=`text`,this.tone=`gray`,this.size=`md`,this.disabled=!1,this.mirrorRtl=!1}static{this.shadowRootOptions={...C.shadowRootOptions,delegatesFocus:!0}}static{this.styles=[E,D,tt,o`
      :host {
        display: inline-flex;
      }
      .control {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        inline-size: var(--_h);
        block-size: var(--_h);
        padding: 0;
        border: 1px solid transparent;
        border-radius: var(--hpu-radius-md);
        background: transparent;
        color: var(--_text);
        cursor: pointer;
      }
      .control::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        pointer-events: none;
      }
      .control:hover:not(:disabled)::before {
        background: var(--hpu-hover);
      }
      .control:active:not(:disabled)::before {
        background: var(--hpu-pressed);
      }
      :host([variant='filled']) .control {
        background: var(--_solid);
        color: var(--_on);
      }
      :host([variant='tonal']) .control {
        background: var(--_tint);
      }
      :host([variant='outlined']) .control {
        border-color: var(--_border);
      }
      .control:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `]}firstUpdated(){this.label||console.warn("hpu-icon-button: `label` is required for icon-only controls")}render(){return v`<button
      class="control"
      part="control"
      type="button"
      aria-label=${this.label||b}
      title=${this.label||b}
      aria-expanded=${j(this.expanded)}
      aria-haspopup=${j(this.haspopup)}
      ?disabled=${this.disabled}
      @click=${this.#e}
    >
      <hpu-icon
        .path=${this.path}
        .name=${this.name}
        ?mirror-rtl=${this.mirrorRtl}
        size=${this.size}
      ></hpu-icon>
    </button>`}#e(e){if(this.disabled)return e.stopImmediatePropagation();this.dispatchEvent(new CustomEvent(`hpu-click`,{bubbles:!0,composed:!0}))}};k([w()],F.prototype,`expanded`,void 0),k([w()],F.prototype,`haspopup`,void 0),k([w()],F.prototype,`path`,void 0),k([w()],F.prototype,`name`,void 0),k([w()],F.prototype,`label`,void 0),k([w({reflect:!0})],F.prototype,`variant`,void 0),k([w({reflect:!0})],F.prototype,`tone`,void 0),k([w({reflect:!0})],F.prototype,`size`,void 0),k([w({type:Boolean,reflect:!0})],F.prototype,`disabled`,void 0),k([w({type:Boolean,attribute:`mirror-rtl`})],F.prototype,`mirrorRtl`,void 0),F=k([O(`hpu-icon-button`)],F);function Bt(e,t,n={}){let r=n.gap??4,i=n.margin??8,a=()=>{let a=e.getBoundingClientRect(),o=document.documentElement.clientWidth,s=document.documentElement.clientHeight,c=getComputedStyle(e).direction===`rtl`;Object.assign(t.style,{position:`fixed`,inset:`auto`,margin:`0`,minInlineSize:n.matchWidth?`${a.width}px`:``,maxBlockSize:``});let l=t.getBoundingClientRect(),u=s-a.bottom-r-i,d=a.top-r-i,f=l.height>u&&d>u,p=Math.max(f?d:u,80);t.style.maxBlockSize=`${p}px`;let m=Math.min(l.height,p),ee=f?a.top-r-m:a.bottom+r,te=n.align===`end`===c?a.left:a.right-l.width;te=Math.min(Math.max(te,i),Math.max(i,o-l.width-i)),t.style.top=`${Math.round(ee)}px`,t.style.left=`${Math.round(te)}px`};a();let o=()=>a();window.addEventListener(`resize`,o),window.addEventListener(`scroll`,o,!0);let s=new ResizeObserver(o);return s.observe(e),()=>{s.disconnect(),window.removeEventListener(`resize`,o),window.removeEventListener(`scroll`,o,!0)}}var Vt=0,I=class extends C{constructor(...e){super(...e),this.items=[],this.label=``,this.align=`end`,this.open=!1,this.#e=`hpu-menu-${Vt++}`,this.#r=e=>{e.composedPath().includes(this)||this.#u(!1)}}#e;#t;static{this.styles=o`
    :host {
      /* Long unbroken text wraps instead of overflowing the component. */
      overflow-wrap: anywhere;
      display: inline-block;
      font-family: var(--hpu-font);
    }
    .popup {
      box-sizing: border-box;
      min-inline-size: 180px;
      padding: var(--hpu-space-1);
      overflow: auto;
      background: var(--hpu-surface-raised);
      color: var(--hpu-text);
      border: 1px solid var(--hpu-border);
      border-radius: var(--hpu-radius-md);
      box-shadow: var(--hpu-shadow-2);
      font-size: var(--hpu-text-sm);
    }
    .item {
      display: flex;
      align-items: center;
      gap: var(--hpu-space-2);
      inline-size: 100%;
      min-block-size: 36px;
      padding: var(--hpu-space-1) var(--hpu-space-3);
      border: 0;
      border-radius: var(--hpu-radius-sm);
      background: transparent;
      color: inherit;
      font: inherit;
      text-align: start;
      cursor: pointer;
    }
    .item:hover:not(:disabled),
    .item:focus-visible {
      background: var(--hpu-hover);
      outline: none;
    }
    .item:focus-visible {
      box-shadow: inset 0 0 0 2px var(--hpu-focus-color);
    }
    .item:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .item.danger {
      color: var(--hpu-danger-text);
    }
    hr {
      margin: var(--hpu-space-1) 0;
      border: 0;
      border-block-start: 1px solid var(--hpu-border);
    }
  `}render(){let e=this.label||A(`common.more`);return v`
      <span class="trigger" @click=${this.#s} @keydown=${this.#c}>
        <slot name="trigger" @slotchange=${()=>this.requestUpdate()}>
          <hpu-icon-button .path=${Ot} .label=${e}></hpu-icon-button>
        </slot>
      </span>
      <div
        class="popup"
        popover="manual"
        role="menu"
        id="${this.#e}-popup"
        aria-label=${e}
        @keydown=${this.#l}
      >
        ${this.items.map(e=>v`${e.divider?v`<hr role="separator" />`:b}<button
                class="item ${e.tone===`danger`?`danger`:``}"
                role="menuitem"
                type="button"
                tabindex="-1"
                ?disabled=${e.disabled}
                @click=${()=>this.#d(e)}
              >
                ${e.icon?v`<hpu-icon .path=${e.icon} size="sm"></hpu-icon>`:b}${e.label}
              </button>`)}
      </div>
    `}get#n(){return this.renderRoot.querySelector(`slot[name="trigger"]`)?.assignedElements({flatten:!0})[0]??this.renderRoot.querySelector(`hpu-icon-button`)}#r;updated(e){let t=this.#n;if(t){let e=this.open?`true`:`false`;if(`expanded`in t){let n=t;n.expanded=e,n.haspopup=`menu`}else t.setAttribute(`aria-haspopup`,`menu`),t.setAttribute(`aria-expanded`,e)}if(e.has(`open`)){if(this.open&&t){this.popup.showPopover(),document.addEventListener(`pointerdown`,this.#r,!0);let e=t.updateComplete;Promise.resolve(e).then(()=>{this.open&&(this.#t?.(),this.#t=Bt(t,this.popup,{align:this.align}))})}else!this.open&&this.popup.matches(`:popover-open`)&&this.#i()}}#i(){this.#t?.(),this.#t=void 0,document.removeEventListener(`pointerdown`,this.#r,!0);try{this.popup?.hidePopover()}catch{}}disconnectedCallback(){super.disconnectedCallback(),this.#i()}get#a(){return[...this.renderRoot.querySelectorAll(`.item:not(:disabled)`)]}async#o(e){this.open||(this.open=!0,await this.updateComplete);let t=this.#a;(e===`first`?t[0]:t[t.length-1])?.focus()}#s(e){e.composedPath().includes(this.#n)&&(this.open?this.#u(!0):this.#o(`first`))}#c(e){e.key===`ArrowDown`||e.key===`ArrowUp`?(e.preventDefault(),this.#o(e.key===`ArrowDown`?`first`:`last`)):e.key===`Escape`&&this.open&&(e.preventDefault(),e.stopPropagation(),this.#u(!0))}#l(e){let t=this.#a,n=t.indexOf(this.shadowRoot?.activeElement??null);switch(e.key){case`ArrowDown`:e.preventDefault(),t[(n+1)%t.length]?.focus();break;case`ArrowUp`:e.preventDefault(),t[(n-1+t.length)%t.length]?.focus();break;case`Home`:e.preventDefault(),t[0]?.focus();break;case`End`:e.preventDefault(),t[t.length-1]?.focus();break;case`Escape`:e.preventDefault(),e.stopPropagation(),this.#u(!0);break;case`Tab`:this.#u(!1)}}#u(e){this.open&&(this.open=!1,e&&this.#n?.focus())}#d(e){e.disabled||(this.dispatchEvent(new CustomEvent(`hpu-select`,{detail:{id:e.id},bubbles:!0,composed:!0})),this.#u(!0))}};k([w({attribute:!1})],I.prototype,`items`,void 0),k([w()],I.prototype,`label`,void 0),k([w({reflect:!0})],I.prototype,`align`,void 0),k([w({type:Boolean,reflect:!0})],I.prototype,`open`,void 0),k([Ke(`.popup`)],I.prototype,`popup`,void 0),I=k([O(`hpu-menu`)],I);var Ht=0,L=class extends C{constructor(...e){super(...e),this.internals=this.attachInternals(),this.uid=`hpu-field-${Ht++}`,this.label=``,this.hint=``,this.error=``,this.name=``,this.value=``,this.placeholder=``,this.hideLabel=!1,this.required=!1,this.disabled=!1,this.readonly=!1,this.size=`md`}static{this.formAssociated=!0}static{this.styles=[D,o`
      :host {
        /* Long unbroken text wraps instead of overflowing the component. */
        overflow-wrap: anywhere;
        display: block;
        font-family: var(--hpu-font);
        color: var(--hpu-text);
      }
      :host([hidden]) {
        display: none;
      }
      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }
      .label {
        display: block;
        margin-block-end: var(--hpu-space-1);
        font-size: var(--hpu-text-sm);
        font-weight: var(--hpu-weight-medium);
        /* Explicit so the label height is the same on every platform: forms offset toggles by it. */
        line-height: var(--hpu-leading-tight);
      }
      .label.vh {
        position: absolute;
        inline-size: 1px;
        block-size: 1px;
        margin: 0;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
      }
      .required {
        margin-inline-start: 2px;
        color: var(--hpu-danger-text);
      }
      .control {
        display: block;
        inline-size: 100%;
        min-block-size: var(--_h);
        padding-inline: var(--_pad);
        background: var(--hpu-surface-raised);
        color: var(--hpu-text);
        border: 1px solid var(--hpu-border-strong);
        border-radius: var(--hpu-radius-md);
        font: var(--hpu-weight-regular) var(--_font) / var(--hpu-leading-normal) var(--hpu-font);
      }
      .control::placeholder {
        color: var(--hpu-text-muted);
      }
      .control:focus-visible {
        outline: var(--hpu-focus-ring);
        outline-offset: 1px;
      }
      .control:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      :host([readonly]) .control {
        background: var(--hpu-surface-sunken);
      }
      .control[aria-invalid='true'] {
        border-color: var(--hpu-danger-text);
      }
      .hint,
      .error {
        margin: var(--hpu-space-1) 0 0;
        font-size: var(--hpu-text-xs);
      }
      .hint {
        color: var(--hpu-text-muted);
      }
      .error {
        display: flex;
        align-items: center;
        gap: var(--hpu-space-1);
        color: var(--hpu-danger-text);
      }
      @media (pointer: coarse) {
        .control {
          min-block-size: max(var(--_h), var(--hpu-touch-target));
        }
      }
    `]}get control(){return this.renderRoot.querySelector(`.control`)}render(){let e=`${this.uid}-hint`,t=`${this.uid}-error`,n=[this.hint?e:``,this.error?t:``].filter(Boolean).join(` `)||void 0;return v`
      ${this.label?v`<label class=${this.hideLabel?`label vh`:`label`} for=${this.uid}
              >${this.label}${this.required?v`<span class="required" aria-hidden="true">*</span>`:b}</label
            >`:b}
      ${this.renderControl({id:this.uid,describedBy:n})}
      ${this.hint?v`<p class="hint" id=${e}>${this.hint}</p>`:b}
      ${this.error?v`<p class="error" id=${t} role="alert">
              <hpu-icon .path=${yt} size="xs"></hpu-icon>${this.error}
            </p>`:b}
    `}onInput(e){this.value=e.target.value,this.dispatchEvent(new CustomEvent(`hpu-input`,{detail:{value:this.value},bubbles:!0,composed:!0}))}onChange(e){this.value=e.target.value,this.dispatchEvent(new CustomEvent(`hpu-change`,{detail:{value:this.value},bubbles:!0,composed:!0}))}get validity(){return this.internals.validity}get validationMessage(){return this.internals.validationMessage}checkValidity(){return this.internals.checkValidity()}reportValidity(){return this.internals.reportValidity()}focus(e){this.control?.focus(e)}updated(e){this.internals.setFormValue(this.value);let t=this.control??void 0;this.error?this.internals.setValidity({customError:!0},this.error,t):this.required&&!this.value&&!this.disabled?this.internals.setValidity({valueMissing:!0},A(`common.required`),t):this.internals.setValidity({})}formDisabledCallback(e){this.disabled=e}formResetCallback(){this.value=this.getAttribute(`value`)??``}};k([w()],L.prototype,`label`,void 0),k([w()],L.prototype,`hint`,void 0),k([w()],L.prototype,`error`,void 0),k([w()],L.prototype,`name`,void 0),k([w()],L.prototype,`value`,void 0),k([w()],L.prototype,`placeholder`,void 0),k([w({type:Boolean,attribute:`hide-label`})],L.prototype,`hideLabel`,void 0),k([w({type:Boolean,reflect:!0})],L.prototype,`required`,void 0),k([w({type:Boolean,reflect:!0})],L.prototype,`disabled`,void 0),k([w({type:Boolean,reflect:!0})],L.prototype,`readonly`,void 0),k([w({reflect:!0})],L.prototype,`size`,void 0);var R=class extends L{constructor(...e){super(...e),this.options=[],this.values=[],this.multiple=!1,this.searchable=!1,this.clearable=!1,this.native=!1,this.allowCustom=!1,this.open=!1,this.search=``,this.active=-1,this.loading=!1,this.#e=new Map,this.#n=0,this.#i=``,this.#g=e=>{e.composedPath().includes(this)||this.#h()}}#e;#t;#n;#r;#i;#a;static{this.styles=[...L.styles,o`
      .box {
        display: flex;
        align-items: center;
        gap: var(--hpu-space-1);
        min-block-size: var(--_h);
        padding: 2px var(--_pad);
        background: var(--hpu-surface-raised);
        border: 1px solid var(--hpu-border-strong);
        border-radius: var(--hpu-radius-md);
        font: var(--hpu-weight-regular) var(--_font) / var(--hpu-leading-normal) var(--hpu-font);
        cursor: pointer;
      }
      .box:focus-within {
        outline: var(--hpu-focus-ring);
        outline-offset: 1px;
      }
      .box.invalid {
        border-color: var(--hpu-danger-text);
      }
      :host([disabled]) .box {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .content {
        display: flex;
        flex: 1;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--hpu-space-1);
        min-inline-size: 0;
      }
      .end {
        display: flex;
        flex: none;
        align-items: center;
        gap: var(--hpu-space-1);
      }
      .inner {
        flex: 1 1 4rem;
        min-inline-size: 3rem;
        padding: 0;
        border: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        outline: none;
        cursor: inherit;
        text-overflow: ellipsis;
      }
      .inner::placeholder {
        color: var(--hpu-text-muted);
      }
      .tag {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        padding-inline: var(--hpu-space-2) 2px;
        background: var(--hpu-surface-sunken);
        border-radius: var(--hpu-radius-pill);
        font-size: var(--hpu-text-xs);
      }
      .chevron {
        flex: none;
        color: var(--hpu-text-muted);
        transition: transform var(--hpu-duration-fast) var(--hpu-ease);
      }
      .box.open .chevron {
        transform: rotate(180deg);
      }
      .popup {
        box-sizing: border-box;
        max-inline-size: calc(100vw - 16px);
        padding: var(--hpu-space-1);
        overflow: auto;
        background: var(--hpu-surface-raised);
        color: var(--hpu-text);
        border: 1px solid var(--hpu-border);
        border-radius: var(--hpu-radius-md);
        box-shadow: var(--hpu-shadow-2);
        font-family: var(--hpu-font);
        font-size: var(--_font);
      }
      ul {
        margin: 0;
        padding: 0;
        list-style: none;
      }
      .group-label {
        padding: var(--hpu-space-2) var(--hpu-space-3) var(--hpu-space-1);
        color: var(--hpu-text-muted);
        font-size: var(--hpu-text-xs);
        font-weight: var(--hpu-weight-bold);
      }
      .option {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--hpu-space-2);
        min-block-size: 36px;
        padding: var(--hpu-space-1) var(--hpu-space-3);
        border-radius: var(--hpu-radius-sm);
        cursor: pointer;
      }
      .option.active {
        background: var(--hpu-hover);
      }
      .option[aria-selected='true'] {
        font-weight: var(--hpu-weight-medium);
        background: var(--hpu-selected);
      }
      .option[aria-disabled='true'] {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .empty {
        display: flex;
        align-items: center;
        gap: var(--hpu-space-2);
        padding: var(--hpu-space-3);
        color: var(--hpu-text-muted);
      }
      .native-wrap {
        position: relative;
        display: block;
      }
      .native-chevron {
        position: absolute;
        inset-block: 0;
        inset-inline-end: var(--hpu-space-3);
        margin-block: auto;
        color: var(--hpu-text-muted);
        pointer-events: none;
      }
      .native {
        appearance: none;
        inline-size: 100%;
        min-block-size: var(--_h);
        /* Room for the chevron drawn above, instead of the browser's arrow hugging the edge. */
        padding-inline: var(--_pad) calc(var(--_pad) + var(--hpu-space-5));
        background: var(--hpu-surface-raised);
        color: var(--hpu-text);
        border: 1px solid var(--hpu-border-strong);
        border-radius: var(--hpu-radius-md);
        font: inherit;
      }
      .native:focus-visible {
        outline: var(--hpu-focus-ring);
        outline-offset: 1px;
      }
    `]}get control(){return this.renderRoot.querySelector(`.inner, .native`)}get#o(){return this.searchable||!!this.loadOptions}get#s(){return this.loadOptions?this.loaded??[]:this.options}get#c(){let e=this.search.trim().toLowerCase();return this.loadOptions||!this.#o||!e?this.#s:this.#s.filter(t=>t.label.toLowerCase().includes(e))}get#l(){return this.multiple?this.values:this.value?[this.value]:[]}#u(e){return this.#e.get(e)??(this.allowCustom?e:``)}willUpdate(e){if(e.has(`options`)||e.has(`loaded`))for(let e of this.#s)this.#e.set(e.value,e.label)}renderControl({id:e,describedBy:t}){return this.native?this.#d(e,t):this.#f(e,t)}#d(e,t){return v`<span class="native-wrap"
      ><select
        class="native"
        id=${e}
        name=${this.name||b}
        ?required=${this.required}
        ?disabled=${this.disabled}
        aria-invalid=${this.error?`true`:`false`}
        aria-describedby=${j(t)}
        @input=${this.onInput}
        @change=${this.onChange}
      >
        ${this.placeholder?v`<option value="" ?selected=${!this.value}>${this.placeholder}</option>`:b}
        ${this.options.map(e=>v`<option
              value=${e.value}
              ?disabled=${e.disabled}
              ?selected=${e.value===this.value}
            >
              ${e.label}
            </option>`)}</select
      ><hpu-icon class="native-chevron" .path=${wt} aria-hidden="true"></hpu-icon
    ></span>`}#f(e,t){let n=this.#l,r=`${this.uid}-list`,i=this.#c,a=this.open&&this.active>=0?`${this.uid}-opt-${this.active}`:void 0,o=this.clearable&&!this.disabled&&!this.readonly&&n.length>0,s=!this.multiple,c=this.open&&this.#o,l=c?this.search:s&&n[0]?this.#u(n[0]):``,u=s&&c&&n[0]?this.#u(n[0]):n.length?``:this.placeholder;return v`
      <div
        class="box ${this.error?`invalid`:``} ${this.open?`open`:``}"
        part="control"
        @pointerdown=${this.#v}
        @click=${this.#y}
      >
        <div class="content">
          ${this.multiple?this.values.map(e=>v`<span class="tag"
                      >${this.#u(e)}<hpu-icon-button
                        .path=${Dt}
                        .label=${A(`select.remove`,{label:this.#u(e)})}
                        size="xs"
                        ?disabled=${this.disabled}
                        @hpu-click=${()=>this.#k(e)}
                      ></hpu-icon-button
                    ></span>`):b}
          <input
            class="inner"
            id=${e}
            role="combobox"
            autocomplete="off"
            aria-haspopup="listbox"
            aria-expanded=${this.open?`true`:`false`}
            aria-controls=${r}
            aria-autocomplete=${this.#o?`list`:`none`}
            aria-activedescendant=${j(a)}
            aria-invalid=${this.error?`true`:`false`}
            aria-required=${this.required?`true`:b}
            aria-describedby=${j(t)}
            .value=${l}
            placeholder=${u||b}
            ?readonly=${!this.#o||this.readonly}
            ?disabled=${this.disabled}
            @keydown=${this.#S}
            @input=${this.#w}
            @blur=${this.#T}
          />
        </div>
        <div class="end">
          ${o?v`<hpu-icon-button
                  .path=${Dt}
                  .label=${A(`select.clear`)}
                  size="xs"
                  @hpu-click=${this.#A}
                ></hpu-icon-button>`:b}
          <hpu-icon class="chevron" .path=${wt} aria-hidden="true"></hpu-icon>
        </div>
      </div>
      <div class="popup" popover="manual" @pointerdown=${e=>e.preventDefault()}>
        <ul
          role="listbox"
          id=${r}
          aria-multiselectable=${this.multiple?`true`:b}
          aria-label=${this.label||b}
        >
          ${this.#p(i)}
        </ul>
        ${this.loading?v`<div class="empty" role="status">
                <hpu-spinner size="sm"></hpu-spinner>${A(`select.loading`)}
              </div>`:i.length?b:v`<div class="empty" role="status">${A(`select.no_results`)}</div>`}
      </div>
    `}#p(e){let t=new Set(this.#l),n=(e,n)=>v`<li
        class="option ${n===this.active?`active`:``}"
        role="option"
        id="${this.uid}-opt-${n}"
        aria-selected=${t.has(e.value)?`true`:`false`}
        aria-disabled=${e.disabled?`true`:b}
        @click=${()=>this.#D(e)}
        @pointermove=${()=>!e.disabled&&(this.active=n)}
      >
        <span>${e.label}</span>
        ${t.has(e.value)?v`<hpu-icon .path=${St} size="sm"></hpu-icon>`:b}
      </li>`,r=[],i=0;for(;i<e.length;){let t=e[i].group;if(!t){r.push(n(e[i],i)),i++;continue}let a=i,o=[];for(;i<e.length&&e[i].group===t;)o.push(n(e[i],i)),i++;let s=`${this.uid}-group-${a}`;r.push(v`<li role="presentation">
          <div class="group-label" id=${s}>${t}</div>
          <ul role="group" aria-labelledby=${s}>
            ${o}
          </ul>
        </li>`)}return r}#m(){if(this.disabled||this.readonly||this.native||this.open)return;this.search=``,this.open=!0;let e=this.#c.findIndex(e=>this.#l.includes(e.value));this.active=e>=0?e:this.#b(-1,1),this.loadOptions&&this.#E(``)}#h(){this.open&&(this.open=!1,this.active=-1,this.search=``,clearTimeout(this.#r),this.#n++,this.loading=!1)}#g;updated(e){if(super.updated(e),this.multiple&&!this.native){if(this.name){let e=new FormData;for(let t of this.values)e.append(this.name,t);this.internals.setFormValue(e)}let e=this.control??void 0;this.error?this.internals.setValidity({customError:!0},this.error,e):this.required&&!this.values.length&&!this.disabled?this.internals.setValidity({valueMissing:!0},A(`common.required`),e):this.internals.setValidity({})}e.has(`open`)&&this.open&&this.active<0&&(this.active=this.#b(-1,1));let t=this.popup;if(t){if(this.open){t.matches(`:popover-open`)||(t.showPopover(),document.addEventListener(`pointerdown`,this.#g,!0)),this.#t?.();let e=this.renderRoot.querySelector(`.box`);this.#t=Bt(e,t,{matchWidth:!0}),this.renderRoot.querySelector(`#${this.uid}-opt-${this.active}`)?.scrollIntoView({block:`nearest`})}else t.matches(`:popover-open`)&&this.#_()}}#_(){this.#t?.(),this.#t=void 0,document.removeEventListener(`pointerdown`,this.#g,!0);try{this.popup?.hidePopover()}catch{}}disconnectedCallback(){super.disconnectedCallback(),this.#_(),clearTimeout(this.#r),clearTimeout(this.#a)}#v(e){let t=e.target;t===this.control||t.closest(`hpu-icon-button`)||e.preventDefault()}#y(e){this.disabled||e.target.closest(`hpu-icon-button`)||(this.control?.focus(),this.open&&!this.#o||this.open&&e.target.closest(`.chevron`)?this.#h():this.#m())}#b(e,t){let n=this.#c;for(let r=e+t;r>=0&&r<n.length;r+=t)if(!n[r].disabled)return r;return e>=0&&e<n.length&&!n[e].disabled?e:-1}#x(e){this.active=this.#b(this.active,e)}#S(e){if(this.disabled||this.readonly)return;let t=this.open;switch(e.key){case`ArrowDown`:case`ArrowUp`:e.preventDefault(),t?this.#x(e.key===`ArrowDown`?1:-1):this.#m();break;case`Home`:case`End`:if(t&&!this.#o){e.preventDefault();let t=this.#c.length;this.active=e.key===`Home`?this.#b(-1,1):this.#b(t,-1)}break;case`Enter`:if(t){e.preventDefault();let t=this.#c[this.active];t?this.#D(t):this.allowCustom&&this.search.trim()?this.#O():this.#h()}else this.#o||(e.preventDefault(),this.#m());break;case` `:if(!this.#o){e.preventDefault();let n=this.#c[this.active];t&&n?this.#D(n):t?this.#h():this.#m()}break;case`Escape`:t&&(e.preventDefault(),e.stopPropagation(),this.#h());break;case`Tab`:t&&this.#h();break;case`Backspace`:this.multiple&&!this.search&&this.values.length&&this.#k(this.values[this.values.length-1]);break;default:this.#o||e.key.length!==1||e.ctrlKey||e.metaKey||e.altKey||this.#C(e.key)}}#C(e){clearTimeout(this.#a),this.#i+=e.toLowerCase(),this.#a=setTimeout(()=>this.#i=``,500),this.open||this.#m();let t=this.#c,n=e=>t.findIndex((t,n)=>n>=e&&!t.disabled&&t.label.toLowerCase().startsWith(this.#i)),r=n(this.#i.length>1?Math.max(this.active,0):this.active+1);this.active=r>=0?r:n(0)>=0?n(0):this.active}#w(e){this.#o&&(this.search=e.target.value,this.open||this.#m(),this.search=e.target.value,this.active=this.#b(-1,1),this.dispatchEvent(new CustomEvent(`hpu-search`,{detail:{search:this.search},bubbles:!0,composed:!0})),this.loadOptions&&(clearTimeout(this.#r),this.#r=setTimeout(()=>void this.#E(this.search),250)))}#T(){this.allowCustom&&this.open&&this.search.trim()?this.#O():this.#h()}async#E(e){let t=++this.#n;this.loading=!0;try{let n=await this.loadOptions(e);t===this.#n&&(this.loaded=n)}catch{t===this.#n&&(this.loaded=[])}finally{t===this.#n&&(this.loading=!1,this.open&&(this.active=this.#b(-1,1)))}}#D(e){e.disabled||(this.#e.set(e.value,e.label),this.multiple?(this.values=this.values.includes(e.value)?this.values.filter(t=>t!==e.value):[...this.values,e.value],this.search=``,this.#j(),this.control?.focus()):(this.value=e.value,this.#h(),this.#j()))}#O(){let e=this.search.trim();this.multiple?this.values.includes(e)||(this.values=[...this.values,e]):this.value=e,this.search=``,this.#h(),this.#j()}#k(e){this.values=this.values.filter(t=>t!==e),this.#j(),this.control?.focus()}#A(){this.multiple?this.values=[]:this.value=``,this.#j(),this.control?.focus()}#j(){let e=this.multiple?{values:this.values}:{value:this.value};this.dispatchEvent(new CustomEvent(`hpu-change`,{detail:e,bubbles:!0,composed:!0}))}formResetCallback(){super.formResetCallback(),this.values=[]}};k([w({attribute:!1})],R.prototype,`options`,void 0),k([w({attribute:!1})],R.prototype,`values`,void 0),k([w({type:Boolean,reflect:!0})],R.prototype,`multiple`,void 0),k([w({type:Boolean,reflect:!0})],R.prototype,`searchable`,void 0),k([w({type:Boolean,reflect:!0})],R.prototype,`clearable`,void 0),k([w({type:Boolean,reflect:!0})],R.prototype,`native`,void 0),k([w({type:Boolean,attribute:`allow-custom`})],R.prototype,`allowCustom`,void 0),k([w({attribute:!1})],R.prototype,`loadOptions`,void 0),k([w({type:Boolean,reflect:!0})],R.prototype,`open`,void 0),k([T()],R.prototype,`search`,void 0),k([T()],R.prototype,`active`,void 0),k([T()],R.prototype,`loading`,void 0),k([T()],R.prototype,`loaded`,void 0),k([Ke(`.popup`)],R.prototype,`popup`,void 0),R=k([O(`hpu-select`)],R);var Ut=class extends C{constructor(...e){super(...e),this.shape=`text`,this.width=``,this.height=``,this.lines=1}static{this.styles=o`
    :host {
      display: block;
    }
    .bone {
      background: linear-gradient(
        90deg,
        var(--hpu-surface-sunken) 25%,
        color-mix(in srgb, var(--hpu-surface-sunken) 60%, var(--hpu-surface-raised)) 50%,
        var(--hpu-surface-sunken) 75%
      );
      background-size: 200% 100%;
      border-radius: var(--hpu-radius-sm);
      animation: shimmer 1.4s linear infinite;
    }
    .bone + .bone {
      margin-block-start: var(--hpu-space-2);
    }
    :host([shape='circle']) .bone {
      border-radius: var(--hpu-radius-pill);
    }
    @media (prefers-reduced-motion: reduce) {
      .bone {
        animation: none;
      }
    }
    @keyframes shimmer {
      from {
        background-position: 200% 0;
      }
      to {
        background-position: -200% 0;
      }
    }
  `}render(){let e=this.shape===`text`?Math.max(1,this.lines):1,t=this.height||(this.shape===`text`?`1em`:this.shape===`circle`?`40px`:`80px`),n=this.width||(this.shape===`circle`?`40px`:`100%`);return v`<div aria-hidden="true">
      ${Array.from({length:e},(r,i)=>{let a=this.shape===`text`&&e>1&&i===e-1?`60%`:n;return v`<div class="bone" style="block-size:${t};inline-size:${a}"></div>`})}
    </div>`}};k([w({reflect:!0})],Ut.prototype,`shape`,void 0),k([w()],Ut.prototype,`width`,void 0),k([w()],Ut.prototype,`height`,void 0),k([w({type:Number})],Ut.prototype,`lines`,void 0),Ut=k([O(`hpu-skeleton`)],Ut);var Wt=class extends C{constructor(...e){super(...e),this.icon=``,this.heading=``,this.description=``}static{this.styles=o`
    :host {
      /* Long unbroken text wraps instead of overflowing the component. */
      overflow-wrap: anywhere;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--hpu-space-3);
      padding: var(--hpu-space-7) var(--hpu-space-4);
      text-align: center;
      color: var(--hpu-text);
      font-family: var(--hpu-font);
    }
    hpu-icon {
      --_icon: 48px;
      color: var(--hpu-text-muted);
    }
    .heading {
      margin: 0;
      font-size: var(--hpu-text-lg);
      font-weight: var(--hpu-weight-bold);
    }
    .description {
      margin: 0;
      max-inline-size: 40ch;
      color: var(--hpu-text-muted);
      font-size: var(--hpu-text-sm);
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: var(--hpu-space-2);
    }
  `}render(){return v`
      ${this.icon?v`<hpu-icon .path=${this.icon}></hpu-icon>`:b}
      <p class="heading">${this.heading}</p>
      ${this.description?v`<p class="description">${this.description}</p>`:b}
      <div class="actions"><slot name="actions"></slot></div>
    `}};k([w()],Wt.prototype,`icon`,void 0),k([w()],Wt.prototype,`heading`,void 0),k([w()],Wt.prototype,`description`,void 0),Wt=k([O(`hpu-empty-state`)],Wt);var Gt={primary:At,gray:At,info:At,success:Ct,warning:vt,danger:yt},z=class extends C{constructor(...e){super(...e),this.tone=`info`,this.size=`md`,this.heading=``,this.icon=``,this.iconTone=``,this.noIcon=!1,this.dismissible=!1}static{this.styles=[E,D,o`
      :host {
        /* Long unbroken text wraps instead of overflowing the component. */
        overflow-wrap: anywhere;
        display: block;
      }
      :host([hidden]) {
        display: none;
      }
      .callout {
        display: flex;
        align-items: flex-start;
        gap: var(--hpu-space-3);
        padding: var(--hpu-space-3) var(--hpu-space-4);
        border: 1px solid var(--_border);
        border-radius: var(--hpu-radius-md);
        background: var(--_tint);
        color: var(--hpu-text);
        font: var(--hpu-weight-regular) var(--_font) / var(--hpu-leading-normal) var(--hpu-font);
      }
      .icon {
        display: inline-flex;
        color: var(--hpu-callout-icon, var(--_icon-c, var(--_text)));
        margin-block-start: 1px;
      }
      .body {
        flex: 1;
        min-inline-size: 0;
      }
      .heading {
        margin: 0 0 var(--hpu-space-1);
        color: var(--_text);
        font-weight: var(--hpu-weight-bold);
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: var(--hpu-space-2);
        margin-block-start: var(--hpu-space-2);
      }
      .actions:not(:has(*)) {
        display: none;
      }
    `]}render(){let e=this.tone===`danger`||this.tone===`warning`,t=qe.includes(this.iconTone)?this.iconTone:``;return v`<div class="callout" role=${e?`alert`:`status`}>
      ${this.noIcon?b:v`<span
              class="icon"
              style=${t?`--_icon-c:var(--hpu-${t}-text)`:``}
            >
              <slot name="icon"
                ><hpu-icon
                  .path=${this.icon||Gt[this.tone]}
                  size=${this.size}
                ></hpu-icon
              ></slot>
            </span>`}
      <div class="body">
        ${this.heading?v`<p class="heading">${this.heading}</p>`:b}
        <slot></slot>
        <div class="actions"><slot name="actions"></slot></div>
      </div>
      ${this.dismissible?v`<hpu-icon-button
              .path=${Dt}
              .label=${A(`common.dismiss`)}
              size="sm"
              @hpu-click=${this.#e}
            ></hpu-icon-button>`:b}
    </div>`}#e(){let e=new CustomEvent(`hpu-dismiss`,{bubbles:!0,composed:!0,cancelable:!0});this.dispatchEvent(e)&&(this.hidden=!0)}};k([w({reflect:!0})],z.prototype,`tone`,void 0),k([w({reflect:!0})],z.prototype,`size`,void 0),k([w()],z.prototype,`heading`,void 0),k([w()],z.prototype,`icon`,void 0),k([w({attribute:`icon-tone`})],z.prototype,`iconTone`,void 0),k([w({type:Boolean,attribute:`no-icon`,reflect:!0})],z.prototype,`noIcon`,void 0),k([w({type:Boolean})],z.prototype,`dismissible`,void 0),z=k([O(`hpu-callout`)],z);var Kt={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},qt=e=>(...t)=>({_$litDirective$:e,values:t}),Jt=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,n){this._$Ct=e,this._$AM=t,this._$Ci=n}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}},{I:Yt}=Re,Xt=e=>e,Zt=()=>document.createComment(``),Qt=(e,t,n)=>{let r=e._$AA.parentNode,i=t===void 0?e._$AB:t._$AA;if(n===void 0)n=new Yt(r.insertBefore(Zt(),i),r.insertBefore(Zt(),i),e,e.options);else{let t=n._$AB.nextSibling,a=n._$AM,o=a!==e;if(o){let t;n._$AQ?.(e),n._$AM=e,n._$AP!==void 0&&(t=e._$AU)!==a._$AU&&n._$AP(t)}if(t!==i||o){let e=n._$AA;for(;e!==t;){let t=Xt(e).nextSibling;Xt(r).insertBefore(e,i),e=t}}}return n},B=(e,t,n=e)=>(e._$AI(t,n),e),$t={},en=(e,t=$t)=>e._$AH=t,tn=e=>e._$AH,nn=e=>{e._$AR(),e._$AA.remove()},rn=(e,t,n)=>{let r=new Map;for(let i=t;i<=n;i++)r.set(e[i],i);return r},an=qt(class extends Jt{constructor(e){if(super(e),e.type!==Kt.CHILD)throw Error(`repeat() can only be used in text expressions`)}dt(e,t,n){let r;n===void 0?n=t:t!==void 0&&(r=t);let i=[],a=[],o=0;for(let t of e)i[o]=r?r(t,o):o,a[o]=n(t,o),o++;return{values:a,keys:i}}render(e,t,n){return this.dt(e,t,n).values}update(e,[t,n,r]){let i=tn(e),{values:a,keys:o}=this.dt(t,n,r);if(!Array.isArray(i))return this.ut=o,a;let s=this.ut??=[],c=[],l,u,d=0,f=i.length-1,p=0,m=a.length-1;for(;d<=f&&p<=m;)if(i[d]===null)d++;else if(i[f]===null)f--;else if(s[d]===o[p])c[p]=B(i[d],a[p]),d++,p++;else if(s[f]===o[m])c[m]=B(i[f],a[m]),f--,m--;else if(s[d]===o[m])c[m]=B(i[d],a[m]),Qt(e,c[m+1],i[d]),d++,m--;else if(s[f]===o[p])c[p]=B(i[f],a[p]),Qt(e,i[d],i[f]),f--,p++;else if(l===void 0&&(l=rn(o,p,m),u=rn(s,d,f)),l.has(s[d])){if(l.has(s[f])){let t=u.get(o[p]),n=t===void 0?null:i[t];if(n===null){let t=Qt(e,i[d]);B(t,a[p]),c[p]=t}else c[p]=B(n,a[p]),Qt(e,i[d],n),i[t]=null;p++}else nn(i[f]),f--}else nn(i[d]),d++;for(;p<=m;){let t=Qt(e,c[m+1]);B(t,a[p]),c[p++]=t}for(;d<=f;){let e=i[d++];e!==null&&nn(e)}return this.ut=o,en(e,c),y}}),on=(e,t)=>e[t],sn=new Intl.Collator(void 0,{numeric:!0,sensitivity:`base`}),cn=(e,t)=>e==null||e===``?t==null||t===``?0:1:t==null||t===``?-1:typeof e==`number`&&typeof t==`number`?e-t:sn.compare(String(e),String(t)),V=class extends C{constructor(...e){super(...e),this.columns=[],this.rows=[],this.label=``,this.rowKey=`id`,this.manualSort=!1,this.selectable=!1,this.selected=[],this.loading=!1,this.rowsClickable=!1,this.emptyHeading=``,this.emptyDescription=``,this.query={},this.pageSize=50,this.virtual=!1,this.rowHeight=48,this.maxHeight=`32rem`,this.loaded=[],this.total=0,this.page=0,this.busy=!1,this.failure=``,this.scrollPos=0,this.viewport=0,this.narrow=!1,this.#e=0}#e;#t;#n;static{this.styles=o`
    :host {
      display: block;
      container-type: inline-size;
      font-family: var(--hpu-font);
      color: var(--hpu-text);
    }
    :host([hidden]) {
      display: none;
    }
    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }
    .wrap {
      background: var(--hpu-surface-raised);
      border: var(--hpu-surface-border);
      box-shadow: var(--hpu-surface-shadow);
      border-radius: var(--hpu-radius-lg);
      overflow: hidden;
    }
    .table {
      display: table;
      inline-size: 100%;
      border-collapse: collapse;
      font-size: var(--hpu-text-sm);
    }
    .head,
    .body {
      display: table-row-group;
    }
    .tr {
      display: table-row;
    }
    .th,
    .td {
      display: table-cell;
      padding: var(--hpu-space-2) var(--hpu-space-3);
      border-block-end: 1px solid var(--hpu-border);
      vertical-align: middle;
      text-align: start;
    }
    .body .tr:last-child .td {
      border-block-end: 0;
    }
    .th {
      background: var(--hpu-surface-sunken);
      color: var(--hpu-text-muted);
      font-size: var(--hpu-text-xs);
      font-weight: var(--hpu-weight-medium);
      white-space: nowrap;
    }
    .th[data-align='end'],
    .td[data-align='end'] {
      text-align: end;
    }
    .th[data-align='center'],
    .td[data-align='center'] {
      text-align: center;
    }
    .sort-btn {
      display: inline-flex;
      align-items: center;
      gap: var(--hpu-space-1);
      min-block-size: var(--hpu-touch-target);
      padding: 0;
      border: 0;
      background: none;
      color: inherit;
      font: inherit;
      cursor: pointer;
    }
    .sort-btn:focus-visible,
    .pick:focus-within {
      outline: var(--hpu-focus-ring);
      outline-offset: 2px;
    }
    .th[aria-sort='ascending'] .sort-btn,
    .th[aria-sort='descending'] .sort-btn {
      color: var(--hpu-text);
    }
    .sort-icon {
      opacity: 0.5;
    }
    [aria-sort='ascending'] .sort-icon,
    [aria-sort='descending'] .sort-icon {
      opacity: 1;
    }
    .tr[data-selected] .td {
      background: var(--hpu-primary-tint);
    }
    .tr[data-clickable] {
      cursor: pointer;
    }
    .tr[data-clickable]:hover .td {
      background: var(--hpu-hover);
    }
    .pick {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-inline-size: var(--hpu-touch-target);
      min-block-size: var(--hpu-touch-target);
    }
    .pick input {
      inline-size: 18px;
      block-size: 18px;
      margin: 0;
      accent-color: var(--hpu-primary-solid);
    }
    .narrow-cell {
      inline-size: 1%;
      white-space: nowrap;
    }
    .sortbar {
      display: none;
      align-items: end;
      gap: var(--hpu-space-2);
      padding: var(--hpu-space-3);
      border-block-end: 1px solid var(--hpu-border);
    }
    .sortbar hpu-select {
      flex: 1;
    }
    .label {
      display: none;
      color: var(--hpu-text-muted);
      font-size: var(--hpu-text-xs);
    }
    .state {
      padding: var(--hpu-space-5);
    }
    .scroll {
      overflow: auto;
    }
    :host([virtual]) .scroll {
      max-block-size: var(--_max, 32rem);
    }
    :host([virtual]) .th {
      position: sticky;
      inset-block-start: 0;
      z-index: 1;
    }
    /* Fixed row height and single-line cells only in the table layout: cards grow with content. */
    @container (min-width: 641px) {
      :host([virtual]) .body .tr:not(.spacer) {
        block-size: var(--_rh, 48px);
      }
      :host([virtual]) .body .td {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-inline-size: 24rem;
      }
    }
    .spacer .td {
      padding: 0;
      border: 0;
    }
    .pager {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: var(--hpu-space-2);
      padding: var(--hpu-space-2) var(--hpu-space-3);
      border-block-start: 1px solid var(--hpu-border);
      color: var(--hpu-text-muted);
      font-size: var(--hpu-text-sm);
    }
    .error {
      padding: var(--hpu-space-3);
    }
    .vh {
      position: absolute;
      inline-size: 1px;
      block-size: 1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }

    /* Card list on narrow containers. Roles keep table semantics when display changes. */
    @container (max-width: 640px) {
      .table,
      .head,
      .body,
      .tr,
      .td {
        display: block;
      }
      .head {
        position: absolute;
        inline-size: 1px;
        block-size: 1px;
        overflow: hidden;
        clip-path: inset(50%);
      }
      .sortbar {
        display: flex;
      }
      .body .tr {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        gap: var(--hpu-space-2) var(--hpu-space-3);
        padding: var(--hpu-space-3);
        border-block-end: 1px solid var(--hpu-border);
      }
      .body .tr:last-child {
        border-block-end: 0;
      }
      .td {
        padding: 0;
        border: 0;
        grid-column: 2;
        display: grid;
        grid-template-columns: minmax(5rem, 40%) 1fr;
        align-items: center;
        column-gap: var(--hpu-space-3);
        min-block-size: 28px;
        text-align: start !important;
      }
      .td[data-primary] {
        display: block;
        font-weight: var(--hpu-weight-medium);
      }
      .value {
        justify-self: start;
        min-inline-size: 0;
      }
      .td .label {
        display: block;
      }
      .td[data-primary] {
        grid-row: 1;
      }
      .td.pick-cell {
        grid-column: 1;
        grid-row: 1;
        inline-size: auto;
        /* Not the label/value grid of the data cells. */
        display: flex;
        justify-content: center;
      }
      .td.actions-cell {
        grid-column: 3;
        grid-row: 1;
        inline-size: auto;
        display: flex;
        justify-content: center;
      }
      .tr[data-selected] .td {
        background: none;
      }
      .tr[data-selected] {
        background: var(--hpu-primary-tint);
      }
      .tr[data-clickable]:hover .td {
        background: none;
      }
    }
  `}get#r(){return this.dataSource?this.loaded:this.rows}get#i(){let e=this.sort;if(!e||this.manualSort||this.dataSource)return this.#r;let t=e.direction===`asc`?1:-1,n=t=>on(t,e.field);return[...this.#r].sort((e,r)=>{let i=n(e),a=n(r),o=i==null||i===``,s=a==null||a===``;return o||s?o===s?0:o?1:-1:t*cn(i,a)})}#a(e){this.sort=e,this.dispatchEvent(new CustomEvent(`hpu-sort`,{detail:{sort:e},bubbles:!0,composed:!0}))}#o(e){let t=this.sort?.field===e?this.sort.direction:void 0;this.#a(t===void 0?{field:e,direction:`asc`}:t===`asc`?{field:e,direction:`desc`}:void 0)}#s(e){this.selected=e,this.dispatchEvent(new CustomEvent(`hpu-select`,{detail:{selected:e},bubbles:!0,composed:!0}))}#c(e,t){let n=new Set(this.selected);t?n.add(e):n.delete(e),this.#s([...n])}#l(e){this.#s(e?this.#r.map(e=>String(on(e,this.rowKey))):[])}#u(e){if(e.sortable)return this.sort?.field===e.key?this.sort.direction===`asc`?`ascending`:`descending`:`none`}#d(){if(!this.sort)return``;let e=this.columns.find(e=>e.key===this.sort.field),t=A(this.sort.direction===`asc`?`table.sort_ascending`:`table.sort_descending`);return`${e?.label??this.sort.field}: ${t}`}#f(){let e=this.columns.filter(e=>e.sortable);if(!e.length)return b;let t=e.map(e=>({value:e.key,label:e.label}));return v`<div class="sortbar">
      <hpu-select
        size="sm"
        label=${A(`table.sort_by`)}
        .options=${t}
        .value=${this.sort?.field??``}
        @hpu-change=${e=>{e.stopPropagation();let t=e.detail.value;this.#a(t?{field:t,direction:this.sort?.direction??`asc`}:void 0)}}
      ></hpu-select>
      <hpu-icon-button
        label=${this.sort?.direction===`desc`?A(`table.sort_descending`):A(`table.sort_ascending`)}
        .icon=${this.sort?.direction===`desc`?bt:xt}
        ?disabled=${!this.sort}
        @click=${()=>this.sort&&this.#a({field:this.sort.field,direction:this.sort.direction===`asc`?`desc`:`asc`})}
      ></hpu-icon-button>
    </div>`}#p(){let e=this.#r.length>0&&this.selected.length===this.#r.length,t=this.selected.length>0&&!e;return v`<div class="head" role="rowgroup">
      <div class="tr" role="row">
        ${this.selectable?v`<div class="th narrow-cell" role="columnheader">
                <label class="pick">
                  <input
                    type="checkbox"
                    aria-label=${A(`table.select_all`)}
                    .checked=${e}
                    .indeterminate=${t}
                    @change=${e=>this.#l(e.target.checked)}
                  />
                </label>
              </div>`:b}
        ${this.columns.map(e=>v`<div
              class="th"
              role="columnheader"
              data-align=${e.align??`start`}
              aria-sort=${this.#u(e)??b}
              style=${e.width?`inline-size:${e.width}`:``}
            >
              ${e.sortable?v`<button
                      class="sort-btn"
                      type="button"
                      @click=${()=>this.#o(e.key)}
                    >
                      ${e.label}
                      <hpu-icon
                        class="sort-icon"
                        size="xs"
                        .path=${this.sort?.field===e.key?this.sort.direction===`asc`?xt:bt:Nt}
                      ></hpu-icon>
                    </button>`:e.label}
            </div>`)}
        ${this.rowActions?v`<div class="th narrow-cell" role="columnheader">
                <span class="vh">${A(`common.more`)}</span>
              </div>`:b}
      </div>
    </div>`}#m(e){let t=String(on(e,this.rowKey)),n=this.selected.includes(t),r=typeof this.rowActions==`function`?this.rowActions(e):this.rowActions;return v`<div
      class="tr"
      role="row"
      aria-selected=${this.selectable?String(n):b}
      ?data-selected=${n}
      ?data-clickable=${this.rowsClickable}
      @click=${this.rowsClickable?t=>{t.composedPath().some(e=>e instanceof HTMLElement&&e.matches(`input,button,hpu-menu,a`))||this.dispatchEvent(new CustomEvent(`hpu-row-click`,{detail:{row:e},bubbles:!0,composed:!0}))}:b}
    >
      ${this.selectable?v`<div class="td narrow-cell pick-cell" role="cell">
              <label class="pick">
                <input
                  type="checkbox"
                  aria-label=${A(`table.select_row`)}
                  .checked=${n}
                  @change=${e=>this.#c(t,e.target.checked)}
                />
              </label>
            </div>`:b}
      ${this.columns.map(t=>{let n=t.render?t.render(e):on(e,t.key);return v`<div
          class="td"
          role="cell"
          data-align=${t.align??`start`}
          ?data-primary=${t.primary}
        >
          ${t.primary?b:v`<span class="label" aria-hidden="true">${t.label}</span>`}
          <span class="value">${n??``}</span>
        </div>`})}
      ${r?v`<div class="td narrow-cell actions-cell" role="cell">
              <hpu-menu
                .items=${r}
                label=${A(`common.more`)}
                @hpu-select=${t=>{t.stopPropagation(),this.dispatchEvent(new CustomEvent(`hpu-row-action`,{detail:{id:t.detail.id,row:e},bubbles:!0,composed:!0}))}}
              ></hpu-menu>
            </div>`:b}
    </div>`}connectedCallback(){super.connectedCallback(),typeof ResizeObserver<`u`&&(this.#n=new ResizeObserver(()=>this.#h()),this.#n.observe(this)),this.#g()}disconnectedCallback(){this.#n?.disconnect(),this.#t?.(),this.#t=void 0,this.#e++,super.disconnectedCallback()}willUpdate(e){(e.has(`query`)||e.has(`sort`)||e.has(`pageSize`))&&this.dataSource&&this.page!==0&&!e.has(`page`)&&(this.page=0)}updated(e){e.has(`dataSource`)?(this.#g(),this.#_(!0)):this.dataSource&&(e.has(`query`)||e.has(`sort`)||e.has(`pageSize`)||e.has(`page`))&&this.#_(!0),(e.has(`virtual`)||e.has(`maxHeight`))&&this.#h()}#h(){this.narrow=this.clientWidth>0&&this.clientWidth<=640,this.scroller&&(this.viewport=this.scroller.clientHeight)}#g(){this.#t?.(),this.#t=this.dataSource?.subscribe?.(()=>void this.#_(!1))}async#_(e){let t=this.dataSource;if(!t)return;let n=++this.#e;e&&(this.busy=!0);try{let e=await t.query({page:this.page,pageSize:this.pageSize,sort:this.sort,search:this.query.search||void 0,filters:this.query.filters});if(n!==this.#e)return;this.loaded=e.rows,this.total=e.total,this.failure=``,this.dispatchEvent(new CustomEvent(`hpu-data`,{detail:{total:e.total,facets:e.facets},bubbles:!0,composed:!0}))}catch(e){if(n!==this.#e)return;this.failure=Rt(e),this.dispatchEvent(new CustomEvent(`hpu-error`,{detail:{message:this.failure},bubbles:!0,composed:!0}))}finally{n===this.#e&&(this.busy=!1)}}#v(){if(!this.dataSource||this.total<=this.pageSize)return b;let e=this.page*this.pageSize+1,t=Math.min(this.total,(this.page+1)*this.pageSize);return v`<div class="pager">
      <span>${A(`table.page_of`,{from:e,to:t,total:this.total})}</span>
      <hpu-icon-button
        .path=${Tt}
        label=${A(`table.previous`)}
        ?disabled=${this.page===0}
        @hpu-click=${()=>--this.page}
      ></hpu-icon-button>
      <hpu-icon-button
        .path=${Et}
        label=${A(`table.next`)}
        ?disabled=${t>=this.total}
        @hpu-click=${()=>this.page+=1}
      ></hpu-icon-button>
    </div>`}#y(){let e=this.#i;if(!this.virtual||this.narrow)return an(e,e=>String(on(e,this.rowKey)),e=>this.#m(e));let t=zt(this.scrollPos,this.viewport||512,this.rowHeight,e.length),n=e=>e>0?v`<div class="tr spacer" role="presentation" aria-hidden="true">
            <div class="td" role="presentation" style="block-size:${e}px"></div>
          </div>`:b;return v`${n(t.before)}${an(e.slice(t.start,t.end),e=>String(on(e,this.rowKey)),e=>this.#m(e))}${n(t.after)}`}render(){let e=this.#r,t=this.loading||this.busy,n=!t&&!this.failure&&e.length===0,r=this.dataSource?this.total:e.length;return v`
      <div class="wrap">
        ${this.#f()}
        ${this.failure?v`<hpu-callout class="error" tone="danger">${this.failure}</hpu-callout>`:b}
        <div
          class="scroll"
          style="--_max:${this.maxHeight};--_rh:${this.rowHeight}px"
          tabindex=${this.virtual&&!this.narrow?`0`:b}
          role=${this.virtual&&!this.narrow?`region`:b}
          aria-label=${this.virtual&&!this.narrow&&this.label?this.label:b}
          @scroll=${this.virtual?e=>{let t=e.currentTarget;this.scrollPos=t.scrollTop,this.viewport=t.clientHeight}:b}
        >
          <div
            class="table"
            role="table"
            aria-label=${this.label||b}
            aria-busy=${t?`true`:`false`}
            aria-rowcount=${r+1}
          >
            ${this.#p()}
            <div class="body" role="rowgroup">${this.#y()}</div>
          </div>
        </div>
        ${t&&e.length===0?v`<div class="state"><hpu-skeleton lines="4"></hpu-skeleton></div>`:b}
        ${n?v`<div class="state">
                <slot name="empty"
                  ><hpu-empty-state
                    .icon=${Pt}
                    heading=${this.emptyHeading||A(`table.empty`)}
                    description=${this.emptyDescription}
                  ></hpu-empty-state
                ></slot>
              </div>`:b}
        ${this.#v()}
        <div class="vh" role="status" aria-live="polite">${this.#d()}</div>
      </div>
    `}};k([w({attribute:!1})],V.prototype,`columns`,void 0),k([w({attribute:!1})],V.prototype,`rows`,void 0),k([w()],V.prototype,`label`,void 0),k([w({attribute:`row-key`})],V.prototype,`rowKey`,void 0),k([w({attribute:!1})],V.prototype,`sort`,void 0),k([w({type:Boolean,attribute:`manual-sort`})],V.prototype,`manualSort`,void 0),k([w({type:Boolean})],V.prototype,`selectable`,void 0),k([w({attribute:!1})],V.prototype,`selected`,void 0),k([w({attribute:!1})],V.prototype,`rowActions`,void 0),k([w({type:Boolean,reflect:!0})],V.prototype,`loading`,void 0),k([w({type:Boolean,attribute:`rows-clickable`})],V.prototype,`rowsClickable`,void 0),k([w({attribute:`empty-heading`})],V.prototype,`emptyHeading`,void 0),k([w({attribute:`empty-description`})],V.prototype,`emptyDescription`,void 0),k([w({attribute:!1})],V.prototype,`dataSource`,void 0),k([w({attribute:!1})],V.prototype,`query`,void 0),k([w({type:Number,attribute:`page-size`})],V.prototype,`pageSize`,void 0),k([w({type:Boolean,reflect:!0})],V.prototype,`virtual`,void 0),k([w({type:Number,attribute:`row-height`})],V.prototype,`rowHeight`,void 0),k([w({attribute:`max-height`})],V.prototype,`maxHeight`,void 0),k([T()],V.prototype,`loaded`,void 0),k([T()],V.prototype,`total`,void 0),k([T()],V.prototype,`page`,void 0),k([T()],V.prototype,`busy`,void 0),k([T()],V.prototype,`failure`,void 0),k([T()],V.prototype,`scrollPos`,void 0),k([T()],V.prototype,`viewport`,void 0),k([T()],V.prototype,`narrow`,void 0),k([Ke(`.scroll`)],V.prototype,`scroller`,void 0),V=k([O(`hpu-data-table`)],V);function ln(e){if(e.matches(`:disabled`)||e.getAttribute(`tabindex`)===`-1`||e.hidden||e.closest(`[inert]`))return!1;let t=getComputedStyle(e);return t.visibility!==`hidden`&&t.display!==`none`}function un(e){let t=[],n=e=>{for(let t of Array.from(e.children)){if(t instanceof HTMLSlotElement){let e=t.assignedElements({flatten:!0});if(e.length){for(let t of e)r(t);continue}}r(t)}},r=e=>{e instanceof HTMLElement&&e.matches(`a[href], area[href], button, input, select, textarea, summary, [tabindex], [contenteditable="true"]`)&&ln(e)&&t.push(e),e.shadowRoot?n(e.shadowRoot):n(e)};return n(e),t}function dn(){let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e}function fn(e,t={}){let n=dn(),r=e.shadowRoot??e,i=t=>{if(t.key!==`Tab`)return;let n=un(r);if(!n.length){t.preventDefault(),e.focus();return}let i=n[0],a=n[n.length-1],o=dn();t.shiftKey&&(o===i||!n.includes(o))?(t.preventDefault(),a.focus()):t.shiftKey||o!==a&&n.includes(o)||(t.preventDefault(),i.focus())};e.addEventListener(`keydown`,i),e.hasAttribute(`tabindex`)||(e.tabIndex=-1),(t.initialFocus??un(r)[0]??e).focus();let a=!1;return()=>{a||(a=!0,e.removeEventListener(`keydown`,i),t.restoreFocus!==!1&&n?.isConnected&&n.focus())}}var pn=0,mn;function hn(){let e=document.documentElement;if(pn++===0){mn={overflow:e.style.overflow,paddingInlineEnd:e.style.paddingInlineEnd};let t=window.innerWidth-e.clientWidth;e.style.overflow=`hidden`,t>0&&(e.style.paddingInlineEnd=`${t}px`)}let t=!1;return()=>{t||(t=!0,--pn===0&&mn&&(e.style.overflow=mn.overflow,e.style.paddingInlineEnd=mn.paddingInlineEnd,mn=void 0))}}var gn=0,H=class extends C{constructor(...e){super(...e),this.open=!1,this.heading=``,this.size=`md`,this.hideClose=!1,this.#e=`hpu-modal-title-${gn++}`}#e;#t;#n;static{this.styles=o`
    dialog {
      box-sizing: border-box;
      inline-size: min(var(--_w, 560px), calc(100vw - 2 * var(--hpu-space-4)));
      max-block-size: calc(100vh - 2 * var(--hpu-space-4));
      padding: 0;
      border: 1px solid var(--hpu-border);
      border-radius: var(--hpu-radius-lg);
      background: var(--hpu-surface-raised);
      color: var(--hpu-text);
      box-shadow: var(--hpu-shadow-2);
      font-family: var(--hpu-font);
      overflow: hidden;
    }
    /* Focus lands on the dialog itself when it has no tabbable content yet; no ring there. */
    dialog:focus-visible {
      outline: none;
    }
    dialog[open] {
      display: flex;
      flex-direction: column;
    }
    dialog::backdrop {
      background: color-mix(in srgb, var(--hpu-text) 45%, transparent);
    }
    :host([size='sm']) dialog {
      --_w: 400px;
    }
    :host([size='lg']) dialog {
      --_w: 800px;
    }
    .head {
      display: flex;
      align-items: center;
      gap: var(--hpu-space-2);
      padding: var(--hpu-space-3) var(--hpu-space-4);
      border-block-end: 1px solid var(--hpu-border);
    }
    h2 {
      flex: 1;
      margin: 0;
      font-size: var(--hpu-text-lg);
      font-weight: var(--hpu-weight-bold);
    }
    .body {
      flex: 1;
      overflow: auto;
      padding: var(--hpu-space-4);
    }
    .foot {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: var(--hpu-space-2);
      padding: var(--hpu-space-3) var(--hpu-space-4);
      border-block-start: 1px solid var(--hpu-border);
    }
    .foot:not(:has(*)) {
      display: none;
    }
    @media (max-width: 640px) {
      dialog[open] {
        inline-size: 100vw;
        max-inline-size: 100vw;
        block-size: 100dvh;
        max-block-size: 100dvh;
        border-radius: 0;
        border: 0;
      }
    }
    @media (prefers-reduced-motion: no-preference) {
      dialog[open] {
        animation: pop var(--hpu-duration) var(--hpu-ease);
      }
    }
    @keyframes pop {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
    }
  `}render(){return v`<dialog
      aria-labelledby=${this.#e}
      @cancel=${this.#s}
      @click=${this.#c}
    >
      <div class="head">
        <h2 id=${this.#e}>${this.heading}</h2>
        ${this.hideClose?b:v`<hpu-icon-button
                .path=${Dt}
                .label=${A(`common.close`)}
                @hpu-click=${()=>this.#o(`button`)}
              ></hpu-icon-button>`}
      </div>
      <div class="body"><slot></slot></div>
      <div class="foot"><slot name="actions"></slot></div>
    </dialog>`}updated(e){e.has(`open`)&&(this.open&&!this.dialog.open?this.#r():!this.open&&this.dialog.open&&this.#i())}disconnectedCallback(){super.disconnectedCallback(),this.#a()}#r(){this.dialog.showModal(),this.#n=hn();let e=this.querySelector(`[autofocus]`);this.#t=fn(this.dialog,{initialFocus:e})}#i(){this.#a(),this.dialog.close()}#a(){this.#t?.(),this.#n?.(),this.#t=this.#n=void 0}#o(e){let t=new CustomEvent(`hpu-close`,{detail:{reason:e},bubbles:!0,composed:!0,cancelable:!0});this.dispatchEvent(t)&&(this.open=!1)}#s(e){e.preventDefault(),this.#o(`escape`)}#c(e){e.target===this.dialog&&this.#o(`backdrop`)}};k([w({type:Boolean,reflect:!0})],H.prototype,`open`,void 0),k([w()],H.prototype,`heading`,void 0),k([w({reflect:!0})],H.prototype,`size`,void 0),k([w({type:Boolean,attribute:`hide-close`})],H.prototype,`hideClose`,void 0),k([Ke(`dialog`)],H.prototype,`dialog`,void 0),H=k([O(`hpu-modal`)],H);var U=class extends C{constructor(...e){super(...e),this.heading=``,this.message=``,this.tone=`primary`,this.confirmLabel=``,this.cancelLabel=``,this.open=!1}render(){let e=this.tone===`danger`;return v`<hpu-modal
      size="sm"
      hide-close
      .open=${this.open}
      .heading=${this.heading}
      @hpu-close=${e=>{e.stopPropagation(),this.#e(!1)}}
    >
      <p style="margin:0;line-height:var(--hpu-leading-normal)">${this.message}</p>
      <hpu-button
        slot="actions"
        variant="text"
        tone="gray"
        ?autofocus=${e}
        @hpu-click=${()=>this.#e(!1)}
        >${this.cancelLabel||A(`common.cancel`)}</hpu-button
      >
      <hpu-button
        slot="actions"
        variant="filled"
        tone=${this.tone}
        ?autofocus=${!e}
        @hpu-click=${()=>this.#e(!0)}
        >${this.confirmLabel||A(`common.confirm`)}</hpu-button
      >
    </hpu-modal>`}#e(e){this.open=!1,this.dispatchEvent(new CustomEvent(`hpu-confirm-result`,{detail:{confirmed:e},bubbles:!0,composed:!0}))}};k([w()],U.prototype,`heading`,void 0),k([w()],U.prototype,`message`,void 0),k([w()],U.prototype,`tone`,void 0),k([w({attribute:`confirm-label`})],U.prototype,`confirmLabel`,void 0),k([w({attribute:`cancel-label`})],U.prototype,`cancelLabel`,void 0),k([w({type:Boolean})],U.prototype,`open`,void 0),U=k([O(`hpu-confirm`)],U);function _n(e){return new Promise(t=>{let n=document.createElement(`hpu-confirm`);n.heading=e.title,n.message=e.message,n.tone=e.tone??`primary`,n.confirmLabel=e.confirmLabel??``,n.cancelLabel=e.cancelLabel??``,n.addEventListener(`hpu-confirm-result`,e=>{t(e.detail.confirmed),setTimeout(()=>n.remove(),0)}),(e.host??document.body).append(n),n.updateComplete.then(()=>n.open=!0)})}var W=class extends L{constructor(...e){super(...e),this.type=`text`,this.autocomplete=``,this.inputmode=``,this.pattern=``,this.icon=``}static{this.styles=[...L.styles,o`
      .wrap {
        position: relative;
        display: block;
      }
      .icon {
        position: absolute;
        inset-inline-start: var(--hpu-space-3);
        inset-block: 0;
        display: flex;
        align-items: center;
        color: var(--hpu-text-muted);
        pointer-events: none;
      }
      .control.has-icon {
        padding-inline-start: calc(var(--hpu-space-3) + 1.5rem);
      }
    `]}renderControl({id:e,describedBy:t}){let n=v`<input
      class=${this.icon?`control has-icon`:`control`}
      part="control"
      id=${e}
      .type=${this.type}
      .value=${this.value}
      name=${this.name||b}
      placeholder=${this.placeholder||b}
      autocomplete=${this.autocomplete||b}
      inputmode=${this.inputmode||b}
      pattern=${this.pattern||b}
      maxlength=${j(this.maxlength)}
      ?required=${this.required}
      ?disabled=${this.disabled}
      ?readonly=${this.readonly}
      aria-invalid=${this.error?`true`:`false`}
      aria-describedby=${j(t)}
      @input=${this.onInput}
      @change=${this.onChange}
    />`;return this.icon?v`<span class="wrap"
          ><span class="icon"><hpu-icon .path=${this.icon}></hpu-icon></span>${n}</span
        >`:n}};k([w()],W.prototype,`type`,void 0),k([w()],W.prototype,`autocomplete`,void 0),k([w()],W.prototype,`inputmode`,void 0),k([w()],W.prototype,`pattern`,void 0),k([w({type:Number})],W.prototype,`maxlength`,void 0),k([w()],W.prototype,`icon`,void 0),W=k([O(`hpu-input`)],W);var G=class extends C{constructor(...e){super(...e),this.selected=!1,this.removable=!1,this.disabled=!1,this.tone=`primary`,this.size=`md`,this.icon=``,this.noIcon=!1,this.removeLabel=``}static{this.styles=[E,D,tt,o`
      :host {
        /* Long unbroken text wraps instead of overflowing the component. */
        overflow-wrap: anywhere;
        display: inline-flex;
      }
      .wrap {
        display: inline-flex;
        align-items: center;
        min-block-size: calc(var(--_h) * 0.8);
        border: 1px solid var(--hpu-border-strong);
        border-radius: var(--hpu-radius-pill);
        background: var(--hpu-surface-raised);
        color: var(--hpu-text);
        font: var(--hpu-weight-medium) var(--_font) / var(--hpu-leading-tight) var(--hpu-font);
      }
      :host([selected]) .wrap {
        background: var(--_tint);
        border-color: var(--_text);
        color: var(--_text);
      }
      :host([disabled]) .wrap {
        opacity: 0.5;
      }
      .control {
        display: inline-flex;
        align-items: center;
        gap: var(--hpu-space-1);
        align-self: stretch;
        padding-inline: calc(var(--_pad) * 0.75);
        border: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        cursor: pointer;
      }
      /* The wrapper no longer clips, so the end controls round their own hover background. */
      .control:first-child {
        border-start-start-radius: var(--hpu-radius-pill);
        border-end-start-radius: var(--hpu-radius-pill);
      }
      .control:last-child {
        border-start-end-radius: var(--hpu-radius-pill);
        border-end-end-radius: var(--hpu-radius-pill);
      }
      .control:hover:not(:disabled) {
        background: var(--hpu-hover);
      }
      .control:disabled {
        cursor: not-allowed;
      }
      .count {
        padding-inline: var(--hpu-space-2);
        border-radius: var(--hpu-radius-pill);
        background: var(--hpu-surface-sunken);
        color: var(--hpu-text);
        font-size: 0.85em;
      }
      .remove {
        padding-inline: var(--hpu-space-2);
      }
      .remove hpu-icon {
        --_icon: calc(var(--_font) + 2px);
      }
      hpu-icon.lead,
      ::slotted([slot='icon']) {
        --_icon: calc(var(--_font) + 2px);
      }
    `]}#e(){return this.noIcon?b:this.icon?v`<hpu-icon class="lead" .path=${this.icon}></hpu-icon>`:this.selected?v`<hpu-icon class="lead check" .path=${St}></hpu-icon>`:b}render(){return v`<span class="wrap">
      <button
        class="control"
        part="control"
        type="button"
        aria-pressed=${this.selected?`true`:`false`}
        ?disabled=${this.disabled}
        @click=${this.#t}
      >
        ${this.noIcon?b:v`<slot name="icon">${this.#e()}</slot>`}
        <slot></slot>
        ${this.count===void 0?b:v`<span class="count">${this.count}</span>`}
      </button>
      ${this.removable?v`<button
              class="control remove"
              type="button"
              aria-label=${this.removeLabel||A(`common.dismiss`)}
              ?disabled=${this.disabled}
              @click=${this.#n}
            >
              <hpu-icon .path=${Dt}></hpu-icon>
            </button>`:b}
    </span>`}#t(){this.selected=!this.selected,this.dispatchEvent(new CustomEvent(`hpu-select`,{detail:{selected:this.selected},bubbles:!0,composed:!0}))}#n(){this.dispatchEvent(new CustomEvent(`hpu-remove`,{bubbles:!0,composed:!0}))}};k([w({type:Boolean,reflect:!0})],G.prototype,`selected`,void 0),k([w({type:Number})],G.prototype,`count`,void 0),k([w({type:Boolean,reflect:!0})],G.prototype,`removable`,void 0),k([w({type:Boolean,reflect:!0})],G.prototype,`disabled`,void 0),k([w({reflect:!0})],G.prototype,`tone`,void 0),k([w({reflect:!0})],G.prototype,`size`,void 0),k([w()],G.prototype,`icon`,void 0),k([w({type:Boolean,attribute:`no-icon`,reflect:!0})],G.prototype,`noIcon`,void 0),k([w({attribute:`remove-label`})],G.prototype,`removeLabel`,void 0),G=k([O(`hpu-chip`)],G);var vn=e=>e===void 0||e===``?[]:Array.isArray(e)?e:[e],yn=e=>Object.values(e).reduce((e,t)=>e+vn(t).length,0),bn=0,K=class extends C{constructor(...e){super(...e),this.filters=[],this.value={search:``,filters:{}},this.searchLabel=``,this.searchPlaceholder=``,this.searchDebounce=250,this.advancedCount=0,this.open=!1,this.draft={},this.hasSlotted=!1,this.#e=`hpu-filters-${bn++}`,this.#o=e=>{e.composedPath().some(e=>e===this.panel||e===this.trigger)||this.#a(!1)},this.#s=e=>{if(e.key===`Escape`){if(e.composedPath().some(e=>e instanceof HTMLElement&&e.matches(`hpu-select[open]`)))return;e.stopPropagation(),this.#a()}}}#e;#t;#n;static{this.styles=o`
    :host {
      display: block;
      container-type: inline-size;
      font-family: var(--hpu-font);
      color: var(--hpu-text);
    }
    :host([hidden]) {
      display: none;
    }
    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }
    .bar {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: var(--hpu-space-2);
    }
    hpu-input {
      inline-size: 20rem;
      max-inline-size: 100%;
      min-inline-size: 0;
    }
    .trigger {
      position: relative;
      display: inline-flex;
    }
    .count {
      position: absolute;
      inset-block-start: -6px;
      inset-inline-end: -6px;
      pointer-events: none;
    }
    .panel {
      position: fixed;
      inset: auto;
      margin: 0;
      inline-size: min(24rem, calc(100vw - 16px));
      max-block-size: min(32rem, calc(100vh - 16px));
      overflow: auto;
      padding: var(--hpu-space-4);
      background: var(--hpu-surface-raised);
      color: var(--hpu-text);
      border: 1px solid var(--hpu-border);
      border-radius: var(--hpu-radius-lg);
      box-shadow: var(--hpu-shadow-2);
    }
    .panel:not(:popover-open) {
      display: none;
    }
    .panel:focus-visible {
      outline: none;
    }
    .panel-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--hpu-space-3);
      margin-block-end: var(--hpu-space-3);
    }
    .panel-title {
      margin: 0;
      font-size: var(--hpu-text-md);
      font-weight: var(--hpu-weight-bold);
    }
    .groups {
      display: flex;
      flex-direction: column;
      gap: var(--hpu-space-4);
    }
    .group-label {
      display: block;
      margin-block-end: var(--hpu-space-2);
      color: var(--hpu-text-muted);
      font-size: var(--hpu-text-xs);
      font-weight: var(--hpu-weight-medium);
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: var(--hpu-space-2);
    }
    .panel-foot {
      margin-block-start: var(--hpu-space-4);
    }
    .vh {
      position: absolute;
      inline-size: 1px;
      block-size: 1px;
      overflow: hidden;
      clip-path: inset(50%);
    }
    @container (max-width: 480px) {
      hpu-input {
        inline-size: auto;
        flex: 1;
      }
    }
  `}disconnectedCallback(){clearTimeout(this.#t),this.#a(!1),super.disconnectedCallback()}updated(e){e.has(`open`)&&(this.open?this.#r():this.#i())}async#r(){if(this.trigger||await this.updateComplete,await this.trigger?.querySelector(`hpu-button`)?.updateComplete,!this.open||!this.panel||!this.trigger||this.panel.matches(`:popover-open`))return;this.draft=structuredClone(this.value.filters),this.panel.showPopover();let e=this.clientWidth<480;this.panel.toggleAttribute(`data-sheet`,e),e?Object.assign(this.panel.style,{inset:`auto 0 0 0`,inlineSize:`auto`,maxBlockSize:`85vh`,borderEndStartRadius:`0`,borderEndEndRadius:`0`}):(this.panel.removeAttribute(`style`),this.#n=Bt(this.trigger,this.panel,{align:`end`})),document.addEventListener(`pointerdown`,this.#o,!0),document.addEventListener(`keydown`,this.#s,!0),this.panel.focus()}#i(){this.#n?.(),this.#n=void 0,document.removeEventListener(`pointerdown`,this.#o,!0),document.removeEventListener(`keydown`,this.#s,!0),this.panel?.matches(`:popover-open`)&&this.panel.hidePopover()}#a(e=!0){this.open&&(this.open=!1,this.#i(),e&&this.trigger?.querySelector(`hpu-button`)?.focus())}#o;#s;#c(e){this.value=e,this.dispatchEvent(new CustomEvent(`hpu-filter-change`,{detail:{value:e},bubbles:!0,composed:!0}))}#l(e){clearTimeout(this.#t),this.searchDraft=void 0,e!==this.value.search&&this.#c({...this.value,search:e})}#u(e){e.stopPropagation(),this.searchDraft=e.detail.value,clearTimeout(this.#t),this.#t=setTimeout(()=>this.#l(e.detail.value),this.searchDebounce)}#d(e,t){let n=vn(this.draft[e.key]),r=n.includes(t),i=e.multiple?r?n.filter(e=>e!==t):[...n,t]:r?[]:[t],a={...this.draft};i.length?a[e.key]=e.multiple?i:i[0]:delete a[e.key],this.draft=a}#f(e,t){let n={...this.draft};t.length?n[e.key]=e.multiple?t:t[0]:delete n[e.key],this.draft=n}#p(){this.#c({...this.value,filters:this.draft}),this.#a()}#m(){clearTimeout(this.#t),this.searchDraft=void 0,this.dispatchEvent(new CustomEvent(`hpu-reset`,{bubbles:!0,composed:!0})),this.#c({search:``,filters:{}}),this.#a()}get#h(){return yn(this.value.filters)+this.advancedCount}#g(e){let t=vn(this.draft[e.key]),n=e.options.map(t=>{let n=t.count??this.facets?.[e.key]?.[t.value];return{value:t.value,label:n===void 0?t.label:`${t.label} (${n})`}});return v`<hpu-select
      size="sm"
      clearable
      label=${e.label}
      ?multiple=${e.multiple}
      ?searchable=${e.searchable}
      .options=${n}
      .value=${t[0]??``}
      .values=${t}
      @hpu-change=${t=>{t.stopPropagation(),this.#f(e,t.detail.values??(t.detail.value?[t.detail.value]:[]))}}
    ></hpu-select>`}#_(e){if(e.type===`select`)return this.#g(e);let t=vn(this.draft[e.key]);return v`<div role="group" aria-labelledby="${this.#e}-${e.key}">
      <span class="group-label" id="${this.#e}-${e.key}">${e.label}</span>
      <div class="chips">
        ${e.options.map(n=>v`<hpu-chip
            size="sm"
            .count=${n.count??this.facets?.[e.key]?.[n.value]}
            ?selected=${t.includes(n.value)}
            @hpu-select=${t=>{t.stopPropagation(),this.#d(e,n.value)}}
            >${n.label}</hpu-chip
          >`)}
      </div>
    </div>`}render(){let e=this.#h,t=e>0||!!this.value.search;return v`
      <div class="bar">
        <hpu-input
          type="search"
          hide-label
          .icon=${jt}
          label=${this.searchLabel||A(`common.search`)}
          placeholder=${this.searchPlaceholder||A(`common.search`)}
          .value=${this.searchDraft??this.value.search}
          @hpu-input=${this.#u}
          @hpu-change=${e=>{e.stopPropagation(),this.#l(e.detail.value)}}
        ></hpu-input>
        ${this.filters.length||this.hasSlotted?v`<span class="trigger">
                <hpu-button
                  variant="outlined"
                  tone="gray"
                  aria-label=${A(`filter.title`)}
                  haspopup="dialog"
                  expanded=${this.open?`true`:`false`}
                  @click=${()=>this.open=!this.open}
                >
                  <hpu-icon slot="icon" .path=${kt}></hpu-icon>
                  ${A(`filter.title`)}
                </hpu-button>
                ${e?v`<hpu-badge class="count" tone="primary" size="sm">${e}</hpu-badge>`:b}
              </span>`:b}
      </div>
      <div
        class="panel"
        popover="manual"
        role="dialog"
        aria-label=${A(`filter.title`)}
        tabindex="-1"
      >
        <div class="panel-head">
          <h2 class="panel-title">${A(`filter.title`)}</h2>
          ${t?v`<hpu-button variant="text" tone="danger" size="sm" @click=${this.#m}
                  >${A(`common.reset`)}</hpu-button
                >`:b}
        </div>
        <div class="groups">
          ${this.filters.map(e=>this.#_(e))}
          <slot
            name="advanced"
            @slotchange=${e=>this.hasSlotted=e.target.assignedNodes().length>0}
          ></slot>
        </div>
        <div class="panel-foot">
          <hpu-button @click=${this.#p}>${A(`filter.apply`)}</hpu-button>
        </div>
      </div>
      <span class="vh" role="status" aria-live="polite"
        >${e?A(`filter.active_count`,{count:e}):``}</span
      >
    `}};k([w({attribute:!1})],K.prototype,`filters`,void 0),k([w({attribute:!1})],K.prototype,`value`,void 0),k([w({attribute:!1})],K.prototype,`facets`,void 0),k([w({attribute:`search-label`})],K.prototype,`searchLabel`,void 0),k([w({attribute:`search-placeholder`})],K.prototype,`searchPlaceholder`,void 0),k([w({type:Number,attribute:`search-debounce`})],K.prototype,`searchDebounce`,void 0),k([w({type:Number,attribute:`advanced-count`})],K.prototype,`advancedCount`,void 0),k([w({type:Boolean,reflect:!0})],K.prototype,`open`,void 0),k([T()],K.prototype,`draft`,void 0),k([T()],K.prototype,`searchDraft`,void 0),k([T()],K.prototype,`hasSlotted`,void 0),k([Ke(`.panel`)],K.prototype,`panel`,void 0),k([Ke(`.trigger`)],K.prototype,`trigger`,void 0),K=k([O(`hpu-filter-bar`)],K);var q=class extends C{constructor(...e){super(...e),this.heading=``,this.description=``,this.icon=``,this.headingLevel=2,this.collapsible=!1,this.open=!0,this.compact=!1,this.aside=!1,this.plain=!1,this.hasFooter=!1,this.hasIconSlot=!1}static{this.styles=[E,tt,o`
      :host {
        /* Long unbroken text wraps instead of overflowing the component. */
        overflow-wrap: anywhere;
        --_gap: var(--hpu-space-4);
        display: block;
        container-type: inline-size;
        font-family: var(--hpu-font);
        color: var(--hpu-text);
      }
      :host([compact]) {
        --_gap: var(--hpu-space-3);
      }
      :host([hidden]) {
        display: none;
      }
      .section {
        background: var(--hpu-surface-raised);
        border: var(--hpu-surface-border);
        box-shadow: var(--hpu-surface-shadow);
        border-radius: var(--hpu-radius-lg);
        overflow: hidden;
      }
      :host([plain]) .section {
        background: none;
        border: 0;
        border-radius: 0;
        /* No surface to round, and clipping would cut off focus rings at the content edge. */
        overflow: visible;
      }
      .head {
        display: flex;
        align-items: center;
        gap: var(--hpu-space-3);
        padding: var(--_gap);
      }
      :host([plain]) .head {
        padding-inline: 0;
      }
      :host([tone]) .head {
        background: var(--_tint);
        border-block-end: 1px solid var(--_border);
      }
      :host([collapsible]) .head,
      .head.clickable {
        cursor: pointer;
      }
      .lead[hidden] {
        display: none;
      }
      .lead {
        display: inline-flex;
        color: var(--hpu-text-muted);
      }
      :host([tone]) .lead {
        color: var(--_text);
      }
      .titles {
        flex: 1;
        min-inline-size: 0;
      }
      .heading {
        margin: 0;
        font-size: var(--hpu-text-md);
        font-weight: var(--hpu-weight-bold);
        line-height: var(--hpu-leading-tight);
      }
      .description {
        margin: var(--hpu-space-1) 0 0;
        color: var(--hpu-text-muted);
        font-size: var(--hpu-text-sm);
      }
      .toggle {
        display: inline-flex;
        align-items: center;
        padding: 0;
        border: 0;
        background: none;
        color: inherit;
        font: inherit;
        text-align: start;
        cursor: pointer;
      }
      .chevron {
        display: inline-flex;
        transition: transform var(--hpu-duration) var(--hpu-ease);
      }
      :host(:not([open])) .chevron {
        transform: rotate(-90deg);
      }
      :host(:not([open]):dir(rtl)) .chevron {
        transform: rotate(90deg);
      }
      .actions {
        display: flex;
        align-items: center;
        gap: var(--hpu-space-2);
      }
      .content {
        padding: var(--_gap);
        padding-block-start: 0;
      }
      :host([tone]) .content,
      .head + .panel .content:first-child {
        padding-block-start: var(--_gap);
      }
      :host([plain]) .content {
        padding-inline: 0;
      }
      .footer {
        padding: var(--hpu-space-3) var(--_gap);
        background: var(--hpu-surface-sunken);
        border-block-start: 1px solid var(--hpu-border);
      }
      :host([plain]) .footer {
        background: none;
        padding-inline: 0;
      }
      [hidden] {
        display: none !important;
      }

      /* Aside: heading beside the content when the container is wide enough. */
      @container (min-width: 640px) {
        :host([aside]) .section {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
          gap: var(--hpu-space-5);
          background: none;
          border: 0;
          border-radius: 0;
          overflow: visible;
        }
        :host([aside]) .head {
          align-items: flex-start;
          padding: 0;
          background: none;
          border: 0;
        }
        :host([aside]) .panel {
          background: var(--hpu-surface-raised);
          border: var(--hpu-surface-border);
          box-shadow: var(--hpu-surface-shadow);
          border-radius: var(--hpu-radius-lg);
          overflow: hidden;
        }
        :host([aside]) .content {
          padding-block-start: var(--_gap);
        }
      }
    `]}render(){let e=v`<slot name="icon" @slotchange=${this.#e}
      >${this.icon?v`<hpu-icon .path=${this.icon}></hpu-icon>`:b}</slot
    >`,t=v`<span class="heading">${this.heading}</span>`;return v`<div class="section">
      <div class="head" @click=${this.#n}>
        <span class="lead" ?hidden=${!this.icon&&!this.hasIconSlot}>${e}</span>
        <div class="titles">
          <div role="heading" aria-level=${this.headingLevel}>
            ${this.collapsible?v`<button
                    class="toggle control"
                    type="button"
                    aria-expanded=${this.open?`true`:`false`}
                    aria-controls="body"
                    @click=${e=>{e.stopPropagation(),this.#r()}}
                  >
                    ${t}
                  </button>`:t}
          </div>
          ${this.description?v`<p class="description">${this.description}</p>`:b}
        </div>
        <div class="actions"><slot name="actions"></slot></div>
        ${this.collapsible?v`<span class="chevron" aria-hidden="true"
                ><hpu-icon .path=${wt}></hpu-icon
              ></span>`:b}
      </div>
      <div class="panel" id="body" ?hidden=${!this.open}>
        <div class="content"><slot></slot></div>
        <div class="footer" ?hidden=${!this.hasFooter}>
          <slot name="footer" @slotchange=${this.#t}></slot>
        </div>
      </div>
    </div>`}#e(e){this.hasIconSlot=e.target.assignedNodes().length>0}#t(e){this.hasFooter=e.target.assignedNodes().length>0}#n(e){this.collapsible&&(e.composedPath().some(e=>e instanceof HTMLElement&&e.classList.contains(`actions`))||this.#r())}#r(){this.open=!this.open,this.dispatchEvent(new CustomEvent(`hpu-toggle`,{detail:{open:this.open},bubbles:!0,composed:!0}))}};k([w()],q.prototype,`heading`,void 0),k([w()],q.prototype,`description`,void 0),k([w()],q.prototype,`icon`,void 0),k([w({type:Number,attribute:`heading-level`})],q.prototype,`headingLevel`,void 0),k([w({type:Boolean})],q.prototype,`collapsible`,void 0),k([w({type:Boolean,reflect:!0})],q.prototype,`open`,void 0),k([w({type:Boolean,reflect:!0})],q.prototype,`compact`,void 0),k([w({type:Boolean,reflect:!0})],q.prototype,`aside`,void 0),k([w({type:Boolean,reflect:!0})],q.prototype,`plain`,void 0),k([w({reflect:!0})],q.prototype,`tone`,void 0),k([T()],q.prototype,`hasFooter`,void 0),k([T()],q.prototype,`hasIconSlot`,void 0),q=k([O(`hpu-section`)],q);var J=class extends C{constructor(...e){super(...e),this.heading=``,this.description=``,this.icon=``,this.aside=!1,this.compact=!1,this.plain=!1,this.columns=1}static{this.styles=o`
    :host {
      /* Long unbroken text wraps instead of overflowing the component. */
      overflow-wrap: anywhere;
      display: block;
    }
    :host([hidden]) {
      display: none;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(var(--_cols, 1), minmax(0, 1fr));
      gap: var(--hpu-space-4);
      align-items: start;
    }
    /*
     * A switch or checkbox without a field label has nothing above it, so beside a labelled
     * field in the same row it would sit higher. Drop it by the height of a field label so its
     * control lines up with its neighbours' controls. Only in side-by-side layouts.
     */
    :host(:not([columns='1'])) ::slotted(hpu-switch:not([label])),
    :host(:not([columns='1'])) ::slotted(hpu-checkbox:not([label])) {
      margin-block-start: var(
        --_label-offset,
        calc(var(--hpu-text-sm) * var(--hpu-leading-tight) + var(--hpu-space-1))
      );
    }
    ::slotted([data-span='full']) {
      grid-column: 1 / -1;
    }
    ::slotted([data-span='2']) {
      grid-column: span 2;
    }
    ::slotted([data-span='3']) {
      grid-column: span 3;
    }
    ::slotted([data-span='4']) {
      grid-column: span 4;
    }
    @container (max-width: 480px) {
      .grid {
        grid-template-columns: minmax(0, 1fr);
      }
      ::slotted([data-span]) {
        grid-column: auto;
      }
      ::slotted(hpu-switch:not([label])),
      ::slotted(hpu-checkbox:not([label])) {
        margin-block-start: 0 !important;
      }
    }
  `}render(){return v`
      <hpu-section
        heading=${this.heading}
        description=${this.description}
        .icon=${this.icon}
        ?aside=${this.aside}
        ?compact=${this.compact}
        ?plain=${this.plain}
      >
        <slot name="actions" slot="actions"></slot>
        <div
          class="grid"
          style="--_cols:${Math.min(4,Math.max(1,Math.round(this.columns)||1))}"
        >
          <slot></slot>
        </div>
      </hpu-section>
    `}};k([w()],J.prototype,`heading`,void 0),k([w()],J.prototype,`description`,void 0),k([w()],J.prototype,`icon`,void 0),k([w({type:Boolean,reflect:!0})],J.prototype,`aside`,void 0),k([w({type:Boolean,reflect:!0})],J.prototype,`compact`,void 0),k([w({type:Boolean,reflect:!0})],J.prototype,`plain`,void 0),k([w({type:Number,reflect:!0})],J.prototype,`columns`,void 0),J=k([O(`hpu-form-section`)],J);var xn=class extends C{constructor(...e){super(...e),this.dirty=!1,this.snapshot=``,this.hasActions=!1,this.#e=!1,this.#i=()=>{this.#e&&this.#a(JSON.stringify(this.values)!==this.snapshot)}}#e;static{this.styles=o`
    :host {
      display: block;
      font-family: var(--hpu-font);
      color: var(--hpu-text);
    }
    :host([hidden]) {
      display: none;
    }
    .body {
      display: flex;
      flex-direction: column;
      gap: var(--hpu-space-5);
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: var(--hpu-space-2);
      margin-block-start: var(--hpu-space-5);
    }
    .actions[hidden] {
      display: none;
    }
  `}render(){return v`
      <div
        class="body"
        @keydown=${this.#n}
        @click=${this.#r}
        @input=${this.#i}
        @change=${this.#i}
        @hpu-input=${this.#i}
        @hpu-change=${this.#i}
      >
        <slot @slotchange=${this.#t}></slot>
        <div class="actions" ?hidden=${!this.hasActions}>
          <slot
            name="actions"
            @slotchange=${e=>this.hasActions=e.target.assignedNodes().length>0}
          ></slot>
        </div>
      </div>
    `}get controls(){return[...this.querySelectorAll(`[name]`)].filter(e=>!e.disabled)}get values(){let e={};for(let t of this.controls){let n=t.name;n&&(e[n]=typeof t.checked==`boolean`?t.checked:t.multiple&&Array.isArray(t.values)?[...t.values]:t.value??``)}return e}markClean(){this.snapshot=JSON.stringify(this.values),this.#a(!1)}reset(){let e=JSON.parse(this.snapshot||`{}`);for(let t of this.controls){let n=t.name;if(!n||!(n in e))continue;let r=e[n];typeof t.checked==`boolean`?t.checked=r===!0:t.multiple&&Array.isArray(r)?t.values=[...r]:t.value=String(r)}this.#a(!1),this.dispatchEvent(new CustomEvent(`hpu-reset`,{bubbles:!0,composed:!0}))}submit(){let e=this.controls.filter(e=>e.checkValidity&&!e.checkValidity());return e.length?(e[0].reportValidity?.(),e[0].focus(),this.dispatchEvent(new CustomEvent(`hpu-invalid`,{detail:{fields:e.map(e=>e.name)},bubbles:!0,composed:!0})),!1):(this.dispatchEvent(new CustomEvent(`hpu-submit`,{detail:{values:this.values},bubbles:!0,composed:!0})),!0)}async#t(){this.#e||(await Promise.all(this.controls.map(e=>e.updateComplete)),this.#e||(this.#e=!0,this.markClean()))}#n(e){if(e.key!==`Enter`||e.defaultPrevented||e.isComposing)return;let t=e.composedPath()[0];t?.tagName!==`INPUT`||[`button`,`checkbox`,`radio`].includes(t.type)||(e.preventDefault(),this.submit())}#r(e){let t=e.composedPath().find(e=>e instanceof HTMLElement&&e.tagName===`HPU-BUTTON`);if(!t||t.disabled)return;let n=t.type;n===`submit`?this.submit():n===`reset`&&this.reset()}#i;#a(e){e!==this.dirty&&(this.dirty=e,this.dispatchEvent(new CustomEvent(`hpu-dirty-change`,{detail:{dirty:e},bubbles:!0,composed:!0})))}};k([w({type:Boolean,reflect:!0})],xn.prototype,`dirty`,void 0),k([T()],xn.prototype,`snapshot`,void 0),k([T()],xn.prototype,`hasActions`,void 0),xn=k([O(`hpu-form`)],xn);var Sn=class extends C{constructor(...e){super(...e),this.min=``,this.gap=`4`}static{this.styles=o`
    :host {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--hpu-grid-min, 240px)), 1fr));
      gap: var(--hpu-space-4);
    }
    :host([gap='0']) {
      gap: 0;
    }
    :host([gap='1']) {
      gap: var(--hpu-space-1);
    }
    :host([gap='2']) {
      gap: var(--hpu-space-2);
    }
    :host([gap='3']) {
      gap: var(--hpu-space-3);
    }
    :host([gap='5']) {
      gap: var(--hpu-space-5);
    }
    :host([gap='6']) {
      gap: var(--hpu-space-6);
    }
  `}updated(){/^\d+(\.\d+)?(px|rem|em|ch|%|vw)$/.test(this.min)?this.style.setProperty(`--hpu-grid-min`,this.min):this.style.removeProperty(`--hpu-grid-min`)}render(){return v`<slot></slot>`}};k([w()],Sn.prototype,`min`,void 0),k([w({reflect:!0})],Sn.prototype,`gap`,void 0),Sn=k([O(`hpu-grid`)],Sn);var Y=class extends C{constructor(...e){super(...e),this.label=``,this.value=``,this.unit=``,this.meta=``,this.icon=``,this.tone=`gray`,this.clickable=!1,this.selected=!1,this.detail=``}static{this.shadowRootOptions={...C.shadowRootOptions,delegatesFocus:!0}}static{this.styles=[E,tt,o`
      :host {
        /* Long unbroken text wraps instead of overflowing the component. */
        overflow-wrap: anywhere;
        display: block;
        font-family: var(--hpu-font);
      }
      /* Fill the grid cell so cards in a row share one height, whatever their content. */
      .card {
        display: flex;
        flex-direction: column;
        inline-size: 100%;
        block-size: 100%;
        padding: var(--hpu-space-4);
        background: var(--hpu-surface-raised);
        color: var(--hpu-text);
        border: var(--hpu-surface-border);
        box-shadow: var(--hpu-surface-shadow);
        border-radius: var(--hpu-radius-lg);
        text-align: start;
        font: inherit;
      }
      button.card {
        cursor: pointer;
        transition: background-color var(--hpu-duration-fast) var(--hpu-ease);
      }
      button.card:hover {
        background: color-mix(in srgb, var(--hpu-surface-raised), var(--hpu-hover));
      }
      :host([selected]) .card {
        border-color: var(--_text);
        background: var(--_tint);
      }
      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--hpu-space-2);
        color: var(--hpu-text-muted);
        font-size: var(--hpu-text-sm);
      }
      hpu-icon {
        color: var(--_text);
      }
      .value {
        margin-block-start: var(--hpu-space-2);
        font-size: var(--hpu-text-xl);
        font-weight: var(--hpu-weight-bold);
        line-height: var(--hpu-leading-tight);
      }
      .unit {
        margin-inline-start: var(--hpu-space-1);
        color: var(--hpu-text-muted);
        font-size: var(--hpu-text-md);
        font-weight: var(--hpu-weight-regular);
      }
      .meta {
        margin-block-start: var(--hpu-space-1);
        color: var(--hpu-text-muted);
        font-size: var(--hpu-text-xs);
      }
      .detail {
        margin-block-start: var(--hpu-space-1);
        color: var(--hpu-text-muted);
        font-size: var(--hpu-text-xs);
      }
      ${a(qe.map(e=>`.detail[data-tone='${e}'] { color: var(--hpu-${e}-text); }`).join(`
`))}
      .visual {
        margin-block-start: auto;
        padding-block-start: var(--hpu-space-3);
      }
      .visual:not(:has(::slotted(*))) {
        padding-block-start: 0;
      }
    `]}render(){let e=v`
      <div class="top">
        <span>${this.label}</span>
        ${this.icon?v`<hpu-icon .path=${this.icon}></hpu-icon>`:b}
      </div>
      <div class="value">
        ${this.value}${this.unit?v`<span class="unit">${this.unit}</span>`:b}
      </div>
      ${this.meta?v`<div class="meta">${this.meta}</div>`:b}
      ${this.detail?v`<div class="detail" data-tone=${j(this.detailTone)}>${this.detail}</div>`:b}
      <div class="visual"><slot name="visual"></slot></div>
    `;return this.clickable?v`<button
          class="card control"
          type="button"
          aria-label=${j(this.accessibleLabel)}
          aria-haspopup=${j(this.haspopup)}
          aria-expanded=${j(this.expanded)}
          aria-pressed=${j(this.haspopup?void 0:this.selected?`true`:`false`)}
          @click=${this.#e}
        >
          ${e}
        </button>`:v`<div class="card">${e}</div>`}#e(){this.dispatchEvent(new CustomEvent(`hpu-activate`,{bubbles:!0,composed:!0}))}};k([w()],Y.prototype,`label`,void 0),k([w()],Y.prototype,`value`,void 0),k([w()],Y.prototype,`unit`,void 0),k([w()],Y.prototype,`meta`,void 0),k([w()],Y.prototype,`icon`,void 0),k([w({reflect:!0})],Y.prototype,`tone`,void 0),k([w({type:Boolean,reflect:!0})],Y.prototype,`clickable`,void 0),k([w({type:Boolean,reflect:!0})],Y.prototype,`selected`,void 0),k([w()],Y.prototype,`detail`,void 0),k([w({attribute:`detail-tone`})],Y.prototype,`detailTone`,void 0),k([w({attribute:`accessible-label`})],Y.prototype,`accessibleLabel`,void 0),k([w()],Y.prototype,`haspopup`,void 0),k([w()],Y.prototype,`expanded`,void 0),Y=k([O(`hpu-stat-card`)],Y);var Cn={primary:At,gray:At,info:At,success:Ct,warning:vt,danger:yt},wn=1,Tn=class extends C{constructor(...e){super(...e),this.maxVisible=3,this.visible=[],this.#e=[],this.#t=new Map}#e;#t;static{this.styles=o`
    :host {
      /* Long unbroken text wraps instead of overflowing the component. */
      overflow-wrap: anywhere;
      position: fixed;
      inset-block-end: var(--hpu-space-4);
      inset-inline: var(--hpu-space-4);
      z-index: 2147483000;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--hpu-space-2);
      pointer-events: none;
      font-family: var(--hpu-font);
    }
    .toast {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: var(--hpu-space-3);
      inline-size: min(100%, 480px);
      padding: var(--hpu-space-3) var(--hpu-space-4);
      background: var(--hpu-surface-raised);
      color: var(--hpu-text);
      border: 1px solid var(--tone-border, var(--hpu-border));
      border-inline-start: 4px solid var(--tone-text, var(--hpu-border-strong));
      border-radius: var(--hpu-radius-md);
      box-shadow: var(--hpu-shadow-2);
      font-size: var(--hpu-text-sm);
      pointer-events: auto;
    }
    hpu-icon {
      color: var(--tone-text);
    }
    .message {
      flex: 1;
      min-inline-size: 0;
    }
    @media (prefers-reduced-motion: no-preference) {
      .toast {
        animation: in var(--hpu-duration) var(--hpu-ease);
      }
    }
    @keyframes in {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
    }
  `}show(e){let t=e.action,n={id:wn++,message:e.message,tone:e.tone??`info`,action:t,duration:e.duration??(t?8e3:5e3)};return this.#e.push(n),this.#n(),n.id}dismiss(e){let t=this.visible.some(t=>t.id===e);this.#i(e),this.#e=this.#e.filter(t=>t.id!==e),this.visible=this.visible.filter(t=>t.id!==e),t&&this.dispatchEvent(new CustomEvent(`hpu-dismiss`,{detail:{id:e},bubbles:!0,composed:!0})),this.#n()}render(){return v`${this.visible.map(e=>v`<div
        class="toast"
        role=${e.tone===`danger`||e.tone===`warning`?`alert`:`status`}
        style="--tone-text:var(--hpu-${e.tone}-text);--tone-border:var(--hpu-${e.tone}-border)"
        @mouseenter=${()=>this.#i(e.id)}
        @mouseleave=${()=>this.#r(e)}
        @focusin=${()=>this.#i(e.id)}
        @focusout=${()=>this.#r(e)}
      >
        <hpu-icon .path=${Cn[e.tone]}></hpu-icon>
        <span class="message">${e.message}</span>
        ${e.action?v`<hpu-button variant="text" size="sm" @hpu-click=${()=>this.#a(e)}
                >${e.action.label}</hpu-button
              >`:b}
        <hpu-icon-button
          .path=${Dt}
          .label=${A(`common.dismiss`)}
          size="sm"
          @hpu-click=${()=>this.dismiss(e.id)}
        ></hpu-icon-button>
      </div>`)}`}connectedCallback(){super.connectedCallback(),this.setAttribute(`role`,`region`),this.setAttribute(`aria-label`,A(`toast.region`))}disconnectedCallback(){super.disconnectedCallback(),this.#t.forEach(e=>clearTimeout(e)),this.#t.clear()}#n(){for(;this.visible.length<this.maxVisible&&this.#e.length;){let e=this.#e.shift();this.visible=[...this.visible,e],this.#r(e)}}#r(e){this.#i(e.id),e.duration>0&&this.#t.set(e.id,setTimeout(()=>this.dismiss(e.id),e.duration))}#i(e){let t=this.#t.get(e);t!==void 0&&clearTimeout(t),this.#t.delete(e)}#a(e){e.action?.onAction(),this.dispatchEvent(new CustomEvent(`hpu-action`,{detail:{id:e.id},bubbles:!0,composed:!0})),this.dismiss(e.id)}};k([w({type:Number,attribute:`max-visible`})],Tn.prototype,`maxVisible`,void 0),k([T()],Tn.prototype,`visible`,void 0),Tn=k([O(`hpu-toast`)],Tn);var En;function X(e){return En?.isConnected||(En=document.createElement(`hpu-toast`),document.body.append(En)),En.show(e)}function Dn(e,t){let n=t?.darkMode===!0;return n&&e.dataset.theme!==`dark`?e.dataset.theme=`dark`:!n&&`theme`in e.dataset&&delete e.dataset.theme,n}var On=e=>e.trim().toLowerCase();function kn(e,t){let n=new Set(t.map(On));return e.filter(e=>!n.has(On(e.name)))}function An(e,t){return e.filter(e=>!t.has(e.name))}function jn(e,t){let n=An(e,t).length;return n===e.length?`all`:n===0?`none`:`partial`}async function Mn(e){return e.connection.sendMessagePromise({type:`ready_home/settings`})}async function Nn(e,t){return e.connection.subscribeMessage(t,{type:`ready_home/subscribe`})}async function Pn(e,t){return e.connection.sendMessagePromise({type:`ready_home/barcode/lookup`,barcode:t})}async function Fn(e){return(await e.connection.sendMessagePromise({type:`ready_home/kit_templates/list`})).templates}var In=new Set([`ean_13`,`ean_8`,`upc_a`,`upc_e`,`code_128`]);function Ln(e,t){let n=e=>Math.round(e*1e4)/1e4;return e===`gram`&&t.calories_per_100g!=null?n(t.calories_per_100g/100):e===`kilogram`&&t.calories_per_100g!=null?n(t.calories_per_100g*10):e===`milliliter`&&t.calories_per_100ml!=null?n(t.calories_per_100ml/100):e===`liter`&&t.calories_per_100ml!=null?n(t.calories_per_100ml*10):null}function Rn(e,t){return In.has(e)?!0:/^\d{8,14}$/.test(t.trim())}function zn(e){return!!e.auth?.external?.config?.hasBarCodeScanner}function Bn(e,t){let n=e.auth?.external;if(!n?.config?.hasBarCodeScanner)return{done:Promise.reject(Error(`No companion barcode scanner`)),abort:()=>{}};let r=!1,i,a=new Promise(e=>{i=e}),o=n.receiveMessage,s=e=>{if(!r){r=!0;try{n.fireMessage({type:`bar_code/close`})}catch{}finally{n.receiveMessage=o}i(e)}};return n.receiveMessage=e=>{let r=e;if(r?.type===`command`&&r.command===`bar_code/scan_result`){r.id!=null&&n.fireMessage({id:r.id,type:`result`,success:!0,result:null});let e=String(r.payload?.rawValue??``).trim(),i=String(r.payload?.format??`unknown`);if(e&&Rn(i,e)){s(e);return}n.fireMessage({type:`bar_code/notify`,payload:{message:t?.rejectMessage??`Not a product barcode — try an EAN/UPC code`}})}else r?.type===`command`&&r.command===`bar_code/aborted`?(r.id!=null&&n.fireMessage({id:r.id,type:`result`,success:!0,result:null}),s(null)):o.call(n,e)},n.fireMessage({type:`bar_code/scan`,payload:{title:t?.title??`Scan barcode`,description:t?.description??`Point the camera at a product barcode`,alternative_option_label:t?.alternativeOptionLabel??`Enter manually`}}),{done:a,abort:()=>s(null)}}function Vn(e,t,n=`Food`){let r={...e},i=[t.brand,t.name].filter(Boolean).join(` `).trim();if(!(r.name||``).trim()&&i&&(r.name=i),(r.category||``).trim()||(r.category=n),!(r.contents_per_unit||``).trim()&&t.contents_per_unit!=null&&(r.contents_per_unit=String(t.contents_per_unit)),(r.contents_unit||``).trim()||(r.contents_unit=t.contents_unit?.trim()||`gram`),!(r.calories_per_content||``).trim()){let e=Ln(r.contents_unit,t);e!=null&&(r.calories_per_content=String(e))}return r}function Z(e){if(e==null)return`Unknown error`;if(typeof e==`string`)return e;if(e instanceof Error)return e.message||String(e);if(typeof e==`object`){let t=e;if(typeof t.message==`string`&&t.message.trim())return t.message;if(typeof t.error==`string`&&t.error.trim())return t.error;if(t.error&&typeof t.error==`object`){let e=t.error;if(typeof e.message==`string`&&e.message.trim())return e.message}try{return JSON.stringify(e)}catch{return`Unknown error`}}return String(e)}function Hn(e){if(typeof e==`object`&&e){let t=e;if(t.code===`not_found`)return!0;let n=typeof t.message==`string`?t.message.toLowerCase():``;if(n.includes(`product not found`)||n.includes(`not found`))return!0}return!!(typeof e==`string`&&/not found/i.test(e))}var Un=`No product found for this barcode.`;function Wn(e,t){let n=e.trim().toLowerCase();return!n||!t?`none`:(t.water_categories??[]).some(e=>e.trim().toLowerCase()===n)?`water`:(t.food_categories??[]).some(e=>e.trim().toLowerCase()===n)?`food`:(t.pet_food_categories??[]).some(e=>e.trim().toLowerCase()===n)?`pet_food`:`none`}function Gn(e){return e===`food`||e===`none`}function Kn(e){let t=e.trim().replace(`,`,`.`);return t?Number(t):NaN}function qn(e){let t=Number(e);return Number.isNaN(t)?`—`:Math.abs(t-Math.round(t))<.05?String(Math.round(t)):String(Math.round(t*100)/100)}function Jn(e,t){return t===`liter`?e:t===`milliliter`?e/1e3:null}function Yn(e){if(e.contents_per_unit!=null&&e.contents_unit){let t=Jn(e.contents_per_unit,e.contents_unit);if(t!=null)return e.quantity*t}return e.unit===`liter`?e.quantity:e.unit===`milliliter`?e.quantity/1e3:e.liters_per_unit==null?null:e.quantity*e.liters_per_unit}function Xn(e,t){return t===`gram`?e:t===`kilogram`?e*1e3:null}function Zn(e){if(e.contents_per_unit!=null&&e.contents_unit){let t=Xn(e.contents_per_unit,e.contents_unit);if(t!=null)return e.quantity*t}return e.unit===`gram`?e.quantity:e.unit===`kilogram`?e.quantity*1e3:null}function Qn(e){return e.contents_per_unit!=null&&e.calories_per_content!=null?e.quantity*e.contents_per_unit*e.calories_per_content:e.calories_per_unit==null?null:e.quantity*e.calories_per_unit}function $n(e,t){if(t===`food`){let t=Qn(e);return t==null?``:`${qn(t)} kcal`}if(t===`water`){let t=Yn(e);return t==null?``:`${qn(t)} L`}if(t===`pet_food`){let t=Zn(e);return t==null?``:`${qn(t)} g`}let n=[],r=Qn(e);r!=null&&n.push(`${qn(r)} kcal`);let i=Yn(e);return i!=null&&n.push(`${qn(i)} L`),n.join(` · `)}function er(e,t){let n={},r=t.contents_per_unit.trim(),i=t.contents_unit.trim(),a=t.calories_per_content.trim(),o=Kn(r),s=Kn(a);if(e===`food`||e===`water`||e===`pet_food`)(r===``||Number.isNaN(o)||o<=0)&&(n.contents_per_unit=`Contents per unit is required`),i?e===`water`&&i!==`liter`&&i!==`milliliter`?n.contents_unit=`Water contents must be liter or milliliter`:e===`pet_food`&&i!==`gram`&&i!==`kilogram`&&(n.contents_unit=`Pet food contents must be gram or kilogram`):n.contents_unit=`Contents unit is required`;else{let e=r!==``,t=!!i;(e||t)&&((!e||Number.isNaN(o)||o<=0)&&(n.contents_per_unit=`Enter contents per unit or clear both fields`),t||(n.contents_unit=`Select a contents unit or clear both fields`))}return e===`food`?(a===``||Number.isNaN(s)||s<0)&&(n.calories_per_content=`Calories per contents unit is required`):e===`none`&&a!==``&&(Number.isNaN(s)||s<0)&&(n.calories_per_content=`Enter a valid calorie value`),n}function tr(e,t){let n={},r=t.contents_per_unit.trim(),i=t.contents_unit.trim(),a=t.calories_per_content.trim();return e===`water`||e===`pet_food`?(n.contents_per_unit=Kn(r),n.contents_unit=i,n.calories_per_content=null,n.calories_per_unit=null,n):e===`food`?(n.contents_per_unit=Kn(r),n.contents_unit=i,n.calories_per_content=Kn(a),n):(r&&i?(n.contents_per_unit=Kn(r),n.contents_unit=i):(n.contents_per_unit=null,n.contents_unit=null,n.liters_per_unit=null),a?n.calories_per_content=Kn(a):(n.calories_per_content=null,n.calories_per_unit=null),n)}function nr(e,t){return t?t.expired.some(t=>t.id===e.id)?`expired`:t.within_urgent.some(t=>t.id===e.id)?`urgent`:t.within_expiring.some(t=>t.id===e.id)?`expiring`:t.low_stock.some(t=>t.id===e.id)?`low`:``:``}function rr(e,t,n,r){let i=[...e],a=r.search.trim().toLowerCase();if(a&&(i=i.filter(e=>e.name.toLowerCase().includes(a)||e.location.toLowerCase().includes(a)||e.category.toLowerCase().includes(a)||(e.barcode||``).toLowerCase().includes(a)||(e.notes||``).toLowerCase().includes(a))),r.filterLocation&&(i=i.filter(e=>e.location.toLowerCase()===r.filterLocation.toLowerCase())),r.filterCategory&&(i=i.filter(e=>e.category.toLowerCase()===r.filterCategory.toLowerCase())),r.filterReadiness&&(i=i.filter(e=>Wn(e.category,n)===r.filterReadiness)),r.filterStatus!==`all`){let e=new Set;r.filterStatus===`expired`?t?.expired.forEach(t=>e.add(t.id)):r.filterStatus===`expiring`?(t?.within_urgent.forEach(t=>e.add(t.id)),t?.within_expiring.forEach(t=>e.add(t.id))):r.filterStatus===`low_stock`&&t?.low_stock.forEach(t=>e.add(t.id)),i=i.filter(t=>e.has(t.id))}return i.sort((e,t)=>r.sort===`quantity`?e.quantity-t.quantity:r.sort===`expiry`?(e.expiry_date||`9999`).localeCompare(t.expiry_date||`9999`):e.name.localeCompare(t.name)),i}function ir(e,t=``){let n=new Set,r=[];for(let i of[...e,t]){let e=i?.trim();if(!e)continue;let t=e.toLowerCase();n.has(t)||(n.add(t),r.push(e))}return r.sort((e,t)=>e.localeCompare(t,void 0,{sensitivity:`base`})),r}function ar(e){if(!e.canWrite)return{buttons:[],menu:[]};let t=[`scan`,`add_from_template`];return e.hasRestockList&&t.push(`push_restock`),e.narrow?{buttons:[`add_item`],menu:t}:{buttons:[...t,`add_item`],menu:[]}}function or(e){return{id:e.id,name:e.name,type:e.type??``,foodPerDay:e.food_grams_per_day,waterPerDay:e.water_liters_per_day}}function sr(e){return{key:e.key,count:e.count,caloriesPerPerson:e.calories_per_day,waterPerPerson:e.water_liters_per_day,caloriesSubtotal:e.count*e.calories_per_day,waterSubtotal:e.count*e.water_liters_per_day}}function cr(e){if(!e)return null;let t=(e.age_categories&&e.age_categories.length>0?e.age_categories:e.number_of_people==null?[]:[{key:`adults`,count:e.number_of_people,calories_per_day:e.calories_per_person_per_day,water_liters_per_day:e.water_liters_per_person_per_day}]).map(sr);if(t.reduce((e,t)=>e+t.count,0)<=0)return null;let n=(e.pets??[]).map(or),r=n.reduce((e,t)=>e+t.waterPerDay,0);return{rows:t,pets:n,dailyCalories:t.reduce((e,t)=>e+t.caloriesSubtotal,0),dailyWater:t.reduce((e,t)=>e+t.waterSubtotal,0)+r,dailyPetWater:r,dailyPetFood:n.reduce((e,t)=>e+t.foodPerDay,0),days:e.duration_hours/24}}function lr(e){return{rows:e.rows.map(e=>({key:e.key,count:e.count,caloriesPerPerson:e.caloriesPerPerson,caloriesSubtotal:e.caloriesSubtotal})),dailyTotal:e.dailyCalories,periodTotal:e.dailyCalories*e.days,days:e.days}}function ur(e){return{rows:e.pets.map(e=>({id:e.id,name:e.name,type:e.type,foodPerDay:e.foodPerDay})),dailyTotal:e.dailyPetFood,periodTotal:e.dailyPetFood*e.days,days:e.days}}var dr={en:{"status.expired":`Expired`,"status.urgent":`Urgent`,"status.expiring":`Expiring`,"status.low":`Low stock`,"action.open_menu":`Open menu`,"action.more":`More actions`,"action.inventory":`Inventory`,"action.scan":`Scan`,"action.add_item":`Add item`,"action.add_from_template":`Add from template`,"action.push_restock":`Push restock list`,"action.close":`Close`,"action.save":`Save`,"action.cancel":`Cancel`,"action.delete":`Delete`,"action.lookup":`Lookup`,"action.edit":`Edit`,"stat.readiness":`Readiness`,"stat.water":`Water`,"stat.food":`Food`,"stat.pet_food":`Pet food`,"stat.completeness":`Completeness`,"completeness.title":`Completeness`,"readiness.title":`Readiness`,"readiness.open":`Explain readiness`,"readiness.explain":`Readiness shows how long your household could manage on the water, food and pet food you have in stock, compared with the target for your chosen number of days. The overall figure is the lowest of those percentages. It does not look at checklist items such as first aid or tools: Completeness covers those.`,"readiness.example":`Example: with 100% water and food but no first aid kit, readiness is 100% while completeness is lower.`,"completeness.explain":`Completeness shows how many of your checklist items are in stock at their desired quantity and not expired. Checklist items are the items with a desired quantity in categories other than food, water and pet food. It does not show how long your supplies would last: Readiness covers water, food and pet food.`,"completeness.example":`Example: 4 of 5 first aid items in stock gives 80% for that category.`,"completeness.open":`Show what is missing from completeness`,"completeness.overall":`Overall`,"completeness.all_complete":`Everything is complete.`,"completeness.category_complete":`Complete`,"completeness.expired":`expired`,"completeness.stock":`{quantity} of {desired}`,"household.food_title":`Food needs`,"household.pet_food_title":`Pet food needs`,"household.open_food":`Show food needs of the household`,"household.open_pet_food":`Show pet food needs`,"household.pet":`Pet`,"household.food_per_day":`Food per day`,"household.not_configured":`No household is set up yet.`,"household.category":`Category`,"household.count":`People`,"household.per_person":`Per person per day`,"household.subtotal":`Subtotal per day`,"household.total_per_day":`Total per day`,"household.total_period":`Total for {days} days`,"household.adults":`Adults (18–69)`,"household.children":`Children (4–17)`,"household.babies_toddlers":`Babies and toddlers (0–3)`,"household.seniors":`Seniors (70+)`,"household.pets":`Pets`,"household.pet_food_period":`Pet food for {days} days`,"stat.hours_suffix":`h`,"filter.search_placeholder":`Search inventory`,"filter.all_status":`All statuses`,"filter.all_location":`All locations`,"filter.all_category":`All categories`,"filter.all_readiness":`All readiness`,"filter.readiness_food":`Food`,"filter.readiness_water":`Water`,"filter.readiness_pet_food":`Pet food`,"filter.readiness_none":`Other`,"filter.sort":`Sort`,"filter.status_label":`Status`,"filter.readiness_label":`Readiness`,"empty.inventory":`No items yet. Add your first supply.`,"empty.filtered":`No items match these filters.`,"dialog.add_title":`Add item`,"dialog.edit_title":`Edit item`,"dialog.template_title":`Add from template`,"field.name":`Name`,"field.quantity":`Quantity`,"field.desired":`Desired`,"field.unit":`Unit`,"field.location":`Location`,"field.category":`Category`,"field.priority":`Priority`,"field.expiry":`Expiry`,"field.notes":`Notes`,"field.barcode":`Barcode`,"field.contents":`Contents per unit`,"field.contents_unit":`Contents unit`,"field.calories":`Calories per contents unit`,"priority.essential":`Essential`,"priority.important":`Important`,"priority.optional":`Optional`,"hint.measure_readiness":`These fields count toward readiness.`,"companion.scan_needed":`Scanning needs the Home Assistant Companion app. Enter the barcode and tap Lookup.`,"template.skip_existing":`Existing names are skipped.`,"template.items":`items`,"template.to_add":`{n} to add`,"template.none_missing":`Nothing missing: all items are already in your inventory.`,"template.select_all":`Select all`,"template.add_selected":`Add missing items ({n})`,"template.added_result":`Added {added}, skipped {skipped}.`,"confirm.remove_title":`Remove item`,"confirm.remove_message":`Remove “{name}”?`,"action.remove":`Remove`,"toast.saved":`Saved “{name}”`,"toast.removed":`Removed “{name}”`,"toast.restock_pushed":`Restock list sent`,"error.generic":`Something went wrong`},nl:{"status.expired":`Verlopen`,"status.urgent":`Urgent`,"status.expiring":`Bijna verlopen`,"status.low":`Lage voorraad`,"action.open_menu":`Menu openen`,"action.more":`Meer acties`,"action.inventory":`Voorraad`,"action.scan":`Scannen`,"action.add_item":`Item toevoegen`,"action.add_from_template":`Uit sjabloon`,"action.push_restock":`Aanvullijst sturen`,"action.close":`Sluiten`,"action.save":`Opslaan`,"action.cancel":`Annuleren`,"action.delete":`Verwijderen`,"action.lookup":`Opzoeken`,"action.edit":`Bewerken`,"stat.readiness":`Paraatheid`,"stat.water":`Water`,"stat.food":`Voedsel`,"stat.pet_food":`Huisdiervoer`,"stat.completeness":`Compleetheid`,"completeness.title":`Compleetheid`,"readiness.title":`Paraatheid`,"readiness.open":`Uitleg over paraatheid`,"readiness.explain":`Paraatheid laat zien hoe lang je huishouden toekan met de voorraad water, voedsel en huisdiervoer, vergeleken met het doel voor het gekozen aantal dagen. Het totaal is het laagste van die percentages. Checklist-items zoals EHBO of gereedschap tellen hier niet mee: die zie je bij Compleetheid.`,"readiness.example":`Voorbeeld: met 100% water en voedsel maar zonder EHBO-set is de paraatheid 100% en de compleetheid lager.`,"completeness.explain":`Compleetheid laat zien hoeveel van je checklist-items op voorraad zijn in de gewenste hoeveelheid en niet verlopen zijn. Checklist-items zijn items met een gewenste hoeveelheid in andere categorieën dan voedsel, water en huisdiervoer. Het zegt niets over hoe lang je voorraad meegaat: dat zie je bij Paraatheid.`,"completeness.example":`Voorbeeld: 4 van de 5 EHBO-items op voorraad geeft 80% voor die categorie.`,"completeness.open":`Toon wat er ontbreekt voor compleetheid`,"completeness.overall":`Totaal`,"completeness.all_complete":`Alles is compleet.`,"completeness.category_complete":`Compleet`,"completeness.expired":`verlopen`,"completeness.stock":`{quantity} van {desired}`,"household.food_title":`Voedselbehoefte`,"household.pet_food_title":`Huisdiervoerbehoefte`,"household.open_food":`Toon de voedselbehoefte van het huishouden`,"household.open_pet_food":`Toon de huisdiervoerbehoefte`,"household.pet":`Huisdier`,"household.food_per_day":`Voer per dag`,"household.not_configured":`Er is nog geen huishouden ingesteld.`,"household.category":`Categorie`,"household.count":`Personen`,"household.per_person":`Per persoon per dag`,"household.subtotal":`Subtotaal per dag`,"household.total_per_day":`Totaal per dag`,"household.total_period":`Totaal voor {days} dagen`,"household.adults":`Volwassenen (18–69)`,"household.children":`Kinderen (4–17)`,"household.babies_toddlers":`Baby’s en peuters (0–3)`,"household.seniors":`Ouderen (70+)`,"household.pets":`Huisdieren`,"household.pet_food_period":`Huisdiervoer voor {days} dagen`,"stat.hours_suffix":`u`,"filter.search_placeholder":`Zoek in voorraad`,"filter.all_status":`Alle statussen`,"filter.all_location":`Alle locaties`,"filter.all_category":`Alle categorieën`,"filter.all_readiness":`Alle paraatheid`,"filter.readiness_food":`Voedsel`,"filter.readiness_water":`Water`,"filter.readiness_pet_food":`Huisdiervoer`,"filter.readiness_none":`Overig`,"filter.sort":`Sorteren`,"filter.status_label":`Status`,"filter.readiness_label":`Paraatheid`,"empty.inventory":`Nog geen items. Voeg je eerste voorraad toe.`,"empty.filtered":`Geen items matchen deze filters.`,"dialog.add_title":`Item toevoegen`,"dialog.edit_title":`Item bewerken`,"dialog.template_title":`Uit sjabloon toevoegen`,"field.name":`Naam`,"field.quantity":`Hoeveelheid`,"field.desired":`Gewenst`,"field.unit":`Eenheid`,"field.location":`Locatie`,"field.category":`Categorie`,"field.priority":`Prioriteit`,"field.expiry":`Houdbaarheidsdatum`,"field.notes":`Notities`,"field.barcode":`Barcode`,"field.contents":`Inhoud per eenheid`,"field.contents_unit":`Inhoudseenheid`,"field.calories":`Calorieën per inhoudseenheid`,"priority.essential":`Essentieel`,"priority.important":`Belangrijk`,"priority.optional":`Optioneel`,"hint.measure_readiness":`Deze velden tellen mee voor paraatheid.`,"companion.scan_needed":`Scannen vereist de Home Assistant Companion-app. Voer de barcode in en tik op Opzoeken.`,"template.skip_existing":`Bestaande namen worden overgeslagen.`,"template.items":`items`,"template.to_add":`{n} toe te voegen`,"template.none_missing":`Niets ontbreekt: alle items staan al in je inventaris.`,"template.select_all":`Alles selecteren`,"template.add_selected":`Ontbrekende items toevoegen ({n})`,"template.added_result":`{added} toegevoegd, {skipped} overgeslagen.`,"confirm.remove_title":`Item verwijderen`,"confirm.remove_message":`“{name}” verwijderen?`,"action.remove":`Verwijderen`,"toast.saved":`“{name}” opgeslagen`,"toast.removed":`“{name}” verwijderd`,"toast.restock_pushed":`Bijbestellijst verstuurd`,"error.generic":`Er ging iets mis`}};function fr(e){let t=e?.locale?.language||e?.language||`en`;return String(t).toLowerCase().split(`-`)[0]===`nl`?`nl`:`en`}function pr(e,t,n){let r=dr[fr(e)][t]??dr.en[t]??t;if(n)for(let[e,t]of Object.entries(n))r=r.replaceAll(`{${e}}`,String(t));return r}function mr(e,t){let n=`status.${t}`,r=pr(e,n);return r===n?t:r}var hr={string:e=>typeof e==`string`?e:void 0,boolean:e=>typeof e==`boolean`?e:void 0,number:e=>typeof e==`number`&&Number.isFinite(e)?e:void 0,oneOf:e=>t=>typeof t==`string`&&e.includes(t)?t:void 0,stringArray:e=>Array.isArray(e)&&e.every(e=>typeof e==`string`)?e:void 0};function gr(e,t){try{let n=JSON.parse(e.getItem(t)??`{}`);return n&&typeof n==`object`&&!Array.isArray(n)?n:{}}catch{return{}}}function _r(e){let t=e.storage??globalThis.localStorage,{storageKey:n,defaults:r,schema:i}=e,a=e=>{try{Object.keys(e).length?t.setItem(n,JSON.stringify(e)):t.removeItem(n)}catch{}};return{load(e){let a=gr(t,n)[e],o=a&&typeof a==`object`?a:{},s={...r};for(let e of Object.keys(i)){let t=i[e](o[e]);t!==void 0&&(s[e]=t)}return s},save(e,r){let o=gr(t,n),s={};for(let e of Object.keys(i))s[e]=r[e];o[e]=s,a(o)},clear(e){let r=gr(t,n);delete r[e],a(r)}}}var vr=[`name`,`expiry`,`quantity`],yr=_r({storageKey:`ready_home.panel.view`,defaults:{search:``,filterStatus:`all`,filterLocation:``,filterCategory:``,filterReadiness:``,sort:`name`},schema:{search:hr.string,filterStatus:hr.string,filterLocation:hr.string,filterCategory:hr.string,filterReadiness:hr.string,sort:hr.oneOf(vr)}});function br(e,t){return e==null||Number.isNaN(Number(e))?``:Number(e)<=0?`bad`:Number(e)<Number(t)?`warn`:`ok`}function Q(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}var xr=`ready-home-panel`,Sr=`/api/ready_home/brand`,Cr=`${Sr}/logo.png`,wr=`${Sr}/logo@2x.png`,Tr=`${Sr}/dark_logo.png`,Er=`${Sr}/dark_logo@2x.png`,Dr=`M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z`,Or=`M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z`,kr=`M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1Z`,Ar=`M12,20A6,6 0 0,1 6,14C6,10 12,3.25 12,3.25C12,3.25 18,10 18,14A6,6 0 0,1 12,20Z`,jr=`M18.06 23H19.72C20.56 23 21.25 22.35 21.35 21.53L23 5.05H18V1H16.03V5.05H11.06L11.36 7.39C13.07 7.86 14.67 8.71 15.63 9.65C17.07 11.07 18.06 12.54 18.06 14.94V23M1 22V21H16.03V22C16.03 22.54 15.58 23 15 23H2C1.45 23 1 22.54 1 22M16.03 15C16.03 7 1 7 1 15H16.03M1 17H16V19H1V17Z`,Mr=`M8.35,3C9.53,2.83 10.78,4.12 11.14,5.9C11.5,7.67 10.85,9.25 9.67,9.43C8.5,9.61 7.24,8.32 6.88,6.54C6.5,4.77 7.17,3.19 8.35,3M15.5,3C16.69,3.19 17.35,4.77 17,6.54C16.62,8.32 15.37,9.61 14.19,9.43C13,9.25 12.35,7.67 12.71,5.9C13.08,4.12 14.33,2.83 15.5,3M3,7.6C4.14,7.11 5.69,8 6.5,9.55C7.26,11.13 7,12.79 5.87,13.28C4.74,13.77 3.2,12.89 2.41,11.32C1.62,9.75 1.9,8.08 3,7.6M21,7.6C22.1,8.08 22.38,9.75 21.59,11.32C20.8,12.89 19.26,13.77 18.13,13.28C17,12.79 16.74,11.13 17.5,9.55C18.31,8 19.86,7.11 21,7.6M19.33,18.38C19.37,19.32 18.65,20.36 17.79,20.75C16,21.57 13.88,19.87 11.89,19.87C9.9,19.87 7.76,21.64 6,20.75C5,20.26 4.31,18.96 4.44,17.88C4.62,16.39 6.41,15.59 7.47,14.5C8.88,13.09 9.88,10.44 11.89,10.44C13.89,10.44 14.95,13.05 16.3,14.5C17.41,15.72 19.26,16.75 19.33,18.38Z`,Nr=`M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3Z`,Pr=[`box`,`pack`,`piece`],Fr=[`gram`,`kilogram`,`liter`,`milliliter`],Ir=[`essential`,`important`,`optional`];function Lr(e){return e&&e.charAt(0).toUpperCase()+e.slice(1)}var Rr=6e3,zr=!1;function Br(){zr||(zr=!0,et(document))}var $=class extends C{constructor(...e){super(...e),this.narrow=!1,this._snapshot=null,this._settings=null,this._search=``,this._filterStatus=`all`,this._filterLocation=``,this._filterCategory=``,this._filterReadiness=``,this._sort=`name`,this._dialogOpen=!1,this._editing=null,this._form={},this._error=``,this._barcodeError=``,this._fieldErrors={},this._saving=!1,this._scanning=!1,this._pendingRemoveIds=[],this._completenessOpen=!1,this._moreOpen=!1,this._readinessOpen=!1,this._householdModal=null,this._templateOpen=!1,this._templates=[],this._templateBusy=!1,this._templateUnchecked={},this._templateNotice=``,this._templateNoticeTimer=null,this._unsub=null,this._connected=!1,this._scanHandle=null,this._viewHydrated=!1,this._onFilterChange=e=>{let{search:t,filters:n}=e.detail.value,r=e=>{let t=n[e];return(Array.isArray(t)?t[0]:t)??``};this._search=t,this._filterStatus=r(`status`)||`all`,this._filterLocation=r(`location`),this._filterCategory=r(`category`),this._filterReadiness=r(`readiness`),this._persistViewState()},this._toggleMenu=e=>{e?.stopPropagation(),this.dispatchEvent(new CustomEvent(`hass-toggle-menu`,{bubbles:!0,composed:!0}))},this._toggleMore=()=>{this._moreOpen?this._closeMore():(this._moreOpen=!0,document.addEventListener(`click`,this._onDocumentClick),this.updateComplete.then(()=>this._moreItems()[0]?.focus()))},this._onDocumentClick=e=>{let t=this.shadowRoot?.querySelector(`.more`);t&&e.composedPath().includes(t)||this._closeMore({refocus:!1})},this._onMoreKeyDown=e=>{if(e.key!==`ArrowDown`&&e.key!==`ArrowUp`)return;let t=this._moreItems();t.length&&(e.preventDefault(),t[(t.indexOf(this.shadowRoot?.activeElement)+(e.key===`ArrowDown`?1:-1)+t.length)%t.length].focus())},this._closeHousehold=()=>{let e=this._householdModal;e&&(this._householdModal=null,this.updateComplete.then(()=>this.shadowRoot?.querySelector(`[data-stat="${e}"]`)?.focus()))},this._openTemplates=async()=>{if(this.hass){this._templateBusy=!0,this._error=``;try{this._templates=await Fn(this.hass),this._templateUnchecked={},this._setTemplateNotice(``),this._templateOpen=!0}catch(e){this._error=Z(e)}finally{this._templateBusy=!1}}},this._openReadiness=()=>{this._readinessOpen=!0},this._closeReadiness=()=>{this._readinessOpen=!1,this.updateComplete.then(()=>this.shadowRoot?.querySelector(`[data-stat="readiness"]`)?.focus())},this._openCompleteness=()=>{this._completenessOpen=!0},this._closeCompleteness=()=>{this._completenessOpen=!1,this.updateComplete.then(()=>this.shadowRoot?.querySelector(`[data-stat="completeness"]`)?.focus())},this._closeTemplates=()=>{this._templateOpen=!1,this._templateUnchecked={}},this._openAdd=()=>{this._canWrite()&&(this._editing=null,this._form=this._blankForm(),this._fieldErrors={},this._error=``,this._barcodeError=``,this._dialogOpen=!0)},this._openEdit=e=>{this._editing=e;let t=Pr.includes(e.unit)?e.unit:`piece`,n=e.contents_per_unit,r=e.contents_unit||``,i=e.calories_per_content;n==null&&e.liters_per_unit!=null&&(n=e.liters_per_unit,r=`liter`),i==null&&e.calories_per_unit!=null&&n==null&&(n=1,r||=`gram`,i=e.calories_per_unit),this._form={name:e.name,quantity:String(e.quantity),desired_quantity:String(e.desired_quantity),unit:t,location:e.location,category:e.category,priority:e.priority,notes:e.notes||``,barcode:e.barcode||``,expiry_date:e.expiry_date||``,contents_per_unit:n==null?``:String(n),contents_unit:r,calories_per_content:i==null?``:String(i)},this._fieldErrors={},this._error=``,this._barcodeError=``,this._dialogOpen=!0},this._closeDialog=()=>{this._abortScan(),this._dialogOpen=!1,this._fieldErrors={},this._error=``,this._barcodeError=``},this._onWindowKeyDown=e=>{e.key===`Escape`&&this._moreOpen&&(e.preventDefault(),this._closeMore())}}connectedCallback(){super.connectedCallback(),this._connected=!0,Br(),this._restoreViewState(),window.addEventListener(`keydown`,this._onWindowKeyDown),this._connect()}disconnectedCallback(){super.disconnectedCallback(),this._connected=!1,window.removeEventListener(`keydown`,this._onWindowKeyDown),document.removeEventListener(`click`,this._onDocumentClick),this._abortScan(),this._setTemplateNotice(``),this._unsub?.(),this._unsub=null}willUpdate(e){e.has(`hass`)&&this.hass&&(Dn(this,this.hass.themes),ht({language:this.hass.language}))}updated(e){e.has(`hass`)&&this.hass&&!this._unsub&&this._connected&&this._connect()}async _connect(){if(this.hass&&!this._unsub)try{this._settings=await Mn(this.hass),this._unsub=await Nn(this.hass,e=>{this._applySnapshot(e)}),this._error=``}catch(e){this._error=Z(e)}}_entryId(){let e=this.panel?.config?.config_entry_id;return typeof e==`string`&&e?e:null}_canWrite(){return this.hass?.user?.is_admin===!0}_viewKey(){return this._entryId()??`default`}_restoreViewState(){let e=yr.load(this._viewKey());this._search=e.search,this._filterStatus=e.filterStatus,this._filterLocation=e.filterLocation,this._filterCategory=e.filterCategory,this._filterReadiness=e.filterReadiness,this._sort=e.sort,this._viewHydrated=!0}_persistViewState(){this._viewHydrated&&yr.save(this._viewKey(),{search:this._search,filterStatus:this._filterStatus,filterLocation:this._filterLocation,filterCategory:this._filterCategory,filterReadiness:this._filterReadiness,sort:this._sort})}_applySnapshot(e){if(this._snapshot=e,e.settings&&(this._settings=e.settings),!this._pendingRemoveIds.length)return;let t=new Set(e.items.map(e=>e.id)),n=this._pendingRemoveIds.filter(e=>t.has(e));n.length!==this._pendingRemoveIds.length&&(this._pendingRemoveIds=n)}_isRemovePending(e){return this._pendingRemoveIds.includes(e)}get _assessment(){return this._snapshot?.assessment??{}}get _bucketCounts(){let e=this._snapshot?.buckets;return{expired:e?.expired.length??0,expiring:(e?.within_urgent.length??0)+(e?.within_expiring.length??0),low_stock:e?.low_stock.length??0}}_readinessKind(e){return Wn(e,this._settings)}get _items(){return rr(this._snapshot?.items??[],this._snapshot?.buckets,this._settings,{search:this._search,filterStatus:this._filterStatus,filterLocation:this._filterLocation,filterCategory:this._filterCategory,filterReadiness:this._filterReadiness,sort:this._sort})}_itemStatus(e){return nr(e,this._snapshot?.buckets)}_t(e,t){return pr(this.hass,e,t)}_statusLabel(e){return mr(this.hass,e)}_filterDefs(){let e=this._bucketCounts,t=ir(this._settings?.locations??[]),n=ir(this._settings?.categories??[]),r=e=>e.map(e=>({value:e,label:e}));return[{key:`status`,label:this._t(`filter.status_label`),options:[{value:`expired`,label:this._t(`status.expired`),count:e.expired},{value:`expiring`,label:this._t(`status.expiring`),count:e.expiring},{value:`low_stock`,label:this._t(`status.low`),count:e.low_stock}]},{key:`location`,label:this._t(`field.location`),type:`select`,options:r(t)},{key:`category`,label:this._t(`field.category`),type:`select`,options:r(n)},{key:`readiness`,label:this._t(`filter.readiness_label`),options:[{value:`water`,label:this._t(`filter.readiness_water`)},{value:`food`,label:this._t(`filter.readiness_food`)},{value:`pet_food`,label:this._t(`filter.readiness_pet_food`)},{value:`none`,label:this._t(`filter.readiness_none`)}]}]}get _filterValue(){let e={};return this._filterStatus&&this._filterStatus!==`all`&&(e.status=this._filterStatus),this._filterLocation&&(e.location=this._filterLocation),this._filterCategory&&(e.category=this._filterCategory),this._filterReadiness&&(e.readiness=this._filterReadiness),{search:this._search,filters:e}}_pct(e){return e==null||Number.isNaN(Number(e))?`—`:`${Math.round(Number(e))}%`}_completenessPercent(){let e=this._snapshot?.completeness?.overall_percent;return e==null||Number.isNaN(Number(e))?null:Number(e)}_formatHours(e){if(e==null||Number.isNaN(Number(e)))return`—`;let t=Math.max(0,Math.round(Number(e)));return t<48?`${t}h`:`${Math.round(t/24)}d`}_formatAmount(e,t){if(e==null||Number.isNaN(Number(e)))return`—`;let n=Number(e);return`${Math.abs(n-Math.round(n))<.05?Math.round(n):Math.round(n*10)/10} ${t}`}_durationHours(){return this._assessment.duration_hours??this._settings?.duration_hours??72}_cardTone(e){let t=br(e,this._durationHours());return t===`ok`?`success`:t===`warn`?`warning`:t===`bad`?`danger`:`gray`}_detailTone(e){let t=br(e,this._durationHours());return t===`bad`?`danger`:t===`warn`?`warning`:void 0}_formatDate(e){if(!e)return`—`;let t=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e.trim());if(!t)return e;let n=new Date(Number(t[1]),Number(t[2])-1,Number(t[3]));if(Number.isNaN(n.getTime()))return e;let r=this.hass?.locale,i=r?.language||this.hass?.language||navigator.language||`en`,a=r?.date_format??`language`,o=a===`system`?void 0:i,s=new Intl.DateTimeFormat(o,{year:`numeric`,month:`numeric`,day:`numeric`});if(a===`language`||a===`system`)return s.format(n);let c=s.formatToParts(n),l=c.find(e=>e.type===`literal`)?.value??`/`,u=c.find(e=>e.type===`day`)?.value??``,d=c.find(e=>e.type===`month`)?.value??``,f=c.find(e=>e.type===`year`)?.value??``,p=c[c.length-1],m=p?.type===`literal`?p.value:``;return a===`DMY`?`${u}${l}${d}${l}${f}${m}`:a===`MDY`?`${d}${l}${u}${l}${f}${m}`:`${f}${l}${d}${l}${u}${m}`}_optionList(e,t){return ir(e,t)}_runHeaderAction(e){switch(e){case`scan`:this._scanFromPanel();break;case`add_from_template`:this._openTemplates();break;case`push_restock`:this._pushRestock();break;case`add_item`:this._openAdd()}}_headerActionLabel(e){return this._t(`action.${e}`)}_renderHeaderActions(){let{buttons:e,menu:t}=ar({canWrite:this._canWrite(),narrow:this.narrow,hasRestockList:!!this._settings?.todo_entity_id});return v`
      ${e.map(e=>this._mdButton(this._headerActionLabel(e),{variant:e===`add_item`?`filled`:`outlined`,disabled:e===`scan`&&this._scanning,onClick:()=>this._runHeaderAction(e)}))}
      ${t.length?this._renderMoreMenu(t):b}
    `}_renderMoreMenu(e){return v`
      <div class="more">
        <hpu-icon-button class="more-btn"
          path=${Or}
          label=${this._t(`action.more`)}
          haspopup="menu"
          expanded=${this._moreOpen?`true`:`false`}
          @hpu-click=${this._toggleMore}
        ></hpu-icon-button>
        ${this._moreOpen?v`
              <div
                class="more-menu"
                role="menu"
                @keydown=${this._onMoreKeyDown}
              >
                ${e.map(e=>v`
                    <button
                      type="button"
                      class="more-item"
                      role="menuitem"
                      ?disabled=${e===`scan`&&this._scanning}
                      @click=${()=>{this._closeMore(),this._runHeaderAction(e)}}
                    >
                      ${this._headerActionLabel(e)}
                    </button>
                  `)}
              </div>
            `:b}
      </div>
    `}_closeMore(e={refocus:!0}){this._moreOpen&&(this._moreOpen=!1,document.removeEventListener(`click`,this._onDocumentClick),e.refocus!==!1&&this.updateComplete.then(()=>this.shadowRoot?.querySelector(`.more-btn`)?.focus()))}_moreItems(){return Array.from(this.shadowRoot?.querySelectorAll(`.more-menu [role="menuitem"]:not([disabled])`)??[])}_mdButton(e,t){let n=t.variant??`outlined`,r=n===`danger-text`;return v`
      <hpu-button
        variant=${r?`text`:n}
        tone=${r?`danger`:`primary`}
        ?disabled=${t.disabled??!1}
        @hpu-click=${t.onClick}
        >${e}</hpu-button
      >
    `}render(){let e=this._items,t=this._assessment,n=t.overall_percent,r=t.water_percent,i=t.food_percent,a=this._completenessPercent(),o=t.supply_hours,s=t.water_supply_hours,c=t.food_supply_hours,l=t.pet_food_target,u=l!=null&&l>0,d=t.pet_food_supply_hours,f=this.hass?.themes?.darkMode===!0,p=f?Tr:Cr,m=f?`${Tr} 1x, ${Er} 2x`:`${Cr} 1x, ${wr} 2x`;return v`
      <div class="page">
        <header class="header">
          <div class="header-row">
            <div class="brand">
              ${this.narrow?v`
                    <hpu-icon-button
          path=${Dr}
          label=${this._t(`action.open_menu`)}
          @hpu-click=${this._toggleMenu}
        ></hpu-icon-button>
                  `:b}
              <h1 class="brand-heading">
                <img
                  class="brand-logo"
                  src=${p}
                  srcset=${m}
                  alt="Ready Home"
                  height="40"
                />
              </h1>
            </div>
            <div class="header-actions">${this._renderHeaderActions()}</div>
          </div>
        </header>

        <div class="content">
          <hpu-grid class="stats" min="11rem" gap="3">
            <hpu-stat-card
              data-stat="readiness"
              label=${this._t(`stat.readiness`)}
              value=${this._pct(n)}
              detail=${this._formatHours(o)}
              detail-tone=${this._detailTone(o)??b}
              tone=${this._cardTone(o)}
              .icon=${kr}
              clickable
              haspopup="dialog"
              accessible-label=${this._t(`readiness.open`)}
              @hpu-activate=${this._openReadiness}
            ></hpu-stat-card>
            <hpu-stat-card
              label=${this._t(`stat.water`)}
              value=${this._formatAmount(t.water_on_hand,`L`)}
              meta=${`${this._pct(r)} · ${this._formatAmount(t.water_target,`L`)}`}
              detail=${this._formatHours(s)}
              detail-tone=${this._detailTone(s)??b}
              tone=${this._cardTone(s)}
              .icon=${Ar}
            ></hpu-stat-card>
            <hpu-stat-card
              data-stat="food"
              label=${this._t(`stat.food`)}
              value=${this._formatAmount(t.food_on_hand,`kcal`)}
              meta=${`${this._pct(i)} · ${this._formatAmount(t.food_target,`kcal`)}`}
              detail=${this._formatHours(c)}
              detail-tone=${this._detailTone(c)??b}
              tone=${this._cardTone(c)}
              .icon=${jr}
              clickable
              haspopup="dialog"
              accessible-label=${this._t(`household.open_food`)}
              @hpu-activate=${()=>this._openHousehold(`food`)}
            ></hpu-stat-card>
            ${u?v`
                  <hpu-stat-card
                    data-stat="pet_food"
                    label=${this._t(`stat.pet_food`)}
                    value=${this._formatAmount(t.pet_food_on_hand,`g`)}
                    meta=${`${this._pct(t.pet_food_percent)} · ${this._formatAmount(l,`g`)}`}
                    detail=${this._formatHours(d)}
                    detail-tone=${this._detailTone(d)??b}
                    tone=${this._cardTone(d)}
                    .icon=${Mr}
                    clickable
                    haspopup="dialog"
                    accessible-label=${this._t(`household.open_pet_food`)}
                    @hpu-activate=${()=>this._openHousehold(`pet_food`)}
                  ></hpu-stat-card>
                `:b}
            ${a==null?b:v`
                  <hpu-stat-card
                    data-stat="completeness"
                    label=${this._t(`stat.completeness`)}
                    value=${this._pct(a)}
                    .icon=${Nr}
                    clickable
                    haspopup="dialog"
                    accessible-label=${this._t(`completeness.open`)}
                    @hpu-activate=${this._openCompleteness}
                  ></hpu-stat-card>
                `}
          </hpu-grid>

          <section class="inventory">
            <div class="toolbar">
              <div class="toolbar-row">
                <hpu-filter-bar
                  class="filter-bar"
                  .filters=${this._filterDefs()}
                  .value=${this._filterValue}
                  search-label=${this._t(`filter.search_placeholder`)}
                  search-placeholder=${this._t(`filter.search_placeholder`)}
                  @hpu-filter-change=${this._onFilterChange}
                ></hpu-filter-bar>
                <hpu-select
                  class="sort"
                  hide-label
                  label=${this._t(`filter.sort`)}
                  .options=${vr.map(e=>({value:e,label:`${this._t(`filter.sort`)}: ${e}`}))}
                  .value=${this._sort}
                  @hpu-change=${e=>{this._sort=e.detail.value,this._persistViewState()}}
                ></hpu-select>
              </div>
              <div class="inventory-meta">
                <span class="item-count"
                  >${e.length}/${this._snapshot?.items.length??0}</span
                >
              </div>
            </div>

            ${this._templateNotice?v`<div class="field-hint" role="status">${this._templateNotice}</div>`:b}
            ${this._error?v`<div class="error" role="alert">${this._error}</div>`:b}

            <hpu-data-table
              class="inventory-table"
              label=${this._t(`action.inventory`)}
              manual-sort
              rows-clickable
              ?loading=${!this._snapshot}
              .columns=${this._columns()}
              .rows=${e}
              @hpu-row-click=${e=>this._openEdit(e.detail.row)}
            >
              ${this._renderEmpty()}
            </hpu-data-table>
          </section>
        </div>
      </div>

      <div class="overlays"></div>
      ${this._dialogOpen?this._renderDialog():b}
      ${this._completenessOpen?this._renderCompletenessDialog():b}
      ${this._readinessOpen?this._renderReadinessDialog():b}
      ${this._householdModal?this._renderHouseholdDialog(this._householdModal):b}
      ${this._templateOpen?this._renderTemplateDialog():b}
    `}_renderEmpty(){return v`
      <div slot="empty" class="empty">
        No items match.
        ${this._canWrite()?v`
              <div class="empty-actions">
                ${this._mdButton(`Scan`,{variant:`outlined`,disabled:this._scanning,onClick:()=>void this._scanFromPanel()})}
                ${this._mdButton(`Add an item`,{variant:`text`,onClick:this._openAdd})}
              </div>
            `:b}
      </div>
    `}_qtyText(e){let t=e.desired_quantity?` / ${e.desired_quantity}`:``;return`${e.quantity}${t} ${e.unit}`}_renderMeasure(e){return $n(e,this._readinessKind(e.category))}_contentsToLiters(e,t){return Jn(e,t)}_formatMeasureNumber(e){let t=Number(e);return Number.isNaN(t)?`—`:Math.abs(t-Math.round(t))<.05?String(Math.round(t)):String(Math.round(t*100)/100)}_contentsUnitLabel(e){return Lr(e||`unit`)}_formTotalContents(){let e=this._parseDecimal(this._form.quantity||`0`),t=this._parseDecimal(this._form.contents_per_unit||``);return!this._form.contents_per_unit||Number.isNaN(t)?null:e*t}_formTotalCalories(){let e=this._formTotalContents(),t=this._parseDecimal(this._form.calories_per_content||``);return e==null||!this._form.calories_per_content||Number.isNaN(t)?null:e*t}_formTotalLiters(){let e=this._formTotalContents();return e==null||!this._form.contents_unit?null:this._contentsToLiters(e,this._form.contents_unit)}_validateForm(){let e=this._form,t={};(e.name||``).trim()||(t.name=`Name is required`),(e.location||``).trim()||(t.location=`Location is required`),(e.category||``).trim()||(t.category=`Category is required`);let n=this._parseDecimal(e.quantity);return(e.quantity===``||Number.isNaN(n)||n<0)&&(t.quantity=`Enter a valid quantity`),(e.unit||``).trim()||(t.unit=`Unit is required`),Object.assign(t,er(this._formReadiness(),{contents_per_unit:e.contents_per_unit||``,contents_unit:e.contents_unit||``,calories_per_content:e.calories_per_content||``})),t}_renderStatusBadge(e){return e?v`<hpu-badge tone=${e===`expired`?`danger`:e===`low`?`info`:`warning`} size="sm"
      >${this._statusLabel(e)}</hpu-badge
    >`:null}_openHousehold(e){this._householdModal=e}_renderHouseholdDialog(e){let t=cr(this._settings);return v`
      <hpu-modal
        class="household-dialog"
        open
        heading=${this._t(e===`food`?`household.food_title`:`household.pet_food_title`)}
        @hpu-close=${this._closeHousehold}
      >
        ${t?e===`food`?this._renderFoodTable(t):this._renderPetFoodTable(t):v`<p class="field-hint">${this._t(`household.not_configured`)}</p>`}
      </hpu-modal>
    `}_renderFoodTable(e){let t=lr(e),n=Math.round(t.days*10)/10;return v`
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>${this._t(`household.category`)}</th>
              <th>${this._t(`household.count`)}</th>
              <th>${this._t(`household.per_person`)}</th>
              <th>${this._t(`household.subtotal`)}</th>
            </tr>
          </thead>
          <tbody>
            ${t.rows.map(e=>v`<tr>
                <td>${this._t(`household.${e.key}`)}</td>
                <td>${e.count}</td>
                <td>${this._formatAmount(e.caloriesPerPerson,`kcal`)}</td>
                <td>${this._formatAmount(e.caloriesSubtotal,`kcal`)}</td>
              </tr>`)}
            <tr>
              <th colspan="3">${this._t(`household.total_per_day`)}</th>
              <td>${this._formatAmount(t.dailyTotal,`kcal`)}</td>
            </tr>
            <tr>
              <th colspan="3">${this._t(`household.total_period`,{days:n})}</th>
              <td>${this._formatAmount(t.periodTotal,`kcal`)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `}_renderPetFoodTable(e){let t=ur(e),n=Math.round(t.days*10)/10;return v`
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>${this._t(`household.pet`)}</th>
              <th>${this._t(`household.food_per_day`)}</th>
            </tr>
          </thead>
          <tbody>
            ${t.rows.map(e=>v`<tr>
                <td>${e.name}${e.type?v` (${e.type})`:b}</td>
                <td>${this._formatAmount(e.foodPerDay,`g`)}</td>
              </tr>`)}
            <tr>
              <th>${this._t(`household.total_per_day`)}</th>
              <td>${this._formatAmount(t.dailyTotal,`g`)}</td>
            </tr>
            <tr>
              <th>${this._t(`household.pet_food_period`,{days:n})}</th>
              <td>${this._formatAmount(t.periodTotal,`g`)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `}_columns(){let e=this._canWrite();return[{key:`name`,label:`Name`,primary:!0},{key:`status`,label:`Status`,render:e=>this._renderStatusBadge(this._itemStatus(e))},{key:`quantity`,label:`Quantity`,render:e=>this._qtyText(e)},{key:`measure`,label:`L / kcal`,render:e=>this._renderMeasure(e)},{key:`location`,label:`Location`,render:e=>e.location||`—`},{key:`category`,label:`Category`,render:e=>e.category||`—`},{key:`expiry_date`,label:`Expiry`,render:e=>this._formatDate(e.expiry_date)},{key:`actions`,label:`Actions`,align:`end`,render:t=>v`
          ${this._mdButton(e?`Edit`:`View`,{variant:`outlined`,onClick:()=>this._openEdit(t)})}
          ${e?this._mdButton(`Remove`,{variant:`danger-text`,disabled:this._isRemovePending(t.id),onClick:()=>void this._remove(t)}):b}
        `}]}_formReadiness(){return this._readinessKind(this._form.category||``)}_showCaloriesField(){return Gn(this._formReadiness())}_renderDialog(){let e=this._form,t=this._optionList(this._settings?.locations??[],e.location||``),n=this._optionList(this._settings?.categories??[],e.category||``),r=this._formReadiness(),i=this._formTotalContents(),a=this._formTotalLiters(),o=this._formTotalCalories(),s=this._contentsUnitLabel(e.contents_unit||`unit`),c=``;i!=null&&e.contents_unit&&(c=`Total on hand: ${this._formatMeasureNumber(i)} ${s}`,a!=null&&(c+=` · ${this._formatMeasureNumber(a)} L`),o!=null&&(c+=` · ${this._formatMeasureNumber(o)} kcal`));let l=this._canWrite();return v`
      <hpu-modal
        open
        heading=${this._editing?this._t(`dialog.edit_title`):this._t(`dialog.add_title`)}
        @hpu-close=${e=>{e.detail.reason===`backdrop`?e.preventDefault():this._closeDialog()}}
      >
        <hpu-form
          @hpu-submit=${()=>void this._save()}
          @hpu-invalid=${()=>void this._save()}
        >
          <hpu-form-section heading="Details" plain>
            <div class="barcode-row">
              ${this._textField(`barcode`,this._t(`field.barcode`),{write:l,error:this._barcodeError})}
              ${l?v`
                    ${this._mdButton(this._t(`action.scan`),{variant:`outlined`,disabled:this._scanning,onClick:()=>void this._scanBarcode()})}
                    ${this._mdButton(this._t(`action.lookup`),{variant:`outlined`,disabled:this._scanning||!(e.barcode||``).trim(),onClick:()=>void this._lookupBarcode()})}
                  `:b}
            </div>
            ${this._textField(`name`,`Name`,{write:l,required:l})}
            <div class="row2">
              ${this._selectField(`location`,`Location`,t.map(e=>({value:e,label:e})),{write:l,required:l,placeholder:`Select location`})}
              ${this._selectField(`category`,`Category`,n.map(e=>({value:e,label:e})),{write:l,required:l,placeholder:`Select category`})}
            </div>
            ${this._selectField(`priority`,this._t(`field.priority`),Ir.map(e=>({value:e,label:this._t(`priority.${e}`)})),{write:l,fallback:`important`})}
            ${this._textField(`notes`,this._t(`field.notes`),{write:l})}
          </hpu-form-section>

          <hpu-form-section heading="Stock" plain>
            <div class="row3">
              ${this._textField(`quantity`,`Quantity`,{write:l,required:l,inputmode:`decimal`,fallback:`1`,hint:c})}
              ${this._textField(`desired_quantity`,`Desired quantity`,{write:l,inputmode:`decimal`,fallback:`0`})}
              ${this._selectField(`unit`,`Unit`,Pr.map(e=>({value:e,label:Lr(e)})),{write:l,required:l,fallback:`piece`})}
            </div>
            <div class="row2">
              ${this._textField(`contents_per_unit`,`Contents per unit`,{write:l,required:l&&(r===`food`||r===`water`||r===`pet_food`),inputmode:`decimal`,hint:`How much is in one bottle, can, or pack?`})}
              ${this._selectField(`contents_unit`,`Contents unit`,Fr.map(e=>({value:e,label:Lr(e)})),{write:l,required:l&&(r===`food`||r===`water`||r===`pet_food`),placeholder:`Select unit`,hint:`Liter, milliliter, gram, or kilogram for one stock unit.`})}
            </div>
            ${this._showCaloriesField()?this._textField(`calories_per_content`,`Calories (kcal) per ${s}`,{write:l,required:l&&r===`food`,inputmode:`decimal`,hint:`Calories per contents unit${o==null?``:` · Total calories on hand: ${this._formatMeasureNumber(o)} kcal`}`}):b}
            ${r===`none`?v`<div class="field-hint">
                  Category is not mapped to food, water or pet food — this item will not
                  count toward readiness.
                </div>`:b}
          </hpu-form-section>

          <hpu-form-section heading="Dates" plain>
            ${this._textField(`expiry_date`,`Expiry`,{write:l,type:`date`})}
          </hpu-form-section>

          ${this._error?v`<div class="error" role="alert">${this._error}</div>`:b}
        </hpu-form>
        <div slot="actions">
          ${this._mdButton(l?this._t(`action.cancel`):this._t(`action.close`),{variant:`text`,onClick:this._closeDialog})}
          ${l?this._mdButton(this._t(`action.save`),{variant:`filled`,disabled:this._saving,onClick:()=>void this._save()}):b}
        </div>
      </hpu-modal>
    `}_textField(e,t,n){return v`<hpu-input
      name=${e}
      label=${t}
      type=${n.type??`text`}
      inputmode=${n.inputmode??``}
      hint=${n.hint??``}
      error=${n.error??this._fieldErrors[e]??``}
      ?required=${n.required??!1}
      ?disabled=${!n.write}
      .value=${this._form[e]||n.fallback||``}
      @hpu-input=${this._onField(e)}
    ></hpu-input>`}_selectField(e,t,n,r){return v`<hpu-select
      name=${e}
      label=${t}
      placeholder=${r.placeholder??``}
      hint=${r.hint??``}
      error=${this._fieldErrors[e]??``}
      ?required=${r.required??!1}
      ?disabled=${!r.write}
      .options=${n}
      .value=${this._form[e]||r.fallback||``}
      @hpu-change=${this._onField(e)}
    ></hpu-select>`}_onField(e){return t=>{let n=t.detail.value;if(this._form={...this._form,[e]:n},e===`barcode`&&this._barcodeError&&(this._barcodeError=``),this._fieldErrors[e]){let t={...this._fieldErrors};delete t[e],this._fieldErrors=t}}}_parseDecimal(e){return Number(String(e).trim().replace(`,`,`.`))}_blankForm(){return{name:``,quantity:`1`,desired_quantity:`0`,unit:`piece`,location:``,category:``,priority:`important`,notes:``,barcode:``,expiry_date:``,contents_per_unit:``,contents_unit:``,calories_per_content:``}}_renderReadinessDialog(){return v`
      <hpu-modal
        class="explain-dialog"
        open
        heading=${this._t(`readiness.title`)}
        @hpu-close=${this._closeReadiness}
      >
        <p>${this._t(`readiness.explain`)}</p>
        <p class="field-hint">${this._t(`readiness.example`)}</p>
      </hpu-modal>
    `}_renderCompletenessDialog(){let e=this._snapshot?.completeness,t=Object.entries(e?.categories??{}),n=this._completenessPercent(),r=this._t(`completeness.title`),i=t.every(([,e])=>e.missing.length===0);return v`
      <hpu-modal
        class="completeness-dialog"
        open
        heading=${r}
        @hpu-close=${this._closeCompleteness}
      >
          <p>${this._t(`completeness.explain`)}</p>
          <p class="field-hint">${this._t(`completeness.example`)}</p>
          <div class="completeness-overall">
            ${this._t(`completeness.overall`)}:
            <strong>${this._pct(n)}</strong>
          </div>
          ${i?v`<p class="completeness-all">
                ${this._t(`completeness.all_complete`)}
              </p>`:b}
          ${t.map(([e,t])=>v`
              <section class="completeness-category">
                <div class="completeness-category-head">
                  <span class="completeness-category-name">${e}</span>
                  <span class="completeness-category-score">
                    ${t.complete}/${t.total} · ${this._pct(t.percent)}
                    ${t.missing.length===0?v`<span
                          class="completeness-check"
                          title=${this._t(`completeness.category_complete`)}
                          aria-label=${this._t(`completeness.category_complete`)}
                          >✓</span
                        >`:b}
                  </span>
                </div>
                ${t.missing.length>0?v`<ul class="completeness-missing">
                      ${t.missing.map(e=>v`
                          <li>
                            <span class="completeness-item-name">${e.name}</span>
                            <span
                              class="completeness-reason ${e.expired?`completeness-reason-expired`:``}"
                              >${e.expired?this._t(`completeness.expired`):this._t(`completeness.stock`,{quantity:e.quantity,desired:e.desired_quantity})}</span
                            >
                          </li>
                        `)}
                    </ul>`:b}
              </section>
            `)}
      </hpu-modal>
    `}_setTemplateNotice(e){this._templateNoticeTimer&&clearTimeout(this._templateNoticeTimer),this._templateNoticeTimer=null,this._templateNotice=e,e&&(this._templateNoticeTimer=setTimeout(()=>{this._templateNotice=``,this._templateNoticeTimer=null},Rr))}_templateMissing(e){return kn(e.items,(this._snapshot?.items??[]).map(e=>e.name))}_setTemplateUnchecked(e,t){this._templateUnchecked={...this._templateUnchecked,[e]:t}}_toggleTemplateItem(e,t,n){let r=new Set(this._templateUnchecked[e.id]??[]);n?r.delete(t):r.add(t),this._setTemplateUnchecked(e.id,r)}_toggleTemplateAll(e){let t=this._templateMissing(e),n=jn(t,this._templateUnchecked[e.id]??new Set);this._setTemplateUnchecked(e.id,n===`all`?new Set(t.map(e=>e.name)):new Set)}async _applyTemplate(e){if(!this.hass||this._templateBusy)return;let t=An(this._templateMissing(e),this._templateUnchecked[e.id]??new Set);if(t.length){this._templateBusy=!0,this._error=``;try{let n=(await this.hass.callService(`ready_home`,`apply_kit_template`,{template_id:e.id,item_names:t.map(e=>e.name)},void 0,void 0,!0))?.response;this._setTemplateNotice(n?this._t(`template.added_result`,{added:n.added_count??0,skipped:n.skipped_count??0}):``),this._closeTemplates()}catch(e){this._error=Z(e),X({message:this._error,tone:`danger`})}finally{this._templateBusy=!1}}}async _pushRestock(){if(this.hass){this._error=``;try{await this.hass.callService(`ready_home`,`push_restock_list`,{}),X({message:this._t(`toast.restock_pushed`),tone:`success`})}catch(e){this._error=Z(e),X({message:this._error,tone:`danger`})}}}_renderTemplateCard(e){let t=this._templateMissing(e),n=this._templateUnchecked[e.id]??new Set,r=An(t,n),i=jn(t,n);return v`
      <div class="template-card">
        <div class="template-card-body">
          <strong>${e.name}</strong>
          <p>${e.description}</p>
          <span class="item-count"
            >${t.length?this._t(`template.to_add`,{n:t.length}):this._t(`template.none_missing`)}</span
          >
        </div>
        ${t.length?v`
              <details class="template-items">
                <summary>${this._t(`template.items`)}</summary>
                <hpu-checkbox
                  class="template-item template-select-all"
                  .checked=${i===`all`}
                  .indeterminate=${i===`partial`}
                  @hpu-change=${()=>this._toggleTemplateAll(e)}
                  >${this._t(`template.select_all`)}</hpu-checkbox
                >
                ${t.map(t=>v`
                    <hpu-checkbox
                      class="template-item"
                      .checked=${!n.has(t.name)}
                      @hpu-change=${n=>this._toggleTemplateItem(e,t.name,n.detail.checked)}
                      >${t.name}</hpu-checkbox
                    >
                  `)}
              </details>
            `:b}
        ${this._mdButton(this._t(`template.add_selected`,{n:r.length}),{variant:`filled`,disabled:this._templateBusy||r.length===0,onClick:()=>void this._applyTemplate(e)})}
      </div>
    `}_renderTemplateDialog(){return v`
      <hpu-modal
        open
        heading=${this._t(`dialog.template_title`)}
        @hpu-close=${this._closeTemplates}
      >
        <p class="field-hint">${this._t(`template.skip_existing`)}</p>
        <div class="template-list">
          ${this._templates.map(e=>this._renderTemplateCard(e))}
        </div>
        <div slot="actions">
          ${this._mdButton(this._t(`action.close`),{variant:`text`,onClick:this._closeTemplates})}
        </div>
      </hpu-modal>
    `}_abortScan(){let e=this._scanHandle;this._scanHandle=null,e?.abort()}async _remove(e){if(this._canWrite()&&!this._isRemovePending(e.id)&&await _n({title:this._t(`confirm.remove_title`),message:this._t(`confirm.remove_message`,{name:e.name}),tone:`danger`,confirmLabel:this._t(`action.remove`),cancelLabel:this._t(`action.cancel`),host:this._overlayHost()})){this._pendingRemoveIds=[...this._pendingRemoveIds,e.id],this._error=``;try{await this.hass.callService(`ready_home`,`remove_item`,{item_id:e.id}),X({message:this._t(`toast.removed`,{name:e.name}),tone:`success`})}catch(t){this._pendingRemoveIds=this._pendingRemoveIds.filter(t=>t!==e.id),this._error=Z(t),X({message:this._error,tone:`danger`})}}}_overlayHost(){return this.shadowRoot?.querySelector(`.overlays`)??void 0}async _save(){if(!this._canWrite())return;let e=this._validateForm();if(this._fieldErrors=e,Object.keys(e).length)return;let t=this._form,n=(t.name||``).trim(),r=this._formReadiness(),i={quantity:this._parseDecimal(t.quantity||`0`),desired_quantity:this._parseDecimal(t.desired_quantity||`0`),unit:t.unit||`piece`,location:t.location||``,category:t.category||``,priority:t.priority||`important`,barcode:t.barcode||``,notes:t.notes||``};t.expiry_date&&(i.expiry_date=t.expiry_date),Object.assign(i,tr(r,{contents_per_unit:t.contents_per_unit||``,contents_unit:t.contents_unit||``,calories_per_content:t.calories_per_content||``})),this._saving=!0,this._error=``;try{this._editing?await this.hass.callService(`ready_home`,`update_item`,{item_id:this._editing.id,new_name:n,...i}):await this.hass.callService(`ready_home`,`add_item`,{name:n,...i}),this._dialogOpen=!1,this._fieldErrors={},this._barcodeError=``,X({message:this._t(`toast.saved`,{name:n}),tone:`success`})}catch(e){this._error=Z(e),X({message:this._error,tone:`danger`})}finally{this._saving=!1}}async _lookupBarcode(){if(!this._canWrite())return;let e=this._form.barcode?.trim();if(e){this._scanning=!0,this._barcodeError=``,this._error=``;try{let t=await Pn(this.hass,e),n=this._settings?.food_categories?.[0]?.trim()||`Food`;this._form=Vn(this._form,t,n)}catch(e){this._barcodeError=Hn(e)?Un:`Barcode lookup failed: ${Z(e)}`}finally{this._scanning=!1}}}async _scanFromPanel(){if(!this._canWrite())return;if(!zn(this.hass)){this._openAdd(),this._barcodeError=this._t(`companion.scan_needed`);return}this._scanning=!0,this._error=``,this._barcodeError=``,this._abortScan();let e=Bn(this.hass);this._scanHandle=e;try{let t=await e.done;if(this._scanHandle===e&&(this._scanHandle=null),!t)return;this._openAdd(),this._form={...this._form,barcode:t},this._scanning=!1,await this._lookupBarcode()}catch(t){this._scanHandle===e&&(this._scanHandle=null),this._openAdd(),this._barcodeError=`Camera scan failed: ${Z(t)}`}finally{this._scanning=!1}}async _scanBarcode(){if(!this._canWrite())return;if(!zn(this.hass)){this._barcodeError=this._t(`companion.scan_needed`);return}this._scanning=!0,this._barcodeError=``,this._error=``,this._abortScan();let e=Bn(this.hass);this._scanHandle=e;try{let t=await e.done;if(this._scanHandle===e&&(this._scanHandle=null),!t)return;this._form={...this._form,barcode:t},this._scanning=!1,await this._lookupBarcode()}catch(t){this._scanHandle===e&&(this._scanHandle=null),this._barcodeError=`Camera scan failed: ${Z(t)}`}finally{this._scanning=!1}}static{this.styles=o`
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
    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }
    .brand-heading {
      margin: 0;
      line-height: 0;
      min-width: 0;
    }
    .brand-logo {
      display: block;
      height: 40px;
      width: auto;
      max-width: min(280px, 100%);
      object-fit: contain;
    }
    .more {
      position: relative;
      flex-shrink: 0;
    }
    .more-menu {
      position: absolute;
      top: calc(100% + 4px);
      right: 0;
      z-index: 20;
      display: flex;
      flex-direction: column;
      min-width: 12rem;
      padding: 4px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 12px;
      background: var(--card-background-color, #fff);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    }
    .more-item {
      padding: 10px 12px;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: var(--primary-text-color);
      text-align: left;
      cursor: pointer;
    }
    .more-item:hover,
    .more-item:focus-visible {
      background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.06);
      outline: none;
    }
    .more-item[disabled] {
      opacity: 0.5;
      cursor: default;
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
      margin-bottom: 16px;
    }
    .completeness-overall {
      font-size: 1.1rem;
    }
    .completeness-category-head {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      font-weight: 500;
    }
    .completeness-check {
      color: var(--rh-ready-color);
      margin-left: 6px;
    }
    .completeness-missing {
      list-style: none;
      margin: 6px 0 0;
      padding: 0 0 0 12px;
    }
    .completeness-missing li {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 4px 0;
      border-bottom: 1px solid var(--divider-color);
    }
    .completeness-item-name {
      min-width: 0;
      overflow-wrap: anywhere;
    }
    .completeness-reason {
      flex-shrink: 0;
      color: var(--secondary-text-color);
    }
    .completeness-reason-expired {
      color: var(--error-color, #c62828);
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
    .filter-bar {
      flex: 1 1 auto;
      min-width: 0;
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
    select,
    input,
    button {
      font: inherit;
    }
    select,
    input {
      padding: 8px 10px;
      border-radius: var(--ha-border-radius-lg, 12px);
      border: 1px solid var(--divider-color);
      background: var(--card-background-color, var(--primary-background-color));
      color: var(--primary-text-color);
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
    tbody tr:last-child td {
      border-bottom: none;
    }
    .inventory-table {
      display: block;
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
    .empty-actions {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .error {
      color: var(--error-color, #c62828);
      font-size: 0.9rem;
      margin-bottom: 10px;
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
    .field-hint {
      color: var(--secondary-text-color);
      font-size: 0.75rem;
      margin-top: 4px;
      line-height: 1.35;
    }
    .template-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .template-card {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 12px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 8px;
    }
    .template-items summary {
      cursor: pointer;
      color: var(--primary-color);
    }
    .template-items summary {
      padding: 2px 0;
    }
    .template-select-all {
      font-weight: 500;
      padding-bottom: 6px;
      margin-bottom: 2px;
    }
    .template-card-body {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .template-card-body p {
      margin: 0;
      color: var(--secondary-text-color);
      font-size: 0.9rem;
    }
    .barcode-row {
      display: flex;
      gap: 6px;
      align-items: center;
    }
    .barcode-row hpu-input {
      flex: 1;
      min-width: 0;
    }
    @media (max-width: 720px) {
      .header-row {
        flex-wrap: nowrap;
        gap: 8px;
      }
      .header-actions {
        gap: 4px;
      }
      .brand-logo {
        height: 36px;
        max-width: min(200px, 42vw);
        min-width: 0;
        object-fit: contain;
      }
      .stats {
        margin-bottom: 12px;
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
      .sort {
        max-width: 8.5rem;
      }
      .row2,
      .row3 {
        grid-template-columns: 1fr;
      }
    }
    /* Smallest phones: keep menu icon, logo, Add item and the more button on one row. */
    @media (max-width: 400px) {
      .brand-logo {
        max-width: 28vw;
      }
    }
  `}};Q([w({attribute:!1})],$.prototype,`hass`,void 0),Q([w({type:Boolean})],$.prototype,`narrow`,void 0),Q([w({attribute:!1})],$.prototype,`panel`,void 0),Q([T()],$.prototype,`_snapshot`,void 0),Q([T()],$.prototype,`_settings`,void 0),Q([T()],$.prototype,`_search`,void 0),Q([T()],$.prototype,`_filterStatus`,void 0),Q([T()],$.prototype,`_filterLocation`,void 0),Q([T()],$.prototype,`_filterCategory`,void 0),Q([T()],$.prototype,`_filterReadiness`,void 0),Q([T()],$.prototype,`_sort`,void 0),Q([T()],$.prototype,`_dialogOpen`,void 0),Q([T()],$.prototype,`_editing`,void 0),Q([T()],$.prototype,`_form`,void 0),Q([T()],$.prototype,`_error`,void 0),Q([T()],$.prototype,`_barcodeError`,void 0),Q([T()],$.prototype,`_fieldErrors`,void 0),Q([T()],$.prototype,`_saving`,void 0),Q([T()],$.prototype,`_scanning`,void 0),Q([T()],$.prototype,`_pendingRemoveIds`,void 0),Q([T()],$.prototype,`_completenessOpen`,void 0),Q([T()],$.prototype,`_moreOpen`,void 0),Q([T()],$.prototype,`_readinessOpen`,void 0),Q([T()],$.prototype,`_householdModal`,void 0),Q([T()],$.prototype,`_templateOpen`,void 0),Q([T()],$.prototype,`_templates`,void 0),Q([T()],$.prototype,`_templateBusy`,void 0),Q([T()],$.prototype,`_templateUnchecked`,void 0),Q([T()],$.prototype,`_templateNotice`,void 0);try{customElements.define(xr,$)}catch{}
//# sourceMappingURL=ready-home-panel.js.map