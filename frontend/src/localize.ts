/** Panel UI strings (en / nl). Entity/config translations live in HA JSON. */

import type { HomeAssistant } from "./types";

export type PanelLang = "en" | "nl";

const EN: Record<string, string> = {
  "status.expired": "Expired",
  "status.urgent": "Urgent",
  "status.expiring": "Expiring",
  "status.low": "Low stock",
  "action.open_menu": "Open menu",
  "action.scan": "Scan",
  "action.add_item": "Add item",
  "action.add_from_template": "Add from template",
  "action.push_restock": "Push restock list",
  "action.close": "Close",
  "action.save": "Save",
  "action.cancel": "Cancel",
  "action.delete": "Delete",
  "action.lookup": "Lookup",
  "action.edit": "Edit",
  "action.apply_template": "Add missing items",
  "stat.readiness": "Readiness",
  "stat.water": "Water",
  "stat.food": "Food",
  "stat.essential": "Essential",
  "stat.completeness": "Completeness",
  "stat.hours_suffix": "h",
  "filter.search_placeholder": "Search inventory",
  "filter.all_status": "All statuses",
  "filter.all_location": "All locations",
  "filter.all_category": "All categories",
  "filter.all_readiness": "All readiness",
  "filter.readiness_food": "Food",
  "filter.readiness_water": "Water",
  "filter.readiness_none": "Other",
  "filter.sort": "Sort",
  "empty.inventory": "No items yet. Add your first supply.",
  "empty.filtered": "No items match these filters.",
  "dialog.add_title": "Add item",
  "dialog.edit_title": "Edit item",
  "dialog.template_title": "Add from template",
  "field.name": "Name",
  "field.quantity": "Quantity",
  "field.desired": "Desired",
  "field.unit": "Unit",
  "field.location": "Location",
  "field.category": "Category",
  "field.priority": "Priority",
  "field.expiry": "Expiry",
  "field.notes": "Notes",
  "field.barcode": "Barcode",
  "field.contents": "Contents per unit",
  "field.contents_unit": "Contents unit",
  "field.calories": "Calories per contents unit",
  "priority.essential": "Essential",
  "priority.important": "Important",
  "priority.optional": "Optional",
  "hint.measure_readiness": "These fields count toward readiness.",
  "companion.scan_needed":
    "Scanning needs the Home Assistant Companion app. Enter the barcode and tap Lookup.",
  "template.skip_existing": "Existing names are skipped.",
  "template.items": "items",
  "error.generic": "Something went wrong",
};

const NL: Record<string, string> = {
  "status.expired": "Verlopen",
  "status.urgent": "Urgent",
  "status.expiring": "Bijna verlopen",
  "status.low": "Lage voorraad",
  "action.open_menu": "Menu openen",
  "action.scan": "Scannen",
  "action.add_item": "Item toevoegen",
  "action.add_from_template": "Uit sjabloon",
  "action.push_restock": "Aanvullijst sturen",
  "action.close": "Sluiten",
  "action.save": "Opslaan",
  "action.cancel": "Annuleren",
  "action.delete": "Verwijderen",
  "action.lookup": "Opzoeken",
  "action.edit": "Bewerken",
  "action.apply_template": "Ontbrekende items toevoegen",
  "stat.readiness": "Paraatheid",
  "stat.water": "Water",
  "stat.food": "Voedsel",
  "stat.essential": "Essentieel",
  "stat.completeness": "Compleetheid",
  "stat.hours_suffix": "u",
  "filter.search_placeholder": "Zoek in voorraad",
  "filter.all_status": "Alle statussen",
  "filter.all_location": "Alle locaties",
  "filter.all_category": "Alle categorieën",
  "filter.all_readiness": "Alle paraatheid",
  "filter.readiness_food": "Voedsel",
  "filter.readiness_water": "Water",
  "filter.readiness_none": "Overig",
  "filter.sort": "Sorteren",
  "empty.inventory": "Nog geen items. Voeg je eerste voorraad toe.",
  "empty.filtered": "Geen items matchen deze filters.",
  "dialog.add_title": "Item toevoegen",
  "dialog.edit_title": "Item bewerken",
  "dialog.template_title": "Uit sjabloon toevoegen",
  "field.name": "Naam",
  "field.quantity": "Hoeveelheid",
  "field.desired": "Gewenst",
  "field.unit": "Eenheid",
  "field.location": "Locatie",
  "field.category": "Categorie",
  "field.priority": "Prioriteit",
  "field.expiry": "Houdbaarheidsdatum",
  "field.notes": "Notities",
  "field.barcode": "Barcode",
  "field.contents": "Inhoud per eenheid",
  "field.contents_unit": "Inhoudseenheid",
  "field.calories": "Calorieën per inhoudseenheid",
  "priority.essential": "Essentieel",
  "priority.important": "Belangrijk",
  "priority.optional": "Optioneel",
  "hint.measure_readiness": "Deze velden tellen mee voor paraatheid.",
  "companion.scan_needed":
    "Scannen vereist de Home Assistant Companion-app. Voer de barcode in en tik op Opzoeken.",
  "template.skip_existing": "Bestaande namen worden overgeslagen.",
  "template.items": "items",
  "error.generic": "Er ging iets mis",
};

const TABLES: Record<PanelLang, Record<string, string>> = { en: EN, nl: NL };

export function panelLanguage(hass: HomeAssistant | undefined | null): PanelLang {
  const raw =
    hass?.locale?.language || hass?.language || "en";
  const base = String(raw).toLowerCase().split("-")[0];
  return base === "nl" ? "nl" : "en";
}

export function t(
  hass: HomeAssistant | undefined | null,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const lang = panelLanguage(hass);
  let text = TABLES[lang][key] ?? TABLES.en[key] ?? key;
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replaceAll(`{${name}}`, String(value));
    }
  }
  return text;
}

export function statusLabel(
  hass: HomeAssistant | undefined | null,
  status: string,
): string {
  const key = `status.${status}`;
  const translated = t(hass, key);
  return translated === key ? status : translated;
}
