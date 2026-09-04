/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const z = globalThis, F = z.ShadowRoot && (z.ShadyCSS === void 0 || z.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, W = Symbol(), X = /* @__PURE__ */ new WeakMap();
let ct = class {
  constructor(t, i, s) {
    if (this._$cssResult$ = !0, s !== W) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (F && t === void 0) {
      const s = i !== void 0 && i.length === 1;
      s && (t = X.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && X.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const _t = (e) => new ct(typeof e == "string" ? e : e + "", void 0, W), V = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((s, r, o) => s + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + e[o + 1], e[0]);
  return new ct(i, e, W);
}, ft = (e, t) => {
  if (F) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const s = document.createElement("style"), r = z.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = i.cssText, e.appendChild(s);
  }
}, Y = F ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const s of t.cssRules) i += s.cssText;
  return _t(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: yt, defineProperty: gt, getOwnPropertyDescriptor: $t, getOwnPropertyNames: mt, getOwnPropertySymbols: vt, getPrototypeOf: bt } = Object, L = globalThis, tt = L.trustedTypes, xt = tt ? tt.emptyScript : "", At = L.reactiveElementPolyfillSupport, O = (e, t) => e, D = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? xt : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let i = e;
  switch (t) {
    case Boolean:
      i = e !== null;
      break;
    case Number:
      i = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(e);
      } catch {
        i = null;
      }
  }
  return i;
} }, Z = (e, t) => !yt(e, t), et = { attribute: !0, type: String, converter: D, reflect: !1, useDefault: !1, hasChanged: Z };
Symbol.metadata ??= Symbol("metadata"), L.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let E = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = et) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const s = Symbol(), r = this.getPropertyDescriptor(t, s, i);
      r !== void 0 && gt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, i, s) {
    const { get: r, set: o } = $t(this.prototype, t) ?? { get() {
      return this[i];
    }, set(n) {
      this[i] = n;
    } };
    return { get: r, set(n) {
      const l = r?.call(this);
      o?.call(this, n), this.requestUpdate(t, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? et;
  }
  static _$Ei() {
    if (this.hasOwnProperty(O("elementProperties"))) return;
    const t = bt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(O("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(O("properties"))) {
      const i = this.properties, s = [...mt(i), ...vt(i)];
      for (const r of s) this.createProperty(r, i[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const i = litPropertyMetadata.get(t);
      if (i !== void 0) for (const [s, r] of i) this.elementProperties.set(s, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, s] of this.elementProperties) {
      const r = this._$Eu(i, s);
      r !== void 0 && this._$Eh.set(r, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const i = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const r of s) i.unshift(Y(r));
    } else t !== void 0 && i.push(Y(t));
    return i;
  }
  static _$Eu(t, i) {
    const s = i.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const s of i.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return ft(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, i, s) {
    this._$AK(t, s);
  }
  _$ET(t, i) {
    const s = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, s);
    if (r !== void 0 && s.reflect === !0) {
      const o = (s.converter?.toAttribute !== void 0 ? s.converter : D).toAttribute(i, s.type);
      this._$Em = t, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(t, i) {
    const s = this.constructor, r = s._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const o = s.getPropertyOptions(r), n = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : D;
      this._$Em = r;
      const l = n.fromAttribute(i, o.type);
      this[r] = l ?? this._$Ej?.get(r) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, i, s, r = !1, o) {
    if (t !== void 0) {
      const n = this.constructor;
      if (r === !1 && (o = this[t]), s ??= n.getPropertyOptions(t), !((s.hasChanged ?? Z)(o, i) || s.useDefault && s.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, s)))) return;
      this.C(t, i, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, i, { useDefault: s, reflect: r, wrapped: o }, n) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, n ?? i ?? this[t]), o !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (i = void 0), this._$AL.set(t, i)), r === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [r, o] of this._$Ep) this[r] = o;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [r, o] of s) {
        const { wrapped: n } = o, l = this[r];
        n !== !0 || this._$AL.has(r) || l === void 0 || this.C(r, void 0, o, l);
      }
    }
    let t = !1;
    const i = this._$AL;
    try {
      t = this.shouldUpdate(i), t ? (this.willUpdate(i), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(i)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(i);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((i) => i.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((i) => this._$ET(i, this[i])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
E.elementStyles = [], E.shadowRootOptions = { mode: "open" }, E[O("elementProperties")] = /* @__PURE__ */ new Map(), E[O("finalized")] = /* @__PURE__ */ new Map(), At?.({ ReactiveElement: E }), (L.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const J = globalThis, it = (e) => e, j = J.trustedTypes, st = j ? j.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, dt = "$lit$", m = `lit$${Math.random().toFixed(9).slice(2)}$`, ht = "?" + m, wt = `<${ht}>`, A = document, M = () => A.createComment(""), U = (e) => e === null || typeof e != "object" && typeof e != "function", K = Array.isArray, Et = (e) => K(e) || typeof e?.[Symbol.iterator] == "function", I = `[ 	
\f\r]`, k = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, rt = /-->/g, ot = />/g, v = RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), nt = /'/g, at = /"/g, pt = /^(?:script|style|textarea|title)$/i, St = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), u = St(1), S = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), lt = /* @__PURE__ */ new WeakMap(), b = A.createTreeWalker(A, 129);
function ut(e, t) {
  if (!K(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return st !== void 0 ? st.createHTML(t) : t;
}
const Ct = (e, t) => {
  const i = e.length - 1, s = [];
  let r, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = k;
  for (let l = 0; l < i; l++) {
    const a = e[l];
    let h, p, c = -1, g = 0;
    for (; g < a.length && (n.lastIndex = g, p = n.exec(a), p !== null); ) g = n.lastIndex, n === k ? p[1] === "!--" ? n = rt : p[1] !== void 0 ? n = ot : p[2] !== void 0 ? (pt.test(p[2]) && (r = RegExp("</" + p[2], "g")), n = v) : p[3] !== void 0 && (n = v) : n === v ? p[0] === ">" ? (n = r ?? k, c = -1) : p[1] === void 0 ? c = -2 : (c = n.lastIndex - p[2].length, h = p[1], n = p[3] === void 0 ? v : p[3] === '"' ? at : nt) : n === at || n === nt ? n = v : n === rt || n === ot ? n = k : (n = v, r = void 0);
    const $ = n === v && e[l + 1].startsWith("/>") ? " " : "";
    o += n === k ? a + wt : c >= 0 ? (s.push(h), a.slice(0, c) + dt + a.slice(c) + m + $) : a + m + (c === -2 ? l : $);
  }
  return [ut(e, o + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class H {
  constructor({ strings: t, _$litType$: i }, s) {
    let r;
    this.parts = [];
    let o = 0, n = 0;
    const l = t.length - 1, a = this.parts, [h, p] = Ct(t, i);
    if (this.el = H.createElement(h, s), b.currentNode = this.el.content, i === 2 || i === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (r = b.nextNode()) !== null && a.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const c of r.getAttributeNames()) if (c.endsWith(dt)) {
          const g = p[n++], $ = r.getAttribute(c).split(m), q = /([.?@])?(.*)/.exec(g);
          a.push({ type: 1, index: o, name: q[2], strings: $, ctor: q[1] === "." ? kt : q[1] === "?" ? Ot : q[1] === "@" ? Mt : B }), r.removeAttribute(c);
        } else c.startsWith(m) && (a.push({ type: 6, index: o }), r.removeAttribute(c));
        if (pt.test(r.tagName)) {
          const c = r.textContent.split(m), g = c.length - 1;
          if (g > 0) {
            r.textContent = j ? j.emptyScript : "";
            for (let $ = 0; $ < g; $++) r.append(c[$], M()), b.nextNode(), a.push({ type: 2, index: ++o });
            r.append(c[g], M());
          }
        }
      } else if (r.nodeType === 8) if (r.data === ht) a.push({ type: 2, index: o });
      else {
        let c = -1;
        for (; (c = r.data.indexOf(m, c + 1)) !== -1; ) a.push({ type: 7, index: o }), c += m.length - 1;
      }
      o++;
    }
  }
  static createElement(t, i) {
    const s = A.createElement("template");
    return s.innerHTML = t, s;
  }
}
function C(e, t, i = e, s) {
  if (t === S) return t;
  let r = s !== void 0 ? i._$Co?.[s] : i._$Cl;
  const o = U(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== o && (r?._$AO?.(!1), o === void 0 ? r = void 0 : (r = new o(e), r._$AT(e, i, s)), s !== void 0 ? (i._$Co ??= [])[s] = r : i._$Cl = r), r !== void 0 && (t = C(e, r._$AS(e, t.values), r, s)), t;
}
class Pt {
  constructor(t, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: i }, parts: s } = this._$AD, r = (t?.creationScope ?? A).importNode(i, !0);
    b.currentNode = r;
    let o = b.nextNode(), n = 0, l = 0, a = s[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let h;
        a.type === 2 ? h = new T(o, o.nextSibling, this, t) : a.type === 1 ? h = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (h = new Ut(o, this, t)), this._$AV.push(h), a = s[++l];
      }
      n !== a?.index && (o = b.nextNode(), n++);
    }
    return b.currentNode = A, r;
  }
  p(t) {
    let i = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, i), i += s.strings.length - 2) : s._$AI(t[i])), i++;
  }
}
class T {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, i, s, r) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = s, this.options = r, this._$Cv = r?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && t?.nodeType === 11 && (t = i.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, i = this) {
    t = C(this, t, i), U(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== S && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Et(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== d && U(this._$AH) ? this._$AA.nextSibling.data = t : this.T(A.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: i, _$litType$: s } = t, r = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = H.createElement(ut(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === r) this._$AH.p(i);
    else {
      const o = new Pt(r, this), n = o.u(this.options);
      o.p(i), this.T(n), this._$AH = o;
    }
  }
  _$AC(t) {
    let i = lt.get(t.strings);
    return i === void 0 && lt.set(t.strings, i = new H(t)), i;
  }
  k(t) {
    K(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let s, r = 0;
    for (const o of t) r === i.length ? i.push(s = new T(this.O(M()), this.O(M()), this, this.options)) : s = i[r], s._$AI(o), r++;
    r < i.length && (this._$AR(s && s._$AB.nextSibling, r), i.length = r);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); t !== this._$AB; ) {
      const s = it(t).nextSibling;
      it(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class B {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, s, r, o) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = t, this.name = i, this._$AM = r, this.options = o, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = d;
  }
  _$AI(t, i = this, s, r) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) t = C(this, t, i, 0), n = !U(t) || t !== this._$AH && t !== S, n && (this._$AH = t);
    else {
      const l = t;
      let a, h;
      for (t = o[0], a = 0; a < o.length - 1; a++) h = C(this, l[s + a], i, a), h === S && (h = this._$AH[a]), n ||= !U(h) || h !== this._$AH[a], h === d ? t = d : t !== d && (t += (h ?? "") + o[a + 1]), this._$AH[a] = h;
    }
    n && !r && this.j(t);
  }
  j(t) {
    t === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class kt extends B {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === d ? void 0 : t;
  }
}
class Ot extends B {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}
class Mt extends B {
  constructor(t, i, s, r, o) {
    super(t, i, s, r, o), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = C(this, t, i, 0) ?? d) === S) return;
    const s = this._$AH, r = t === d && s !== d || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, o = t !== d && (s === d || r);
    r && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Ut {
  constructor(t, i, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    C(this, t);
  }
}
const Ht = J.litHtmlPolyfillSupport;
Ht?.(H, T), (J.litHtmlVersions ??= []).push("3.3.3");
const Nt = (e, t, i) => {
  const s = i?.renderBefore ?? t;
  let r = s._$litPart$;
  if (r === void 0) {
    const o = i?.renderBefore ?? null;
    s._$litPart$ = r = new T(t.insertBefore(M(), o), o, void 0, i ?? {});
  }
  return r._$AI(e), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Q = globalThis;
class x extends E {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Nt(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return S;
  }
}
x._$litElement$ = !0, x.finalized = !0, Q.litElementHydrateSupport?.({ LitElement: x });
const Rt = Q.litElementPolyfillSupport;
Rt?.({ LitElement: x });
(Q.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const G = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Tt = { attribute: !0, type: String, converter: D, reflect: !1, hasChanged: Z }, qt = (e = Tt, t, i) => {
  const { kind: s, metadata: r } = i;
  let o = globalThis.litPropertyMetadata.get(r);
  if (o === void 0 && globalThis.litPropertyMetadata.set(r, o = /* @__PURE__ */ new Map()), s === "setter" && ((e = Object.create(e)).wrapped = !0), o.set(i.name, e), s === "accessor") {
    const { name: n } = i;
    return { set(l) {
      const a = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(n, a, e, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(n, void 0, e, l), l;
    } };
  }
  if (s === "setter") {
    const { name: n } = i;
    return function(l) {
      const a = this[n];
      t.call(this, l), this.requestUpdate(n, a, e, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function w(e) {
  return (t, i) => typeof i == "object" ? qt(e, t, i) : ((s, r, o) => {
    const n = r.hasOwnProperty(o);
    return r.constructor.createProperty(o, s), n ? Object.getOwnPropertyDescriptor(r, o) : void 0;
  })(e, t, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function y(e) {
  return w({ ...e, state: !0, attribute: !1 });
}
var zt = Object.defineProperty, Dt = Object.getOwnPropertyDescriptor, P = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Dt(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (r = (s ? n(t, i, r) : n(r)) || r);
  return s && r && zt(t, i, r), r;
};
let N = class extends x {
  setConfig(e) {
    this._config = { ...e };
  }
  getCardSize() {
    return 4;
  }
  static getConfigElement() {
    return document.createElement("ready-home-readiness-card-editor");
  }
  static getStubConfig() {
    return { type: "custom:ready-home-readiness-card" };
  }
  _state(e, t) {
    const i = e || t;
    return this.hass?.states?.[i];
  }
  _num(e, t) {
    const i = this._state(e, t);
    if (!i || i.state === "unknown" || i.state === "unavailable") return null;
    const s = Number(i.state);
    return Number.isFinite(s) ? s : null;
  }
  render() {
    if (!this.hass || !this._config) return u``;
    const e = this._num(this._config.entity, "sensor.ready_home_readiness"), t = this._num(
      this._config.water_entity,
      "sensor.ready_home_water_readiness"
    ), i = this._num(
      this._config.food_entity,
      "sensor.ready_home_food_readiness"
    ), s = this._num(this._config.expired_entity, "sensor.ready_home_expired_items") ?? 0, r = this._num(this._config.expiring_entity, "sensor.ready_home_expiring_items") ?? 0, o = this._num(this._config.low_stock_entity, "sensor.ready_home_low_stock_items") ?? 0, n = this._state(
      this._config.attention_entity,
      "binary_sensor.ready_home_needs_attention"
    ), a = this._state(
      this._config.entity,
      "sensor.ready_home_readiness"
    )?.attributes?.supply_hours;
    return u`
      <ha-card class=${n?.state === "on" ? "attention" : ""}>
        <div class="header">
          <div class="title">Ready Home</div>
          <div class="subtitle">Emergency readiness</div>
        </div>
        <div class="overall">
          <div class="overall-value">
            ${e === null ? "—" : `${Math.round(e)}%`}
          </div>
          <div class="overall-label">Overall</div>
          ${a != null ? u`<div class="supply">~${Math.round(Number(a))}h supply</div>` : null}
        </div>
        <div class="bars">
          ${this._bar("Water", t, "var(--info-color, #0288d1)")}
          ${this._bar("Food", i, "var(--success-color, #388e3c)")}
        </div>
        <div class="counts">
          <div><span>${s}</span> expired</div>
          <div><span>${r}</span> expiring</div>
          <div><span>${o}</span> low stock</div>
        </div>
      </ha-card>
    `;
  }
  _bar(e, t, i) {
    const s = t === null ? 0 : Math.max(0, Math.min(100, t));
    return u`
      <div class="bar-row">
        <div class="bar-label">
          <span>${e}</span>
          <span>${t === null ? "—" : `${Math.round(t)}%`}</span>
        </div>
        <div class="bar-track">
          <div class="bar-fill" style="width:${s}%;background:${i}"></div>
        </div>
      </div>
    `;
  }
};
N.styles = V`
    ha-card {
      padding: 16px;
      background: var(--ha-card-background, var(--card-background-color));
    }
    ha-card.attention {
      border-left: 3px solid var(--warning-color, #f57c00);
    }
    .header {
      margin-bottom: 12px;
    }
    .title {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .subtitle {
      font-size: 0.85rem;
      color: var(--secondary-text-color);
    }
    .overall {
      text-align: center;
      margin: 8px 0 16px;
    }
    .overall-value {
      font-size: 2.4rem;
      font-weight: 700;
      line-height: 1.1;
      color: var(--primary-text-color);
    }
    .overall-label,
    .supply {
      color: var(--secondary-text-color);
      font-size: 0.85rem;
    }
    .bars {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 16px;
    }
    .bar-label {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      margin-bottom: 4px;
      color: var(--primary-text-color);
    }
    .bar-track {
      height: 8px;
      border-radius: 4px;
      background: var(--divider-color, rgba(127, 127, 127, 0.2));
      overflow: hidden;
    }
    .bar-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.3s ease;
    }
    .counts {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      text-align: center;
      font-size: 0.8rem;
      color: var(--secondary-text-color);
    }
    .counts span {
      display: block;
      font-size: 1.2rem;
      font-weight: 600;
      color: var(--primary-text-color);
    }
  `;
P([
  w({ attribute: !1 })
], N.prototype, "hass", 2);
P([
  w({ attribute: !1 })
], N.prototype, "_config", 2);
N = P([
  G("ready-home-readiness-card")
], N);
let R = class extends x {
  setConfig(e) {
    this._config = { ...e };
  }
  render() {
    return this._config ? u`
      <div class="editor">
        <p>Optional entity overrides (defaults use Ready Home sensors).</p>
        ${this._field("entity", "Overall readiness")}
        ${this._field("water_entity", "Water readiness")}
        ${this._field("food_entity", "Food readiness")}
      </div>
    ` : u``;
  }
  _field(e, t) {
    const i = this._config[e] || "";
    return u`
      <label>
        ${t}
        <input
          .value=${i}
          @change=${(s) => {
      const r = s.target.value;
      this._config = { ...this._config, [e]: r || void 0 }, this.dispatchEvent(
        new CustomEvent("config-changed", {
          detail: { config: this._config }
        })
      );
    }}
        />
      </label>
    `;
  }
};
R.styles = V`
    .editor {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 8px;
    }
    label {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 0.9rem;
    }
    input {
      padding: 8px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
  `;
P([
  w({ attribute: !1 })
], R.prototype, "hass", 2);
P([
  w({ attribute: !1 })
], R.prototype, "_config", 2);
R = P([
  G("ready-home-readiness-card-editor")
], R);
async function jt(e) {
  return e.connection.sendMessagePromise({
    type: "ready_home/settings"
  });
}
async function Lt(e, t) {
  return e.connection.subscribeMessage(t, {
    type: "ready_home/subscribe"
  });
}
async function Bt(e, t) {
  return e.connection.sendMessagePromise({
    type: "ready_home/barcode/lookup",
    barcode: t
  });
}
var It = Object.defineProperty, Ft = Object.getOwnPropertyDescriptor, f = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Ft(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (r = (s ? n(t, i, r) : n(r)) || r);
  return s && r && It(t, i, r), r;
};
let _ = class extends x {
  constructor() {
    super(...arguments), this._snapshot = null, this._settings = null, this._filterStatus = "all", this._filterLocation = "", this._filterCategory = "", this._sort = "name", this._dialogOpen = !1, this._editing = null, this._form = {}, this._error = "", this._unsub = null, this._openAdd = () => {
      this._editing = null, this._form = {
        name: "",
        quantity: "1",
        desired_quantity: "0",
        unit: "piece",
        resource: "none",
        priority: "important"
      }, this._dialogOpen = !0;
    }, this._openEdit = (e) => {
      this._editing = e, this._form = {
        name: e.name,
        quantity: String(e.quantity),
        desired_quantity: String(e.desired_quantity),
        unit: e.unit,
        location: e.location,
        category: e.category,
        resource: e.resource,
        priority: e.priority,
        expiry_date: e.expiry_date || "",
        barcode: e.barcode || "",
        liters_per_unit: e.liters_per_unit != null ? String(e.liters_per_unit) : "",
        calories_per_unit: e.calories_per_unit != null ? String(e.calories_per_unit) : ""
      }, this._dialogOpen = !0;
    }, this._closeDialog = () => {
      this._dialogOpen = !1;
    };
  }
  setConfig(e) {
    this._config = { ...e };
  }
  getCardSize() {
    return 8;
  }
  static getStubConfig() {
    return { type: "custom:ready-home-inventory-card" };
  }
  async updated(e) {
    if (e.has("hass") && this.hass && !this._unsub)
      try {
        this._settings = await jt(this.hass), this._unsub = await Lt(this.hass, (t) => {
          this._snapshot = t;
        });
      } catch (t) {
        this._error = String(t);
      }
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._unsub?.(), this._unsub = null;
  }
  get _items() {
    let e = [...this._snapshot?.items ?? []];
    if (this._filterLocation && (e = e.filter(
      (t) => t.location.toLowerCase() === this._filterLocation.toLowerCase()
    )), this._filterCategory && (e = e.filter(
      (t) => t.category.toLowerCase() === this._filterCategory.toLowerCase()
    )), this._filterStatus !== "all") {
      const t = this._snapshot?.buckets, i = /* @__PURE__ */ new Set();
      this._filterStatus === "expired" ? t?.expired.forEach((s) => i.add(s.id)) : this._filterStatus === "expiring" ? (t?.within_urgent.forEach((s) => i.add(s.id)), t?.within_expiring.forEach((s) => i.add(s.id))) : this._filterStatus === "low_stock" && t?.low_stock.forEach((s) => i.add(s.id)), e = e.filter((s) => i.has(s.id));
    }
    return e.sort((t, i) => this._sort === "quantity" ? t.quantity - i.quantity : this._sort === "expiry" ? (t.expiry_date || "9999").localeCompare(i.expiry_date || "9999") : t.name.localeCompare(i.name)), e;
  }
  render() {
    if (!this._config) return u``;
    const e = this._items, t = this._settings?.locations ?? [], i = this._settings?.categories ?? [];
    return u`
      <ha-card>
        <div class="toolbar">
          <div class="title">Inventory</div>
          <button class="primary" @click=${this._openAdd}>Add item</button>
        </div>
        <div class="filters">
          <select
            .value=${this._filterStatus}
            @change=${(s) => {
      this._filterStatus = s.target.value;
    }}
          >
            <option value="all">All</option>
            <option value="expired">Expired</option>
            <option value="expiring">Expiring</option>
            <option value="low_stock">Low stock</option>
          </select>
          <select
            .value=${this._filterLocation}
            @change=${(s) => {
      this._filterLocation = s.target.value;
    }}
          >
            <option value="">All locations</option>
            ${t.map((s) => u`<option value=${s}>${s}</option>`)}
          </select>
          <select
            .value=${this._filterCategory}
            @change=${(s) => {
      this._filterCategory = s.target.value;
    }}
          >
            <option value="">All categories</option>
            ${i.map((s) => u`<option value=${s}>${s}</option>`)}
          </select>
          <select
            .value=${this._sort}
            @change=${(s) => {
      this._sort = s.target.value;
    }}
          >
            <option value="name">Sort: name</option>
            <option value="expiry">Sort: expiry</option>
            <option value="quantity">Sort: quantity</option>
          </select>
        </div>
        ${this._error ? u`<div class="error">${this._error}</div>` : d}
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Qty</th>
                <th>Location</th>
                <th>Expiry</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${e.map(
      (s) => u`
                  <tr>
                    <td>
                      <button class="link" @click=${() => this._openEdit(s)}>
                        ${s.name}
                      </button>
                      <div class="meta">
                        ${s.category || "—"} · ${s.resource}
                      </div>
                    </td>
                    <td class="qty">
                      <button @click=${() => this._adjust(s, -1)}>−</button>
                      <span>${s.quantity} ${s.unit}</span>
                      <button @click=${() => this._adjust(s, 1)}>+</button>
                    </td>
                    <td>${s.location || "—"}</td>
                    <td>${s.expiry_date || "—"}</td>
                    <td>
                      <button class="danger" @click=${() => this._remove(s)}>
                        ×
                      </button>
                    </td>
                  </tr>
                `
    )}
              ${e.length === 0 ? u`<tr>
                    <td colspan="5" class="empty">No items yet</td>
                  </tr>` : d}
            </tbody>
          </table>
        </div>
        ${this._dialogOpen ? this._renderDialog() : d}
      </ha-card>
    `;
  }
  _renderDialog() {
    const e = this._form;
    return u`
      <div class="dialog-backdrop" @click=${this._closeDialog}>
        <div class="dialog" @click=${(t) => t.stopPropagation()}>
          <h3>${this._editing ? "Edit item" : "Add item"}</h3>
          <label>Name <input .value=${e.name || ""} @input=${this._onField("name")} /></label>
          <label
            >Quantity
            <input
              type="number"
              step="0.01"
              .value=${e.quantity || "1"}
              @input=${this._onField("quantity")}
            />
          </label>
          <label
            >Desired
            <input
              type="number"
              step="0.01"
              .value=${e.desired_quantity || "0"}
              @input=${this._onField("desired_quantity")}
            />
          </label>
          <label
            >Unit
            <select .value=${e.unit || "piece"} @change=${this._onField("unit")}>
              ${["piece", "pack", "box", "gram", "kilogram", "liter", "milliliter"].map(
      (t) => u`<option value=${t}>${t}</option>`
    )}
            </select>
          </label>
          <label
            >Location
            <input .value=${e.location || ""} @input=${this._onField("location")} />
          </label>
          <label
            >Category
            <input .value=${e.category || ""} @input=${this._onField("category")} />
          </label>
          <label
            >Resource
            <select .value=${e.resource || "none"} @change=${this._onField("resource")}>
              <option value="none">none</option>
              <option value="water">water</option>
              <option value="food">food</option>
            </select>
          </label>
          <label
            >Liters / unit
            <input
              type="number"
              step="0.01"
              .value=${e.liters_per_unit || ""}
              @input=${this._onField("liters_per_unit")}
            />
          </label>
          <label
            >Calories / unit
            <input
              type="number"
              step="1"
              .value=${e.calories_per_unit || ""}
              @input=${this._onField("calories_per_unit")}
            />
          </label>
          <label
            >Expiry
            <input
              type="date"
              .value=${e.expiry_date || ""}
              @input=${this._onField("expiry_date")}
            />
          </label>
          <label
            >Barcode
            <div class="barcode-row">
              <input .value=${e.barcode || ""} @input=${this._onField("barcode")} />
              <button type="button" @click=${this._scanBarcode}>Scan</button>
              <button type="button" @click=${this._lookupBarcode}>Lookup</button>
            </div>
          </label>
          <div class="dialog-actions">
            <button @click=${this._closeDialog}>Cancel</button>
            <button class="primary" @click=${this._save}>Save</button>
          </div>
        </div>
      </div>
    `;
  }
  _onField(e) {
    return (t) => {
      const i = t.target;
      this._form = { ...this._form, [e]: i.value };
    };
  }
  async _adjust(e, t) {
    await this.hass.callService("ready_home", "adjust_quantity", {
      item_id: e.id,
      delta: t
    });
  }
  async _remove(e) {
    confirm(`Remove ${e.name}?`) && await this.hass.callService("ready_home", "remove_item", { item_id: e.id });
  }
  async _save() {
    const e = this._form, t = {
      name: e.name,
      quantity: Number(e.quantity || 0),
      desired_quantity: Number(e.desired_quantity || 0),
      unit: e.unit || "piece",
      location: e.location || "",
      category: e.category || "",
      resource: e.resource || "none",
      priority: e.priority || "important",
      barcode: e.barcode || ""
    };
    e.expiry_date && (t.expiry_date = e.expiry_date), e.liters_per_unit && (t.liters_per_unit = Number(e.liters_per_unit)), e.calories_per_unit && (t.calories_per_unit = Number(e.calories_per_unit)), this._editing ? await this.hass.callService("ready_home", "update_item", {
      item_id: this._editing.id,
      new_name: t.name,
      ...t
    }) : await this.hass.callService("ready_home", "add_item", t), this._dialogOpen = !1;
  }
  async _lookupBarcode() {
    const e = this._form.barcode?.trim();
    if (e)
      try {
        const t = await Bt(this.hass, e), i = [t.brand, t.name].filter(Boolean).join(" ").trim();
        this._form = {
          ...this._form,
          name: i || this._form.name,
          resource: this._form.resource === "none" ? "food" : this._form.resource,
          calories_per_unit: t.calories_per_100g != null ? String(t.calories_per_100g) : this._form.calories_per_unit
        };
      } catch (t) {
        this._error = `Barcode lookup failed: ${t}`;
      }
  }
  async _scanBarcode() {
    if (typeof BarcodeDetector > "u") {
      this._error = "BarcodeDetector not supported in this browser — enter code manually.";
      return;
    }
    try {
      const e = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      }), t = document.createElement("video");
      t.srcObject = e, await t.play();
      const i = new BarcodeDetector({
        formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128"]
      });
      await new Promise((r) => setTimeout(r, 700));
      const s = await i.detect(t);
      e.getTracks().forEach((r) => r.stop()), s[0]?.rawValue ? (this._form = { ...this._form, barcode: s[0].rawValue }, await this._lookupBarcode()) : this._error = "No barcode detected — try again or enter manually.";
    } catch (e) {
      this._error = `Camera scan failed: ${e}`;
    }
  }
};
_.styles = V`
    ha-card {
      padding: 12px 16px 16px;
    }
    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .title {
      font-size: 1.1rem;
      font-weight: 600;
    }
    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 10px;
    }
    select,
    input,
    button {
      font: inherit;
    }
    select,
    input {
      padding: 6px 8px;
      border-radius: 4px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    button {
      padding: 6px 10px;
      border-radius: 4px;
      border: 1px solid var(--divider-color);
      background: var(--secondary-background-color, transparent);
      color: var(--primary-text-color);
      cursor: pointer;
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
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.9rem;
    }
    th,
    td {
      text-align: left;
      padding: 8px 4px;
      border-bottom: 1px solid var(--divider-color);
      vertical-align: top;
    }
    .meta {
      font-size: 0.75rem;
      color: var(--secondary-text-color);
    }
    .qty {
      white-space: nowrap;
    }
    .qty button {
      padding: 2px 8px;
    }
    .empty {
      text-align: center;
      color: var(--secondary-text-color);
      padding: 20px !important;
    }
    .error {
      color: var(--error-color, #c62828);
      font-size: 0.85rem;
      margin-bottom: 8px;
    }
    .dialog-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .dialog {
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      padding: 16px;
      border-radius: 8px;
      width: min(420px, 92vw);
      max-height: 90vh;
      overflow: auto;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .dialog label {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 0.85rem;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 8px;
    }
    .barcode-row {
      display: flex;
      gap: 6px;
    }
    .barcode-row input {
      flex: 1;
    }
  `;
f([
  w({ attribute: !1 })
], _.prototype, "hass", 2);
f([
  w({ attribute: !1 })
], _.prototype, "_config", 2);
f([
  y()
], _.prototype, "_snapshot", 2);
f([
  y()
], _.prototype, "_settings", 2);
f([
  y()
], _.prototype, "_filterStatus", 2);
f([
  y()
], _.prototype, "_filterLocation", 2);
f([
  y()
], _.prototype, "_filterCategory", 2);
f([
  y()
], _.prototype, "_sort", 2);
f([
  y()
], _.prototype, "_dialogOpen", 2);
f([
  y()
], _.prototype, "_editing", 2);
f([
  y()
], _.prototype, "_form", 2);
f([
  y()
], _.prototype, "_error", 2);
_ = f([
  G("ready-home-inventory-card")
], _);
window.customCards = window.customCards || [];
window.customCards.push(
  {
    type: "ready-home-readiness-card",
    name: "Ready Home Readiness",
    description: "Water and food readiness gauges with attention counts",
    preview: !0
  },
  {
    type: "ready-home-inventory-card",
    name: "Ready Home Inventory",
    description: "Manage emergency supply inventory",
    preview: !0
  }
);
//# sourceMappingURL=ready-home.js.map
