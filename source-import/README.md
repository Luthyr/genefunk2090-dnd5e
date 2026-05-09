# Source Import Notes

Place source references, hand-entered draft JSON, or private import scratch files here.

Do not distribute copyrighted book text inside the public module unless you have the rights to do so.

Suggested private workflow:
1. Use the GeneFunk PDFs as reference.
2. Manually create Foundry Items in a local world.
3. Export Items into the module compendia.
4. Keep only the resulting game data you have rights to distribute.
5. For personal-use-only modules, keep the module private.
Source import files are table-safe placeholders for creating world Items during development.

Use `macros/import-starter-content.js` or this console command in an active dnd5e world:

```js
await GeneFunk2090.importStarterContent();
```

The JSON in this folder is not a Foundry compendium database and should not be declared under `packs` in `module.json`.

Current files:

- `starter-items.json`: placeholder class Items and placeholder category Items with no copyrighted book text.
