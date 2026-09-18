# 6. Automations

## Notify when something expires

```yaml
alias: Ready Home item expired
triggers:
  - trigger: event
    event_type: ready_home_item_expired
actions:
  - action: notify.persistent_notification
    data:
      title: Inventory expired
      message: >-
        {{ trigger.event.data.item.name }}
        ({{ trigger.event.data.item.location or "no location" }})
        has expired.
```

## Notify when something is expiring soon

Fires for both the urgent window and the wider expiring window (`trigger.event.data.bucket` is always `"expiring"`).

```yaml
alias: Ready Home item expiring
triggers:
  - trigger: event
    event_type: ready_home_item_expiring
actions:
  - action: notify.persistent_notification
    data:
      title: Inventory expiring soon
      message: >-
        {{ trigger.event.data.item.name }} expires
        {{ trigger.event.data.item.expiry_date }}.
        Qty {{ trigger.event.data.item.quantity }}
        {{ trigger.event.data.item.unit }}.
```

## Add low-stock items to a todo list

```yaml
alias: Ready Home low stock to shopping list
triggers:
  - trigger: event
    event_type: ready_home_item_low_stock
actions:
  - action: todo.add_item
    target:
      entity_id: todo.shopping_list
    data:
      item: >-
        Restock {{ trigger.event.data.item.name }}
        ({{ trigger.event.data.item.quantity }}/{{ trigger.event.data.item.desired_quantity }})
```

## When anything needs attention (problem sensor)

Use the binary sensor for a single “something is wrong” trigger. Entity id may vary with your device name.

```yaml
alias: Ready Home needs attention
triggers:
  - trigger: state
    entity_id: binary_sensor.ready_home_needs_attention
    to: "on"
actions:
  - action: notify.persistent_notification
    data:
      title: Ready Home needs attention
      message: >-
        {{ state_attr('binary_sensor.ready_home_needs_attention', 'cause') }}
```

## Notify with the expired list from the sensor

```yaml
alias: Ready Home daily expired digest
triggers:
  - trigger: time
    at: "09:00:00"
conditions:
  - condition: numeric_state
    entity_id: sensor.ready_home_expired_items
    above: 0
actions:
  - action: notify.persistent_notification
    data:
      title: Expired inventory
      message: >-
        {{ state_attr('sensor.ready_home_expired_items', 'items')
           | map(attribute='name') | list | join(', ') }}
```

## Expiring / low-stock lists via `list_items`

Useful in scripts when you want a fresh filtered list (see also [4. Actions](04-actions.md)).

```yaml
alias: Ready Home shopping from low stock
sequence:
  - action: ready_home.list_items
    data:
      status: low_stock
    response_variable: low
  - repeat:
      for_each: "{{ low.items }}"
      sequence:
        - action: todo.add_item
          target:
            entity_id: todo.shopping_list
          data:
            item: "Restock {{ repeat.item.name }}"
```

The same action accepts `status: expired`, `expiring`, or `ok`.

---

**Previous:** [5. Sensors and events](05-sensors-and-events.md) · **Next:** [7. Readiness math](07-readiness.md)
