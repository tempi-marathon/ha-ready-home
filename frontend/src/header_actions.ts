/** Which header actions are shown as buttons and which sit in the narrow-screen menu. */

export type HeaderAction =
  | "scan"
  | "add_from_template"
  | "push_restock"
  | "add_item";

export interface HeaderActions {
  /** Always-visible buttons, in display order. */
  buttons: HeaderAction[];
  /** Entries in the "more actions" dropdown (narrow screens only). */
  menu: HeaderAction[];
}

export function headerActions(opts: {
  canWrite: boolean;
  narrow: boolean;
  hasRestockList: boolean;
}): HeaderActions {
  if (!opts.canWrite) return { buttons: [], menu: [] };
  const secondary: HeaderAction[] = ["scan", "add_from_template"];
  if (opts.hasRestockList) secondary.push("push_restock");
  if (opts.narrow) return { buttons: ["add_item"], menu: secondary };
  return { buttons: [...secondary, "add_item"], menu: [] };
}
