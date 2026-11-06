# 7. Readiness math

```
daily_water    = Σ over age categories (count × water liters per person per day)
daily_calories = Σ over age categories (count × calories per person per day)
water_target   = daily_water × duration_hours / 24
calorie_target = daily_calories × duration_hours / 24
percent        = min(100, on_hand / target × 100)
overall        = min(water_percent, food_percent)
```

Age categories are adults (18–69), children (4–17), babies and toddlers (0–3) and seniors (70+). Defaults follow Voedingscentrum.nl for light activity (kcal/day 2200, 1800, 1000, 1900; water 3 L/day each) and can be changed per category. Installs that predate age categories are read as all adults: the old headcount is the adult count and the old per-person values are the adult values, so their targets do not change. Nothing is rewritten until you save **Readiness targets**.

Expired stock is excluded. Items whose category is mapped to food or water but lack calories or liters are counted as unmeasurable and left out of totals. Configure food/water category lists under **Locations and categories** in [2. Configuration](02-configuration.md).

## Essential readiness

The same targets and formula are also computed using only items with priority `essential`. Overall water/food sensors stay unchanged; `essential_*` sensors show whether essentials alone cover the plan.

## Category completeness

For categories **not** mapped to food or water, items with `desired_quantity > 0` form a checklist. An item is complete when not expired and `quantity >= desired_quantity`. `category_completeness` is the average of those category percents (or unavailable when no checklist items exist). Kit templates (`apply_kit_template`) seed such checklist items; they are not separate kit entities.

---

**Previous:** [6. Automations](06-automations.md)
