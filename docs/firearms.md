# Firearm Foundation

The firearm layer keeps dnd5e as the rules engine. Modern firearms are normal dnd5e weapon Items with a GeneFunk category flag and a small firearm metadata flag.

## Item Data

Use dnd5e fields where possible:

- `type: "weapon"`
- `system.damage.parts`
- `system.uses.value` for current magazine ammo
- `system.uses.max` for displayed magazine maximum
- Standard dnd5e item rolls remain unchanged

Use GeneFunk flags for module-specific state:

```json
{
  "flags": {
    "genefunk2090-dnd5e": {
      "category": "modern-weapon",
      "firearm": {
        "magazineCapacity": 30,
        "reserveAmmo": 90,
        "reloadAction": "action",
        "burstEnabled": false,
        "burstSize": 3,
        "traits": ["placeholder", "burst", "reload"]
      }
    }
  }
}
```

## Helpers

Console helpers:

```js
const actor = GeneFunk2090.getSelectedActor();
const item = actor.items.getName("Placeholder Burst Rifle");

GeneFunk2090.getAmmoState(item);
await GeneFunk2090.spendAmmo(item);
await GeneFunk2090.reloadAmmo(item);
await GeneFunk2090.setBurstFire(item, true);
```

## UI

- Actor sheets show a lightweight firearm ammo panel when the actor owns modern-weapon Items.
- Modern firearm item sheets show magazine, reserve, traits, spend ammo, reload, and burst toggle controls.

The module does not override dnd5e roll internals. Use the normal dnd5e item roll controls for attacks and damage.
