var e=globalThis,t=e.ShadowRoot&&(e.ShadyCSS===void 0||e.ShadyCSS.nativeShadow)&&`adoptedStyleSheets`in Document.prototype&&`replace`in CSSStyleSheet.prototype,n=Symbol(),r=new WeakMap,i=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,n=this.t;if(t&&e===void 0){let t=n!==void 0&&n.length===1;t&&(e=r.get(n)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&r.set(n,e))}return e}toString(){return this.cssText}},a=e=>new i(typeof e==`string`?e:e+``,void 0,n),o=(e,...t)=>new i(e.length===1?e[0]:t.reduce((t,n,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if(typeof e==`number`)return e;throw Error(`Value passed to 'css' function must be a 'css' function result: `+e+`. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`)})(n)+e[r+1],e[0]),e,n),s=(n,r)=>{if(t)n.adoptedStyleSheets=r.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let t of r){let r=document.createElement(`style`),i=e.litNonce;i!==void 0&&r.setAttribute(`nonce`,i),r.textContent=t.cssText,n.appendChild(r)}},c=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t=``;for(let n of e.cssRules)t+=n.cssText;return a(t)})(e):e,{is:l,defineProperty:u,getOwnPropertyDescriptor:d,getOwnPropertyNames:f,getOwnPropertySymbols:p,getPrototypeOf:m}=Object,h=globalThis,g=h.trustedTypes,ee=g?g.emptyScript:``,te=h.reactiveElementPolyfillSupport,_=(e,t)=>e,v={toAttribute(e,t){switch(t){case Boolean:e=e?ee:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},y=(e,t)=>!l(e,t),ne={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:y};Symbol.metadata??=Symbol(`metadata`),h.litPropertyMetadata??=new WeakMap;var b=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=ne){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol(),r=this.getPropertyDescriptor(e,n,t);r!==void 0&&u(this.prototype,e,r)}}static getPropertyDescriptor(e,t,n){let{get:r,set:i}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(t){let a=r?.call(this);i?.call(this,t),this.requestUpdate(e,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ne}static _$Ei(){if(this.hasOwnProperty(_(`elementProperties`)))return;let e=m(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(_(`finalized`)))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_(`properties`))){let e=this.properties,t=[...f(e),...p(e)];for(let n of t)this.createProperty(n,e[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[e,n]of t)this.elementProperties.set(e,n)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let n=this._$Eu(e,t);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let e of n)t.unshift(c(e))}else e!==void 0&&t.push(c(e));return t}static _$Eu(e,t){let n=t.attribute;return!1===n?void 0:typeof n==`string`?n:typeof e==`string`?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return s(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){let n=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,n);if(r!==void 0&&!0===n.reflect){let i=(n.converter?.toAttribute===void 0?v:n.converter).toAttribute(t,n.type);this._$Em=e,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(e,t){let n=this.constructor,r=n._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let e=n.getPropertyOptions(r),i=typeof e.converter==`function`?{fromAttribute:e.converter}:e.converter?.fromAttribute===void 0?v:e.converter;this._$Em=r;let a=i.fromAttribute(t,e.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(e,t,n,r=!1,i){if(e!==void 0){let a=this.constructor;if(!1===r&&(i=this[e]),n??=a.getPropertyOptions(e),!((n.hasChanged??y)(i,t)||n.useDefault&&n.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,n))))return;this.C(e,t,n)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:r,wrapped:i},a){n&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==i||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),!0===r&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[t,n]of e){let{wrapped:e}=n,r=this[t];!0!==e||this._$AL.has(t)||r===void 0||this.C(t,void 0,n,r)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};b.elementStyles=[],b.shadowRootOptions={mode:`open`},b[_(`elementProperties`)]=new Map,b[_(`finalized`)]=new Map,te?.({ReactiveElement:b}),(h.reactiveElementVersions??=[]).push(`2.1.2`);var x=globalThis,re=e=>e,S=x.trustedTypes,ie=S?S.createPolicy(`lit-html`,{createHTML:e=>e}):void 0,C=`$lit$`,w=`lit$${Math.random().toFixed(9).slice(2)}$`,T=`?`+w,ae=`<${T}>`,E=document,D=()=>E.createComment(``),O=e=>e===null||typeof e!=`object`&&typeof e!=`function`,oe=Array.isArray,se=e=>oe(e)||typeof e?.[Symbol.iterator]==`function`,ce=`[ 	
\f\r]`,k=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,le=/-->/g,ue=/>/g,A=RegExp(`>|${ce}(?:([^\\s"'>=/]+)(${ce}*=${ce}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,`g`),de=/'/g,fe=/"/g,pe=/^(?:script|style|textarea|title)$/i,j=(e=>(t,...n)=>({_$litType$:e,strings:t,values:n}))(1),M=Symbol.for(`lit-noChange`),N=Symbol.for(`lit-nothing`),me=new WeakMap,P=E.createTreeWalker(E,129);function he(e,t){if(!oe(e)||!e.hasOwnProperty(`raw`))throw Error(`invalid template strings array`);return ie===void 0?t:ie.createHTML(t)}var ge=(e,t)=>{let n=e.length-1,r=[],i,a=t===2?`<svg>`:t===3?`<math>`:``,o=k;for(let t=0;t<n;t++){let n=e[t],s,c,l=-1,u=0;for(;u<n.length&&(o.lastIndex=u,c=o.exec(n),c!==null);)u=o.lastIndex,o===k?c[1]===`!--`?o=le:c[1]===void 0?c[2]===void 0?c[3]!==void 0&&(o=A):(pe.test(c[2])&&(i=RegExp(`</`+c[2],`g`)),o=A):o=ue:o===A?c[0]===`>`?(o=i??k,l=-1):c[1]===void 0?l=-2:(l=o.lastIndex-c[2].length,s=c[1],o=c[3]===void 0?A:c[3]===`"`?fe:de):o===fe||o===de?o=A:o===le||o===ue?o=k:(o=A,i=void 0);let d=o===A&&e[t+1].startsWith(`/>`)?` `:``;a+=o===k?n+ae:l>=0?(r.push(s),n.slice(0,l)+C+n.slice(l)+w+d):n+w+(l===-2?t:d)}return[he(e,a+(e[n]||`<?>`)+(t===2?`</svg>`:t===3?`</math>`:``)),r]},F=class e{constructor({strings:t,_$litType$:n},r){let i;this.parts=[];let a=0,o=0,s=t.length-1,c=this.parts,[l,u]=ge(t,n);if(this.el=e.createElement(l,r),P.currentNode=this.el.content,n===2||n===3){let e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;(i=P.nextNode())!==null&&c.length<s;){if(i.nodeType===1){if(i.hasAttributes())for(let e of i.getAttributeNames())if(e.endsWith(C)){let t=u[o++],n=i.getAttribute(e).split(w),r=/([.?@])?(.*)/.exec(t);c.push({type:1,index:a,name:r[2],strings:n,ctor:r[1]===`.`?ve:r[1]===`?`?ye:r[1]===`@`?be:R}),i.removeAttribute(e)}else e.startsWith(w)&&(c.push({type:6,index:a}),i.removeAttribute(e));if(pe.test(i.tagName)){let e=i.textContent.split(w),t=e.length-1;if(t>0){i.textContent=S?S.emptyScript:``;for(let n=0;n<t;n++)i.append(e[n],D()),P.nextNode(),c.push({type:2,index:++a});i.append(e[t],D())}}}else if(i.nodeType===8){if(i.data===T)c.push({type:2,index:a});else{let e=-1;for(;(e=i.data.indexOf(w,e+1))!==-1;)c.push({type:7,index:a}),e+=w.length-1}}a++}}static createElement(e,t){let n=E.createElement(`template`);return n.innerHTML=e,n}};function I(e,t,n=e,r){if(t===M)return t;let i=r===void 0?n._$Cl:n._$Co?.[r],a=O(t)?void 0:t._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(e),i._$AT(e,n,r)),r===void 0?n._$Cl=i:(n._$Co??=[])[r]=i),i!==void 0&&(t=I(e,i._$AS(e,t.values),i,r)),t}var _e=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,r=(e?.creationScope??E).importNode(t,!0);P.currentNode=r;let i=P.nextNode(),a=0,o=0,s=n[0];for(;s!==void 0;){if(a===s.index){let t;s.type===2?t=new L(i,i.nextSibling,this,e):s.type===1?t=new s.ctor(i,s.name,s.strings,this,e):s.type===6&&(t=new xe(i,this,e)),this._$AV.push(t),s=n[++o]}a!==s?.index&&(i=P.nextNode(),a++)}return P.currentNode=E,r}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings===void 0?n._$AI(e[t]):(n._$AI(e,n,t),t+=n.strings.length-2)),t++}},L=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,r){this.type=2,this._$AH=N,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=I(this,e,t),O(e)?e===N||e==null||e===``?(this._$AH!==N&&this._$AR(),this._$AH=N):e!==this._$AH&&e!==M&&this._(e):e._$litType$===void 0?e.nodeType===void 0?se(e)?this.k(e):this._(e):this.T(e):this.$(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==N&&O(this._$AH)?this._$AA.nextSibling.data=e:this.T(E.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,r=typeof n==`number`?this._$AC(e):(n.el===void 0&&(n.el=F.createElement(he(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===r)this._$AH.p(t);else{let e=new _e(r,this),n=e.u(this.options);e.p(t),this.T(n),this._$AH=e}}_$AC(e){let t=me.get(e.strings);return t===void 0&&me.set(e.strings,t=new F(e)),t}k(t){oe(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,r,i=0;for(let a of t)i===n.length?n.push(r=new e(this.O(D()),this.O(D()),this,this.options)):r=n[i],r._$AI(a),i++;i<n.length&&(this._$AR(r&&r._$AB.nextSibling,i),n.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let t=re(e).nextSibling;re(e).remove(),e=t}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},R=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,r,i){this.type=1,this._$AH=N,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=i,n.length>2||n[0]!==``||n[1]!==``?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=N}_$AI(e,t=this,n,r){let i=this.strings,a=!1;if(i===void 0)e=I(this,e,t,0),a=!O(e)||e!==this._$AH&&e!==M,a&&(this._$AH=e);else{let r=e,o,s;for(e=i[0],o=0;o<i.length-1;o++)s=I(this,r[n+o],t,o),s===M&&(s=this._$AH[o]),a||=!O(s)||s!==this._$AH[o],s===N?e=N:e!==N&&(e+=(s??``)+i[o+1]),this._$AH[o]=s}a&&!r&&this.j(e)}j(e){e===N?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??``)}},ve=class extends R{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===N?void 0:e}},ye=class extends R{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==N)}},be=class extends R{constructor(e,t,n,r,i){super(e,t,n,r,i),this.type=5}_$AI(e,t=this){if((e=I(this,e,t,0)??N)===M)return;let n=this._$AH,r=e===N&&n!==N||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==N&&(n===N||r);r&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH==`function`?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},xe=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){I(this,e)}},Se={M:C,P:w,A:T,C:1,L:ge,R:_e,D:se,V:I,I:L,H:R,N:ye,U:be,B:ve,F:xe},Ce=x.litHtmlPolyfillSupport;Ce?.(F,L),(x.litHtmlVersions??=[]).push(`3.3.3`);var we=(e,t,n)=>{let r=n?.renderBefore??t,i=r._$litPart$;if(i===void 0){let e=n?.renderBefore??null;r._$litPart$=i=new L(t.insertBefore(D(),e),e,void 0,n??{})}return i._$AI(e),i},z=globalThis,B=class extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=we(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return M}};B._$litElement$=!0,B.finalized=!0,z.litElementHydrateSupport?.({LitElement:B});var Te=z.litElementPolyfillSupport;Te?.({LitElement:B}),(z.litElementVersions??=[]).push(`4.2.2`);var V={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Ee=e=>(...t)=>({_$litDirective$:e,values:t}),De=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,n){this._$Ct=e,this._$AM=t,this._$Ci=n}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}},{I:Oe}=Se,ke=e=>e.strings===void 0,Ae={},je=(e,t=Ae)=>e._$AH=t,H=Ee(class extends De{constructor(e){if(super(e),e.type!==V.PROPERTY&&e.type!==V.ATTRIBUTE&&e.type!==V.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!ke(e))throw Error("`live` bindings can only contain a single expression")}render(e){return e}update(e,[t]){if(t===M||t===N)return t;let n=e.element,r=e.name;if(e.type===V.PROPERTY){if(t===n[r])return M}else if(e.type===V.BOOLEAN_ATTRIBUTE){if(!!t===n.hasAttribute(r))return M}else if(e.type===V.ATTRIBUTE&&n.getAttribute(r)===t+``)return M;return je(e),t}}),Me={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:y},Ne=(e=Me,t,n)=>{let{kind:r,metadata:i}=n,a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),r===`setter`&&((e=Object.create(e)).wrapped=!0),a.set(n.name,e),r===`accessor`){let{name:r}=n;return{set(n){let i=t.get.call(this);t.set.call(this,n),this.requestUpdate(r,i,e,!0,n)},init(t){return t!==void 0&&this.C(r,void 0,e,t),t}}}if(r===`setter`){let{name:r}=n;return function(n){let i=this[r];t.call(this,n),this.requestUpdate(r,i,e,!0,n)}}throw Error(`Unsupported decorator location: `+r)};function U(e){return(t,n)=>typeof n==`object`?Ne(e,t,n):((e,t,n)=>{let r=t.hasOwnProperty(n);return t.constructor.createProperty(n,e),r?Object.getOwnPropertyDescriptor(t,n):void 0})(e,t,n)}function W(e){return U({...e,state:!0,attribute:!1})}async function Pe(e){return e.connection.sendMessagePromise({type:`ready_home/settings`})}async function Fe(e,t){return e.connection.subscribeMessage(t,{type:`ready_home/subscribe`})}async function Ie(e,t){return e.connection.sendMessagePromise({type:`ready_home/barcode/lookup`,barcode:t})}async function Le(e){return(await e.connection.sendMessagePromise({type:`ready_home/kit_templates/list`})).templates}var Re=new Set([`ean_13`,`ean_8`,`upc_a`,`upc_e`,`code_128`]);function ze(e,t){let n=e=>Math.round(e*1e4)/1e4;return e===`gram`&&t.calories_per_100g!=null?n(t.calories_per_100g/100):e===`kilogram`&&t.calories_per_100g!=null?n(t.calories_per_100g*10):e===`milliliter`&&t.calories_per_100ml!=null?n(t.calories_per_100ml/100):e===`liter`&&t.calories_per_100ml!=null?n(t.calories_per_100ml*10):null}function Be(e,t){return Re.has(e)?!0:/^\d{8,14}$/.test(t.trim())}function Ve(e){return!!e.auth?.external?.config?.hasBarCodeScanner}function He(e,t){let n=e.auth?.external;if(!n?.config?.hasBarCodeScanner)return{done:Promise.reject(Error(`No companion barcode scanner`)),abort:()=>{}};let r=!1,i,a=new Promise(e=>{i=e}),o=n.receiveMessage,s=e=>{if(!r){r=!0;try{n.fireMessage({type:`bar_code/close`})}catch{}finally{n.receiveMessage=o}i(e)}};return n.receiveMessage=e=>{let r=e;if(r?.type===`command`&&r.command===`bar_code/scan_result`){r.id!=null&&n.fireMessage({id:r.id,type:`result`,success:!0,result:null});let e=String(r.payload?.rawValue??``).trim(),i=String(r.payload?.format??`unknown`);if(e&&Be(i,e)){s(e);return}n.fireMessage({type:`bar_code/notify`,payload:{message:t?.rejectMessage??`Not a product barcode — try an EAN/UPC code`}})}else r?.type===`command`&&r.command===`bar_code/aborted`?(r.id!=null&&n.fireMessage({id:r.id,type:`result`,success:!0,result:null}),s(null)):o.call(n,e)},n.fireMessage({type:`bar_code/scan`,payload:{title:t?.title??`Scan barcode`,description:t?.description??`Point the camera at a product barcode`,alternative_option_label:t?.alternativeOptionLabel??`Enter manually`}}),{done:a,abort:()=>s(null)}}function Ue(e,t,n=`Food`){let r={...e},i=[t.brand,t.name].filter(Boolean).join(` `).trim();if(!(r.name||``).trim()&&i&&(r.name=i),(r.category||``).trim()||(r.category=n),!(r.contents_per_unit||``).trim()&&t.contents_per_unit!=null&&(r.contents_per_unit=String(t.contents_per_unit)),(r.contents_unit||``).trim()||(r.contents_unit=t.contents_unit?.trim()||`gram`),!(r.calories_per_content||``).trim()){let e=ze(r.contents_unit,t);e!=null&&(r.calories_per_content=String(e))}return r}function G(e){if(e==null)return`Unknown error`;if(typeof e==`string`)return e;if(e instanceof Error)return e.message||String(e);if(typeof e==`object`){let t=e;if(typeof t.message==`string`&&t.message.trim())return t.message;if(typeof t.error==`string`&&t.error.trim())return t.error;if(t.error&&typeof t.error==`object`){let e=t.error;if(typeof e.message==`string`&&e.message.trim())return e.message}try{return JSON.stringify(e)}catch{return`Unknown error`}}return String(e)}function We(e){if(typeof e==`object`&&e){let t=e;if(t.code===`not_found`)return!0;let n=typeof t.message==`string`?t.message.toLowerCase():``;if(n.includes(`product not found`)||n.includes(`not found`))return!0}return!!(typeof e==`string`&&/not found/i.test(e))}var Ge=`No product found for this barcode.`;function Ke(e,t){let n=e.trim().toLowerCase();return!n||!t?`none`:(t.water_categories??[]).some(e=>e.trim().toLowerCase()===n)?`water`:(t.food_categories??[]).some(e=>e.trim().toLowerCase()===n)?`food`:(t.pet_food_categories??[]).some(e=>e.trim().toLowerCase()===n)?`pet_food`:`none`}function qe(e){return e===`food`||e===`none`}function K(e){let t=e.trim().replace(`,`,`.`);return t?Number(t):NaN}function q(e){let t=Number(e);return Number.isNaN(t)?`—`:Math.abs(t-Math.round(t))<.05?String(Math.round(t)):String(Math.round(t*100)/100)}function Je(e,t){return t===`liter`?e:t===`milliliter`?e/1e3:null}function Ye(e){if(e.contents_per_unit!=null&&e.contents_unit){let t=Je(e.contents_per_unit,e.contents_unit);if(t!=null)return e.quantity*t}return e.unit===`liter`?e.quantity:e.unit===`milliliter`?e.quantity/1e3:e.liters_per_unit==null?null:e.quantity*e.liters_per_unit}function Xe(e,t){return t===`gram`?e:t===`kilogram`?e*1e3:null}function Ze(e){if(e.contents_per_unit!=null&&e.contents_unit){let t=Xe(e.contents_per_unit,e.contents_unit);if(t!=null)return e.quantity*t}return e.unit===`gram`?e.quantity:e.unit===`kilogram`?e.quantity*1e3:null}function Qe(e){return e.contents_per_unit!=null&&e.calories_per_content!=null?e.quantity*e.contents_per_unit*e.calories_per_content:e.calories_per_unit==null?null:e.quantity*e.calories_per_unit}function $e(e,t){if(t===`food`){let t=Qe(e);return t==null?``:`${q(t)} kcal`}if(t===`water`){let t=Ye(e);return t==null?``:`${q(t)} L`}if(t===`pet_food`){let t=Ze(e);return t==null?``:`${q(t)} g`}let n=[],r=Qe(e);r!=null&&n.push(`${q(r)} kcal`);let i=Ye(e);return i!=null&&n.push(`${q(i)} L`),n.join(` · `)}function et(e,t){let n={},r=t.contents_per_unit.trim(),i=t.contents_unit.trim(),a=t.calories_per_content.trim(),o=K(r),s=K(a);if(e===`food`||e===`water`||e===`pet_food`)(r===``||Number.isNaN(o)||o<=0)&&(n.contents_per_unit=`Contents per unit is required`),i?e===`water`&&i!==`liter`&&i!==`milliliter`?n.contents_unit=`Water contents must be liter or milliliter`:e===`pet_food`&&i!==`gram`&&i!==`kilogram`&&(n.contents_unit=`Pet food contents must be gram or kilogram`):n.contents_unit=`Contents unit is required`;else{let e=r!==``,t=!!i;(e||t)&&((!e||Number.isNaN(o)||o<=0)&&(n.contents_per_unit=`Enter contents per unit or clear both fields`),t||(n.contents_unit=`Select a contents unit or clear both fields`))}return e===`food`?(a===``||Number.isNaN(s)||s<0)&&(n.calories_per_content=`Calories per contents unit is required`):e===`none`&&a!==``&&(Number.isNaN(s)||s<0)&&(n.calories_per_content=`Enter a valid calorie value`),n}function tt(e,t){let n={},r=t.contents_per_unit.trim(),i=t.contents_unit.trim(),a=t.calories_per_content.trim();return e===`water`||e===`pet_food`?(n.contents_per_unit=K(r),n.contents_unit=i,n.calories_per_content=null,n.calories_per_unit=null,n):e===`food`?(n.contents_per_unit=K(r),n.contents_unit=i,n.calories_per_content=K(a),n):(r&&i?(n.contents_per_unit=K(r),n.contents_unit=i):(n.contents_per_unit=null,n.contents_unit=null,n.liters_per_unit=null),a?n.calories_per_content=K(a):(n.calories_per_content=null,n.calories_per_unit=null),n)}function nt(e,t){return t?t.expired.some(t=>t.id===e.id)?`expired`:t.within_urgent.some(t=>t.id===e.id)?`urgent`:t.within_expiring.some(t=>t.id===e.id)?`expiring`:t.low_stock.some(t=>t.id===e.id)?`low`:``:``}function rt(e,t,n,r){let i=[...e],a=r.search.trim().toLowerCase();if(a&&(i=i.filter(e=>e.name.toLowerCase().includes(a)||e.location.toLowerCase().includes(a)||e.category.toLowerCase().includes(a)||(e.barcode||``).toLowerCase().includes(a)||(e.notes||``).toLowerCase().includes(a))),r.filterLocation&&(i=i.filter(e=>e.location.toLowerCase()===r.filterLocation.toLowerCase())),r.filterCategory&&(i=i.filter(e=>e.category.toLowerCase()===r.filterCategory.toLowerCase())),r.filterReadiness&&(i=i.filter(e=>Ke(e.category,n)===r.filterReadiness)),r.filterStatus!==`all`){let e=new Set;r.filterStatus===`expired`?t?.expired.forEach(t=>e.add(t.id)):r.filterStatus===`expiring`?(t?.within_urgent.forEach(t=>e.add(t.id)),t?.within_expiring.forEach(t=>e.add(t.id))):r.filterStatus===`low_stock`&&t?.low_stock.forEach(t=>e.add(t.id)),i=i.filter(t=>e.has(t.id))}return i.sort((e,t)=>r.sort===`quantity`?e.quantity-t.quantity:r.sort===`expiry`?(e.expiry_date||`9999`).localeCompare(t.expiry_date||`9999`):e.name.localeCompare(t.name)),i}function it(e){return{id:e.id,name:e.name,type:e.type??``,foodPerDay:e.food_grams_per_day,waterPerDay:e.water_liters_per_day}}function at(e){return{key:e.key,count:e.count,caloriesPerPerson:e.calories_per_day,waterPerPerson:e.water_liters_per_day,caloriesSubtotal:e.count*e.calories_per_day,waterSubtotal:e.count*e.water_liters_per_day}}function ot(e){if(!e)return null;let t=(e.age_categories&&e.age_categories.length>0?e.age_categories:e.number_of_people==null?[]:[{key:`adults`,count:e.number_of_people,calories_per_day:e.calories_per_person_per_day,water_liters_per_day:e.water_liters_per_person_per_day}]).map(at);if(t.reduce((e,t)=>e+t.count,0)<=0)return null;let n=(e.pets??[]).map(it),r=n.reduce((e,t)=>e+t.waterPerDay,0);return{rows:t,pets:n,dailyCalories:t.reduce((e,t)=>e+t.caloriesSubtotal,0),dailyWater:t.reduce((e,t)=>e+t.waterSubtotal,0)+r,dailyPetWater:r,dailyPetFood:n.reduce((e,t)=>e+t.foodPerDay,0),days:e.duration_hours/24}}var st={en:{"status.expired":`Expired`,"status.urgent":`Urgent`,"status.expiring":`Expiring`,"status.low":`Low stock`,"action.open_menu":`Open menu`,"action.scan":`Scan`,"action.add_item":`Add item`,"action.add_from_template":`Add from template`,"action.push_restock":`Push restock list`,"action.close":`Close`,"action.save":`Save`,"action.cancel":`Cancel`,"action.delete":`Delete`,"action.lookup":`Lookup`,"action.edit":`Edit`,"action.apply_template":`Add missing items`,"stat.readiness":`Readiness`,"stat.water":`Water`,"stat.food":`Food`,"stat.pet_food":`Pet food`,"stat.completeness":`Completeness`,"completeness.title":`Completeness`,"completeness.open":`Show what is missing from completeness`,"completeness.overall":`Overall`,"completeness.all_complete":`Everything is complete.`,"completeness.category_complete":`Complete`,"completeness.expired":`expired`,"completeness.stock":`{quantity} of {desired}`,"household.title":`Household needs`,"household.category":`Category`,"household.count":`People`,"household.per_person":`Per person per day`,"household.subtotal":`Subtotal per day`,"household.total_per_day":`Total per day`,"household.total_period":`Total for {days} days`,"household.adults":`Adults (18–69)`,"household.children":`Children (4–17)`,"household.babies_toddlers":`Babies and toddlers (0–3)`,"household.seniors":`Seniors (70+)`,"household.pets":`Pets`,"household.pet_food_period":`Pet food for {days} days`,"stat.hours_suffix":`h`,"filter.search_placeholder":`Search inventory`,"filter.all_status":`All statuses`,"filter.all_location":`All locations`,"filter.all_category":`All categories`,"filter.all_readiness":`All readiness`,"filter.readiness_food":`Food`,"filter.readiness_water":`Water`,"filter.readiness_pet_food":`Pet food`,"filter.readiness_none":`Other`,"filter.sort":`Sort`,"empty.inventory":`No items yet. Add your first supply.`,"empty.filtered":`No items match these filters.`,"dialog.add_title":`Add item`,"dialog.edit_title":`Edit item`,"dialog.template_title":`Add from template`,"field.name":`Name`,"field.quantity":`Quantity`,"field.desired":`Desired`,"field.unit":`Unit`,"field.location":`Location`,"field.category":`Category`,"field.priority":`Priority`,"field.expiry":`Expiry`,"field.notes":`Notes`,"field.barcode":`Barcode`,"field.contents":`Contents per unit`,"field.contents_unit":`Contents unit`,"field.calories":`Calories per contents unit`,"priority.essential":`Essential`,"priority.important":`Important`,"priority.optional":`Optional`,"hint.measure_readiness":`These fields count toward readiness.`,"companion.scan_needed":`Scanning needs the Home Assistant Companion app. Enter the barcode and tap Lookup.`,"template.skip_existing":`Existing names are skipped.`,"template.items":`items`,"error.generic":`Something went wrong`},nl:{"status.expired":`Verlopen`,"status.urgent":`Urgent`,"status.expiring":`Bijna verlopen`,"status.low":`Lage voorraad`,"action.open_menu":`Menu openen`,"action.scan":`Scannen`,"action.add_item":`Item toevoegen`,"action.add_from_template":`Uit sjabloon`,"action.push_restock":`Aanvullijst sturen`,"action.close":`Sluiten`,"action.save":`Opslaan`,"action.cancel":`Annuleren`,"action.delete":`Verwijderen`,"action.lookup":`Opzoeken`,"action.edit":`Bewerken`,"action.apply_template":`Ontbrekende items toevoegen`,"stat.readiness":`Paraatheid`,"stat.water":`Water`,"stat.food":`Voedsel`,"stat.pet_food":`Huisdiervoer`,"stat.completeness":`Compleetheid`,"completeness.title":`Compleetheid`,"completeness.open":`Toon wat er ontbreekt voor compleetheid`,"completeness.overall":`Totaal`,"completeness.all_complete":`Alles is compleet.`,"completeness.category_complete":`Compleet`,"completeness.expired":`verlopen`,"completeness.stock":`{quantity} van {desired}`,"household.title":`Behoefte huishouden`,"household.category":`Categorie`,"household.count":`Personen`,"household.per_person":`Per persoon per dag`,"household.subtotal":`Subtotaal per dag`,"household.total_per_day":`Totaal per dag`,"household.total_period":`Totaal voor {days} dagen`,"household.adults":`Volwassenen (18–69)`,"household.children":`Kinderen (4–17)`,"household.babies_toddlers":`Baby’s en peuters (0–3)`,"household.seniors":`Ouderen (70+)`,"household.pets":`Huisdieren`,"household.pet_food_period":`Huisdiervoer voor {days} dagen`,"stat.hours_suffix":`u`,"filter.search_placeholder":`Zoek in voorraad`,"filter.all_status":`Alle statussen`,"filter.all_location":`Alle locaties`,"filter.all_category":`Alle categorieën`,"filter.all_readiness":`Alle paraatheid`,"filter.readiness_food":`Voedsel`,"filter.readiness_water":`Water`,"filter.readiness_pet_food":`Huisdiervoer`,"filter.readiness_none":`Overig`,"filter.sort":`Sorteren`,"empty.inventory":`Nog geen items. Voeg je eerste voorraad toe.`,"empty.filtered":`Geen items matchen deze filters.`,"dialog.add_title":`Item toevoegen`,"dialog.edit_title":`Item bewerken`,"dialog.template_title":`Uit sjabloon toevoegen`,"field.name":`Naam`,"field.quantity":`Hoeveelheid`,"field.desired":`Gewenst`,"field.unit":`Eenheid`,"field.location":`Locatie`,"field.category":`Categorie`,"field.priority":`Prioriteit`,"field.expiry":`Houdbaarheidsdatum`,"field.notes":`Notities`,"field.barcode":`Barcode`,"field.contents":`Inhoud per eenheid`,"field.contents_unit":`Inhoudseenheid`,"field.calories":`Calorieën per inhoudseenheid`,"priority.essential":`Essentieel`,"priority.important":`Belangrijk`,"priority.optional":`Optioneel`,"hint.measure_readiness":`Deze velden tellen mee voor paraatheid.`,"companion.scan_needed":`Scannen vereist de Home Assistant Companion-app. Voer de barcode in en tik op Opzoeken.`,"template.skip_existing":`Bestaande namen worden overgeslagen.`,"template.items":`items`,"error.generic":`Er ging iets mis`}};function ct(e){let t=e?.locale?.language||e?.language||`en`;return String(t).toLowerCase().split(`-`)[0]===`nl`?`nl`:`en`}function lt(e,t,n){let r=st[ct(e)][t]??st.en[t]??t;if(n)for(let[e,t]of Object.entries(n))r=r.replaceAll(`{${e}}`,String(t));return r}function ut(e,t){let n=`status.${t}`,r=lt(e,n);return r===n?t:r}var J={search:``,filterStatus:`all`,filterLocation:``,filterCategory:``,filterReadiness:``,filtersOpen:!1,sort:`name`},dt=`ready_home.panel.view`,ft=new Set([`name`,`expiry`,`quantity`]);function pt(e){return e?`${dt}.${e}`:dt}function Y(e,t){return typeof e==`string`?e:t}function mt(e,t){if(!e)return{...J};try{let n=e.getItem(pt(t));if(!n)return{...J};let r=JSON.parse(n),i=Y(r.sort,`name`);return{search:Y(r.search,``),filterStatus:Y(r.filterStatus,`all`),filterLocation:Y(r.filterLocation,``),filterCategory:Y(r.filterCategory,``),filterReadiness:Y(r.filterReadiness,``),filtersOpen:!!r.filtersOpen,sort:ft.has(i)?i:`name`}}catch{return{...J}}}function ht(e,t,n){if(e)try{e.setItem(pt(n),JSON.stringify(t))}catch{}}function X(e,t=``){let n=new Set,r=[];for(let i of[...e,t]){let e=i?.trim();if(!e)continue;let t=e.toLowerCase();n.has(t)||(n.add(t),r.push(e))}return r.sort((e,t)=>e.localeCompare(t,void 0,{sensitivity:`base`})),r}function gt(e,t){return e==null||Number.isNaN(Number(e))?``:Number(e)<=0?`bad`:Number(e)<Number(t)?`warn`:`ok`}function Z(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}var _t=`ready-home-panel`,Q=`/api/ready_home/brand`,vt=`${Q}/logo.png`,yt=`${Q}/logo@2x.png`,bt=`${Q}/dark_logo.png`,xt=`${Q}/dark_logo@2x.png`,St=`M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z`,Ct=`M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z`,wt=`M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1Z`,Tt=`M12,20A6,6 0 0,1 6,14C6,10 12,3.25 12,3.25C12,3.25 18,10 18,14A6,6 0 0,1 12,20Z`,Et=`M18.06 23H19.72C20.56 23 21.25 22.35 21.35 21.53L23 5.05H18V1H16.03V5.05H11.06L11.36 7.39C13.07 7.86 14.67 8.71 15.63 9.65C17.07 11.07 18.06 12.54 18.06 14.94V23M1 22V21H16.03V22C16.03 22.54 15.58 23 15 23H2C1.45 23 1 22.54 1 22M16.03 15C16.03 7 1 7 1 15H16.03M1 17H16V19H1V17Z`,Dt=`M8.35,3C9.53,2.83 10.78,4.12 11.14,5.9C11.5,7.67 10.85,9.25 9.67,9.43C8.5,9.61 7.24,8.32 6.88,6.54C6.5,4.77 7.17,3.19 8.35,3M15.5,3C16.69,3.19 17.35,4.77 17,6.54C16.62,8.32 15.37,9.61 14.19,9.43C13,9.25 12.35,7.67 12.71,5.9C13.08,4.12 14.33,2.83 15.5,3M3,7.6C4.14,7.11 5.69,8 6.5,9.55C7.26,11.13 7,12.79 5.87,13.28C4.74,13.77 3.2,12.89 2.41,11.32C1.62,9.75 1.9,8.08 3,7.6M21,7.6C22.1,8.08 22.38,9.75 21.59,11.32C20.8,12.89 19.26,13.77 18.13,13.28C17,12.79 16.74,11.13 17.5,9.55C18.31,8 19.86,7.11 21,7.6M19.33,18.38C19.37,19.32 18.65,20.36 17.79,20.75C16,21.57 13.88,19.87 11.89,19.87C9.9,19.87 7.76,21.64 6,20.75C5,20.26 4.31,18.96 4.44,17.88C4.62,16.39 6.41,15.59 7.47,14.5C8.88,13.09 9.88,10.44 11.89,10.44C13.89,10.44 14.95,13.05 16.3,14.5C17.41,15.72 19.26,16.75 19.33,18.38Z`,Ot=`M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3Z`,kt=[`box`,`pack`,`piece`],At=[`gram`,`kilogram`,`liter`,`milliliter`],jt=[`essential`,`important`,`optional`];function Mt(e){return e&&e.charAt(0).toUpperCase()+e.slice(1)}var $=class extends B{constructor(...e){super(...e),this.narrow=!1,this._snapshot=null,this._settings=null,this._search=``,this._filterStatus=`all`,this._filterLocation=``,this._filterCategory=``,this._filterReadiness=``,this._filtersOpen=!1,this._sort=`name`,this._dialogOpen=!1,this._editing=null,this._form={},this._error=``,this._barcodeError=``,this._fieldErrors={},this._saving=!1,this._scanning=!1,this._pendingRemoveIds=[],this._completenessOpen=!1,this._templateOpen=!1,this._templates=[],this._templateBusy=!1,this._unsub=null,this._connected=!1,this._scanHandle=null,this._viewHydrated=!1,this._resetFilters=()=>{this._filterLocation=``,this._filterCategory=``,this._filterReadiness=``,this._persistViewState()},this._toggleMenu=e=>{e?.stopPropagation(),this.dispatchEvent(new CustomEvent(`hass-toggle-menu`,{bubbles:!0,composed:!0}))},this._openTemplates=async()=>{if(this.hass){this._templateBusy=!0,this._error=``;try{this._templates=await Le(this.hass),this._templateOpen=!0}catch(e){this._error=G(e)}finally{this._templateBusy=!1}}},this._openCompleteness=()=>{this._completenessOpen=!0},this._closeCompleteness=()=>{this._completenessOpen=!1,this.updateComplete.then(()=>this.shadowRoot?.querySelector(`.stat-button`)?.focus())},this._closeTemplates=()=>{this._templateOpen=!1},this._openAdd=()=>{this._canWrite()&&(this._editing=null,this._form=this._blankForm(),this._fieldErrors={},this._error=``,this._barcodeError=``,this._dialogOpen=!0)},this._openEdit=e=>{this._editing=e;let t=kt.includes(e.unit)?e.unit:`piece`,n=e.contents_per_unit,r=e.contents_unit||``,i=e.calories_per_content;n==null&&e.liters_per_unit!=null&&(n=e.liters_per_unit,r=`liter`),i==null&&e.calories_per_unit!=null&&n==null&&(n=1,r||=`gram`,i=e.calories_per_unit),this._form={name:e.name,quantity:String(e.quantity),desired_quantity:String(e.desired_quantity),unit:t,location:e.location,category:e.category,priority:e.priority,notes:e.notes||``,barcode:e.barcode||``,expiry_date:e.expiry_date||``,contents_per_unit:n==null?``:String(n),contents_unit:r,calories_per_content:i==null?``:String(i)},this._fieldErrors={},this._error=``,this._barcodeError=``,this._dialogOpen=!0},this._closeDialog=()=>{this._abortScan(),this._dialogOpen=!1,this._fieldErrors={},this._error=``,this._barcodeError=``},this._onWindowKeyDown=e=>{e.key===`Escape`&&(this._completenessOpen?(e.preventDefault(),this._closeCompleteness()):this._dialogOpen&&(e.preventDefault(),this._closeDialog()))}}connectedCallback(){super.connectedCallback(),this._connected=!0,this._restoreViewState(),window.addEventListener(`keydown`,this._onWindowKeyDown),this._connect()}disconnectedCallback(){super.disconnectedCallback(),this._connected=!1,window.removeEventListener(`keydown`,this._onWindowKeyDown),this._abortScan(),this._unsub?.(),this._unsub=null}updated(e){e.has(`hass`)&&this.hass&&!this._unsub&&this._connected&&this._connect()}async _connect(){if(this.hass&&!this._unsub)try{this._settings=await Pe(this.hass),this._unsub=await Fe(this.hass,e=>{this._applySnapshot(e)}),this._error=``}catch(e){this._error=G(e)}}_entryId(){let e=this.panel?.config?.config_entry_id;return typeof e==`string`&&e?e:null}_canWrite(){return this.hass?.user?.is_admin===!0}_restoreViewState(){let e=mt(typeof localStorage<`u`?localStorage:null,this._entryId());this._search=e.search,this._filterStatus=e.filterStatus,this._filterLocation=e.filterLocation,this._filterCategory=e.filterCategory,this._filterReadiness=e.filterReadiness,this._filtersOpen=e.filtersOpen,this._sort=e.sort,this._viewHydrated=!0}_persistViewState(){this._viewHydrated&&ht(typeof localStorage<`u`?localStorage:null,{search:this._search,filterStatus:this._filterStatus,filterLocation:this._filterLocation,filterCategory:this._filterCategory,filterReadiness:this._filterReadiness,filtersOpen:this._filtersOpen,sort:this._sort},this._entryId())}_applySnapshot(e){if(this._snapshot=e,e.settings&&(this._settings=e.settings),!this._pendingRemoveIds.length)return;let t=new Set(e.items.map(e=>e.id)),n=this._pendingRemoveIds.filter(e=>t.has(e));n.length!==this._pendingRemoveIds.length&&(this._pendingRemoveIds=n)}_isRemovePending(e){return this._pendingRemoveIds.includes(e)}get _assessment(){return this._snapshot?.assessment??{}}get _bucketCounts(){let e=this._snapshot?.buckets;return{expired:e?.expired.length??0,expiring:(e?.within_urgent.length??0)+(e?.within_expiring.length??0),low_stock:e?.low_stock.length??0}}get _activeFilterCount(){let e=0;return this._filterLocation&&(e+=1),this._filterCategory&&(e+=1),this._filterReadiness&&(e+=1),e}_readinessKind(e){return Ke(e,this._settings)}get _items(){return rt(this._snapshot?.items??[],this._snapshot?.buckets,this._settings,{search:this._search,filterStatus:this._filterStatus,filterLocation:this._filterLocation,filterCategory:this._filterCategory,filterReadiness:this._filterReadiness,sort:this._sort})}_itemStatus(e){return nt(e,this._snapshot?.buckets)}_t(e,t){return lt(this.hass,e,t)}_statusLabel(e){return ut(this.hass,e)}_setStatusFilter(e){this._filterStatus=this._filterStatus===e?`all`:e,this._persistViewState()}_pct(e){return e==null||Number.isNaN(Number(e))?`—`:`${Math.round(Number(e))}%`}_completenessPercent(){let e=this._snapshot?.completeness?.overall_percent;return e==null||Number.isNaN(Number(e))?null:Number(e)}_formatHours(e){if(e==null||Number.isNaN(Number(e)))return`—`;let t=Math.max(0,Math.round(Number(e)));return t<48?`${t}h`:`${Math.round(t/24)}d`}_formatAmount(e,t){if(e==null||Number.isNaN(Number(e)))return`—`;let n=Number(e);return`${Math.abs(n-Math.round(n))<.05?Math.round(n):Math.round(n*10)/10} ${t}`}_durationHours(){return this._assessment.duration_hours??this._settings?.duration_hours??72}_statToneClass(e){let t=gt(e,this._durationHours());return t?`stat-${t}`:``}_durationClass(e){let t=gt(e,this._durationHours());return t===`bad`?`duration-bad`:t===`warn`?`duration-warn`:``}_expiryClass(e){return e===`expired`?`expiry-expired`:e===`urgent`||e===`expiring`?`expiry-warn`:``}_formatDate(e){if(!e)return`—`;let t=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e.trim());if(!t)return e;let n=new Date(Number(t[1]),Number(t[2])-1,Number(t[3]));if(Number.isNaN(n.getTime()))return e;let r=this.hass?.locale,i=r?.language||this.hass?.language||navigator.language||`en`,a=r?.date_format??`language`,o=a===`system`?void 0:i,s=new Intl.DateTimeFormat(o,{year:`numeric`,month:`numeric`,day:`numeric`});if(a===`language`||a===`system`)return s.format(n);let c=s.formatToParts(n),l=c.find(e=>e.type===`literal`)?.value??`/`,u=c.find(e=>e.type===`day`)?.value??``,d=c.find(e=>e.type===`month`)?.value??``,f=c.find(e=>e.type===`year`)?.value??``,p=c[c.length-1],m=p?.type===`literal`?p.value:``;return a===`DMY`?`${u}${l}${d}${l}${f}${m}`:a===`MDY`?`${d}${l}${u}${l}${f}${m}`:`${f}${l}${d}${l}${u}${m}`}_optionList(e,t){return X(e,t)}_mdButton(e,t){return j`
      <button
        type="button"
        class="md-btn md-btn-${t.variant??`outlined`}"
        ?disabled=${t.disabled??!1}
        @click=${t.onClick}
      >
        ${e}
      </button>
    `}render(){let e=this._items,t=this._assessment,n=X(this._settings?.locations??[]),r=X(this._settings?.categories??[]),i=t.overall_percent,a=t.water_percent,o=t.food_percent,s=this._completenessPercent(),c=this._bucketCounts,l=t.supply_hours,u=t.water_supply_hours,d=t.food_supply_hours,f=t.pet_food_target,p=f!=null&&f>0,m=t.pet_food_supply_hours,h=this.hass?.themes?.darkMode===!0,g=h?bt:vt,ee=h?`${bt} 1x, ${xt} 2x`:`${vt} 1x, ${yt} 2x`;return j`
      <div class="page">
        <header class="header">
          <div class="header-row">
            <div class="brand">
              ${this.narrow?j`
                    <button
                      type="button"
                      class="icon-btn"
                      aria-label=${this._t(`action.open_menu`)}
                      @click=${this._toggleMenu}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="currentColor" d=${St} />
                      </svg>
                    </button>
                  `:N}
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
            <div class="header-actions">
              ${this._canWrite()?j`
                    ${this._mdButton(this._t(`action.scan`),{variant:`outlined`,disabled:this._scanning,onClick:()=>void this._scanFromPanel()})}
                    ${this._mdButton(this._t(`action.add_from_template`),{variant:`outlined`,onClick:()=>void this._openTemplates()})}
                    ${this._settings?.todo_entity_id?this._mdButton(this._t(`action.push_restock`),{variant:`outlined`,onClick:()=>void this._pushRestock()}):N}
                    ${this._mdButton(this._t(`action.add_item`),{variant:`filled`,onClick:this._openAdd})}
                  `:N}
            </div>
          </div>
        </header>

        <div class="content">
          <div class="stats">
            <div class="stat ${this._statToneClass(l)}">
              <span class="stat-label">
                <svg class="stat-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d=${wt} />
                </svg>
                ${this._t(`stat.readiness`)}
              </span>
              <span class="stat-value">${this._pct(i)}</span>
              <span class="stat-duration ${this._durationClass(l)}"
                >${this._formatHours(l)}</span
              >
            </div>
            <div class="stat ${this._statToneClass(u)}">
              <span class="stat-label">
                <svg class="stat-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d=${Tt} />
                </svg>
                ${this._t(`stat.water`)}
              </span>
              <span class="stat-value"
                >${this._formatAmount(t.water_on_hand,`L`)}</span
              >
              <span class="stat-meta"
                >${this._pct(a)} ·
                ${this._formatAmount(t.water_target,`L`)}</span
              >
              <span class="stat-duration ${this._durationClass(u)}"
                >${this._formatHours(u)}</span
              >
            </div>
            <div class="stat ${this._statToneClass(d)}">
              <span class="stat-label">
                <svg class="stat-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d=${Et} />
                </svg>
                ${this._t(`stat.food`)}
              </span>
              <span class="stat-value"
                >${this._formatAmount(t.food_on_hand,`kcal`)}</span
              >
              <span class="stat-meta"
                >${this._pct(o)} ·
                ${this._formatAmount(t.food_target,`kcal`)}</span
              >
              <span class="stat-duration ${this._durationClass(d)}"
                >${this._formatHours(d)}</span
              >
            </div>
            ${p?j`
                  <div class="stat ${this._statToneClass(m)}">
                    <span class="stat-label">
                      <svg
                        class="stat-icon"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path fill="currentColor" d=${Dt} />
                      </svg>
                      ${this._t(`stat.pet_food`)}
                    </span>
                    <span class="stat-value"
                      >${this._formatAmount(t.pet_food_on_hand,`g`)}</span
                    >
                    <span class="stat-meta"
                      >${this._pct(t.pet_food_percent)} ·
                      ${this._formatAmount(f,`g`)}</span
                    >
                    <span class="stat-duration ${this._durationClass(m)}"
                      >${this._formatHours(m)}</span
                    >
                  </div>
                `:N}
            ${s==null?N:j`
                  <button
                    type="button"
                    class="stat stat-button"
                    aria-haspopup="dialog"
                    aria-label=${this._t(`completeness.open`)}
                    @click=${this._openCompleteness}
                  >
                    <span class="stat-label">
                      <svg
                        class="stat-icon"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path fill="currentColor" d=${Ot} />
                      </svg>
                      ${this._t(`stat.completeness`)}
                    </span>
                    <span class="stat-value">${this._pct(s)}</span>
                  </button>
                `}
          </div>

          ${this._renderHousehold()}

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
                <button
                  type="button"
                  class="md-btn md-btn-outlined filters-btn ${this._filtersOpen||this._activeFilterCount?`active`:``}"
                  @click=${()=>{this._filtersOpen=!this._filtersOpen,this._persistViewState()}}
                >
                  Filters${this._activeFilterCount?j` (${this._activeFilterCount})`:N}
                </button>
              </div>
              ${this._filtersOpen?j`
                    <div class="filters">
                      <select
                        .value=${this._filterLocation}
                        @change=${e=>{this._filterLocation=e.target.value,this._persistViewState()}}
                      >
                        <option value=""
                          >${this._t(`filter.all_location`)}</option
                        >
                        ${n.map(e=>j`<option value=${e}>${e}</option>`)}
                      </select>
                      <select
                        .value=${this._filterCategory}
                        @change=${e=>{this._filterCategory=e.target.value,this._persistViewState()}}
                      >
                        <option value=""
                          >${this._t(`filter.all_category`)}</option
                        >
                        ${r.map(e=>j`<option value=${e}>${e}</option>`)}
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
                      ${this._activeFilterCount?this._mdButton(`Reset`,{variant:`text`,onClick:this._resetFilters}):N}
                    </div>
                  `:N}
              <div class="inventory-meta">
                <span class="item-count"
                  >${e.length}/${this._snapshot?.items.length??0}</span
                >
              </div>
            </div>

            ${this._error?j`<div class="error" role="alert">${this._error}</div>`:N}

            ${this.narrow?this._renderCardList(e):this._renderTable(e)}
          </section>
        </div>
      </div>

      ${this._dialogOpen?this._renderDialog():N}
      ${this._completenessOpen?this._renderCompletenessDialog():N}
      ${this._templateOpen?this._renderTemplateDialog():N}
    `}_renderEmpty(){return this._snapshot?j`
      <div class="empty">
        No items match.
        ${this._canWrite()?j`
              <div class="empty-actions">
                ${this._mdButton(`Scan`,{variant:`outlined`,disabled:this._scanning,onClick:()=>void this._scanFromPanel()})}
                ${this._mdButton(`Add an item`,{variant:`text`,onClick:this._openAdd})}
              </div>
            `:N}
      </div>
    `:j`<div class="empty">Loading inventory…</div>`}_renderQtyText(e){return j`
      <span class="qty-text"
        >${e.quantity}${e.desired_quantity?j` / ${e.desired_quantity}`:N}
        ${e.unit}</span
      >
    `}_renderMeasure(e){return $e(e,this._readinessKind(e.category))}_contentsToLiters(e,t){return Je(e,t)}_formatMeasureNumber(e){let t=Number(e);return Number.isNaN(t)?`—`:Math.abs(t-Math.round(t))<.05?String(Math.round(t)):String(Math.round(t*100)/100)}_contentsUnitLabel(e){return Mt(e||`unit`)}_formTotalContents(){let e=this._parseDecimal(this._form.quantity||`0`),t=this._parseDecimal(this._form.contents_per_unit||``);return!this._form.contents_per_unit||Number.isNaN(t)?null:e*t}_formTotalCalories(){let e=this._formTotalContents(),t=this._parseDecimal(this._form.calories_per_content||``);return e==null||!this._form.calories_per_content||Number.isNaN(t)?null:e*t}_formTotalLiters(){let e=this._formTotalContents();return e==null||!this._form.contents_unit?null:this._contentsToLiters(e,this._form.contents_unit)}_fieldLabel(e,t=!1){return j`<span class="field-label"
      >${e}${t?j`<span class="req" aria-hidden="true">*</span>`:N}</span
    >`}_fieldError(e){let t=this._fieldErrors[e];return t?j`<div class="field-error">${t}</div>`:N}_fieldInvalid(e){return!!this._fieldErrors[e]}_validateForm(){let e=this._form,t={};(e.name||``).trim()||(t.name=`Name is required`),(e.location||``).trim()||(t.location=`Location is required`),(e.category||``).trim()||(t.category=`Category is required`);let n=this._parseDecimal(e.quantity);return(e.quantity===``||Number.isNaN(n)||n<0)&&(t.quantity=`Enter a valid quantity`),(e.unit||``).trim()||(t.unit=`Unit is required`),Object.assign(t,et(this._formReadiness(),{contents_per_unit:e.contents_per_unit||``,contents_unit:e.contents_unit||``,calories_per_content:e.calories_per_content||``})),t}_renderStatusBadge(e){return e?j`<span class="badge badge-${e}"
      >${this._statusLabel(e)}</span
    >`:N}_renderHousehold(){let e=ot(this._settings);if(!e)return N;let t=Math.round(e.days*10)/10;return j`
      <details class="household">
        <summary>${this._t(`household.title`)}</summary>
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
              ${e.rows.map(e=>j`<tr>
                  <td>${this._t(`household.${e.key}`)}</td>
                  <td>${e.count}</td>
                  <td>
                    ${this._formatAmount(e.caloriesPerPerson,`kcal`)} ·
                    ${this._formatAmount(e.waterPerPerson,`L`)}
                  </td>
                  <td>
                    ${this._formatAmount(e.caloriesSubtotal,`kcal`)} ·
                    ${this._formatAmount(e.waterSubtotal,`L`)}
                  </td>
                </tr>`)}
              ${e.pets.length>0?j`<tr>
                    <th colspan="4">${this._t(`household.pets`)}</th>
                  </tr>`:N}
              ${e.pets.map(e=>j`<tr>
                  <td>
                    ${e.name}${e.type?j` (${e.type})`:N}
                  </td>
                  <td>1</td>
                  <td>
                    ${this._formatAmount(e.foodPerDay,`g`)} ·
                    ${this._formatAmount(e.waterPerDay,`L`)}
                  </td>
                  <td>
                    ${this._formatAmount(e.foodPerDay,`g`)} ·
                    ${this._formatAmount(e.waterPerDay,`L`)}
                  </td>
                </tr>`)}
              <tr>
                <th colspan="3">${this._t(`household.total_per_day`)}</th>
                <td>
                  ${this._formatAmount(e.dailyCalories,`kcal`)} ·
                  ${this._formatAmount(e.dailyWater,`L`)}
                </td>
              </tr>
              <tr>
                <th colspan="3">
                  ${this._t(`household.total_period`,{days:t})}
                </th>
                <td>
                  ${this._formatAmount(e.dailyCalories*e.days,`kcal`)} ·
                  ${this._formatAmount(e.dailyWater*e.days,`L`)}
                </td>
              </tr>
              ${e.pets.length>0?j`<tr>
                    <th colspan="3">
                      ${this._t(`household.pet_food_period`,{days:t})}
                    </th>
                    <td>${this._formatAmount(e.dailyPetFood*e.days,`g`)}</td>
                  </tr>`:N}
            </tbody>
          </table>
        </div>
      </details>
    `}_renderTable(e){return j`
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
            ${e.length===0?j`<tr>
                  <td colspan="8">${this._renderEmpty()}</td>
                </tr>`:N}
          </tbody>
        </table>
      </div>
    `}_renderCardList(e){return e.length===0?this._renderEmpty():j`
      <div class="card-list">
        ${e.map(e=>this._renderItemCard(e))}
      </div>
    `}_renderRow(e){let t=this._itemStatus(e),n=this._renderMeasure(e);return j`
      <tr class=${t?`row-${t}`:``}>
        <td>
          <button class="link" @click=${()=>this._openEdit(e)}>
            ${e.name}
          </button>
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
          ${this._canWrite()?this._mdButton(`Remove`,{variant:`danger-text`,disabled:this._isRemovePending(e.id),onClick:()=>void this._remove(e)}):N}
        </td>
      </tr>
    `}_renderItemCard(e){let t=this._itemStatus(e),n=this._renderMeasure(e),r=[e.location,e.category,n].filter(Boolean).join(` · `);return j`
      <article
        class="item-card ${t?`row-${t}`:``}"
        @click=${()=>this._openEdit(e)}
      >
        <div class="item-card-top">
          <div class="item-card-title">
            <span class="item-name">${e.name}</span>
            ${this._renderStatusBadge(t)}
          </div>
          <button
            type="button"
            class="md-btn md-btn-danger-text"
            ?disabled=${this._isRemovePending(e.id)}
            ?hidden=${!this._canWrite()}
            @click=${t=>{t.stopPropagation(),this._remove(e)}}
          >
            Remove
          </button>
        </div>
        ${r?j`<div class="meta">${r}</div>`:N}
        <div class="item-card-bottom">
          ${this._renderQtyText(e)}
          ${e.expiry_date?j`<span class="${this._expiryClass(t)}"
                >${this._formatDate(e.expiry_date)}</span
              >`:N}
        </div>
      </article>
    `}_formReadiness(){return this._readinessKind(this._form.category||``)}_showCaloriesField(){return qe(this._formReadiness())}_renderDialog(){let e=this._form,t=this._optionList(this._settings?.locations??[],e.location||``),n=this._optionList(this._settings?.categories??[],e.category||``),r=this._formReadiness(),i=this._formTotalContents(),a=this._formTotalLiters(),o=this._formTotalCalories(),s=this._contentsUnitLabel(e.contents_unit||`unit`),c=``;i!=null&&e.contents_unit&&(c=`Total on hand: ${this._formatMeasureNumber(i)} ${s}`,a!=null&&(c+=` · ${this._formatMeasureNumber(a)} L`),o!=null&&(c+=` · ${this._formatMeasureNumber(o)} kcal`));let l=this._canWrite(),u=this._editing?this._t(`dialog.edit_title`):this._t(`dialog.add_title`);return j`
      <div class="dialog-backdrop">
        <div
          class="dialog ${this.narrow?`dialog-narrow`:``}"
          role="dialog"
          aria-modal="true"
          aria-label=${u}
        >
          <div class="dialog-header">
            <h2>${u}</h2>
            <button
              type="button"
              class="icon-btn dialog-close"
              aria-label=${this._t(`action.close`)}
              @click=${this._closeDialog}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d=${Ct} />
              </svg>
            </button>
          </div>

          <div class="form-section">
            <div class="form-section-title">Details</div>
            <label
              >${this._t(`field.barcode`)}
              <div class="barcode-row">
                <input
                  .value=${e.barcode||``}
                  ?disabled=${!l}
                  @input=${this._onField(`barcode`)}
                />
                ${l?j`
                      ${this._mdButton(this._t(`action.scan`),{variant:`outlined`,disabled:this._scanning,onClick:()=>void this._scanBarcode()})}
                      ${this._mdButton(this._t(`action.lookup`),{variant:`outlined`,disabled:this._scanning||!(e.barcode||``).trim(),onClick:()=>void this._lookupBarcode()})}
                    `:N}
              </div>
              ${this._barcodeError?j`<div class="field-error" role="alert">
                    ${this._barcodeError}
                  </div>`:N}
            </label>
            <label
              >${this._fieldLabel(`Name`,l)}
              <input
                class=${this._fieldInvalid(`name`)?`invalid`:``}
                .value=${e.name||``}
                ?disabled=${!l}
                @input=${this._onField(`name`)}
              />
              ${this._fieldError(`name`)}
            </label>
            <div class="row2">
              <label
                >${this._fieldLabel(`Location`,l)}
                <select
                  class=${this._fieldInvalid(`location`)?`invalid`:``}
                  .value=${H(e.location||``)}
                  ?disabled=${!l}
                  @change=${this._onField(`location`)}
                >
                  <option value="" ?selected=${!e.location}>
                    Select location
                  </option>
                  ${t.map(t=>j`<option
                        value=${t}
                        ?selected=${(e.location||``)===t}
                      >
                        ${t}
                      </option>`)}
                </select>
                ${this._fieldError(`location`)}
              </label>
              <label
                >${this._fieldLabel(`Category`,l)}
                <select
                  class=${this._fieldInvalid(`category`)?`invalid`:``}
                  .value=${H(e.category||``)}
                  ?disabled=${!l}
                  @change=${this._onField(`category`)}
                >
                  <option value="" ?selected=${!e.category}>
                    Select category
                  </option>
                  ${n.map(t=>j`<option
                        value=${t}
                        ?selected=${(e.category||``)===t}
                      >
                        ${t}
                      </option>`)}
                </select>
                ${this._fieldError(`category`)}
              </label>
            </div>
            <label
              >${this._t(`field.priority`)}
              <select
                .value=${H(e.priority||`important`)}
                ?disabled=${!l}
                @change=${this._onField(`priority`)}
              >
                ${jt.map(t=>j`<option
                      value=${t}
                      ?selected=${(e.priority||`important`)===t}
                    >
                      ${this._t(`priority.${t}`)}
                    </option>`)}
              </select>
            </label>
            <label
              >${this._t(`field.notes`)}
              <input
                .value=${e.notes||``}
                ?disabled=${!l}
                @input=${this._onField(`notes`)}
              />
            </label>
          </div>

          <div class="form-section">
            <div class="form-section-title">Stock</div>
            <div class="row3">
              <label
                >${this._fieldLabel(`Quantity`,l)}
                <input
                  class=${this._fieldInvalid(`quantity`)?`invalid`:``}
                  type="text"
                  inputmode="decimal"
                  .value=${H(e.quantity||`1`)}
                  ?disabled=${!l}
                  @input=${this._onField(`quantity`)}
                />
                ${this._fieldError(`quantity`)}
                ${c?j`<div class="field-hint">${c}</div>`:N}
              </label>
              <label
                >Desired quantity
                <input
                  type="text"
                  inputmode="decimal"
                  .value=${H(e.desired_quantity||`0`)}
                  ?disabled=${!l}
                  @input=${this._onField(`desired_quantity`)}
                />
              </label>
              <label
                >${this._fieldLabel(`Unit`,l)}
                <select
                  class=${this._fieldInvalid(`unit`)?`invalid`:``}
                  .value=${H(e.unit||`piece`)}
                  ?disabled=${!l}
                  @change=${this._onField(`unit`)}
                >
                  ${kt.map(t=>j`<option
                        value=${t}
                        ?selected=${(e.unit||`piece`)===t}
                      >
                        ${Mt(t)}
                      </option>`)}
                </select>
                ${this._fieldError(`unit`)}
              </label>
            </div>
            <div class="row2">
              <label
                >${this._fieldLabel(`Contents per unit`,l&&(r===`food`||r===`water`||r===`pet_food`))}
                <input
                  class=${this._fieldInvalid(`contents_per_unit`)?`invalid`:``}
                  type="text"
                  inputmode="decimal"
                  .value=${H(e.contents_per_unit||``)}
                  ?disabled=${!l}
                  @input=${this._onField(`contents_per_unit`)}
                />
                ${this._fieldError(`contents_per_unit`)}
                <div class="field-hint">
                  How much is in one bottle, can, or pack?
                </div>
              </label>
              <label
                >${this._fieldLabel(`Contents unit`,l&&(r===`food`||r===`water`||r===`pet_food`))}
                <select
                  class=${this._fieldInvalid(`contents_unit`)?`invalid`:``}
                  .value=${H(e.contents_unit||``)}
                  ?disabled=${!l}
                  @change=${this._onField(`contents_unit`)}
                >
                  <option value="" ?selected=${!e.contents_unit}>
                    Select unit
                  </option>
                  ${At.map(t=>j`<option
                        value=${t}
                        ?selected=${(e.contents_unit||``)===t}
                      >
                        ${Mt(t)}
                      </option>`)}
                </select>
                ${this._fieldError(`contents_unit`)}
                <div class="field-hint">
                  Liter, milliliter, gram, or kilogram for one stock unit.
                </div>
              </label>
            </div>
            ${this._showCaloriesField()?j`
                  <label
                    >${this._fieldLabel(`Calories (kcal) per ${s}`,l&&r===`food`)}
                    <input
                      class=${this._fieldInvalid(`calories_per_content`)?`invalid`:``}
                      type="text"
                      inputmode="decimal"
                      .value=${H(e.calories_per_content||``)}
                      ?disabled=${!l}
                      @input=${this._onField(`calories_per_content`)}
                    />
                    ${this._fieldError(`calories_per_content`)}
                    <div class="field-hint">
                      Calories per contents unit${o==null?N:j` · Total calories on hand:
                            ${this._formatMeasureNumber(o)} kcal`}
                    </div>
                  </label>
                `:N}
            ${r===`none`?j`<div class="field-hint">
                  Category is not mapped to food, water or pet food — this item will not
                  count toward readiness.
                </div>`:N}
          </div>

          <div class="form-section">
            <div class="form-section-title">Dates</div>
            <label
              >Expiry
              <input
                type="date"
                .value=${e.expiry_date||``}
                ?disabled=${!l}
                @input=${this._onField(`expiry_date`)}
              />
            </label>
          </div>

          ${this._error?j`<div class="error" role="alert">${this._error}</div>`:N}

          <div class="dialog-actions">
            ${this._mdButton(l?this._t(`action.cancel`):this._t(`action.close`),{variant:`text`,onClick:this._closeDialog})}
            ${l?this._mdButton(this._t(`action.save`),{variant:`filled`,disabled:this._saving,onClick:()=>void this._save()}):N}
          </div>
        </div>
      </div>
    `}_onField(e){return t=>{let n=t.target;if(this._form={...this._form,[e]:n.value},e===`barcode`&&this._barcodeError&&(this._barcodeError=``),this._fieldErrors[e]){let t={...this._fieldErrors};delete t[e],this._fieldErrors=t}}}_parseDecimal(e){return Number(String(e).trim().replace(`,`,`.`))}_blankForm(){return{name:``,quantity:`1`,desired_quantity:`0`,unit:`piece`,location:``,category:``,priority:`important`,notes:``,barcode:``,expiry_date:``,contents_per_unit:``,contents_unit:``,calories_per_content:``}}_renderCompletenessDialog(){let e=this._snapshot?.completeness,t=Object.entries(e?.categories??{}),n=this._completenessPercent(),r=this._t(`completeness.title`),i=t.every(([,e])=>e.missing.length===0);return j`
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
            <button
              type="button"
              class="icon-btn dialog-close"
              aria-label=${this._t(`action.close`)}
              @click=${this._closeCompleteness}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d=${Ct} />
              </svg>
            </button>
          </div>
          <div class="completeness-overall">
            ${this._t(`completeness.overall`)}:
            <strong>${this._pct(n)}</strong>
          </div>
          ${i?j`<p class="completeness-all">
                ${this._t(`completeness.all_complete`)}
              </p>`:N}
          ${t.map(([e,t])=>j`
              <section class="completeness-category">
                <div class="completeness-category-head">
                  <span class="completeness-category-name">${e}</span>
                  <span class="completeness-category-score">
                    ${t.complete}/${t.total} · ${this._pct(t.percent)}
                    ${t.missing.length===0?j`<span
                          class="completeness-check"
                          title=${this._t(`completeness.category_complete`)}
                          aria-label=${this._t(`completeness.category_complete`)}
                          >✓</span
                        >`:N}
                  </span>
                </div>
                ${t.missing.length>0?j`<ul class="completeness-missing">
                      ${t.missing.map(e=>j`
                          <li>
                            <span class="completeness-item-name">${e.name}</span>
                            <span
                              class="completeness-reason ${e.expired?`completeness-reason-expired`:``}"
                              >${e.expired?this._t(`completeness.expired`):this._t(`completeness.stock`,{quantity:e.quantity,desired:e.desired_quantity})}</span
                            >
                          </li>
                        `)}
                    </ul>`:N}
              </section>
            `)}
        </div>
      </div>
    `}async _applyTemplate(e){if(this.hass&&!this._templateBusy){this._templateBusy=!0,this._error=``;try{await this.hass.callService(`ready_home`,`apply_kit_template`,{template_id:e}),this._templateOpen=!1}catch(e){this._error=G(e)}finally{this._templateBusy=!1}}}async _pushRestock(){if(this.hass){this._error=``;try{await this.hass.callService(`ready_home`,`push_restock_list`,{})}catch(e){this._error=G(e)}}}_renderTemplateDialog(){return j`
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
            <button
              type="button"
              class="icon-btn"
              aria-label=${this._t(`action.close`)}
              @click=${this._closeTemplates}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d=${Ct} />
              </svg>
            </button>
          </div>
          <p class="field-hint">${this._t(`template.skip_existing`)}</p>
          <div class="template-list">
            ${this._templates.map(e=>j`
                <div class="template-card">
                  <div class="template-card-body">
                    <strong>${e.name}</strong>
                    <p>${e.description}</p>
                    <span class="item-count"
                      >${e.item_count} ${this._t(`template.items`)}</span
                    >
                  </div>
                  ${this._mdButton(this._t(`action.apply_template`),{variant:`filled`,disabled:this._templateBusy,onClick:()=>void this._applyTemplate(e.id)})}
                </div>
              `)}
          </div>
          <div class="dialog-actions">
            ${this._mdButton(this._t(`action.close`),{variant:`text`,onClick:this._closeTemplates})}
          </div>
        </div>
      </div>
    `}_abortScan(){let e=this._scanHandle;this._scanHandle=null,e?.abort()}async _remove(e){if(this._canWrite()&&!this._isRemovePending(e.id)&&confirm(`Remove “${e.name}”?`)){this._pendingRemoveIds=[...this._pendingRemoveIds,e.id],this._error=``;try{await this.hass.callService(`ready_home`,`remove_item`,{item_id:e.id})}catch(t){this._pendingRemoveIds=this._pendingRemoveIds.filter(t=>t!==e.id),this._error=G(t)}}}async _save(){if(!this._canWrite())return;let e=this._validateForm();if(this._fieldErrors=e,Object.keys(e).length)return;let t=this._form,n=(t.name||``).trim(),r=this._formReadiness(),i={quantity:this._parseDecimal(t.quantity||`0`),desired_quantity:this._parseDecimal(t.desired_quantity||`0`),unit:t.unit||`piece`,location:t.location||``,category:t.category||``,priority:t.priority||`important`,barcode:t.barcode||``,notes:t.notes||``};t.expiry_date&&(i.expiry_date=t.expiry_date),Object.assign(i,tt(r,{contents_per_unit:t.contents_per_unit||``,contents_unit:t.contents_unit||``,calories_per_content:t.calories_per_content||``})),this._saving=!0,this._error=``;try{this._editing?await this.hass.callService(`ready_home`,`update_item`,{item_id:this._editing.id,new_name:n,...i}):await this.hass.callService(`ready_home`,`add_item`,{name:n,...i}),this._dialogOpen=!1,this._fieldErrors={},this._barcodeError=``}catch(e){this._error=G(e)}finally{this._saving=!1}}async _lookupBarcode(){if(!this._canWrite())return;let e=this._form.barcode?.trim();if(e){this._scanning=!0,this._barcodeError=``,this._error=``;try{let t=await Ie(this.hass,e),n=this._settings?.food_categories?.[0]?.trim()||`Food`;this._form=Ue(this._form,t,n)}catch(e){this._barcodeError=We(e)?Ge:`Barcode lookup failed: ${G(e)}`}finally{this._scanning=!1}}}async _scanFromPanel(){if(!this._canWrite())return;if(!Ve(this.hass)){this._openAdd(),this._barcodeError=this._t(`companion.scan_needed`);return}this._scanning=!0,this._error=``,this._barcodeError=``,this._abortScan();let e=He(this.hass);this._scanHandle=e;try{let t=await e.done;if(this._scanHandle===e&&(this._scanHandle=null),!t)return;this._openAdd(),this._form={...this._form,barcode:t},this._scanning=!1,await this._lookupBarcode()}catch(t){this._scanHandle===e&&(this._scanHandle=null),this._openAdd(),this._barcodeError=`Camera scan failed: ${G(t)}`}finally{this._scanning=!1}}async _scanBarcode(){if(!this._canWrite())return;if(!Ve(this.hass)){this._barcodeError=this._t(`companion.scan_needed`);return}this._scanning=!0,this._barcodeError=``,this._error=``,this._abortScan();let e=He(this.hass);this._scanHandle=e;try{let t=await e.done;if(this._scanHandle===e&&(this._scanHandle=null),!t)return;this._form={...this._form,barcode:t},this._scanning=!1,await this._lookupBarcode()}catch(t){this._scanHandle===e&&(this._scanHandle=null),this._barcodeError=`Camera scan failed: ${G(t)}`}finally{this._scanning=!1}}static{this.styles=o`
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
    .household {
      margin-bottom: 16px;
    }
    .household summary {
      cursor: pointer;
      font-weight: 500;
      margin-bottom: 8px;
    }
    .stat {
      padding: 16px;
      border-radius: var(--ha-border-radius-md, 8px);
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
    button.stat-button {
      font: inherit;
      color: inherit;
      text-align: left;
      border-top: none;
      border-right: none;
      border-bottom: none;
      cursor: pointer;
    }
    button.stat-button:hover {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    }
    button.stat-button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
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
      border-radius: var(--ha-border-radius-lg, 12px);
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
      border-radius: var(--ha-button-border-radius, var(--ha-border-radius-pill, 9999px));
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
    .barcode-row input {
      flex: 1;
      min-width: 0;
    }
    @media (max-width: 720px) {
      .brand-logo {
        height: 36px;
        max-width: min(200px, 42vw);
      }
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
  `}};Z([U({attribute:!1})],$.prototype,`hass`,void 0),Z([U({type:Boolean})],$.prototype,`narrow`,void 0),Z([U({attribute:!1})],$.prototype,`panel`,void 0),Z([W()],$.prototype,`_snapshot`,void 0),Z([W()],$.prototype,`_settings`,void 0),Z([W()],$.prototype,`_search`,void 0),Z([W()],$.prototype,`_filterStatus`,void 0),Z([W()],$.prototype,`_filterLocation`,void 0),Z([W()],$.prototype,`_filterCategory`,void 0),Z([W()],$.prototype,`_filterReadiness`,void 0),Z([W()],$.prototype,`_filtersOpen`,void 0),Z([W()],$.prototype,`_sort`,void 0),Z([W()],$.prototype,`_dialogOpen`,void 0),Z([W()],$.prototype,`_editing`,void 0),Z([W()],$.prototype,`_form`,void 0),Z([W()],$.prototype,`_error`,void 0),Z([W()],$.prototype,`_barcodeError`,void 0),Z([W()],$.prototype,`_fieldErrors`,void 0),Z([W()],$.prototype,`_saving`,void 0),Z([W()],$.prototype,`_scanning`,void 0),Z([W()],$.prototype,`_pendingRemoveIds`,void 0),Z([W()],$.prototype,`_completenessOpen`,void 0),Z([W()],$.prototype,`_templateOpen`,void 0),Z([W()],$.prototype,`_templates`,void 0),Z([W()],$.prototype,`_templateBusy`,void 0);try{customElements.define(_t,$)}catch{}
//# sourceMappingURL=ready-home-panel.js.map