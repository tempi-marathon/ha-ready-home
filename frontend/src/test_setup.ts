/**
 * jsdom gaps that the shared UI library's form-associated elements run into.
 * Browsers provide both; this only makes the unit-test environment behave alike.
 */

const internals = (globalThis as { ElementInternals?: { prototype: object } })
  .ElementInternals?.prototype as Record<string, unknown> | undefined;
if (internals) {
  internals.setFormValue ??= () => undefined;
  internals.setValidity ??= () => undefined;
  internals.checkValidity ??= () => true;
  internals.reportValidity ??= () => true;
}

// Focusing a host whose shadow root delegates focus moves focus to its first control.
const nativeFocus = HTMLElement.prototype.focus;
HTMLElement.prototype.focus = function focus(options?: FocusOptions) {
  const delegates = (
    this.constructor as { shadowRootOptions?: { delegatesFocus?: boolean } }
  ).shadowRootOptions?.delegatesFocus;
  const inner = delegates
    ? this.shadowRoot?.querySelector<HTMLElement>("button, input, [tabindex]")
    : null;
  if (inner) inner.focus(options);
  else nativeFocus.call(this, options);
};

// jsdom has no native <dialog> methods: model showModal/close with the `open` attribute.
const dialog = (globalThis as { HTMLDialogElement?: { prototype: HTMLDialogElement } })
  .HTMLDialogElement?.prototype;
if (dialog) {
  dialog.showModal ??= function showModal(this: HTMLDialogElement) {
    this.setAttribute("open", "");
  };
  dialog.close ??= function close(this: HTMLDialogElement) {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
}
