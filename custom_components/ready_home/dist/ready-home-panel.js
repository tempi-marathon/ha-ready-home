var e=globalThis,t=e.ShadowRoot&&(e.ShadyCSS===void 0||e.ShadyCSS.nativeShadow)&&`adoptedStyleSheets`in Document.prototype&&`replace`in CSSStyleSheet.prototype,n=Symbol(),r=new WeakMap,i=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,n=this.t;if(t&&e===void 0){let t=n!==void 0&&n.length===1;t&&(e=r.get(n)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&r.set(n,e))}return e}toString(){return this.cssText}},a=e=>new i(typeof e==`string`?e:e+``,void 0,n),o=(e,...t)=>new i(e.length===1?e[0]:t.reduce((t,n,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if(typeof e==`number`)return e;throw Error(`Value passed to 'css' function must be a 'css' function result: `+e+`. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`)})(n)+e[r+1],e[0]),e,n),s=(n,r)=>{if(t)n.adoptedStyleSheets=r.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let t of r){let r=document.createElement(`style`),i=e.litNonce;i!==void 0&&r.setAttribute(`nonce`,i),r.textContent=t.cssText,n.appendChild(r)}},c=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t=``;for(let n of e.cssRules)t+=n.cssText;return a(t)})(e):e,{is:l,defineProperty:u,getOwnPropertyDescriptor:d,getOwnPropertyNames:f,getOwnPropertySymbols:p,getPrototypeOf:m}=Object,h=globalThis,g=h.trustedTypes,ee=g?g.emptyScript:``,te=h.reactiveElementPolyfillSupport,_=(e,t)=>e,ne={toAttribute(e,t){switch(t){case Boolean:e=e?ee:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},re=(e,t)=>!l(e,t),ie={attribute:!0,type:String,converter:ne,reflect:!1,useDefault:!1,hasChanged:re};Symbol.metadata??=Symbol(`metadata`),h.litPropertyMetadata??=new WeakMap;var v=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=ie){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol(),r=this.getPropertyDescriptor(e,n,t);r!==void 0&&u(this.prototype,e,r)}}static getPropertyDescriptor(e,t,n){let{get:r,set:i}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(t){let a=r?.call(this);i?.call(this,t),this.requestUpdate(e,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ie}static _$Ei(){if(this.hasOwnProperty(_(`elementProperties`)))return;let e=m(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(_(`finalized`)))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_(`properties`))){let e=this.properties,t=[...f(e),...p(e)];for(let n of t)this.createProperty(n,e[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[e,n]of t)this.elementProperties.set(e,n)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let n=this._$Eu(e,t);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let e of n)t.unshift(c(e))}else e!==void 0&&t.push(c(e));return t}static _$Eu(e,t){let n=t.attribute;return!1===n?void 0:typeof n==`string`?n:typeof e==`string`?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return s(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){let n=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,n);if(r!==void 0&&!0===n.reflect){let i=(n.converter?.toAttribute===void 0?ne:n.converter).toAttribute(t,n.type);this._$Em=e,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(e,t){let n=this.constructor,r=n._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let e=n.getPropertyOptions(r),i=typeof e.converter==`function`?{fromAttribute:e.converter}:e.converter?.fromAttribute===void 0?ne:e.converter;this._$Em=r;let a=i.fromAttribute(t,e.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(e,t,n,r=!1,i){if(e!==void 0){let a=this.constructor;if(!1===r&&(i=this[e]),n??=a.getPropertyOptions(e),!((n.hasChanged??re)(i,t)||n.useDefault&&n.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,n))))return;this.C(e,t,n)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:r,wrapped:i},a){n&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==i||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),!0===r&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[t,n]of e){let{wrapped:e}=n,r=this[t];!0!==e||this._$AL.has(t)||r===void 0||this.C(t,void 0,n,r)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};v.elementStyles=[],v.shadowRootOptions={mode:`open`},v[_(`elementProperties`)]=new Map,v[_(`finalized`)]=new Map,te?.({ReactiveElement:v}),(h.reactiveElementVersions??=[]).push(`2.1.2`);var ae=globalThis,oe=e=>e,se=ae.trustedTypes,ce=se?se.createPolicy(`lit-html`,{createHTML:e=>e}):void 0,le=`$lit$`,y=`lit$${Math.random().toFixed(9).slice(2)}$`,ue=`?`+y,de=`<${ue}>`,b=document,x=()=>b.createComment(``),S=e=>e===null||typeof e!=`object`&&typeof e!=`function`,fe=Array.isArray,pe=e=>fe(e)||typeof e?.[Symbol.iterator]==`function`,me=`[ 	
\f\r]`,C=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,he=/-->/g,ge=/>/g,w=RegExp(`>|${me}(?:([^\\s"'>=/]+)(${me}*=${me}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,`g`),_e=/'/g,ve=/"/g,ye=/^(?:script|style|textarea|title)$/i,T=(e=>(t,...n)=>({_$litType$:e,strings:t,values:n}))(1),E=Symbol.for(`lit-noChange`),D=Symbol.for(`lit-nothing`),be=new WeakMap,O=b.createTreeWalker(b,129);function xe(e,t){if(!fe(e)||!e.hasOwnProperty(`raw`))throw Error(`invalid template strings array`);return ce===void 0?t:ce.createHTML(t)}var Se=(e,t)=>{let n=e.length-1,r=[],i,a=t===2?`<svg>`:t===3?`<math>`:``,o=C;for(let t=0;t<n;t++){let n=e[t],s,c,l=-1,u=0;for(;u<n.length&&(o.lastIndex=u,c=o.exec(n),c!==null);)u=o.lastIndex,o===C?c[1]===`!--`?o=he:c[1]===void 0?c[2]===void 0?c[3]!==void 0&&(o=w):(ye.test(c[2])&&(i=RegExp(`</`+c[2],`g`)),o=w):o=ge:o===w?c[0]===`>`?(o=i??C,l=-1):c[1]===void 0?l=-2:(l=o.lastIndex-c[2].length,s=c[1],o=c[3]===void 0?w:c[3]===`"`?ve:_e):o===ve||o===_e?o=w:o===he||o===ge?o=C:(o=w,i=void 0);let d=o===w&&e[t+1].startsWith(`/>`)?` `:``;a+=o===C?n+de:l>=0?(r.push(s),n.slice(0,l)+le+n.slice(l)+y+d):n+y+(l===-2?t:d)}return[xe(e,a+(e[n]||`<?>`)+(t===2?`</svg>`:t===3?`</math>`:``)),r]},Ce=class e{constructor({strings:t,_$litType$:n},r){let i;this.parts=[];let a=0,o=0,s=t.length-1,c=this.parts,[l,u]=Se(t,n);if(this.el=e.createElement(l,r),O.currentNode=this.el.content,n===2||n===3){let e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;(i=O.nextNode())!==null&&c.length<s;){if(i.nodeType===1){if(i.hasAttributes())for(let e of i.getAttributeNames())if(e.endsWith(le)){let t=u[o++],n=i.getAttribute(e).split(y),r=/([.?@])?(.*)/.exec(t);c.push({type:1,index:a,name:r[2],strings:n,ctor:r[1]===`.`?De:r[1]===`?`?Oe:r[1]===`@`?ke:Ee}),i.removeAttribute(e)}else e.startsWith(y)&&(c.push({type:6,index:a}),i.removeAttribute(e));if(ye.test(i.tagName)){let e=i.textContent.split(y),t=e.length-1;if(t>0){i.textContent=se?se.emptyScript:``;for(let n=0;n<t;n++)i.append(e[n],x()),O.nextNode(),c.push({type:2,index:++a});i.append(e[t],x())}}}else if(i.nodeType===8){if(i.data===ue)c.push({type:2,index:a});else{let e=-1;for(;(e=i.data.indexOf(y,e+1))!==-1;)c.push({type:7,index:a}),e+=y.length-1}}a++}}static createElement(e,t){let n=b.createElement(`template`);return n.innerHTML=e,n}};function k(e,t,n=e,r){if(t===E)return t;let i=r===void 0?n._$Cl:n._$Co?.[r],a=S(t)?void 0:t._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(e),i._$AT(e,n,r)),r===void 0?n._$Cl=i:(n._$Co??=[])[r]=i),i!==void 0&&(t=k(e,i._$AS(e,t.values),i,r)),t}var we=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,r=(e?.creationScope??b).importNode(t,!0);O.currentNode=r;let i=O.nextNode(),a=0,o=0,s=n[0];for(;s!==void 0;){if(a===s.index){let t;s.type===2?t=new Te(i,i.nextSibling,this,e):s.type===1?t=new s.ctor(i,s.name,s.strings,this,e):s.type===6&&(t=new Ae(i,this,e)),this._$AV.push(t),s=n[++o]}a!==s?.index&&(i=O.nextNode(),a++)}return O.currentNode=b,r}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings===void 0?n._$AI(e[t]):(n._$AI(e,n,t),t+=n.strings.length-2)),t++}},Te=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,r){this.type=2,this._$AH=D,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=k(this,e,t),S(e)?e===D||e==null||e===``?(this._$AH!==D&&this._$AR(),this._$AH=D):e!==this._$AH&&e!==E&&this._(e):e._$litType$===void 0?e.nodeType===void 0?pe(e)?this.k(e):this._(e):this.T(e):this.$(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==D&&S(this._$AH)?this._$AA.nextSibling.data=e:this.T(b.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,r=typeof n==`number`?this._$AC(e):(n.el===void 0&&(n.el=Ce.createElement(xe(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===r)this._$AH.p(t);else{let e=new we(r,this),n=e.u(this.options);e.p(t),this.T(n),this._$AH=e}}_$AC(e){let t=be.get(e.strings);return t===void 0&&be.set(e.strings,t=new Ce(e)),t}k(t){fe(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,r,i=0;for(let a of t)i===n.length?n.push(r=new e(this.O(x()),this.O(x()),this,this.options)):r=n[i],r._$AI(a),i++;i<n.length&&(this._$AR(r&&r._$AB.nextSibling,i),n.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let t=oe(e).nextSibling;oe(e).remove(),e=t}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},Ee=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,r,i){this.type=1,this._$AH=D,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=i,n.length>2||n[0]!==``||n[1]!==``?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=D}_$AI(e,t=this,n,r){let i=this.strings,a=!1;if(i===void 0)e=k(this,e,t,0),a=!S(e)||e!==this._$AH&&e!==E,a&&(this._$AH=e);else{let r=e,o,s;for(e=i[0],o=0;o<i.length-1;o++)s=k(this,r[n+o],t,o),s===E&&(s=this._$AH[o]),a||=!S(s)||s!==this._$AH[o],s===D?e=D:e!==D&&(e+=(s??``)+i[o+1]),this._$AH[o]=s}a&&!r&&this.j(e)}j(e){e===D?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??``)}},De=class extends Ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===D?void 0:e}},Oe=class extends Ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==D)}},ke=class extends Ee{constructor(e,t,n,r,i){super(e,t,n,r,i),this.type=5}_$AI(e,t=this){if((e=k(this,e,t,0)??D)===E)return;let n=this._$AH,r=e===D&&n!==D||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==D&&(n===D||r);r&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH==`function`?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Ae=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){k(this,e)}},je=ae.litHtmlPolyfillSupport;je?.(Ce,Te),(ae.litHtmlVersions??=[]).push(`3.3.3`);var Me=(e,t,n)=>{let r=n?.renderBefore??t,i=r._$litPart$;if(i===void 0){let e=n?.renderBefore??null;r._$litPart$=i=new Te(t.insertBefore(x(),e),e,void 0,n??{})}return i._$AI(e),i},Ne=globalThis,A=class extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Me(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return E}};A._$litElement$=!0,A.finalized=!0,Ne.litElementHydrateSupport?.({LitElement:A});var Pe=Ne.litElementPolyfillSupport;Pe?.({LitElement:A}),(Ne.litElementVersions??=[]).push(`4.2.2`);var Fe={attribute:!0,type:String,converter:ne,reflect:!1,hasChanged:re},Ie=(e=Fe,t,n)=>{let{kind:r,metadata:i}=n,a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),r===`setter`&&((e=Object.create(e)).wrapped=!0),a.set(n.name,e),r===`accessor`){let{name:r}=n;return{set(n){let i=t.get.call(this);t.set.call(this,n),this.requestUpdate(r,i,e,!0,n)},init(t){return t!==void 0&&this.C(r,void 0,e,t),t}}}if(r===`setter`){let{name:r}=n;return function(n){let i=this[r];t.call(this,n),this.requestUpdate(r,i,e,!0,n)}}throw Error(`Unsupported decorator location: `+r)};function j(e){return(t,n)=>typeof n==`object`?Ie(e,t,n):((e,t,n)=>{let r=t.hasOwnProperty(n);return t.constructor.createProperty(n,e),r?Object.getOwnPropertyDescriptor(t,n):void 0})(e,t,n)}function M(e){return j({...e,state:!0,attribute:!1})}var Le=(e,t,n)=>(n.configurable=!0,n.enumerable=!0,Reflect.decorate&&typeof t!=`object`&&Object.defineProperty(e,t,n),n);function Re(e,t){return(n,r,i)=>{let a=t=>t.renderRoot?.querySelector(e)??null;if(t){let{get:e,set:t}=typeof r==`object`?n:i??(()=>{let e=Symbol();return{get(){return this[e]},set(t){this[e]=t}}})();return Le(n,r,{get(){let n=e.call(this);return n===void 0&&(n=a(this),(n!==null||this.hasUpdated)&&t.call(this,n)),n}})}return Le(n,r,{get(){return a(this)}})}}var ze=[`primary`,`gray`,`success`,`warning`,`danger`,`info`],Be=[`xs`,`sm`,`md`,`lg`,`xl`],Ve={xs:[24,8,12,14],sm:[32,12,13,16],md:[40,16,14,20],lg:[48,20,16,24],xl:[56,24,18,28]},He={danger:`var(--error-color, #db4437)`,warning:`var(--warning-color, #ffa600)`,success:`var(--success-color, #43a047)`,info:`var(--info-color, #039be5)`};function Ue(e,t){return`
  --hpu-${e}: ${t};
  --hpu-${e}-tint: color-mix(in srgb, var(--hpu-${e}) var(--_hpu-tint), var(--hpu-surface-raised));
  --hpu-${e}-border: color-mix(in srgb, var(--hpu-${e}) var(--_hpu-tint-border), var(--hpu-surface-raised));
  --hpu-${e}-text: color-mix(in srgb, var(--hpu-${e}) var(--_hpu-tone-text), var(--hpu-text));
  --hpu-${e}-solid: var(--hpu-${e});
  --hpu-${e}-on: var(--hpu-surface-raised);`}function We(e=`:root, :host, .hpu-root`){let t=e.split(`,`).map(e=>`${e.trim()}[data-theme='dark']`).join(`, `),n=Object.entries(Ve).map(([e,[t,n,r,i]])=>`
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

  /* Status and gray tones */${[Ue(`primary`,`var(--hpu-accent)`),Ue(`gray`,`var(--hpu-text-muted)`),...Object.entries(He).map(([e,t])=>Ue(e,t))].join(``)}

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
    --hpu-on-accent: oklch(from var(--hpu-accent) calc(0.99 - 0.74 * clamp(0, (l - 0.56) * 1000, 1)) calc(c * 0.6 * clamp(0, (l - 0.56) * 1000, 1)) h);${ze.map(e=>`
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
`}var Ge=We();function Ke(e=document){let t=new CSSStyleSheet;return t.replaceSync(Ge),e.adoptedStyleSheets=[...e.adoptedStyleSheets,t],t}var N=a(`
  :host {
    --_c: var(--hpu-primary);
    --_solid: var(--hpu-primary-solid);
    --_on: var(--hpu-primary-on);
    --_tint: var(--hpu-primary-tint);
    --_border: var(--hpu-primary-border);
    --_text: var(--hpu-primary-text);
  }
  ${ze.map(e=>`:host([tone='${e}']) {
    --_c: var(--hpu-${e});
    --_solid: var(--hpu-${e}-solid);
    --_on: var(--hpu-${e}-on);
    --_tint: var(--hpu-${e}-tint);
    --_border: var(--hpu-${e}-border);
    --_text: var(--hpu-${e}-text);
  }`).join(`
`)}
`),P=a(`
  :host {
    --_h: var(--hpu-size-md-height);
    --_pad: var(--hpu-size-md-padding);
    --_font: var(--hpu-size-md-font);
    --_icon: var(--hpu-size-md-icon);
  }
  ${Be.map(e=>`:host([size='${e}']) {
    --_h: var(--hpu-size-${e}-height);
    --_pad: var(--hpu-size-${e}-padding);
    --_font: var(--hpu-size-${e}-font);
    --_icon: var(--hpu-size-${e}-icon);
  }`).join(`
`)}
`),qe=o`
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
`;var Je=`0.2.0`,Ye=e=>e.split(`.`)[0],Xe=new Set;function Ze(e,t,n=Je){let r=customElements.get(e);if(!r){Object.defineProperty(t,"libVersion",{value:n}),customElements.define(e,t);return}let i=r.libVersion??`unknown`;Ye(i)!==Ye(n)&&!Xe.has(`${i}>${n}`)&&(Xe.add(`${i}>${n}`),console.warn(`ha-panel-ui ${n} found version ${i} already registered (<${e}>). The older copy is used by both panels. Align the versions to avoid surprises.`))}var F=e=>t=>{Ze(e,t)};function I(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}var Qe=class extends A{constructor(...e){super(...e),this.tone=`gray`,this.size=`md`}static{this.styles=[N,P,o`
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
    `]}render(){return T`<slot name="icon"></slot><slot></slot>`}};I([j({reflect:!0})],Qe.prototype,`tone`,void 0),I([j({reflect:!0})],Qe.prototype,`size`,void 0),Qe=I([F(`hpu-badge`)],Qe);var $e={"common.close":`Close`,"common.cancel":`Cancel`,"common.confirm":`Confirm`,"common.save":`Save`,"common.delete":`Delete`,"common.reset":`Reset`,"common.loading":`Loading`,"common.search":`Search`,"common.clear":`Clear`,"common.dismiss":`Dismiss`,"common.undo":`Undo`,"common.more":`More actions`,"common.required":`Required`,"table.empty":`Nothing to show`,"table.sort_ascending":`Sorted ascending`,"table.sort_descending":`Sorted descending`,"table.page_of":`{from}–{to} of {total}`,"table.previous":`Previous page`,"table.next":`Next page`,"table.sort_by":`Sort by`,"table.select_row":`Select row`,"table.select_all":`Select all rows`,"filter.title":`Filters`,"filter.apply":`Apply filters`,"filter.advanced":`More filters`,"filter.active_count":`{count} active`,"filter.no_results":`No results match your filters`,"page.menu":`Open menu`,"toast.region":`Notifications`,"select.no_results":`No results`,"select.loading":`Loading options`,"select.clear":`Clear selection`,"select.remove":`Remove {label}`,"connection.lost":`Connection to Home Assistant lost`,"connection.reconnecting":`Reconnecting to Home Assistant`},et={"common.close":`Sluiten`,"common.cancel":`Annuleren`,"common.confirm":`Bevestigen`,"common.save":`Opslaan`,"common.delete":`Verwijderen`,"common.reset":`Herstellen`,"common.loading":`Laden`,"common.search":`Zoeken`,"common.clear":`Wissen`,"common.dismiss":`Negeren`,"common.undo":`Ongedaan maken`,"common.more":`Meer acties`,"common.required":`Verplicht`,"table.empty":`Niets om te tonen`,"table.sort_ascending":`Oplopend gesorteerd`,"table.sort_descending":`Aflopend gesorteerd`,"table.page_of":`{from}–{to} van {total}`,"table.previous":`Vorige pagina`,"table.next":`Volgende pagina`,"table.sort_by":`Sorteren op`,"table.select_row":`Rij selecteren`,"table.select_all":`Alle rijen selecteren`,"filter.title":`Filters`,"filter.apply":`Filters toepassen`,"filter.advanced":`Meer filters`,"filter.active_count":`{count} actief`,"filter.no_results":`Geen resultaten voor deze filters`,"page.menu":`Menu openen`,"toast.region":`Meldingen`,"select.no_results":`Geen resultaten`,"select.loading":`Opties laden`,"select.clear":`Selectie wissen`,"select.remove":`{label} verwijderen`,"connection.lost":`Verbinding met Home Assistant verbroken`,"connection.reconnecting":`Opnieuw verbinden met Home Assistant`};function tt(e,t){return t?e.replace(/\{(\w+)\}/g,(e,n)=>n in t?String(t[n]):e):e}function nt(e,t){let n=t.fallback??`en`;return(r,i)=>{let a=t.language(),o=[a,a.split(`-`)[0]??a,n];for(let n of o){let a=t.overrides?.[n]?.[r]??e[n]?.[r];if(a!==void 0)return tt(a,i)}return r}}function rt(e,t){return nt({en:$e,nl:et,...t?.tables},{language:e,overrides:t?.overrides})}var it=``,at,ot;function st(e={}){e.language!==void 0&&(it=e.language),at=e,ot=void 0}function L(e,t){return ot??=rt(()=>it||document.documentElement.lang||navigator.language||`en`,at),ot(e,t)}var R=class extends A{constructor(...e){super(...e),this.tone=`primary`,this.size=`md`,this.label=``}static{this.styles=[N,P,o`
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
    `]}render(){return T`<svg viewBox="0 0 24 24" role="img" aria-label=${this.label||L(`common.loading`)}>
      <circle cx="12" cy="12" r="9"></circle>
    </svg>`}};I([j({reflect:!0})],R.prototype,`tone`,void 0),I([j({reflect:!0})],R.prototype,`size`,void 0),I([j()],R.prototype,`label`,void 0),R=I([F(`hpu-spinner`)],R);var z=e=>e??D,B=class extends A{constructor(...e){super(...e),this.#e=this.attachInternals(),this.variant=`filled`,this.tone=`primary`,this.size=`md`,this.loading=!1,this.disabled=!1,this.type=`button`}static{this.shadowRootOptions={...A.shadowRootOptions,delegatesFocus:!0}}static{this.formAssociated=!0}#e;static{this.styles=[N,P,qe,o`
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
    `]}render(){let e=this.disabled||this.loading;return T`<button
      class="control"
      part="control"
      type="button"
      ?disabled=${this.disabled}
      aria-disabled=${e?`true`:D}
      aria-busy=${this.loading?`true`:D}
      aria-expanded=${z(this.expanded)}
      aria-haspopup=${z(this.haspopup)}
      @click=${this.#t}
    >
      <span class="content"><slot name="icon"></slot><slot></slot></span>
      ${this.loading?T`<hpu-spinner tone=${this.tone}></hpu-spinner>`:D}
    </button>`}#t(e){this.disabled||this.loading?(e.stopImmediatePropagation(),e.preventDefault()):(this.dispatchEvent(new CustomEvent(`hpu-click`,{bubbles:!0,composed:!0})),this.type===`submit`?this.#e.form?.requestSubmit():this.type===`reset`&&this.#e.form?.reset())}};I([j()],B.prototype,`expanded`,void 0),I([j()],B.prototype,`haspopup`,void 0),I([j({reflect:!0})],B.prototype,`variant`,void 0),I([j({reflect:!0})],B.prototype,`tone`,void 0),I([j({reflect:!0})],B.prototype,`size`,void 0),I([j({type:Boolean,reflect:!0})],B.prototype,`loading`,void 0),I([j({type:Boolean,reflect:!0})],B.prototype,`disabled`,void 0),I([j()],B.prototype,`type`,void 0),B=I([F(`hpu-button`)],B);var ct=new Map,V=class extends A{constructor(...e){super(...e),this.path=``,this.name=``,this.label=``,this.size=`md`,this.mirrorRtl=!1}static{this.styles=[P,o`
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
    `]}render(){let e=this.path||ct.get(this.name)||``;return T`<svg
      viewBox="0 0 24 24"
      role=${this.label?`img`:D}
      aria-label=${this.label||D}
      aria-hidden=${this.label?D:`true`}
    >
      <path d=${e}></path>
    </svg>`}};I([j()],V.prototype,`path`,void 0),I([j()],V.prototype,`name`,void 0),I([j()],V.prototype,`label`,void 0),I([j({reflect:!0})],V.prototype,`size`,void 0),I([j({type:Boolean,attribute:`mirror-rtl`,reflect:!0})],V.prototype,`mirrorRtl`,void 0),V=I([F(`hpu-icon`)],V);var lt=`M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z`,ut=`M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z`,dt=`M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z`,ft=`M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z`,pt=`M19,13H5V11H19V13Z`,mt=0,H=class extends A{constructor(...e){super(...e),this.internals=this.attachInternals(),this.uid=`hpu-toggle-${mt++}`,this.checked=!1,this.disabled=!1,this.required=!1,this.compact=!1,this.name=``,this.value=`on`,this.label=``,this.hint=``,this.error=``}static{this.formAssociated=!0}get input(){return this.renderRoot.querySelector(`input`)}extraInputProps(){return{}}render(){let e=`${this.uid}-hint`,t=`${this.uid}-error`,n=[this.hint?e:``,this.error?t:``].filter(Boolean).join(` `)||void 0,r=`${this.uid}-label`,i=`${this.uid}-text`;return T`
      ${this.label?T`<span class="field-label" id=${r}
              >${this.label}${this.required?T`<span class="required" aria-hidden="true">*</span>`:D}</span
            >`:D}
      <label class="row">
        <input
          type="checkbox"
          role=${z(this.role_)}
          .checked=${this.checked}
          .indeterminate=${this.extraInputProps().indeterminate??!1}
          ?disabled=${this.disabled}
          ?required=${this.required}
          aria-labelledby=${this.label?`${r} ${i}`:D}
          aria-invalid=${this.error?`true`:D}
          aria-describedby=${z(n)}
          @change=${this.onChange}
        />
        ${this.renderVisual()}
        <span class="text" id=${i}
          ><slot></slot>${this.required&&!this.label?T`<span class="required" aria-hidden="true">*</span>`:D}</span
        >
      </label>
      ${this.hint?T`<p class="hint" id=${e}>${this.hint}</p>`:D}
      ${this.error?T`<p class="error" id=${t} role="alert">
              <hpu-icon .path=${lt} size="xs"></hpu-icon>${this.error}
            </p>`:D}
    `}onChange(e){this.checked=e.target.checked,this.afterChange(),this.dispatchEvent(new CustomEvent(`hpu-change`,{detail:{checked:this.checked},bubbles:!0,composed:!0}))}afterChange(){}updated(){this.internals.setFormValue(this.checked?this.value:null);let e=this.input??void 0;this.error?this.internals.setValidity({customError:!0},this.error,e):this.required&&!this.checked&&!this.disabled?this.internals.setValidity({valueMissing:!0},L(`common.required`),e):this.internals.setValidity({})}get validity(){return this.internals.validity}get validationMessage(){return this.internals.validationMessage}checkValidity(){return this.internals.checkValidity()}reportValidity(){return this.internals.reportValidity()}focus(e){this.input?.focus(e)}formDisabledCallback(e){this.disabled=e}formResetCallback(){this.checked=this.hasAttribute(`checked`)}};I([j({type:Boolean,reflect:!0})],H.prototype,`checked`,void 0),I([j({type:Boolean,reflect:!0})],H.prototype,`disabled`,void 0),I([j({type:Boolean,reflect:!0})],H.prototype,`required`,void 0),I([j({type:Boolean,reflect:!0})],H.prototype,`compact`,void 0),I([j()],H.prototype,`name`,void 0),I([j()],H.prototype,`value`,void 0),I([j()],H.prototype,`label`,void 0),I([j()],H.prototype,`hint`,void 0),I([j()],H.prototype,`error`,void 0);var ht=o`
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
`,gt=class extends H{constructor(...e){super(...e),this.indeterminate=!1}static{this.styles=[ht,o`
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
    `]}extraInputProps(){return{indeterminate:this.indeterminate}}afterChange(){this.indeterminate=!1}renderVisual(){return T`<span class="visual"
      ><hpu-icon .path=${this.indeterminate?pt:ut}></hpu-icon
    ></span>`}};I([j({type:Boolean,reflect:!0})],gt.prototype,`indeterminate`,void 0),gt=I([F(`hpu-checkbox`)],gt);var _t=class extends A{constructor(...e){super(...e),this.min=``,this.gap=`4`}static{this.styles=o`
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
  `}updated(){/^\d+(\.\d+)?(px|rem|em|ch|%|vw)$/.test(this.min)?this.style.setProperty(`--hpu-grid-min`,this.min):this.style.removeProperty(`--hpu-grid-min`)}render(){return T`<slot></slot>`}};I([j()],_t.prototype,`min`,void 0),I([j({reflect:!0})],_t.prototype,`gap`,void 0),_t=I([F(`hpu-grid`)],_t);var U=class extends A{constructor(...e){super(...e),this.path=``,this.name=``,this.label=``,this.variant=`text`,this.tone=`gray`,this.size=`md`,this.disabled=!1,this.mirrorRtl=!1}static{this.shadowRootOptions={...A.shadowRootOptions,delegatesFocus:!0}}static{this.styles=[N,P,qe,o`
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
    `]}firstUpdated(){this.label||console.warn("hpu-icon-button: `label` is required for icon-only controls")}render(){return T`<button
      class="control"
      part="control"
      type="button"
      aria-label=${this.label||D}
      title=${this.label||D}
      aria-expanded=${z(this.expanded)}
      aria-haspopup=${z(this.haspopup)}
      ?disabled=${this.disabled}
      @click=${this.#e}
    >
      <hpu-icon
        .path=${this.path}
        .name=${this.name}
        ?mirror-rtl=${this.mirrorRtl}
        size=${this.size}
      ></hpu-icon>
    </button>`}#e(e){if(this.disabled)return e.stopImmediatePropagation();this.dispatchEvent(new CustomEvent(`hpu-click`,{bubbles:!0,composed:!0}))}};I([j()],U.prototype,`expanded`,void 0),I([j()],U.prototype,`haspopup`,void 0),I([j()],U.prototype,`path`,void 0),I([j()],U.prototype,`name`,void 0),I([j()],U.prototype,`label`,void 0),I([j({reflect:!0})],U.prototype,`variant`,void 0),I([j({reflect:!0})],U.prototype,`tone`,void 0),I([j({reflect:!0})],U.prototype,`size`,void 0),I([j({type:Boolean,reflect:!0})],U.prototype,`disabled`,void 0),I([j({type:Boolean,attribute:`mirror-rtl`})],U.prototype,`mirrorRtl`,void 0),U=I([F(`hpu-icon-button`)],U);var vt=0,W=class extends A{constructor(...e){super(...e),this.internals=this.attachInternals(),this.uid=`hpu-field-${vt++}`,this.label=``,this.hint=``,this.error=``,this.name=``,this.value=``,this.placeholder=``,this.hideLabel=!1,this.required=!1,this.disabled=!1,this.readonly=!1,this.size=`md`}static{this.formAssociated=!0}static{this.styles=[P,o`
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
    `]}get control(){return this.renderRoot.querySelector(`.control`)}render(){let e=`${this.uid}-hint`,t=`${this.uid}-error`,n=[this.hint?e:``,this.error?t:``].filter(Boolean).join(` `)||void 0;return T`
      ${this.label?T`<label class=${this.hideLabel?`label vh`:`label`} for=${this.uid}
              >${this.label}${this.required?T`<span class="required" aria-hidden="true">*</span>`:D}</label
            >`:D}
      ${this.renderControl({id:this.uid,describedBy:n})}
      ${this.hint?T`<p class="hint" id=${e}>${this.hint}</p>`:D}
      ${this.error?T`<p class="error" id=${t} role="alert">
              <hpu-icon .path=${lt} size="xs"></hpu-icon>${this.error}
            </p>`:D}
    `}onInput(e){this.value=e.target.value,this.dispatchEvent(new CustomEvent(`hpu-input`,{detail:{value:this.value},bubbles:!0,composed:!0}))}onChange(e){this.value=e.target.value,this.dispatchEvent(new CustomEvent(`hpu-change`,{detail:{value:this.value},bubbles:!0,composed:!0}))}get validity(){return this.internals.validity}get validationMessage(){return this.internals.validationMessage}checkValidity(){return this.internals.checkValidity()}reportValidity(){return this.internals.reportValidity()}focus(e){this.control?.focus(e)}updated(e){this.internals.setFormValue(this.value);let t=this.control??void 0;this.error?this.internals.setValidity({customError:!0},this.error,t):this.required&&!this.value&&!this.disabled?this.internals.setValidity({valueMissing:!0},L(`common.required`),t):this.internals.setValidity({})}formDisabledCallback(e){this.disabled=e}formResetCallback(){this.value=this.getAttribute(`value`)??``}};I([j()],W.prototype,`label`,void 0),I([j()],W.prototype,`hint`,void 0),I([j()],W.prototype,`error`,void 0),I([j()],W.prototype,`name`,void 0),I([j()],W.prototype,`value`,void 0),I([j()],W.prototype,`placeholder`,void 0),I([j({type:Boolean,attribute:`hide-label`})],W.prototype,`hideLabel`,void 0),I([j({type:Boolean,reflect:!0})],W.prototype,`required`,void 0),I([j({type:Boolean,reflect:!0})],W.prototype,`disabled`,void 0),I([j({type:Boolean,reflect:!0})],W.prototype,`readonly`,void 0),I([j({reflect:!0})],W.prototype,`size`,void 0);var G=class extends W{constructor(...e){super(...e),this.type=`text`,this.autocomplete=``,this.inputmode=``,this.pattern=``,this.icon=``}static{this.styles=[...W.styles,o`
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
    `]}renderControl({id:e,describedBy:t}){let n=T`<input
      class=${this.icon?`control has-icon`:`control`}
      part="control"
      id=${e}
      .type=${this.type}
      .value=${this.value}
      name=${this.name||D}
      placeholder=${this.placeholder||D}
      autocomplete=${this.autocomplete||D}
      inputmode=${this.inputmode||D}
      pattern=${this.pattern||D}
      maxlength=${z(this.maxlength)}
      ?required=${this.required}
      ?disabled=${this.disabled}
      ?readonly=${this.readonly}
      aria-invalid=${this.error?`true`:`false`}
      aria-describedby=${z(t)}
      @input=${this.onInput}
      @change=${this.onChange}
    />`;return this.icon?T`<span class="wrap"
          ><span class="icon"><hpu-icon .path=${this.icon}></hpu-icon></span>${n}</span
        >`:n}};I([j()],G.prototype,`type`,void 0),I([j()],G.prototype,`autocomplete`,void 0),I([j()],G.prototype,`inputmode`,void 0),I([j()],G.prototype,`pattern`,void 0),I([j({type:Number})],G.prototype,`maxlength`,void 0),I([j()],G.prototype,`icon`,void 0),G=I([F(`hpu-input`)],G);function yt(e,t,n={}){let r=n.gap??4,i=n.margin??8,a=()=>{let a=e.getBoundingClientRect(),o=document.documentElement.clientWidth,s=document.documentElement.clientHeight,c=getComputedStyle(e).direction===`rtl`;Object.assign(t.style,{position:`fixed`,inset:`auto`,margin:`0`,minInlineSize:n.matchWidth?`${a.width}px`:``,maxBlockSize:``});let l=t.getBoundingClientRect(),u=s-a.bottom-r-i,d=a.top-r-i,f=l.height>u&&d>u,p=Math.max(f?d:u,80);t.style.maxBlockSize=`${p}px`;let m=Math.min(l.height,p),h=f?a.top-r-m:a.bottom+r,g=n.align===`end`===c?a.left:a.right-l.width;g=Math.min(Math.max(g,i),Math.max(i,o-l.width-i)),t.style.top=`${Math.round(h)}px`,t.style.left=`${Math.round(g)}px`};a();let o=()=>a();window.addEventListener(`resize`,o),window.addEventListener(`scroll`,o,!0);let s=new ResizeObserver(o);return s.observe(e),()=>{s.disconnect(),window.removeEventListener(`resize`,o),window.removeEventListener(`scroll`,o,!0)}}var K=class extends W{constructor(...e){super(...e),this.options=[],this.values=[],this.multiple=!1,this.searchable=!1,this.clearable=!1,this.native=!1,this.allowCustom=!1,this.open=!1,this.search=``,this.active=-1,this.loading=!1,this.#e=new Map,this.#n=0,this.#i=``,this.#g=e=>{e.composedPath().includes(this)||this.#h()}}#e;#t;#n;#r;#i;#a;static{this.styles=[...W.styles,o`
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
    `]}get control(){return this.renderRoot.querySelector(`.inner, .native`)}get#o(){return this.searchable||!!this.loadOptions}get#s(){return this.loadOptions?this.loaded??[]:this.options}get#c(){let e=this.search.trim().toLowerCase();return this.loadOptions||!this.#o||!e?this.#s:this.#s.filter(t=>t.label.toLowerCase().includes(e))}get#l(){return this.multiple?this.values:this.value?[this.value]:[]}#u(e){return this.#e.get(e)??(this.allowCustom?e:``)}willUpdate(e){if(e.has(`options`)||e.has(`loaded`))for(let e of this.#s)this.#e.set(e.value,e.label)}renderControl({id:e,describedBy:t}){return this.native?this.#d(e,t):this.#f(e,t)}#d(e,t){return T`<span class="native-wrap"
      ><select
        class="native"
        id=${e}
        name=${this.name||D}
        ?required=${this.required}
        ?disabled=${this.disabled}
        aria-invalid=${this.error?`true`:`false`}
        aria-describedby=${z(t)}
        @input=${this.onInput}
        @change=${this.onChange}
      >
        ${this.placeholder?T`<option value="" ?selected=${!this.value}>${this.placeholder}</option>`:D}
        ${this.options.map(e=>T`<option
              value=${e.value}
              ?disabled=${e.disabled}
              ?selected=${e.value===this.value}
            >
              ${e.label}
            </option>`)}</select
      ><hpu-icon class="native-chevron" .path=${dt} aria-hidden="true"></hpu-icon
    ></span>`}#f(e,t){let n=this.#l,r=`${this.uid}-list`,i=this.#c,a=this.open&&this.active>=0?`${this.uid}-opt-${this.active}`:void 0,o=this.clearable&&!this.disabled&&!this.readonly&&n.length>0,s=!this.multiple,c=this.open&&this.#o,l=c?this.search:s&&n[0]?this.#u(n[0]):``,u=s&&c&&n[0]?this.#u(n[0]):n.length?``:this.placeholder;return T`
      <div
        class="box ${this.error?`invalid`:``} ${this.open?`open`:``}"
        part="control"
        @pointerdown=${this.#v}
        @click=${this.#y}
      >
        <div class="content">
          ${this.multiple?this.values.map(e=>T`<span class="tag"
                      >${this.#u(e)}<hpu-icon-button
                        .path=${ft}
                        .label=${L(`select.remove`,{label:this.#u(e)})}
                        size="xs"
                        ?disabled=${this.disabled}
                        @hpu-click=${()=>this.#k(e)}
                      ></hpu-icon-button
                    ></span>`):D}
          <input
            class="inner"
            id=${e}
            role="combobox"
            autocomplete="off"
            aria-haspopup="listbox"
            aria-expanded=${this.open?`true`:`false`}
            aria-controls=${r}
            aria-autocomplete=${this.#o?`list`:`none`}
            aria-activedescendant=${z(a)}
            aria-invalid=${this.error?`true`:`false`}
            aria-required=${this.required?`true`:D}
            aria-describedby=${z(t)}
            .value=${l}
            placeholder=${u||D}
            ?readonly=${!this.#o||this.readonly}
            ?disabled=${this.disabled}
            @keydown=${this.#S}
            @input=${this.#w}
            @blur=${this.#T}
          />
        </div>
        <div class="end">
          ${o?T`<hpu-icon-button
                  .path=${ft}
                  .label=${L(`select.clear`)}
                  size="xs"
                  @hpu-click=${this.#A}
                ></hpu-icon-button>`:D}
          <hpu-icon class="chevron" .path=${dt} aria-hidden="true"></hpu-icon>
        </div>
      </div>
      <div class="popup" popover="manual" @pointerdown=${e=>e.preventDefault()}>
        <ul
          role="listbox"
          id=${r}
          aria-multiselectable=${this.multiple?`true`:D}
          aria-label=${this.label||D}
        >
          ${this.#p(i)}
        </ul>
        ${this.loading?T`<div class="empty" role="status">
                <hpu-spinner size="sm"></hpu-spinner>${L(`select.loading`)}
              </div>`:i.length?D:T`<div class="empty" role="status">${L(`select.no_results`)}</div>`}
      </div>
    `}#p(e){let t=new Set(this.#l),n=(e,n)=>T`<li
        class="option ${n===this.active?`active`:``}"
        role="option"
        id="${this.uid}-opt-${n}"
        aria-selected=${t.has(e.value)?`true`:`false`}
        aria-disabled=${e.disabled?`true`:D}
        @click=${()=>this.#D(e)}
        @pointermove=${()=>!e.disabled&&(this.active=n)}
      >
        <span>${e.label}</span>
        ${t.has(e.value)?T`<hpu-icon .path=${ut} size="sm"></hpu-icon>`:D}
      </li>`,r=[],i=0;for(;i<e.length;){let t=e[i].group;if(!t){r.push(n(e[i],i)),i++;continue}let a=i,o=[];for(;i<e.length&&e[i].group===t;)o.push(n(e[i],i)),i++;let s=`${this.uid}-group-${a}`;r.push(T`<li role="presentation">
          <div class="group-label" id=${s}>${t}</div>
          <ul role="group" aria-labelledby=${s}>
            ${o}
          </ul>
        </li>`)}return r}#m(){if(this.disabled||this.readonly||this.native||this.open)return;this.search=``,this.open=!0;let e=this.#c.findIndex(e=>this.#l.includes(e.value));this.active=e>=0?e:this.#b(-1,1),this.loadOptions&&this.#E(``)}#h(){this.open&&(this.open=!1,this.active=-1,this.search=``,clearTimeout(this.#r),this.#n++,this.loading=!1)}#g;updated(e){if(super.updated(e),this.multiple&&!this.native){if(this.name){let e=new FormData;for(let t of this.values)e.append(this.name,t);this.internals.setFormValue(e)}let e=this.control??void 0;this.error?this.internals.setValidity({customError:!0},this.error,e):this.required&&!this.values.length&&!this.disabled?this.internals.setValidity({valueMissing:!0},L(`common.required`),e):this.internals.setValidity({})}e.has(`open`)&&this.open&&this.active<0&&(this.active=this.#b(-1,1));let t=this.popup;if(t){if(this.open){t.matches(`:popover-open`)||(t.showPopover(),document.addEventListener(`pointerdown`,this.#g,!0)),this.#t?.();let e=this.renderRoot.querySelector(`.box`);this.#t=yt(e,t,{matchWidth:!0}),this.renderRoot.querySelector(`#${this.uid}-opt-${this.active}`)?.scrollIntoView({block:`nearest`})}else t.matches(`:popover-open`)&&this.#_()}}#_(){this.#t?.(),this.#t=void 0,document.removeEventListener(`pointerdown`,this.#g,!0);try{this.popup?.hidePopover()}catch{}}disconnectedCallback(){super.disconnectedCallback(),this.#_(),clearTimeout(this.#r),clearTimeout(this.#a)}#v(e){let t=e.target;t===this.control||t.closest(`hpu-icon-button`)||e.preventDefault()}#y(e){this.disabled||e.target.closest(`hpu-icon-button`)||(this.control?.focus(),this.open&&!this.#o||this.open&&e.target.closest(`.chevron`)?this.#h():this.#m())}#b(e,t){let n=this.#c;for(let r=e+t;r>=0&&r<n.length;r+=t)if(!n[r].disabled)return r;return e>=0&&e<n.length&&!n[e].disabled?e:-1}#x(e){this.active=this.#b(this.active,e)}#S(e){if(this.disabled||this.readonly)return;let t=this.open;switch(e.key){case`ArrowDown`:case`ArrowUp`:e.preventDefault(),t?this.#x(e.key===`ArrowDown`?1:-1):this.#m();break;case`Home`:case`End`:if(t&&!this.#o){e.preventDefault();let t=this.#c.length;this.active=e.key===`Home`?this.#b(-1,1):this.#b(t,-1)}break;case`Enter`:if(t){e.preventDefault();let t=this.#c[this.active];t?this.#D(t):this.allowCustom&&this.search.trim()?this.#O():this.#h()}else this.#o||(e.preventDefault(),this.#m());break;case` `:if(!this.#o){e.preventDefault();let n=this.#c[this.active];t&&n?this.#D(n):t?this.#h():this.#m()}break;case`Escape`:t&&(e.preventDefault(),e.stopPropagation(),this.#h());break;case`Tab`:t&&this.#h();break;case`Backspace`:this.multiple&&!this.search&&this.values.length&&this.#k(this.values[this.values.length-1]);break;default:this.#o||e.key.length!==1||e.ctrlKey||e.metaKey||e.altKey||this.#C(e.key)}}#C(e){clearTimeout(this.#a),this.#i+=e.toLowerCase(),this.#a=setTimeout(()=>this.#i=``,500),this.open||this.#m();let t=this.#c,n=e=>t.findIndex((t,n)=>n>=e&&!t.disabled&&t.label.toLowerCase().startsWith(this.#i)),r=n(this.#i.length>1?Math.max(this.active,0):this.active+1);this.active=r>=0?r:n(0)>=0?n(0):this.active}#w(e){this.#o&&(this.search=e.target.value,this.open||this.#m(),this.search=e.target.value,this.active=this.#b(-1,1),this.dispatchEvent(new CustomEvent(`hpu-search`,{detail:{search:this.search},bubbles:!0,composed:!0})),this.loadOptions&&(clearTimeout(this.#r),this.#r=setTimeout(()=>void this.#E(this.search),250)))}#T(){this.allowCustom&&this.open&&this.search.trim()?this.#O():this.#h()}async#E(e){let t=++this.#n;this.loading=!0;try{let n=await this.loadOptions(e);t===this.#n&&(this.loaded=n)}catch{t===this.#n&&(this.loaded=[])}finally{t===this.#n&&(this.loading=!1,this.open&&(this.active=this.#b(-1,1)))}}#D(e){e.disabled||(this.#e.set(e.value,e.label),this.multiple?(this.values=this.values.includes(e.value)?this.values.filter(t=>t!==e.value):[...this.values,e.value],this.search=``,this.#j(),this.control?.focus()):(this.value=e.value,this.#h(),this.#j()))}#O(){let e=this.search.trim();this.multiple?this.values.includes(e)||(this.values=[...this.values,e]):this.value=e,this.search=``,this.#h(),this.#j()}#k(e){this.values=this.values.filter(t=>t!==e),this.#j(),this.control?.focus()}#A(){this.multiple?this.values=[]:this.value=``,this.#j(),this.control?.focus()}#j(){let e=this.multiple?{values:this.values}:{value:this.value};this.dispatchEvent(new CustomEvent(`hpu-change`,{detail:e,bubbles:!0,composed:!0}))}formResetCallback(){super.formResetCallback(),this.values=[]}};I([j({attribute:!1})],K.prototype,`options`,void 0),I([j({attribute:!1})],K.prototype,`values`,void 0),I([j({type:Boolean,reflect:!0})],K.prototype,`multiple`,void 0),I([j({type:Boolean,reflect:!0})],K.prototype,`searchable`,void 0),I([j({type:Boolean,reflect:!0})],K.prototype,`clearable`,void 0),I([j({type:Boolean,reflect:!0})],K.prototype,`native`,void 0),I([j({type:Boolean,attribute:`allow-custom`})],K.prototype,`allowCustom`,void 0),I([j({attribute:!1})],K.prototype,`loadOptions`,void 0),I([j({type:Boolean,reflect:!0})],K.prototype,`open`,void 0),I([M()],K.prototype,`search`,void 0),I([M()],K.prototype,`active`,void 0),I([M()],K.prototype,`loading`,void 0),I([M()],K.prototype,`loaded`,void 0),I([Re(`.popup`)],K.prototype,`popup`,void 0),K=I([F(`hpu-select`)],K);var q=class extends A{constructor(...e){super(...e),this.label=``,this.value=``,this.unit=``,this.meta=``,this.icon=``,this.tone=`gray`,this.clickable=!1,this.selected=!1,this.detail=``}static{this.shadowRootOptions={...A.shadowRootOptions,delegatesFocus:!0}}static{this.styles=[N,qe,o`
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
      ${a(ze.map(e=>`.detail[data-tone='${e}'] { color: var(--hpu-${e}-text); }`).join(`
`))}
      .visual {
        margin-block-start: auto;
        padding-block-start: var(--hpu-space-3);
      }
      .visual:not(:has(::slotted(*))) {
        padding-block-start: 0;
      }
    `]}render(){let e=T`
      <div class="top">
        <span>${this.label}</span>
        ${this.icon?T`<hpu-icon .path=${this.icon}></hpu-icon>`:D}
      </div>
      <div class="value">
        ${this.value}${this.unit?T`<span class="unit">${this.unit}</span>`:D}
      </div>
      ${this.meta?T`<div class="meta">${this.meta}</div>`:D}
      ${this.detail?T`<div class="detail" data-tone=${z(this.detailTone)}>${this.detail}</div>`:D}
      <div class="visual"><slot name="visual"></slot></div>
    `;return this.clickable?T`<button
          class="card control"
          type="button"
          aria-label=${z(this.accessibleLabel)}
          aria-haspopup=${z(this.haspopup)}
          aria-expanded=${z(this.expanded)}
          aria-pressed=${z(this.haspopup?void 0:this.selected?`true`:`false`)}
          @click=${this.#e}
        >
          ${e}
        </button>`:T`<div class="card">${e}</div>`}#e(){this.dispatchEvent(new CustomEvent(`hpu-activate`,{bubbles:!0,composed:!0}))}};I([j()],q.prototype,`label`,void 0),I([j()],q.prototype,`value`,void 0),I([j()],q.prototype,`unit`,void 0),I([j()],q.prototype,`meta`,void 0),I([j()],q.prototype,`icon`,void 0),I([j({reflect:!0})],q.prototype,`tone`,void 0),I([j({type:Boolean,reflect:!0})],q.prototype,`clickable`,void 0),I([j({type:Boolean,reflect:!0})],q.prototype,`selected`,void 0),I([j()],q.prototype,`detail`,void 0),I([j({attribute:`detail-tone`})],q.prototype,`detailTone`,void 0),I([j({attribute:`accessible-label`})],q.prototype,`accessibleLabel`,void 0),I([j()],q.prototype,`haspopup`,void 0),I([j()],q.prototype,`expanded`,void 0),q=I([F(`hpu-stat-card`)],q);function bt(e,t){let n=t?.darkMode===!0;return n&&e.dataset.theme!==`dark`?e.dataset.theme=`dark`:!n&&`theme`in e.dataset&&delete e.dataset.theme,n}var xt=e=>e.trim().toLowerCase();function St(e,t){let n=new Set(t.map(xt));return e.filter(e=>!n.has(xt(e.name)))}function Ct(e,t){return e.filter(e=>!t.has(e.name))}function wt(e,t){let n=Ct(e,t).length;return n===e.length?`all`:n===0?`none`:`partial`}async function Tt(e){return e.connection.sendMessagePromise({type:`ready_home/settings`})}async function Et(e,t){return e.connection.subscribeMessage(t,{type:`ready_home/subscribe`})}async function Dt(e,t){return e.connection.sendMessagePromise({type:`ready_home/barcode/lookup`,barcode:t})}async function Ot(e){return(await e.connection.sendMessagePromise({type:`ready_home/kit_templates/list`})).templates}var kt=new Set([`ean_13`,`ean_8`,`upc_a`,`upc_e`,`code_128`]);function At(e,t){let n=e=>Math.round(e*1e4)/1e4;return e===`gram`&&t.calories_per_100g!=null?n(t.calories_per_100g/100):e===`kilogram`&&t.calories_per_100g!=null?n(t.calories_per_100g*10):e===`milliliter`&&t.calories_per_100ml!=null?n(t.calories_per_100ml/100):e===`liter`&&t.calories_per_100ml!=null?n(t.calories_per_100ml*10):null}function jt(e,t){return kt.has(e)?!0:/^\d{8,14}$/.test(t.trim())}function Mt(e){return!!e.auth?.external?.config?.hasBarCodeScanner}function Nt(e,t){let n=e.auth?.external;if(!n?.config?.hasBarCodeScanner)return{done:Promise.reject(Error(`No companion barcode scanner`)),abort:()=>{}};let r=!1,i,a=new Promise(e=>{i=e}),o=n.receiveMessage,s=e=>{if(!r){r=!0;try{n.fireMessage({type:`bar_code/close`})}catch{}finally{n.receiveMessage=o}i(e)}};return n.receiveMessage=e=>{let r=e;if(r?.type===`command`&&r.command===`bar_code/scan_result`){r.id!=null&&n.fireMessage({id:r.id,type:`result`,success:!0,result:null});let e=String(r.payload?.rawValue??``).trim(),i=String(r.payload?.format??`unknown`);if(e&&jt(i,e)){s(e);return}n.fireMessage({type:`bar_code/notify`,payload:{message:t?.rejectMessage??`Not a product barcode — try an EAN/UPC code`}})}else r?.type===`command`&&r.command===`bar_code/aborted`?(r.id!=null&&n.fireMessage({id:r.id,type:`result`,success:!0,result:null}),s(null)):o.call(n,e)},n.fireMessage({type:`bar_code/scan`,payload:{title:t?.title??`Scan barcode`,description:t?.description??`Point the camera at a product barcode`,alternative_option_label:t?.alternativeOptionLabel??`Enter manually`}}),{done:a,abort:()=>s(null)}}function Pt(e,t,n=`Food`){let r={...e},i=[t.brand,t.name].filter(Boolean).join(` `).trim();if(!(r.name||``).trim()&&i&&(r.name=i),(r.category||``).trim()||(r.category=n),!(r.contents_per_unit||``).trim()&&t.contents_per_unit!=null&&(r.contents_per_unit=String(t.contents_per_unit)),(r.contents_unit||``).trim()||(r.contents_unit=t.contents_unit?.trim()||`gram`),!(r.calories_per_content||``).trim()){let e=At(r.contents_unit,t);e!=null&&(r.calories_per_content=String(e))}return r}function J(e){if(e==null)return`Unknown error`;if(typeof e==`string`)return e;if(e instanceof Error)return e.message||String(e);if(typeof e==`object`){let t=e;if(typeof t.message==`string`&&t.message.trim())return t.message;if(typeof t.error==`string`&&t.error.trim())return t.error;if(t.error&&typeof t.error==`object`){let e=t.error;if(typeof e.message==`string`&&e.message.trim())return e.message}try{return JSON.stringify(e)}catch{return`Unknown error`}}return String(e)}function Ft(e){if(typeof e==`object`&&e){let t=e;if(t.code===`not_found`)return!0;let n=typeof t.message==`string`?t.message.toLowerCase():``;if(n.includes(`product not found`)||n.includes(`not found`))return!0}return!!(typeof e==`string`&&/not found/i.test(e))}var It=`No product found for this barcode.`;function Lt(e,t){let n=e.trim().toLowerCase();return!n||!t?`none`:(t.water_categories??[]).some(e=>e.trim().toLowerCase()===n)?`water`:(t.food_categories??[]).some(e=>e.trim().toLowerCase()===n)?`food`:(t.pet_food_categories??[]).some(e=>e.trim().toLowerCase()===n)?`pet_food`:`none`}function Rt(e){return e===`food`||e===`none`}function Y(e){let t=e.trim().replace(`,`,`.`);return t?Number(t):NaN}function zt(e){let t=Number(e);return Number.isNaN(t)?`—`:Math.abs(t-Math.round(t))<.05?String(Math.round(t)):String(Math.round(t*100)/100)}function Bt(e,t){return t===`liter`?e:t===`milliliter`?e/1e3:null}function Vt(e){if(e.contents_per_unit!=null&&e.contents_unit){let t=Bt(e.contents_per_unit,e.contents_unit);if(t!=null)return e.quantity*t}return e.unit===`liter`?e.quantity:e.unit===`milliliter`?e.quantity/1e3:e.liters_per_unit==null?null:e.quantity*e.liters_per_unit}function Ht(e,t){return t===`gram`?e:t===`kilogram`?e*1e3:null}function Ut(e){if(e.contents_per_unit!=null&&e.contents_unit){let t=Ht(e.contents_per_unit,e.contents_unit);if(t!=null)return e.quantity*t}return e.unit===`gram`?e.quantity:e.unit===`kilogram`?e.quantity*1e3:null}function Wt(e){return e.contents_per_unit!=null&&e.calories_per_content!=null?e.quantity*e.contents_per_unit*e.calories_per_content:e.calories_per_unit==null?null:e.quantity*e.calories_per_unit}function Gt(e,t){if(t===`food`){let t=Wt(e);return t==null?``:`${zt(t)} kcal`}if(t===`water`){let t=Vt(e);return t==null?``:`${zt(t)} L`}if(t===`pet_food`){let t=Ut(e);return t==null?``:`${zt(t)} g`}let n=[],r=Wt(e);r!=null&&n.push(`${zt(r)} kcal`);let i=Vt(e);return i!=null&&n.push(`${zt(i)} L`),n.join(` · `)}function Kt(e,t){let n={},r=t.contents_per_unit.trim(),i=t.contents_unit.trim(),a=t.calories_per_content.trim(),o=Y(r),s=Y(a);if(e===`food`||e===`water`||e===`pet_food`)(r===``||Number.isNaN(o)||o<=0)&&(n.contents_per_unit=`Contents per unit is required`),i?e===`water`&&i!==`liter`&&i!==`milliliter`?n.contents_unit=`Water contents must be liter or milliliter`:e===`pet_food`&&i!==`gram`&&i!==`kilogram`&&(n.contents_unit=`Pet food contents must be gram or kilogram`):n.contents_unit=`Contents unit is required`;else{let e=r!==``,t=!!i;(e||t)&&((!e||Number.isNaN(o)||o<=0)&&(n.contents_per_unit=`Enter contents per unit or clear both fields`),t||(n.contents_unit=`Select a contents unit or clear both fields`))}return e===`food`?(a===``||Number.isNaN(s)||s<0)&&(n.calories_per_content=`Calories per contents unit is required`):e===`none`&&a!==``&&(Number.isNaN(s)||s<0)&&(n.calories_per_content=`Enter a valid calorie value`),n}function qt(e,t){let n={},r=t.contents_per_unit.trim(),i=t.contents_unit.trim(),a=t.calories_per_content.trim();return e===`water`||e===`pet_food`?(n.contents_per_unit=Y(r),n.contents_unit=i,n.calories_per_content=null,n.calories_per_unit=null,n):e===`food`?(n.contents_per_unit=Y(r),n.contents_unit=i,n.calories_per_content=Y(a),n):(r&&i?(n.contents_per_unit=Y(r),n.contents_unit=i):(n.contents_per_unit=null,n.contents_unit=null,n.liters_per_unit=null),a?n.calories_per_content=Y(a):(n.calories_per_content=null,n.calories_per_unit=null),n)}function Jt(e,t){return t?t.expired.some(t=>t.id===e.id)?`expired`:t.within_urgent.some(t=>t.id===e.id)?`urgent`:t.within_expiring.some(t=>t.id===e.id)?`expiring`:t.low_stock.some(t=>t.id===e.id)?`low`:``:``}function Yt(e,t,n,r){let i=[...e],a=r.search.trim().toLowerCase();if(a&&(i=i.filter(e=>e.name.toLowerCase().includes(a)||e.location.toLowerCase().includes(a)||e.category.toLowerCase().includes(a)||(e.barcode||``).toLowerCase().includes(a)||(e.notes||``).toLowerCase().includes(a))),r.filterLocation&&(i=i.filter(e=>e.location.toLowerCase()===r.filterLocation.toLowerCase())),r.filterCategory&&(i=i.filter(e=>e.category.toLowerCase()===r.filterCategory.toLowerCase())),r.filterReadiness&&(i=i.filter(e=>Lt(e.category,n)===r.filterReadiness)),r.filterStatus!==`all`){let e=new Set;r.filterStatus===`expired`?t?.expired.forEach(t=>e.add(t.id)):r.filterStatus===`expiring`?(t?.within_urgent.forEach(t=>e.add(t.id)),t?.within_expiring.forEach(t=>e.add(t.id))):r.filterStatus===`low_stock`&&t?.low_stock.forEach(t=>e.add(t.id)),i=i.filter(t=>e.has(t.id))}return i.sort((e,t)=>r.sort===`quantity`?e.quantity-t.quantity:r.sort===`expiry`?(e.expiry_date||`9999`).localeCompare(t.expiry_date||`9999`):e.name.localeCompare(t.name)),i}function Xt(e){if(!e.canWrite)return{buttons:[],menu:[]};let t=[`scan`,`add_from_template`];return e.hasRestockList&&t.push(`push_restock`),e.narrow?{buttons:[`add_item`],menu:t}:{buttons:[...t,`add_item`],menu:[]}}function Zt(e){return{id:e.id,name:e.name,type:e.type??``,foodPerDay:e.food_grams_per_day,waterPerDay:e.water_liters_per_day}}function Qt(e){return{key:e.key,count:e.count,caloriesPerPerson:e.calories_per_day,waterPerPerson:e.water_liters_per_day,caloriesSubtotal:e.count*e.calories_per_day,waterSubtotal:e.count*e.water_liters_per_day}}function $t(e){if(!e)return null;let t=(e.age_categories&&e.age_categories.length>0?e.age_categories:e.number_of_people==null?[]:[{key:`adults`,count:e.number_of_people,calories_per_day:e.calories_per_person_per_day,water_liters_per_day:e.water_liters_per_person_per_day}]).map(Qt);if(t.reduce((e,t)=>e+t.count,0)<=0)return null;let n=(e.pets??[]).map(Zt),r=n.reduce((e,t)=>e+t.waterPerDay,0);return{rows:t,pets:n,dailyCalories:t.reduce((e,t)=>e+t.caloriesSubtotal,0),dailyWater:t.reduce((e,t)=>e+t.waterSubtotal,0)+r,dailyPetWater:r,dailyPetFood:n.reduce((e,t)=>e+t.foodPerDay,0),days:e.duration_hours/24}}function en(e){return{rows:e.rows.map(e=>({key:e.key,count:e.count,caloriesPerPerson:e.caloriesPerPerson,caloriesSubtotal:e.caloriesSubtotal})),dailyTotal:e.dailyCalories,periodTotal:e.dailyCalories*e.days,days:e.days}}function tn(e){return{rows:e.pets.map(e=>({id:e.id,name:e.name,type:e.type,foodPerDay:e.foodPerDay})),dailyTotal:e.dailyPetFood,periodTotal:e.dailyPetFood*e.days,days:e.days}}var nn={en:{"status.expired":`Expired`,"status.urgent":`Urgent`,"status.expiring":`Expiring`,"status.low":`Low stock`,"action.open_menu":`Open menu`,"action.more":`More actions`,"action.scan":`Scan`,"action.add_item":`Add item`,"action.add_from_template":`Add from template`,"action.push_restock":`Push restock list`,"action.close":`Close`,"action.save":`Save`,"action.cancel":`Cancel`,"action.delete":`Delete`,"action.lookup":`Lookup`,"action.edit":`Edit`,"stat.readiness":`Readiness`,"stat.water":`Water`,"stat.food":`Food`,"stat.pet_food":`Pet food`,"stat.completeness":`Completeness`,"completeness.title":`Completeness`,"readiness.title":`Readiness`,"readiness.open":`Explain readiness`,"readiness.explain":`Readiness shows how long your household could manage on the water, food and pet food you have in stock, compared with the target for your chosen number of days. The overall figure is the lowest of those percentages. It does not look at checklist items such as first aid or tools: Completeness covers those.`,"readiness.example":`Example: with 100% water and food but no first aid kit, readiness is 100% while completeness is lower.`,"completeness.explain":`Completeness shows how many of your checklist items are in stock at their desired quantity and not expired. Checklist items are the items with a desired quantity in categories other than food, water and pet food. It does not show how long your supplies would last: Readiness covers water, food and pet food.`,"completeness.example":`Example: 4 of 5 first aid items in stock gives 80% for that category.`,"completeness.open":`Show what is missing from completeness`,"completeness.overall":`Overall`,"completeness.all_complete":`Everything is complete.`,"completeness.category_complete":`Complete`,"completeness.expired":`expired`,"completeness.stock":`{quantity} of {desired}`,"household.food_title":`Food needs`,"household.pet_food_title":`Pet food needs`,"household.open_food":`Show food needs of the household`,"household.open_pet_food":`Show pet food needs`,"household.pet":`Pet`,"household.food_per_day":`Food per day`,"household.not_configured":`No household is set up yet.`,"household.category":`Category`,"household.count":`People`,"household.per_person":`Per person per day`,"household.subtotal":`Subtotal per day`,"household.total_per_day":`Total per day`,"household.total_period":`Total for {days} days`,"household.adults":`Adults (18–69)`,"household.children":`Children (4–17)`,"household.babies_toddlers":`Babies and toddlers (0–3)`,"household.seniors":`Seniors (70+)`,"household.pets":`Pets`,"household.pet_food_period":`Pet food for {days} days`,"stat.hours_suffix":`h`,"filter.search_placeholder":`Search inventory`,"filter.all_status":`All statuses`,"filter.all_location":`All locations`,"filter.all_category":`All categories`,"filter.all_readiness":`All readiness`,"filter.readiness_food":`Food`,"filter.readiness_water":`Water`,"filter.readiness_pet_food":`Pet food`,"filter.readiness_none":`Other`,"filter.sort":`Sort`,"empty.inventory":`No items yet. Add your first supply.`,"empty.filtered":`No items match these filters.`,"dialog.add_title":`Add item`,"dialog.edit_title":`Edit item`,"dialog.template_title":`Add from template`,"field.name":`Name`,"field.quantity":`Quantity`,"field.desired":`Desired`,"field.unit":`Unit`,"field.location":`Location`,"field.category":`Category`,"field.priority":`Priority`,"field.expiry":`Expiry`,"field.notes":`Notes`,"field.barcode":`Barcode`,"field.contents":`Contents per unit`,"field.contents_unit":`Contents unit`,"field.calories":`Calories per contents unit`,"priority.essential":`Essential`,"priority.important":`Important`,"priority.optional":`Optional`,"hint.measure_readiness":`These fields count toward readiness.`,"companion.scan_needed":`Scanning needs the Home Assistant Companion app. Enter the barcode and tap Lookup.`,"template.skip_existing":`Existing names are skipped.`,"template.items":`items`,"template.to_add":`{n} to add`,"template.none_missing":`Nothing missing: all items are already in your inventory.`,"template.select_all":`Select all`,"template.add_selected":`Add missing items ({n})`,"template.added_result":`Added {added}, skipped {skipped}.`,"error.generic":`Something went wrong`},nl:{"status.expired":`Verlopen`,"status.urgent":`Urgent`,"status.expiring":`Bijna verlopen`,"status.low":`Lage voorraad`,"action.open_menu":`Menu openen`,"action.more":`Meer acties`,"action.scan":`Scannen`,"action.add_item":`Item toevoegen`,"action.add_from_template":`Uit sjabloon`,"action.push_restock":`Aanvullijst sturen`,"action.close":`Sluiten`,"action.save":`Opslaan`,"action.cancel":`Annuleren`,"action.delete":`Verwijderen`,"action.lookup":`Opzoeken`,"action.edit":`Bewerken`,"stat.readiness":`Paraatheid`,"stat.water":`Water`,"stat.food":`Voedsel`,"stat.pet_food":`Huisdiervoer`,"stat.completeness":`Compleetheid`,"completeness.title":`Compleetheid`,"readiness.title":`Paraatheid`,"readiness.open":`Uitleg over paraatheid`,"readiness.explain":`Paraatheid laat zien hoe lang je huishouden toekan met de voorraad water, voedsel en huisdiervoer, vergeleken met het doel voor het gekozen aantal dagen. Het totaal is het laagste van die percentages. Checklist-items zoals EHBO of gereedschap tellen hier niet mee: die zie je bij Compleetheid.`,"readiness.example":`Voorbeeld: met 100% water en voedsel maar zonder EHBO-set is de paraatheid 100% en de compleetheid lager.`,"completeness.explain":`Compleetheid laat zien hoeveel van je checklist-items op voorraad zijn in de gewenste hoeveelheid en niet verlopen zijn. Checklist-items zijn items met een gewenste hoeveelheid in andere categorieën dan voedsel, water en huisdiervoer. Het zegt niets over hoe lang je voorraad meegaat: dat zie je bij Paraatheid.`,"completeness.example":`Voorbeeld: 4 van de 5 EHBO-items op voorraad geeft 80% voor die categorie.`,"completeness.open":`Toon wat er ontbreekt voor compleetheid`,"completeness.overall":`Totaal`,"completeness.all_complete":`Alles is compleet.`,"completeness.category_complete":`Compleet`,"completeness.expired":`verlopen`,"completeness.stock":`{quantity} van {desired}`,"household.food_title":`Voedselbehoefte`,"household.pet_food_title":`Huisdiervoerbehoefte`,"household.open_food":`Toon de voedselbehoefte van het huishouden`,"household.open_pet_food":`Toon de huisdiervoerbehoefte`,"household.pet":`Huisdier`,"household.food_per_day":`Voer per dag`,"household.not_configured":`Er is nog geen huishouden ingesteld.`,"household.category":`Categorie`,"household.count":`Personen`,"household.per_person":`Per persoon per dag`,"household.subtotal":`Subtotaal per dag`,"household.total_per_day":`Totaal per dag`,"household.total_period":`Totaal voor {days} dagen`,"household.adults":`Volwassenen (18–69)`,"household.children":`Kinderen (4–17)`,"household.babies_toddlers":`Baby’s en peuters (0–3)`,"household.seniors":`Ouderen (70+)`,"household.pets":`Huisdieren`,"household.pet_food_period":`Huisdiervoer voor {days} dagen`,"stat.hours_suffix":`u`,"filter.search_placeholder":`Zoek in voorraad`,"filter.all_status":`Alle statussen`,"filter.all_location":`Alle locaties`,"filter.all_category":`Alle categorieën`,"filter.all_readiness":`Alle paraatheid`,"filter.readiness_food":`Voedsel`,"filter.readiness_water":`Water`,"filter.readiness_pet_food":`Huisdiervoer`,"filter.readiness_none":`Overig`,"filter.sort":`Sorteren`,"empty.inventory":`Nog geen items. Voeg je eerste voorraad toe.`,"empty.filtered":`Geen items matchen deze filters.`,"dialog.add_title":`Item toevoegen`,"dialog.edit_title":`Item bewerken`,"dialog.template_title":`Uit sjabloon toevoegen`,"field.name":`Naam`,"field.quantity":`Hoeveelheid`,"field.desired":`Gewenst`,"field.unit":`Eenheid`,"field.location":`Locatie`,"field.category":`Categorie`,"field.priority":`Prioriteit`,"field.expiry":`Houdbaarheidsdatum`,"field.notes":`Notities`,"field.barcode":`Barcode`,"field.contents":`Inhoud per eenheid`,"field.contents_unit":`Inhoudseenheid`,"field.calories":`Calorieën per inhoudseenheid`,"priority.essential":`Essentieel`,"priority.important":`Belangrijk`,"priority.optional":`Optioneel`,"hint.measure_readiness":`Deze velden tellen mee voor paraatheid.`,"companion.scan_needed":`Scannen vereist de Home Assistant Companion-app. Voer de barcode in en tik op Opzoeken.`,"template.skip_existing":`Bestaande namen worden overgeslagen.`,"template.items":`items`,"template.to_add":`{n} toe te voegen`,"template.none_missing":`Niets ontbreekt: alle items staan al in je inventaris.`,"template.select_all":`Alles selecteren`,"template.add_selected":`Ontbrekende items toevoegen ({n})`,"template.added_result":`{added} toegevoegd, {skipped} overgeslagen.`,"error.generic":`Er ging iets mis`}};function rn(e){let t=e?.locale?.language||e?.language||`en`;return String(t).toLowerCase().split(`-`)[0]===`nl`?`nl`:`en`}function an(e,t,n){let r=nn[rn(e)][t]??nn.en[t]??t;if(n)for(let[e,t]of Object.entries(n))r=r.replaceAll(`{${e}}`,String(t));return r}function on(e,t){let n=`status.${t}`,r=an(e,n);return r===n?t:r}var sn={search:``,filterStatus:`all`,filterLocation:``,filterCategory:``,filterReadiness:``,filtersOpen:!1,sort:`name`},cn=`ready_home.panel.view`,ln=new Set([`name`,`expiry`,`quantity`]);function un(e){return e?`${cn}.${e}`:cn}function X(e,t){return typeof e==`string`?e:t}function dn(e,t){if(!e)return{...sn};try{let n=e.getItem(un(t));if(!n)return{...sn};let r=JSON.parse(n),i=X(r.sort,`name`);return{search:X(r.search,``),filterStatus:X(r.filterStatus,`all`),filterLocation:X(r.filterLocation,``),filterCategory:X(r.filterCategory,``),filterReadiness:X(r.filterReadiness,``),filtersOpen:!!r.filtersOpen,sort:ln.has(i)?i:`name`}}catch{return{...sn}}}function fn(e,t,n){if(e)try{e.setItem(un(n),JSON.stringify(t))}catch{}}function pn(e,t=``){let n=new Set,r=[];for(let i of[...e,t]){let e=i?.trim();if(!e)continue;let t=e.toLowerCase();n.has(t)||(n.add(t),r.push(e))}return r.sort((e,t)=>e.localeCompare(t,void 0,{sensitivity:`base`})),r}function mn(e,t){return e==null||Number.isNaN(Number(e))?``:Number(e)<=0?`bad`:Number(e)<Number(t)?`warn`:`ok`}function Z(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}var hn=`ready-home-panel`,gn=`/api/ready_home/brand`,_n=`${gn}/logo.png`,vn=`${gn}/logo@2x.png`,yn=`${gn}/dark_logo.png`,bn=`${gn}/dark_logo@2x.png`,xn=`M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z`,Sn=`M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z`,Q=`M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z`,Cn=`M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1Z`,wn=`M12,20A6,6 0 0,1 6,14C6,10 12,3.25 12,3.25C12,3.25 18,10 18,14A6,6 0 0,1 12,20Z`,Tn=`M18.06 23H19.72C20.56 23 21.25 22.35 21.35 21.53L23 5.05H18V1H16.03V5.05H11.06L11.36 7.39C13.07 7.86 14.67 8.71 15.63 9.65C17.07 11.07 18.06 12.54 18.06 14.94V23M1 22V21H16.03V22C16.03 22.54 15.58 23 15 23H2C1.45 23 1 22.54 1 22M16.03 15C16.03 7 1 7 1 15H16.03M1 17H16V19H1V17Z`,En=`M8.35,3C9.53,2.83 10.78,4.12 11.14,5.9C11.5,7.67 10.85,9.25 9.67,9.43C8.5,9.61 7.24,8.32 6.88,6.54C6.5,4.77 7.17,3.19 8.35,3M15.5,3C16.69,3.19 17.35,4.77 17,6.54C16.62,8.32 15.37,9.61 14.19,9.43C13,9.25 12.35,7.67 12.71,5.9C13.08,4.12 14.33,2.83 15.5,3M3,7.6C4.14,7.11 5.69,8 6.5,9.55C7.26,11.13 7,12.79 5.87,13.28C4.74,13.77 3.2,12.89 2.41,11.32C1.62,9.75 1.9,8.08 3,7.6M21,7.6C22.1,8.08 22.38,9.75 21.59,11.32C20.8,12.89 19.26,13.77 18.13,13.28C17,12.79 16.74,11.13 17.5,9.55C18.31,8 19.86,7.11 21,7.6M19.33,18.38C19.37,19.32 18.65,20.36 17.79,20.75C16,21.57 13.88,19.87 11.89,19.87C9.9,19.87 7.76,21.64 6,20.75C5,20.26 4.31,18.96 4.44,17.88C4.62,16.39 6.41,15.59 7.47,14.5C8.88,13.09 9.88,10.44 11.89,10.44C13.89,10.44 14.95,13.05 16.3,14.5C17.41,15.72 19.26,16.75 19.33,18.38Z`,Dn=`M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3Z`,On=[`box`,`pack`,`piece`],kn=[`gram`,`kilogram`,`liter`,`milliliter`],An=[`essential`,`important`,`optional`];function jn(e){return e&&e.charAt(0).toUpperCase()+e.slice(1)}var Mn=6e3,Nn=!1;function Pn(){Nn||(Nn=!0,Ke(document))}var $=class extends A{constructor(...e){super(...e),this.narrow=!1,this._snapshot=null,this._settings=null,this._search=``,this._filterStatus=`all`,this._filterLocation=``,this._filterCategory=``,this._filterReadiness=``,this._filtersOpen=!1,this._sort=`name`,this._dialogOpen=!1,this._editing=null,this._form={},this._error=``,this._barcodeError=``,this._fieldErrors={},this._saving=!1,this._scanning=!1,this._pendingRemoveIds=[],this._completenessOpen=!1,this._moreOpen=!1,this._readinessOpen=!1,this._householdModal=null,this._templateOpen=!1,this._templates=[],this._templateBusy=!1,this._templateUnchecked={},this._templateNotice=``,this._templateNoticeTimer=null,this._unsub=null,this._connected=!1,this._scanHandle=null,this._viewHydrated=!1,this._resetFilters=()=>{this._filterLocation=``,this._filterCategory=``,this._filterReadiness=``,this._persistViewState()},this._toggleMenu=e=>{e?.stopPropagation(),this.dispatchEvent(new CustomEvent(`hass-toggle-menu`,{bubbles:!0,composed:!0}))},this._toggleMore=()=>{this._moreOpen?this._closeMore():(this._moreOpen=!0,document.addEventListener(`click`,this._onDocumentClick),this.updateComplete.then(()=>this._moreItems()[0]?.focus()))},this._onDocumentClick=e=>{let t=this.shadowRoot?.querySelector(`.more`);t&&e.composedPath().includes(t)||this._closeMore({refocus:!1})},this._onMoreKeyDown=e=>{if(e.key!==`ArrowDown`&&e.key!==`ArrowUp`)return;let t=this._moreItems();t.length&&(e.preventDefault(),t[(t.indexOf(this.shadowRoot?.activeElement)+(e.key===`ArrowDown`?1:-1)+t.length)%t.length].focus())},this._closeHousehold=()=>{let e=this._householdModal;e&&(this._householdModal=null,this.updateComplete.then(()=>this.shadowRoot?.querySelector(`[data-stat="${e}"]`)?.focus()))},this._openTemplates=async()=>{if(this.hass){this._templateBusy=!0,this._error=``;try{this._templates=await Ot(this.hass),this._templateUnchecked={},this._setTemplateNotice(``),this._templateOpen=!0}catch(e){this._error=J(e)}finally{this._templateBusy=!1}}},this._openReadiness=()=>{this._readinessOpen=!0},this._closeReadiness=()=>{this._readinessOpen=!1,this.updateComplete.then(()=>this.shadowRoot?.querySelector(`[data-stat="readiness"]`)?.focus())},this._openCompleteness=()=>{this._completenessOpen=!0},this._closeCompleteness=()=>{this._completenessOpen=!1,this.updateComplete.then(()=>this.shadowRoot?.querySelector(`[data-stat="completeness"]`)?.focus())},this._closeTemplates=()=>{this._templateOpen=!1,this._templateUnchecked={}},this._openAdd=()=>{this._canWrite()&&(this._editing=null,this._form=this._blankForm(),this._fieldErrors={},this._error=``,this._barcodeError=``,this._dialogOpen=!0)},this._openEdit=e=>{this._editing=e;let t=On.includes(e.unit)?e.unit:`piece`,n=e.contents_per_unit,r=e.contents_unit||``,i=e.calories_per_content;n==null&&e.liters_per_unit!=null&&(n=e.liters_per_unit,r=`liter`),i==null&&e.calories_per_unit!=null&&n==null&&(n=1,r||=`gram`,i=e.calories_per_unit),this._form={name:e.name,quantity:String(e.quantity),desired_quantity:String(e.desired_quantity),unit:t,location:e.location,category:e.category,priority:e.priority,notes:e.notes||``,barcode:e.barcode||``,expiry_date:e.expiry_date||``,contents_per_unit:n==null?``:String(n),contents_unit:r,calories_per_content:i==null?``:String(i)},this._fieldErrors={},this._error=``,this._barcodeError=``,this._dialogOpen=!0},this._closeDialog=()=>{this._abortScan(),this._dialogOpen=!1,this._fieldErrors={},this._error=``,this._barcodeError=``},this._onWindowKeyDown=e=>{e.key===`Escape`&&(this._moreOpen?(e.preventDefault(),this._closeMore()):this._readinessOpen?(e.preventDefault(),this._closeReadiness()):this._householdModal?(e.preventDefault(),this._closeHousehold()):this._completenessOpen?(e.preventDefault(),this._closeCompleteness()):this._dialogOpen&&(e.preventDefault(),this._closeDialog()))}}connectedCallback(){super.connectedCallback(),this._connected=!0,Pn(),this._restoreViewState(),window.addEventListener(`keydown`,this._onWindowKeyDown),this._connect()}disconnectedCallback(){super.disconnectedCallback(),this._connected=!1,window.removeEventListener(`keydown`,this._onWindowKeyDown),document.removeEventListener(`click`,this._onDocumentClick),this._abortScan(),this._setTemplateNotice(``),this._unsub?.(),this._unsub=null}willUpdate(e){e.has(`hass`)&&this.hass&&(bt(this,this.hass.themes),st({language:this.hass.language}))}updated(e){e.has(`hass`)&&this.hass&&!this._unsub&&this._connected&&this._connect()}async _connect(){if(this.hass&&!this._unsub)try{this._settings=await Tt(this.hass),this._unsub=await Et(this.hass,e=>{this._applySnapshot(e)}),this._error=``}catch(e){this._error=J(e)}}_entryId(){let e=this.panel?.config?.config_entry_id;return typeof e==`string`&&e?e:null}_canWrite(){return this.hass?.user?.is_admin===!0}_restoreViewState(){let e=dn(typeof localStorage<`u`?localStorage:null,this._entryId());this._search=e.search,this._filterStatus=e.filterStatus,this._filterLocation=e.filterLocation,this._filterCategory=e.filterCategory,this._filterReadiness=e.filterReadiness,this._filtersOpen=e.filtersOpen,this._sort=e.sort,this._viewHydrated=!0}_persistViewState(){this._viewHydrated&&fn(typeof localStorage<`u`?localStorage:null,{search:this._search,filterStatus:this._filterStatus,filterLocation:this._filterLocation,filterCategory:this._filterCategory,filterReadiness:this._filterReadiness,filtersOpen:this._filtersOpen,sort:this._sort},this._entryId())}_applySnapshot(e){if(this._snapshot=e,e.settings&&(this._settings=e.settings),!this._pendingRemoveIds.length)return;let t=new Set(e.items.map(e=>e.id)),n=this._pendingRemoveIds.filter(e=>t.has(e));n.length!==this._pendingRemoveIds.length&&(this._pendingRemoveIds=n)}_isRemovePending(e){return this._pendingRemoveIds.includes(e)}get _assessment(){return this._snapshot?.assessment??{}}get _bucketCounts(){let e=this._snapshot?.buckets;return{expired:e?.expired.length??0,expiring:(e?.within_urgent.length??0)+(e?.within_expiring.length??0),low_stock:e?.low_stock.length??0}}get _activeFilterCount(){let e=0;return this._filterLocation&&(e+=1),this._filterCategory&&(e+=1),this._filterReadiness&&(e+=1),e}_readinessKind(e){return Lt(e,this._settings)}get _items(){return Yt(this._snapshot?.items??[],this._snapshot?.buckets,this._settings,{search:this._search,filterStatus:this._filterStatus,filterLocation:this._filterLocation,filterCategory:this._filterCategory,filterReadiness:this._filterReadiness,sort:this._sort})}_itemStatus(e){return Jt(e,this._snapshot?.buckets)}_t(e,t){return an(this.hass,e,t)}_statusLabel(e){return on(this.hass,e)}_setStatusFilter(e){this._filterStatus=this._filterStatus===e?`all`:e,this._persistViewState()}_pct(e){return e==null||Number.isNaN(Number(e))?`—`:`${Math.round(Number(e))}%`}_completenessPercent(){let e=this._snapshot?.completeness?.overall_percent;return e==null||Number.isNaN(Number(e))?null:Number(e)}_formatHours(e){if(e==null||Number.isNaN(Number(e)))return`—`;let t=Math.max(0,Math.round(Number(e)));return t<48?`${t}h`:`${Math.round(t/24)}d`}_formatAmount(e,t){if(e==null||Number.isNaN(Number(e)))return`—`;let n=Number(e);return`${Math.abs(n-Math.round(n))<.05?Math.round(n):Math.round(n*10)/10} ${t}`}_durationHours(){return this._assessment.duration_hours??this._settings?.duration_hours??72}_cardTone(e){let t=mn(e,this._durationHours());return t===`ok`?`success`:t===`warn`?`warning`:t===`bad`?`danger`:`gray`}_detailTone(e){let t=mn(e,this._durationHours());return t===`bad`?`danger`:t===`warn`?`warning`:void 0}_expiryClass(e){return e===`expired`?`expiry-expired`:e===`urgent`||e===`expiring`?`expiry-warn`:``}_formatDate(e){if(!e)return`—`;let t=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e.trim());if(!t)return e;let n=new Date(Number(t[1]),Number(t[2])-1,Number(t[3]));if(Number.isNaN(n.getTime()))return e;let r=this.hass?.locale,i=r?.language||this.hass?.language||navigator.language||`en`,a=r?.date_format??`language`,o=a===`system`?void 0:i,s=new Intl.DateTimeFormat(o,{year:`numeric`,month:`numeric`,day:`numeric`});if(a===`language`||a===`system`)return s.format(n);let c=s.formatToParts(n),l=c.find(e=>e.type===`literal`)?.value??`/`,u=c.find(e=>e.type===`day`)?.value??``,d=c.find(e=>e.type===`month`)?.value??``,f=c.find(e=>e.type===`year`)?.value??``,p=c[c.length-1],m=p?.type===`literal`?p.value:``;return a===`DMY`?`${u}${l}${d}${l}${f}${m}`:a===`MDY`?`${d}${l}${u}${l}${f}${m}`:`${f}${l}${d}${l}${u}${m}`}_optionList(e,t){return pn(e,t)}_runHeaderAction(e){switch(e){case`scan`:this._scanFromPanel();break;case`add_from_template`:this._openTemplates();break;case`push_restock`:this._pushRestock();break;case`add_item`:this._openAdd()}}_headerActionLabel(e){return this._t(`action.${e}`)}_renderHeaderActions(){let{buttons:e,menu:t}=Xt({canWrite:this._canWrite(),narrow:this.narrow,hasRestockList:!!this._settings?.todo_entity_id});return T`
      ${e.map(e=>this._mdButton(this._headerActionLabel(e),{variant:e===`add_item`?`filled`:`outlined`,disabled:e===`scan`&&this._scanning,onClick:()=>this._runHeaderAction(e)}))}
      ${t.length?this._renderMoreMenu(t):D}
    `}_renderMoreMenu(e){return T`
      <div class="more">
        <hpu-icon-button class="more-btn"
          path=${Sn}
          label=${this._t(`action.more`)}
          haspopup="menu"
          expanded=${this._moreOpen?`true`:`false`}
          @hpu-click=${this._toggleMore}
        ></hpu-icon-button>
        ${this._moreOpen?T`
              <div
                class="more-menu"
                role="menu"
                @keydown=${this._onMoreKeyDown}
              >
                ${e.map(e=>T`
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
            `:D}
      </div>
    `}_closeMore(e={refocus:!0}){this._moreOpen&&(this._moreOpen=!1,document.removeEventListener(`click`,this._onDocumentClick),e.refocus!==!1&&this.updateComplete.then(()=>this.shadowRoot?.querySelector(`.more-btn`)?.focus()))}_moreItems(){return Array.from(this.shadowRoot?.querySelectorAll(`.more-menu [role="menuitem"]:not([disabled])`)??[])}_mdButton(e,t){let n=t.variant??`outlined`,r=n===`danger-text`;return T`
      <hpu-button
        variant=${r?`text`:n}
        tone=${r?`danger`:`primary`}
        ?disabled=${t.disabled??!1}
        @hpu-click=${t.onClick}
        >${e}</hpu-button
      >
    `}render(){let e=this._items,t=this._assessment,n=pn(this._settings?.locations??[]),r=pn(this._settings?.categories??[]),i=t.overall_percent,a=t.water_percent,o=t.food_percent,s=this._completenessPercent(),c=this._bucketCounts,l=t.supply_hours,u=t.water_supply_hours,d=t.food_supply_hours,f=t.pet_food_target,p=f!=null&&f>0,m=t.pet_food_supply_hours,h=this.hass?.themes?.darkMode===!0,g=h?yn:_n,ee=h?`${yn} 1x, ${bn} 2x`:`${_n} 1x, ${vn} 2x`;return T`
      <div class="page">
        <header class="header">
          <div class="header-row">
            <div class="brand">
              ${this.narrow?T`
                    <hpu-icon-button
          path=${xn}
          label=${this._t(`action.open_menu`)}
          @hpu-click=${this._toggleMenu}
        ></hpu-icon-button>
                  `:D}
              <h1 class="brand-heading">
                <img
                  class="brand-logo"
                  src=${g}
                  srcset=${ee}
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
              value=${this._pct(i)}
              detail=${this._formatHours(l)}
              detail-tone=${this._detailTone(l)??D}
              tone=${this._cardTone(l)}
              .icon=${Cn}
              clickable
              haspopup="dialog"
              accessible-label=${this._t(`readiness.open`)}
              @hpu-activate=${this._openReadiness}
            ></hpu-stat-card>
            <hpu-stat-card
              label=${this._t(`stat.water`)}
              value=${this._formatAmount(t.water_on_hand,`L`)}
              meta=${`${this._pct(a)} · ${this._formatAmount(t.water_target,`L`)}`}
              detail=${this._formatHours(u)}
              detail-tone=${this._detailTone(u)??D}
              tone=${this._cardTone(u)}
              .icon=${wn}
            ></hpu-stat-card>
            <hpu-stat-card
              data-stat="food"
              label=${this._t(`stat.food`)}
              value=${this._formatAmount(t.food_on_hand,`kcal`)}
              meta=${`${this._pct(o)} · ${this._formatAmount(t.food_target,`kcal`)}`}
              detail=${this._formatHours(d)}
              detail-tone=${this._detailTone(d)??D}
              tone=${this._cardTone(d)}
              .icon=${Tn}
              clickable
              haspopup="dialog"
              accessible-label=${this._t(`household.open_food`)}
              @hpu-activate=${()=>this._openHousehold(`food`)}
            ></hpu-stat-card>
            ${p?T`
                  <hpu-stat-card
                    data-stat="pet_food"
                    label=${this._t(`stat.pet_food`)}
                    value=${this._formatAmount(t.pet_food_on_hand,`g`)}
                    meta=${`${this._pct(t.pet_food_percent)} · ${this._formatAmount(f,`g`)}`}
                    detail=${this._formatHours(m)}
                    detail-tone=${this._detailTone(m)??D}
                    tone=${this._cardTone(m)}
                    .icon=${En}
                    clickable
                    haspopup="dialog"
                    accessible-label=${this._t(`household.open_pet_food`)}
                    @hpu-activate=${()=>this._openHousehold(`pet_food`)}
                  ></hpu-stat-card>
                `:D}
            ${s==null?D:T`
                  <hpu-stat-card
                    data-stat="completeness"
                    label=${this._t(`stat.completeness`)}
                    value=${this._pct(s)}
                    .icon=${Dn}
                    clickable
                    haspopup="dialog"
                    accessible-label=${this._t(`completeness.open`)}
                    @hpu-activate=${this._openCompleteness}
                  ></hpu-stat-card>
                `}
          </hpu-grid>

          <div class="attention" role="group" aria-label="Attention filters">
            <button
              type="button"
              class="chip ${this._filterStatus===`expired`?`active`:``}"
              @click=${()=>this._setStatusFilter(`expired`)}
            >
              ${this._t(`status.expired`)}
              <span class="chip-count">${c.expired}</span>
            </button>
            <button
              type="button"
              class="chip ${this._filterStatus===`expiring`?`active`:``}"
              @click=${()=>this._setStatusFilter(`expiring`)}
            >
              ${this._t(`status.expiring`)}
              <span class="chip-count">${c.expiring}</span>
            </button>
            <button
              type="button"
              class="chip ${this._filterStatus===`low_stock`?`active`:``}"
              @click=${()=>this._setStatusFilter(`low_stock`)}
            >
              ${this._t(`status.low`)}
              <span class="chip-count">${c.low_stock}</span>
            </button>
          </div>

          <section class="inventory">
            <div class="toolbar">
              <div class="toolbar-row">
                <input
                  class="search"
                  type="search"
                  placeholder=${this._t(`filter.search_placeholder`)}
                  .value=${this._search}
                  @input=${e=>{this._search=e.target.value,this._persistViewState()}}
                />
                <select
                  class="sort"
                  .value=${this._sort}
                  @change=${e=>{this._sort=e.target.value,this._persistViewState()}}
                >
                  <option value="name">${this._t(`filter.sort`)}: name</option>
                  <option value="expiry">${this._t(`filter.sort`)}: expiry</option>
                  <option value="quantity"
                    >${this._t(`filter.sort`)}: quantity</option
                  >
                </select>
                <hpu-button
                  class="filters-btn"
                  variant=${this._filtersOpen||this._activeFilterCount?`tonal`:`outlined`}
                  @hpu-click=${()=>{this._filtersOpen=!this._filtersOpen,this._persistViewState()}}
                >
                  Filters${this._activeFilterCount?T` (${this._activeFilterCount})`:D}
                </hpu-button>
              </div>
              ${this._filtersOpen?T`
                    <div class="filters">
                      <select
                        .value=${this._filterLocation}
                        @change=${e=>{this._filterLocation=e.target.value,this._persistViewState()}}
                      >
                        <option value=""
                          >${this._t(`filter.all_location`)}</option
                        >
                        ${n.map(e=>T`<option value=${e}>${e}</option>`)}
                      </select>
                      <select
                        .value=${this._filterCategory}
                        @change=${e=>{this._filterCategory=e.target.value,this._persistViewState()}}
                      >
                        <option value=""
                          >${this._t(`filter.all_category`)}</option
                        >
                        ${r.map(e=>T`<option value=${e}>${e}</option>`)}
                      </select>
                      <select
                        .value=${this._filterReadiness}
                        @change=${e=>{this._filterReadiness=e.target.value,this._persistViewState()}}
                      >
                        <option value=""
                          >${this._t(`filter.all_readiness`)}</option
                        >
                        <option value="water"
                          >${this._t(`filter.readiness_water`)}</option
                        >
                        <option value="food"
                          >${this._t(`filter.readiness_food`)}</option
                        >
                        <option value="pet_food"
                          >${this._t(`filter.readiness_pet_food`)}</option
                        >
                        <option value="none"
                          >${this._t(`filter.readiness_none`)}</option
                        >
                      </select>
                      ${this._activeFilterCount?this._mdButton(`Reset`,{variant:`text`,onClick:this._resetFilters}):D}
                    </div>
                  `:D}
              <div class="inventory-meta">
                <span class="item-count"
                  >${e.length}/${this._snapshot?.items.length??0}</span
                >
              </div>
            </div>

            ${this._templateNotice?T`<div class="field-hint" role="status">${this._templateNotice}</div>`:D}
            ${this._error?T`<div class="error" role="alert">${this._error}</div>`:D}

            ${this.narrow?this._renderCardList(e):this._renderTable(e)}
          </section>
        </div>
      </div>

      ${this._dialogOpen?this._renderDialog():D}
      ${this._completenessOpen?this._renderCompletenessDialog():D}
      ${this._readinessOpen?this._renderReadinessDialog():D}
      ${this._householdModal?this._renderHouseholdDialog(this._householdModal):D}
      ${this._templateOpen?this._renderTemplateDialog():D}
    `}_renderEmpty(){return this._snapshot?T`
      <div class="empty">
        No items match.
        ${this._canWrite()?T`
              <div class="empty-actions">
                ${this._mdButton(`Scan`,{variant:`outlined`,disabled:this._scanning,onClick:()=>void this._scanFromPanel()})}
                ${this._mdButton(`Add an item`,{variant:`text`,onClick:this._openAdd})}
              </div>
            `:D}
      </div>
    `:T`<div class="empty">Loading inventory…</div>`}_renderQtyText(e){return T`
      <span class="qty-text"
        >${e.quantity}${e.desired_quantity?T` / ${e.desired_quantity}`:D}
        ${e.unit}</span
      >
    `}_renderMeasure(e){return Gt(e,this._readinessKind(e.category))}_contentsToLiters(e,t){return Bt(e,t)}_formatMeasureNumber(e){let t=Number(e);return Number.isNaN(t)?`—`:Math.abs(t-Math.round(t))<.05?String(Math.round(t)):String(Math.round(t*100)/100)}_contentsUnitLabel(e){return jn(e||`unit`)}_formTotalContents(){let e=this._parseDecimal(this._form.quantity||`0`),t=this._parseDecimal(this._form.contents_per_unit||``);return!this._form.contents_per_unit||Number.isNaN(t)?null:e*t}_formTotalCalories(){let e=this._formTotalContents(),t=this._parseDecimal(this._form.calories_per_content||``);return e==null||!this._form.calories_per_content||Number.isNaN(t)?null:e*t}_formTotalLiters(){let e=this._formTotalContents();return e==null||!this._form.contents_unit?null:this._contentsToLiters(e,this._form.contents_unit)}_validateForm(){let e=this._form,t={};(e.name||``).trim()||(t.name=`Name is required`),(e.location||``).trim()||(t.location=`Location is required`),(e.category||``).trim()||(t.category=`Category is required`);let n=this._parseDecimal(e.quantity);return(e.quantity===``||Number.isNaN(n)||n<0)&&(t.quantity=`Enter a valid quantity`),(e.unit||``).trim()||(t.unit=`Unit is required`),Object.assign(t,Kt(this._formReadiness(),{contents_per_unit:e.contents_per_unit||``,contents_unit:e.contents_unit||``,calories_per_content:e.calories_per_content||``})),t}_renderStatusBadge(e){return e?T`<hpu-badge tone=${e===`expired`?`danger`:e===`low`?`info`:`warning`} size="sm"
      >${this._statusLabel(e)}</hpu-badge
    >`:D}_openHousehold(e){this._householdModal=e}_renderHouseholdDialog(e){let t=$t(this._settings),n=this._t(e===`food`?`household.food_title`:`household.pet_food_title`);return T`
      <div
        class="dialog-backdrop"
        @click=${e=>{e.target===e.currentTarget&&this._closeHousehold()}}
      >
        <div
          class="dialog household-dialog ${this.narrow?`dialog-narrow`:``}"
          role="dialog"
          aria-modal="true"
          aria-label=${n}
        >
          <div class="dialog-header">
            <h2>${n}</h2>
            <hpu-icon-button class="dialog-close"
          path=${Q}
          label=${this._t(`action.close`)}
          @hpu-click=${this._closeHousehold}
        ></hpu-icon-button>
          </div>
          ${t?e===`food`?this._renderFoodTable(t):this._renderPetFoodTable(t):T`<p class="field-hint">${this._t(`household.not_configured`)}</p>`}
        </div>
      </div>
    `}_renderFoodTable(e){let t=en(e),n=Math.round(t.days*10)/10;return T`
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
            ${t.rows.map(e=>T`<tr>
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
    `}_renderPetFoodTable(e){let t=tn(e),n=Math.round(t.days*10)/10;return T`
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>${this._t(`household.pet`)}</th>
              <th>${this._t(`household.food_per_day`)}</th>
            </tr>
          </thead>
          <tbody>
            ${t.rows.map(e=>T`<tr>
                <td>${e.name}${e.type?T` (${e.type})`:D}</td>
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
    `}_renderTable(e){return T`
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
            ${e.map(e=>this._renderRow(e))}
            ${e.length===0?T`<tr>
                  <td colspan="8">${this._renderEmpty()}</td>
                </tr>`:D}
          </tbody>
        </table>
      </div>
    `}_renderCardList(e){return e.length===0?this._renderEmpty():T`
      <div class="card-list">
        ${e.map(e=>this._renderItemCard(e))}
      </div>
    `}_renderRow(e){let t=this._itemStatus(e),n=this._renderMeasure(e);return T`
      <tr class=${t?`row-${t}`:``}>
        <td>
          <hpu-button
            variant="text"
            @hpu-click=${()=>this._openEdit(e)}
            >${e.name}</hpu-button
          >
        </td>
        <td class="status-col">${this._renderStatusBadge(t)}</td>
        <td>${this._renderQtyText(e)}</td>
        <td class="measure-col">${n}</td>
        <td>${e.location||`—`}</td>
        <td>${e.category||`—`}</td>
        <td class="expiry-col ${this._expiryClass(t)}">
          ${this._formatDate(e.expiry_date)}
        </td>
        <td class="actions">
          ${this._mdButton(this._canWrite()?`Edit`:`View`,{variant:`outlined`,onClick:()=>this._openEdit(e)})}
          ${this._canWrite()?this._mdButton(`Remove`,{variant:`danger-text`,disabled:this._isRemovePending(e.id),onClick:()=>void this._remove(e)}):D}
        </td>
      </tr>
    `}_renderItemCard(e){let t=this._itemStatus(e),n=this._renderMeasure(e),r=[e.location,e.category,n].filter(Boolean).join(` · `);return T`
      <article
        class="item-card ${t?`row-${t}`:``}"
        @click=${()=>this._openEdit(e)}
      >
        <div class="item-card-top">
          <div class="item-card-title">
            <span class="item-name">${e.name}</span>
            ${this._renderStatusBadge(t)}
          </div>
          <hpu-button
            variant="text"
            tone="danger"
            size="sm"
            ?disabled=${this._isRemovePending(e.id)}
            ?hidden=${!this._canWrite()}
            @click=${e=>e.stopPropagation()}
            @hpu-click=${()=>void this._remove(e)}
            >Remove</hpu-button
          >
        </div>
        ${r?T`<div class="meta">${r}</div>`:D}
        <div class="item-card-bottom">
          ${this._renderQtyText(e)}
          ${e.expiry_date?T`<span class="${this._expiryClass(t)}"
                >${this._formatDate(e.expiry_date)}</span
              >`:D}
        </div>
      </article>
    `}_formReadiness(){return this._readinessKind(this._form.category||``)}_showCaloriesField(){return Rt(this._formReadiness())}_renderDialog(){let e=this._form,t=this._optionList(this._settings?.locations??[],e.location||``),n=this._optionList(this._settings?.categories??[],e.category||``),r=this._formReadiness(),i=this._formTotalContents(),a=this._formTotalLiters(),o=this._formTotalCalories(),s=this._contentsUnitLabel(e.contents_unit||`unit`),c=``;i!=null&&e.contents_unit&&(c=`Total on hand: ${this._formatMeasureNumber(i)} ${s}`,a!=null&&(c+=` · ${this._formatMeasureNumber(a)} L`),o!=null&&(c+=` · ${this._formatMeasureNumber(o)} kcal`));let l=this._canWrite(),u=this._editing?this._t(`dialog.edit_title`):this._t(`dialog.add_title`);return T`
      <div class="dialog-backdrop">
        <div
          class="dialog ${this.narrow?`dialog-narrow`:``}"
          role="dialog"
          aria-modal="true"
          aria-label=${u}
        >
          <div class="dialog-header">
            <h2>${u}</h2>
            <hpu-icon-button class="dialog-close"
          path=${Q}
          label=${this._t(`action.close`)}
          @hpu-click=${this._closeDialog}
        ></hpu-icon-button>
          </div>

          <div class="form-section">
            <div class="form-section-title">Details</div>
            <div class="barcode-row">
              ${this._textField(`barcode`,this._t(`field.barcode`),{write:l,error:this._barcodeError})}
              ${l?T`
                    ${this._mdButton(this._t(`action.scan`),{variant:`outlined`,disabled:this._scanning,onClick:()=>void this._scanBarcode()})}
                    ${this._mdButton(this._t(`action.lookup`),{variant:`outlined`,disabled:this._scanning||!(e.barcode||``).trim(),onClick:()=>void this._lookupBarcode()})}
                  `:D}
            </div>
            ${this._textField(`name`,`Name`,{write:l,required:l})}
            <div class="row2">
              ${this._selectField(`location`,`Location`,t.map(e=>({value:e,label:e})),{write:l,required:l,placeholder:`Select location`})}
              ${this._selectField(`category`,`Category`,n.map(e=>({value:e,label:e})),{write:l,required:l,placeholder:`Select category`})}
            </div>
            ${this._selectField(`priority`,this._t(`field.priority`),An.map(e=>({value:e,label:this._t(`priority.${e}`)})),{write:l,fallback:`important`})}
            ${this._textField(`notes`,this._t(`field.notes`),{write:l})}
          </div>

          <div class="form-section">
            <div class="form-section-title">Stock</div>
            <div class="row3">
              ${this._textField(`quantity`,`Quantity`,{write:l,required:l,inputmode:`decimal`,fallback:`1`,hint:c})}
              ${this._textField(`desired_quantity`,`Desired quantity`,{write:l,inputmode:`decimal`,fallback:`0`})}
              ${this._selectField(`unit`,`Unit`,On.map(e=>({value:e,label:jn(e)})),{write:l,required:l,fallback:`piece`})}
            </div>
            <div class="row2">
              ${this._textField(`contents_per_unit`,`Contents per unit`,{write:l,required:l&&(r===`food`||r===`water`||r===`pet_food`),inputmode:`decimal`,hint:`How much is in one bottle, can, or pack?`})}
              ${this._selectField(`contents_unit`,`Contents unit`,kn.map(e=>({value:e,label:jn(e)})),{write:l,required:l&&(r===`food`||r===`water`||r===`pet_food`),placeholder:`Select unit`,hint:`Liter, milliliter, gram, or kilogram for one stock unit.`})}
            </div>
            ${this._showCaloriesField()?this._textField(`calories_per_content`,`Calories (kcal) per ${s}`,{write:l,required:l&&r===`food`,inputmode:`decimal`,hint:`Calories per contents unit${o==null?``:` · Total calories on hand: ${this._formatMeasureNumber(o)} kcal`}`}):D}
            ${r===`none`?T`<div class="field-hint">
                  Category is not mapped to food, water or pet food — this item will not
                  count toward readiness.
                </div>`:D}
          </div>

          <div class="form-section">
            <div class="form-section-title">Dates</div>
            ${this._textField(`expiry_date`,`Expiry`,{write:l,type:`date`})}
          </div>

          ${this._error?T`<div class="error" role="alert">${this._error}</div>`:D}

          <div class="dialog-actions">
            ${this._mdButton(l?this._t(`action.cancel`):this._t(`action.close`),{variant:`text`,onClick:this._closeDialog})}
            ${l?this._mdButton(this._t(`action.save`),{variant:`filled`,disabled:this._saving,onClick:()=>void this._save()}):D}
          </div>
        </div>
      </div>
    `}_textField(e,t,n){return T`<hpu-input
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
    ></hpu-input>`}_selectField(e,t,n,r){return T`<hpu-select
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
    ></hpu-select>`}_onField(e){return t=>{let n=t.detail.value;if(this._form={...this._form,[e]:n},e===`barcode`&&this._barcodeError&&(this._barcodeError=``),this._fieldErrors[e]){let t={...this._fieldErrors};delete t[e],this._fieldErrors=t}}}_parseDecimal(e){return Number(String(e).trim().replace(`,`,`.`))}_blankForm(){return{name:``,quantity:`1`,desired_quantity:`0`,unit:`piece`,location:``,category:``,priority:`important`,notes:``,barcode:``,expiry_date:``,contents_per_unit:``,contents_unit:``,calories_per_content:``}}_renderReadinessDialog(){let e=this._t(`readiness.title`);return T`
      <div
        class="dialog-backdrop"
        @click=${e=>{e.target===e.currentTarget&&this._closeReadiness()}}
      >
        <div
          class="dialog explain-dialog ${this.narrow?`dialog-narrow`:``}"
          role="dialog"
          aria-modal="true"
          aria-label=${e}
        >
          <div class="dialog-header">
            <h2>${e}</h2>
            <hpu-icon-button class="dialog-close"
          path=${Q}
          label=${this._t(`action.close`)}
          @hpu-click=${this._closeReadiness}
        ></hpu-icon-button>
          </div>
          <p>${this._t(`readiness.explain`)}</p>
          <p class="field-hint">${this._t(`readiness.example`)}</p>
        </div>
      </div>
    `}_renderCompletenessDialog(){let e=this._snapshot?.completeness,t=Object.entries(e?.categories??{}),n=this._completenessPercent(),r=this._t(`completeness.title`),i=t.every(([,e])=>e.missing.length===0);return T`
      <div
        class="dialog-backdrop"
        @click=${e=>{e.target===e.currentTarget&&this._closeCompleteness()}}
      >
        <div
          class="dialog completeness-dialog ${this.narrow?`dialog-narrow`:``}"
          role="dialog"
          aria-modal="true"
          aria-label=${r}
        >
          <div class="dialog-header">
            <h2>${r}</h2>
            <hpu-icon-button class="dialog-close"
          path=${Q}
          label=${this._t(`action.close`)}
          @hpu-click=${this._closeCompleteness}
        ></hpu-icon-button>
          </div>
          <p>${this._t(`completeness.explain`)}</p>
          <p class="field-hint">${this._t(`completeness.example`)}</p>
          <div class="completeness-overall">
            ${this._t(`completeness.overall`)}:
            <strong>${this._pct(n)}</strong>
          </div>
          ${i?T`<p class="completeness-all">
                ${this._t(`completeness.all_complete`)}
              </p>`:D}
          ${t.map(([e,t])=>T`
              <section class="completeness-category">
                <div class="completeness-category-head">
                  <span class="completeness-category-name">${e}</span>
                  <span class="completeness-category-score">
                    ${t.complete}/${t.total} · ${this._pct(t.percent)}
                    ${t.missing.length===0?T`<span
                          class="completeness-check"
                          title=${this._t(`completeness.category_complete`)}
                          aria-label=${this._t(`completeness.category_complete`)}
                          >✓</span
                        >`:D}
                  </span>
                </div>
                ${t.missing.length>0?T`<ul class="completeness-missing">
                      ${t.missing.map(e=>T`
                          <li>
                            <span class="completeness-item-name">${e.name}</span>
                            <span
                              class="completeness-reason ${e.expired?`completeness-reason-expired`:``}"
                              >${e.expired?this._t(`completeness.expired`):this._t(`completeness.stock`,{quantity:e.quantity,desired:e.desired_quantity})}</span
                            >
                          </li>
                        `)}
                    </ul>`:D}
              </section>
            `)}
        </div>
      </div>
    `}_setTemplateNotice(e){this._templateNoticeTimer&&clearTimeout(this._templateNoticeTimer),this._templateNoticeTimer=null,this._templateNotice=e,e&&(this._templateNoticeTimer=setTimeout(()=>{this._templateNotice=``,this._templateNoticeTimer=null},Mn))}_templateMissing(e){return St(e.items,(this._snapshot?.items??[]).map(e=>e.name))}_setTemplateUnchecked(e,t){this._templateUnchecked={...this._templateUnchecked,[e]:t}}_toggleTemplateItem(e,t,n){let r=new Set(this._templateUnchecked[e.id]??[]);n?r.delete(t):r.add(t),this._setTemplateUnchecked(e.id,r)}_toggleTemplateAll(e){let t=this._templateMissing(e),n=wt(t,this._templateUnchecked[e.id]??new Set);this._setTemplateUnchecked(e.id,n===`all`?new Set(t.map(e=>e.name)):new Set)}async _applyTemplate(e){if(!this.hass||this._templateBusy)return;let t=Ct(this._templateMissing(e),this._templateUnchecked[e.id]??new Set);if(t.length){this._templateBusy=!0,this._error=``;try{let n=(await this.hass.callService(`ready_home`,`apply_kit_template`,{template_id:e.id,item_names:t.map(e=>e.name)},void 0,void 0,!0))?.response;this._setTemplateNotice(n?this._t(`template.added_result`,{added:n.added_count??0,skipped:n.skipped_count??0}):``),this._closeTemplates()}catch(e){this._error=J(e)}finally{this._templateBusy=!1}}}async _pushRestock(){if(this.hass){this._error=``;try{await this.hass.callService(`ready_home`,`push_restock_list`,{})}catch(e){this._error=J(e)}}}_renderTemplateCard(e){let t=this._templateMissing(e),n=this._templateUnchecked[e.id]??new Set,r=Ct(t,n),i=wt(t,n);return T`
      <div class="template-card">
        <div class="template-card-body">
          <strong>${e.name}</strong>
          <p>${e.description}</p>
          <span class="item-count"
            >${t.length?this._t(`template.to_add`,{n:t.length}):this._t(`template.none_missing`)}</span
          >
        </div>
        ${t.length?T`
              <details class="template-items">
                <summary>${this._t(`template.items`)}</summary>
                <hpu-checkbox
                  class="template-item template-select-all"
                  .checked=${i===`all`}
                  .indeterminate=${i===`partial`}
                  @hpu-change=${()=>this._toggleTemplateAll(e)}
                  >${this._t(`template.select_all`)}</hpu-checkbox
                >
                ${t.map(t=>T`
                    <hpu-checkbox
                      class="template-item"
                      .checked=${!n.has(t.name)}
                      @hpu-change=${n=>this._toggleTemplateItem(e,t.name,n.detail.checked)}
                      >${t.name}</hpu-checkbox
                    >
                  `)}
              </details>
            `:D}
        ${this._mdButton(this._t(`template.add_selected`,{n:r.length}),{variant:`filled`,disabled:this._templateBusy||r.length===0,onClick:()=>void this._applyTemplate(e)})}
      </div>
    `}_renderTemplateDialog(){return T`
      <div
        class="dialog-backdrop"
        @click=${e=>{e.target===e.currentTarget&&this._closeTemplates()}}
      >
        <div
          class="dialog"
          role="dialog"
          aria-modal="true"
          aria-label=${this._t(`dialog.template_title`)}
        >
          <div class="dialog-header">
            <h2>${this._t(`dialog.template_title`)}</h2>
            <hpu-icon-button
          path=${Q}
          label=${this._t(`action.close`)}
          @hpu-click=${this._closeTemplates}
        ></hpu-icon-button>
          </div>
          <p class="field-hint">${this._t(`template.skip_existing`)}</p>
          <div class="template-list">
            ${this._templates.map(e=>this._renderTemplateCard(e))}
          </div>
          <div class="dialog-actions">
            ${this._mdButton(this._t(`action.close`),{variant:`text`,onClick:this._closeTemplates})}
          </div>
        </div>
      </div>
    `}_abortScan(){let e=this._scanHandle;this._scanHandle=null,e?.abort()}async _remove(e){if(this._canWrite()&&!this._isRemovePending(e.id)&&confirm(`Remove “${e.name}”?`)){this._pendingRemoveIds=[...this._pendingRemoveIds,e.id],this._error=``;try{await this.hass.callService(`ready_home`,`remove_item`,{item_id:e.id})}catch(t){this._pendingRemoveIds=this._pendingRemoveIds.filter(t=>t!==e.id),this._error=J(t)}}}async _save(){if(!this._canWrite())return;let e=this._validateForm();if(this._fieldErrors=e,Object.keys(e).length)return;let t=this._form,n=(t.name||``).trim(),r=this._formReadiness(),i={quantity:this._parseDecimal(t.quantity||`0`),desired_quantity:this._parseDecimal(t.desired_quantity||`0`),unit:t.unit||`piece`,location:t.location||``,category:t.category||``,priority:t.priority||`important`,barcode:t.barcode||``,notes:t.notes||``};t.expiry_date&&(i.expiry_date=t.expiry_date),Object.assign(i,qt(r,{contents_per_unit:t.contents_per_unit||``,contents_unit:t.contents_unit||``,calories_per_content:t.calories_per_content||``})),this._saving=!0,this._error=``;try{this._editing?await this.hass.callService(`ready_home`,`update_item`,{item_id:this._editing.id,new_name:n,...i}):await this.hass.callService(`ready_home`,`add_item`,{name:n,...i}),this._dialogOpen=!1,this._fieldErrors={},this._barcodeError=``}catch(e){this._error=J(e)}finally{this._saving=!1}}async _lookupBarcode(){if(!this._canWrite())return;let e=this._form.barcode?.trim();if(e){this._scanning=!0,this._barcodeError=``,this._error=``;try{let t=await Dt(this.hass,e),n=this._settings?.food_categories?.[0]?.trim()||`Food`;this._form=Pt(this._form,t,n)}catch(e){this._barcodeError=Ft(e)?It:`Barcode lookup failed: ${J(e)}`}finally{this._scanning=!1}}}async _scanFromPanel(){if(!this._canWrite())return;if(!Mt(this.hass)){this._openAdd(),this._barcodeError=this._t(`companion.scan_needed`);return}this._scanning=!0,this._error=``,this._barcodeError=``,this._abortScan();let e=Nt(this.hass);this._scanHandle=e;try{let t=await e.done;if(this._scanHandle===e&&(this._scanHandle=null),!t)return;this._openAdd(),this._form={...this._form,barcode:t},this._scanning=!1,await this._lookupBarcode()}catch(t){this._scanHandle===e&&(this._scanHandle=null),this._openAdd(),this._barcodeError=`Camera scan failed: ${J(t)}`}finally{this._scanning=!1}}async _scanBarcode(){if(!this._canWrite())return;if(!Mt(this.hass)){this._barcodeError=this._t(`companion.scan_needed`);return}this._scanning=!0,this._barcodeError=``,this._error=``,this._abortScan();let e=Nt(this.hass);this._scanHandle=e;try{let t=await e.done;if(this._scanHandle===e&&(this._scanHandle=null),!t)return;this._form={...this._form,barcode:t},this._scanning=!1,await this._lookupBarcode()}catch(t){this._scanHandle===e&&(this._scanHandle=null),this._barcodeError=`Camera scan failed: ${J(t)}`}finally{this._scanning=!1}}static{this.styles=o`
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
    .expiry-col {
      white-space: nowrap;
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
      border-radius: var(--ha-border-radius-lg, 12px);
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
      border-radius: var(--ha-dialog-border-radius, var(--ha-border-radius-lg, 12px));
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
      border-radius: var(--ha-dialog-border-radius, var(--ha-border-radius-lg, 12px));
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
      border-radius: var(--ha-border-radius-md, 8px);
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.02));
    }
    .form-section-title {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--primary-color);
      text-transform: uppercase;
      letter-spacing: 0.04em;
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
    .dialog .template-item {
      flex-direction: row;
      align-items: center;
      gap: 10px;
      padding: 4px 0;
      font-size: 1rem;
      line-height: 1.3;
      text-align: left;
      overflow-wrap: anywhere;
      cursor: pointer;
    }
    .template-items summary {
      padding: 2px 0;
    }
    .dialog .template-select-all {
      font-weight: 500;
      padding-bottom: 6px;
      margin-bottom: 2px;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
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
    /* Smallest phones: keep menu icon, logo, Add item and the more button on one row. */
    @media (max-width: 400px) {
      .brand-logo {
        max-width: 28vw;
      }
    }
  `}};Z([j({attribute:!1})],$.prototype,`hass`,void 0),Z([j({type:Boolean})],$.prototype,`narrow`,void 0),Z([j({attribute:!1})],$.prototype,`panel`,void 0),Z([M()],$.prototype,`_snapshot`,void 0),Z([M()],$.prototype,`_settings`,void 0),Z([M()],$.prototype,`_search`,void 0),Z([M()],$.prototype,`_filterStatus`,void 0),Z([M()],$.prototype,`_filterLocation`,void 0),Z([M()],$.prototype,`_filterCategory`,void 0),Z([M()],$.prototype,`_filterReadiness`,void 0),Z([M()],$.prototype,`_filtersOpen`,void 0),Z([M()],$.prototype,`_sort`,void 0),Z([M()],$.prototype,`_dialogOpen`,void 0),Z([M()],$.prototype,`_editing`,void 0),Z([M()],$.prototype,`_form`,void 0),Z([M()],$.prototype,`_error`,void 0),Z([M()],$.prototype,`_barcodeError`,void 0),Z([M()],$.prototype,`_fieldErrors`,void 0),Z([M()],$.prototype,`_saving`,void 0),Z([M()],$.prototype,`_scanning`,void 0),Z([M()],$.prototype,`_pendingRemoveIds`,void 0),Z([M()],$.prototype,`_completenessOpen`,void 0),Z([M()],$.prototype,`_moreOpen`,void 0),Z([M()],$.prototype,`_readinessOpen`,void 0),Z([M()],$.prototype,`_householdModal`,void 0),Z([M()],$.prototype,`_templateOpen`,void 0),Z([M()],$.prototype,`_templates`,void 0),Z([M()],$.prototype,`_templateBusy`,void 0),Z([M()],$.prototype,`_templateUnchecked`,void 0),Z([M()],$.prototype,`_templateNotice`,void 0);try{customElements.define(hn,$)}catch{}
//# sourceMappingURL=ready-home-panel.js.map