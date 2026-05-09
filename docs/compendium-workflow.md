# Compendium Workflow

Foundry v13 module packs must point at real compendium data created or exported by Foundry. Empty folders, README files, or source JSON files are not valid compendium databases.

This module currently ships starter source data in:

- `source-import/starter-items.json`
- `source-import/starter-actors.json`

Those files are reviewable placeholders and can be imported into a development world with console helpers. They are not declared as module packs in `module.json`.

## Development Import

In a dnd5e world with this module enabled, run as GM:

```js
await GeneFunk2090.importStarterContent();
await GeneFunk2090.importStarterActors();
```

Review and edit the created world Items and Actors in Foundry. Keep descriptions placeholder-only unless you have rights to distribute the text.

## Export To Real Module Packs

Use this workflow when the world content is ready to ship as compendia:

1. Create module compendium packs from Foundry or with Foundry's supported package tools.
2. Move or export the generated pack data into module folders under `packs/`.
3. Confirm each pack folder contains Foundry-generated database files, not only README/source placeholders.
4. Add pack definitions to `module.json`.
5. Restart Foundry and verify the packs appear and open before publishing a release.

Example `module.json` pack definitions, only after real pack data exists:

```json
{
  "packs": [
    {
      "name": "classes",
      "label": "GeneFunk 2090 Classes",
      "path": "packs/classes",
      "type": "Item",
      "system": "dnd5e",
      "ownership": {
        "PLAYER": "OBSERVER",
        "ASSISTANT": "OWNER"
      }
    },
    {
      "name": "equipment",
      "label": "GeneFunk 2090 Gear",
      "path": "packs/equipment",
      "type": "Item",
      "system": "dnd5e",
      "ownership": {
        "PLAYER": "OBSERVER",
        "ASSISTANT": "OWNER"
      }
    },
    {
      "name": "actors",
      "label": "GeneFunk 2090 Sample Actors",
      "path": "packs/actors",
      "type": "Actor",
      "system": "dnd5e",
      "ownership": {
        "PLAYER": "OBSERVER",
        "ASSISTANT": "OWNER"
      }
    }
  ]
}
```

Do not add those definitions while the folders are empty or contain only README files. Foundry will try to load them as real compendia and can fail during install or activation.

## Release Check

Before building a release:

```powershell
.\tools\package-release.ps1
```

The packaging script validates JSON source files but does not validate real compendium database contents. Open the module in Foundry v13 to verify actual packs.
