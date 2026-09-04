import "./cards/readiness-card";
import "./cards/inventory-card";

window.customCards = window.customCards || [];
window.customCards.push(
  {
    type: "ready-home-readiness-card",
    name: "Ready Home Readiness",
    description: "Water and food readiness gauges with attention counts",
    preview: true,
  },
  {
    type: "ready-home-inventory-card",
    name: "Ready Home Inventory",
    description: "Manage emergency supply inventory",
    preview: true,
  },
);
