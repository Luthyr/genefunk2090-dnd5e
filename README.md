# GeneFunk 2090 Add-On for D&D 5e

`genefunk2090-dnd5e` is a Foundry VTT v13 module that keeps the official `dnd5e` system as the rules engine and layers small GeneFunk 2090-style cyberpunk and biopunk affordances on top.

This repository intentionally does not contain copyrighted GeneFunk book text. Starter data is limited to placeholders and schema examples.

## Current Scope

- Foundry v13 module manifest using the modern package format.
- Required system relationship for `dnd5e`.
- World settings for sheet badges, modern firearms, and hack tracking.
- Actor sheet badge for actors with a GeneFunk profile flag.
- Console helpers exposed as `globalThis.Genefunk2090`.
- Copyable starter macros in `macros/`.
- Flag model documentation in `docs/flags.md`.

## Install for Local Development

1. Copy or symlink this repository into your Foundry user data folder:

   ```text
   Data/modules/genefunk2090-dnd5e
   ```

2. Confirm the folder contains `module.json` at its root.
3. Start Foundry VTT v13.
4. Create or open a world using the official `dnd5e` system.
5. Enable **GeneFunk 2090 Add-On for D&D 5e** in **Manage Modules**.

The module id and folder name must both be `genefunk2090-dnd5e`.

## Test Checklist

### Manifest and Activation

1. Start Foundry v13.
2. Open a `dnd5e` world.
3. Enable the module.
4. Confirm there are no manifest or activation errors in the browser console.

### Settings

1. Open **Configure Settings**.
2. Find the module settings.
3. Toggle:
   - **Show GeneFunk sheet badges**
   - **Enable modern firearms**
   - **Enable hack tracking**

The modern firearms and hack tracking toggles are placeholders for future behavior.

### Console Helpers

Select a token, then run:

```js
await Genefunk2090.setActorProfile({
  archetype: "GeneFunk Profile",
  origin: "Placeholder origin",
  background: "Placeholder background",
  notes: "Local table notes"
});
```

Print the profile to chat:

```js
await Genefunk2090.printActorProfileToChat();
```

Tag an item:

```js
const actor = Genefunk2090.getSelectedActor();
const item = actor.items.contents[0];
await Genefunk2090.tagItem(item, "cyberware");
```

### Sheet Badge

1. Enable **Show GeneFunk sheet badges**.
2. Set a profile on an actor with the console helper or macro.
3. Open that actor's character sheet.
4. Confirm a compact GeneFunk badge appears in the sheet header.

### Starter Macros

Create Foundry script macros and copy the contents of:

- `macros/set-gene-funk-profile.js`
- `macros/tag-selected-item.js`
- `macros/print-gene-funk-profile.js`

Run them with a token selected. The item-tag macro tags the first rendered item sheet for the selected actor when possible, otherwise the actor's first item.

## Data Model

See `docs/flags.md` for the initial actor and item flag schema.

## Development Notes

- Use ES modules through `module.json` `esmodules`.
- Prefer Foundry flags under `genefunk2090-dnd5e`.
- Keep dnd5e actor and item data as the source of rules behavior.
- Avoid dnd5e roll overrides until a later, documented automation pass.
