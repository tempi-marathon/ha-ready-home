"""Built-in kit templates that seed inventory checklist items."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from .models import InventoryPriority, InventoryUnit


@dataclass(frozen=True, slots=True)
class KitTemplateItem:
    """One suggested inventory row from a kit template."""

    name: str
    category: str
    desired_quantity: float
    priority: InventoryPriority = InventoryPriority.IMPORTANT
    unit: InventoryUnit = InventoryUnit.PIECE
    quantity: float = 0.0


@dataclass(frozen=True, slots=True)
class KitTemplate:
    """Named preset list of checklist items."""

    id: str
    name: str
    description: str
    items: tuple[KitTemplateItem, ...]


KIT_TEMPLATES: tuple[KitTemplate, ...] = (
    KitTemplate(
        id="first_aid",
        name="First aid",
        description="Basic medical supplies for household emergencies.",
        items=(
            KitTemplateItem(
                name="First aid kit",
                category="Medical",
                desired_quantity=1,
                priority=InventoryPriority.ESSENTIAL,
            ),
            KitTemplateItem(
                name="Pain relievers",
                category="Medical",
                desired_quantity=1,
                priority=InventoryPriority.ESSENTIAL,
            ),
            KitTemplateItem(
                name="Bandages / gauze",
                category="Medical",
                desired_quantity=2,
                priority=InventoryPriority.ESSENTIAL,
            ),
            KitTemplateItem(
                name="Antiseptic",
                category="Medical",
                desired_quantity=1,
            ),
            KitTemplateItem(
                name="Thermometer",
                category="Medical",
                desired_quantity=1,
            ),
            KitTemplateItem(
                name="Prescription meds (3+ days)",
                category="Medical",
                desired_quantity=1,
                priority=InventoryPriority.ESSENTIAL,
            ),
        ),
    ),
    KitTemplate(
        id="go_bag",
        name="Go-bag",
        description="Portable essentials if you need to leave quickly.",
        items=(
            KitTemplateItem(
                name="Flashlight / headlamp",
                category="Tools",
                desired_quantity=2,
                priority=InventoryPriority.ESSENTIAL,
            ),
            KitTemplateItem(
                name="Batteries (spare)",
                category="Tools",
                desired_quantity=1,
                priority=InventoryPriority.ESSENTIAL,
            ),
            KitTemplateItem(
                name="Multi-tool / knife",
                category="Tools",
                desired_quantity=1,
                priority=InventoryPriority.ESSENTIAL,
            ),
            KitTemplateItem(
                name="Emergency radio",
                category="Tools",
                desired_quantity=1,
            ),
            KitTemplateItem(
                name="Whistle",
                category="Tools",
                desired_quantity=1,
            ),
            KitTemplateItem(
                name="Copies of IDs / documents",
                category="Other",
                desired_quantity=1,
                priority=InventoryPriority.ESSENTIAL,
            ),
            KitTemplateItem(
                name="Cash (small bills)",
                category="Other",
                desired_quantity=1,
            ),
        ),
    ),
    KitTemplate(
        id="basic_tools",
        name="Basic tools",
        description="Household tools useful during outages and repairs.",
        items=(
            KitTemplateItem(
                name="Duct tape",
                category="Tools",
                desired_quantity=1,
            ),
            KitTemplateItem(
                name="Work gloves",
                category="Tools",
                desired_quantity=2,
            ),
            KitTemplateItem(
                name="Manual can opener",
                category="Tools",
                desired_quantity=1,
                priority=InventoryPriority.ESSENTIAL,
            ),
            KitTemplateItem(
                name="Fire extinguisher",
                category="Tools",
                desired_quantity=1,
                priority=InventoryPriority.ESSENTIAL,
            ),
            KitTemplateItem(
                name="Matches / lighter",
                category="Tools",
                desired_quantity=1,
                priority=InventoryPriority.ESSENTIAL,
            ),
        ),
    ),
)

_BY_ID = {t.id: t for t in KIT_TEMPLATES}


def get_kit_template(template_id: str) -> KitTemplate | None:
    """Return a template by id, or None."""
    return _BY_ID.get(template_id)


def list_kit_templates() -> list[dict[str, Any]]:
    """Serialize templates for services / websocket (no full item payloads)."""
    return [
        {
            "id": t.id,
            "name": t.name,
            "description": t.description,
            "item_count": len(t.items),
        }
        for t in KIT_TEMPLATES
    ]


def template_items_dicts(template: KitTemplate) -> list[dict[str, Any]]:
    """Serialize template item rows for UI preview."""
    return [
        {
            "name": i.name,
            "category": i.category,
            "desired_quantity": i.desired_quantity,
            "quantity": i.quantity,
            "priority": i.priority.value,
            "unit": i.unit.value,
        }
        for i in template.items
    ]
