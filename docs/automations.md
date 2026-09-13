# Example automations

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
      message: "{{ trigger.event.data.item.name }} has expired."
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
      item: "Restock {{ trigger.event.data.item.name }}"
```

## Related

- [Sensors and events](sensors-and-events.md)
- [Actions](actions.md)
