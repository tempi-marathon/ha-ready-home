# 7. Readiness math

```
water_target   = people × water_liters_per_person_per_day × duration_hours / 24
calorie_target = people × calories_per_person_per_day × duration_hours / 24
percent        = min(100, on_hand / target × 100)
overall        = min(water_percent, food_percent)
```

Expired stock is excluded. Items whose category is mapped to food or water but lack calories or liters are counted as unmeasurable and left out of totals. Configure food/water category lists under **Locations and categories** in [2. Configuration](02-configuration.md).

## Category completeness

For categories **not** mapped to food or water, items with `desired_quantity > 0` form a checklist. An item is complete when not expired and `quantity >= desired_quantity`. `category_completeness` is the average of those category percents (or unavailable when no checklist items exist). Kit templates (`apply_kit_template`) seed such checklist items; they are not separate kit entities.

The sidebar panel's completeness card opens a dialog listing every item that keeps a category below 100%, with its reason: stock below the desired quantity (`2 of 5`) or expired (an item that is both shows as expired). The websocket `completeness.categories.<name>.missing` carries these as objects (`id`, `name`, `quantity`, `desired_quantity`, `expired`) without the cap that applies to the sensor attribute, which stays a list of names.

---

**Previous:** [6. Automations](06-automations.md)
