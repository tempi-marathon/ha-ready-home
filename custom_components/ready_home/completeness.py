"""Category completeness for non–food/water inventory."""

from __future__ import annotations

from datetime import date

from .const import ATTRIBUTE_ITEM_CAP
from .models import (
    CategoryCompleteness,
    CategoryScore,
    InventoryItem,
    MissingItem,
    ReadinessSettings,
)


def assess_category_completeness(
    items: list[InventoryItem],
    settings: ReadinessSettings,
    today: date | None = None,
) -> CategoryCompleteness:
    """Score checklist-style categories (not mapped to food or water).

    Eligible items have ``desired_quantity > 0``. An item is complete when it is
    not expired and ``quantity >= desired_quantity``. Categories with no eligible
    items are omitted. Overall percent is the average of scored categories.
    """
    today = today or date.today()

    # Prefer configured category list order; also include stray item categories.
    category_names: list[str] = []
    seen: set[str] = set()
    for name in settings.categories:
        cleaned = str(name).strip()
        if not cleaned:
            continue
        key = cleaned.lower()
        if key in seen:
            continue
        seen.add(key)
        category_names.append(cleaned)
    for item in items:
        cleaned = str(item.category or "").strip()
        if not cleaned:
            continue
        key = cleaned.lower()
        if key in seen:
            continue
        if settings.readiness_kind(cleaned) != "none":
            continue
        seen.add(key)
        category_names.append(cleaned)

    scores: list[CategoryScore] = []
    for category in category_names:
        if settings.readiness_kind(category) != "none":
            continue
        cat_key = category.strip().lower()
        eligible = [
            i
            for i in items
            if (i.category or "").strip().lower() == cat_key
            and float(i.desired_quantity) > 0
        ]
        if not eligible:
            continue
        complete = 0
        missing_names: list[str] = []
        missing_items: list[MissingItem] = []
        for item in eligible:
            if not item.is_expired(today) and float(item.quantity) >= float(
                item.desired_quantity
            ):
                complete += 1
            else:
                missing_names.append(item.name)
                missing_items.append(
                    MissingItem(
                        id=item.id,
                        name=item.name,
                        quantity=float(item.quantity),
                        desired_quantity=float(item.desired_quantity),
                        expired=item.is_expired(today),
                    )
                )
        total = len(eligible)
        percent = (complete / total) * 100.0 if total else 0.0
        scores.append(
            CategoryScore(
                category=category,
                percent=percent,
                complete=complete,
                total=total,
                missing=tuple(missing_names),
                missing_items=tuple(missing_items),
            )
        )

    if not scores:
        return CategoryCompleteness(overall_percent=None, categories=())

    overall = sum(s.percent for s in scores) / len(scores)
    return CategoryCompleteness(overall_percent=overall, categories=tuple(scores))


def completeness_attr_dict(
    completeness: CategoryCompleteness,
) -> dict[str, object]:
    """Serialize completeness for sensor attributes (names only, capped)."""
    categories: dict[str, object] = {}
    for score in completeness.categories:
        missing_cap = list(score.missing[:ATTRIBUTE_ITEM_CAP])
        categories[score.category] = {
            "percent": round(score.percent, 1),
            "complete": score.complete,
            "total": score.total,
            "missing": missing_cap,
        }
    return {
        "overall_percent": (
            None
            if completeness.overall_percent is None
            else round(completeness.overall_percent, 1)
        ),
        "categories": categories,
    }


def completeness_ws_dict(
    completeness: CategoryCompleteness,
) -> dict[str, object]:
    """Serialize completeness for the websocket: uncapped missing items with reasons."""
    payload = completeness_attr_dict(completeness)
    categories = payload["categories"]
    assert isinstance(categories, dict)
    for score in completeness.categories:
        categories[score.category]["missing"] = [  # type: ignore[index]
            {
                "id": m.id,
                "name": m.name,
                "quantity": m.quantity,
                "desired_quantity": m.desired_quantity,
                "expired": m.expired,
            }
            for m in score.missing_items
        ]
    return payload
