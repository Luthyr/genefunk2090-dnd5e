# GeneFunk 2090 Flag Model

This module stores GeneFunk-specific data in Foundry flags under the module id `genefunk2090-dnd5e`.

The dnd5e actor and item data models remain the rules engine. This module should not replace dnd5e document schemas or override dnd5e roll internals in this early pass.

## Actor Flags

### `flags.genefunk2090-dnd5e.profile`

Stores table-authored GeneFunk profile metadata for an actor.

```json
{
  "genotype": "Placeholder genotype",
  "occupation": "Placeholder occupation",
  "faction": "Placeholder faction",
  "credits": 100,
  "cyberwareLoad": 1,
  "archetype": "GeneFunk Profile",
  "origin": "Placeholder origin",
  "background": "Placeholder background",
  "notes": "Table-approved notes only"
}
```

Expected use:

- Display a compact sheet badge when the setting is enabled.
- Print a summary to chat with the starter macro or console helper.
- Display and edit the lightweight GeneFunk actor panel.
- Provide future hooks for non-invasive dnd5e add-on behavior.

Do not store copyrighted book text here in distributed examples. Use local table notes, short labels, or references to legally owned content.

## Item Flags

### `flags.genefunk2090-dnd5e.category`

Classifies an item for later module affordances.

Allowed starter values:

- `hack`
- `cyberware`
- `bioware`
- `modern-weapon`
- `armor`
- `drug`
- `tool`
- `equipment`

Example:

```json
{
  "flags": {
    "genefunk2090-dnd5e": {
      "category": "cyberware"
    }
  }
}
```

### `flags.genefunk2090-dnd5e.contentType`

Classifies placeholder class Items without implying mechanics.

Example:

```json
{
  "flags": {
    "genefunk2090-dnd5e": {
      "contentType": "class",
      "placeholder": true
    }
  }
}
```

The item remains a normal dnd5e item. Damage formulas, activation, uses, equipment state, and rolls should continue to use dnd5e fields unless a later feature has a documented reason to add a flag.

Modern firearm placeholders use normal dnd5e `system.uses.value` for current magazine ammo. Reserve ammo and magazine metadata live in `flags.genefunk2090-dnd5e.ammo`.

Example:

```json
{
  "flags": {
    "genefunk2090-dnd5e": {
      "category": "modern-weapon",
      "ammo": {
        "magazineSize": 12,
        "reserve": 36,
        "reload": "action"
      }
    }
  }
}
```

The helper `GeneFunk2090.spendAmmo(item)` decrements `system.uses.value`. The helper `GeneFunk2090.reloadAmmo(item)` moves rounds from reserve into the magazine.

## Settings

World settings registered by this module:

- `showSheetBadges`: shows actor sheet badges for actors with a GeneFunk profile flag.
- `enableModernFirearms`: placeholder toggle for modern firearm content affordances.
- `enableHackTracking`: placeholder toggle for hack-tagged item workflows.
