# Readiness math

```
water_target   = people × water_liters_per_person_per_day × duration_hours / 24
calorie_target = people × calories_per_person_per_day × duration_hours / 24
percent        = min(100, on_hand / target × 100)
overall        = min(water_percent, food_percent)
```

Expired stock is excluded. Items whose category is mapped to food or water but lack calories or liters are counted as unmeasurable and left out of totals. Configure food/water category lists under **Locations and categories** in [Configuration](configuration.md).
