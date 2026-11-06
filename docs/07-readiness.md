# 7. Readiness math

```
daily_water    = Σ over age categories (count × water liters per person per day)
                 + Σ over pets (water liters per day)
daily_calories = Σ over age categories (count × calories per person per day)
daily_pet_food = Σ over pets (food grams per day)
water_target   = daily_water × duration_hours / 24
calorie_target = daily_calories × duration_hours / 24
pet_food_target = daily_pet_food × duration_hours / 24      (grams)
percent        = min(100, on_hand / target × 100)
overall        = min(water_percent, food_percent)           (and pet_food_percent, when pet_food_target > 0)
```

Age categories are adults (18–69), children (4–17), babies and toddlers (0–3) and seniors (70+). Defaults follow Voedingscentrum.nl for light activity (kcal/day 2200, 1800, 1000, 1900; water 3 L/day each) and can be changed per category. Installs that predate age categories are read as all adults: the old headcount is the adult count and the old per-person values are the adult values, so their targets do not change. Nothing is rewritten until you save **Readiness targets**.

## Pets

Add any number of pets under **Pets** in the options (name, food in grams per day, water in liters per day, optional type). There are no built-in pet types or amounts. Pet water is added to the shared water target and counts against the same water stock; there is no separate pet water category. Pet food is a separate target in grams and is never mixed with the human food total in kcal.

Pet food on hand is the grams in items whose category is listed under **Pet food categories** (default `Pet food`). Package contents entered in kilograms are converted to grams, and the legacy gram/kilogram stock units count as well. Items without a gram amount are unmeasurable and left out, expired stock is excluded, and pet food joins the overall readiness and supply hours only when a pet food target exists (at least one pet with food above 0). A category can only be one of food, water or pet food; if it is listed more than once, water wins over food, and food wins over pet food.

Installs that predate pets read as no pets and no pet food categories, so their targets, readiness and attention results do not change. Nothing is written until you add your first pet or save **Locations and categories**; the first pet also maps the `Pet food` category unless that name is already a food or water category. Expired, expiring and low-stock warnings are per item, so pet food items are covered like any other item.

The settings websocket response also returns `target_breakdown`: water per age category and per pet, food (kcal) per age category and pet food (g) per pet, each over the full duration and summing to the targets.

Expired stock is excluded. Items whose category is mapped to food or water but lack calories or liters are counted as unmeasurable and left out of totals. Configure food/water category lists under **Locations and categories** in [2. Configuration](02-configuration.md).

## Category completeness

For categories **not** mapped to food or water, items with `desired_quantity > 0` form a checklist. An item is complete when not expired and `quantity >= desired_quantity`. `category_completeness` is the average of those category percents (or unavailable when no checklist items exist). Kit templates (`apply_kit_template`) seed such checklist items; they are not separate kit entities.

The sidebar panel's completeness card opens a dialog listing every item that keeps a category below 100%, with its reason: stock below the desired quantity (`2 of 5`) or expired (an item that is both shows as expired). The websocket `completeness.categories.<name>.missing` carries these as objects (`id`, `name`, `quantity`, `desired_quantity`, `expired`) without the cap that applies to the sensor attribute, which stays a list of names.

---

**Previous:** [6. Automations](06-automations.md)
