# GeneFunk 2090 for D&D 5e

A Foundry VTT add-on module scaffold for using GeneFunk 2090-style cyberpunk/biopunk rules and content on top of the existing D&D 5e system.

## Current Status

Version: 0.1.3 gameplay placeholder pass

This is an MVP foundation. It does not include copyrighted book text or extracted PDF content. It provides:

- A valid Foundry module manifest
- D&D 5e system dependency
- Source JSON placeholders for starter Items and Actors
- Starter script hooks
- Actor profile helper flags
- Item categorization helper flags
- Placeholder starter Items in `source-import/starter-items.json`
- Basic character sheet badge styling
- A content import roadmap

## Install

Copy the `genefunk2090-dnd5e` folder into:

```text
{Foundry User Data}/Data/modules/
```

Then restart Foundry and enable **GeneFunk 2090 for D&D 5e** in a D&D 5e world.

The local folder name must be exactly:

```text
genefunk2090-dnd5e
```

## URL Install

Foundry's **Install Module** URL flow only works after a GitHub release has these assets attached:

- `module.json`
- `genefunk2090-dnd5e.zip`

Build those assets with:

```powershell
.\tools\package-release.ps1
```

Then create a GitHub release and upload:

```text
dist/module.json
dist/genefunk2090-dnd5e.zip
```

After the release exists, use this manifest URL in Foundry:

```text
https://github.com/Luthyr/genefunk2090-dnd5e/releases/download/v0.1.3/module.json
```

Using the GitHub repository page URL or a release URL without uploaded assets will fail with an invalid manifest response. GitHub's `latest` release URL does not work for prereleases.

## Developer Console Helpers

Set a GeneFunk profile on a selected token's actor:

```js
await GeneFunk2090.setProfile(canvas.tokens.controlled[0].actor, {
  archetype: "Example Archetype",
  origin: "Example Origin",
  background: "Example Background"
});
```

Tag an item:

```js
await GeneFunk2090.tagItem(actor.items.getName("Example Item"), "cyberware");
```

Import placeholder starter Items and Actors into the current world:

```js
await GeneFunk2090.importStarterContent();
await GeneFunk2090.importStarterActors();
```

This creates placeholder class Items for Biohacker, Codehacker, Crook, Engineer, Gunfighter, Hardcase, Samurai, and Suit, plus one placeholder Item for each starter category. These are not book text and do not contain real mechanics yet.

The gameplay placeholder pass adds one playable Gunfighter class shell, three placeholder firearms, one armor item, three dnd5e spell-based hacks, one cyberware item, one sample NPC, and one sample player character. It also adds a lightweight GeneFunk actor panel for genotype, occupation, faction, credits, and cyberware load.

Modern-weapon Items track the current magazine in `system.uses.value` and reserve ammo in the `flags.genefunk2090-dnd5e.ammo.reserve` flag. Spend and reload ammo with:

```js
await GeneFunk2090.spendAmmo(item);
await GeneFunk2090.reloadAmmo(item);
```

## Starter Macros

Create Foundry script macros by copying from:

- `macros/import-starter-content.js`
- `macros/set-genotype-occupation.js`
- `macros/set-gene-funk-profile.js`
- `macros/tag-selected-item.js`
- `macros/print-gene-funk-profile.js`

## Test The Vertical Slice In Foundry

1. Install or update the module in a Foundry VTT v13 world using the official `dnd5e` system.
2. Log in as a GM and enable **GeneFunk 2090 for D&D 5e**.
3. Run the starter import helpers in the browser console as GM:

   ```js
   await GeneFunk2090.importStarterContent();
   await GeneFunk2090.importStarterActors();
   ```

4. Confirm the world Items directory contains `Gunfighter`.
5. Confirm the world Items directory contains:
   - `Placeholder Light Pistol`
   - `Placeholder Burst Rifle`
   - `Placeholder Heavy Sidearm`
   - `Placeholder Tactical Armor`
   - `Placeholder Signal Spike`
   - `Placeholder System Jam`
   - `Placeholder Firewall Patch`
   - `Placeholder Optic Implant`
6. Confirm the world Actors directory contains:
   - `GeneFunk Placeholder NPC`
   - `GeneFunk Placeholder PC`
7. Import or open the sample PC. The actor sheet should show the GeneFunk panel with genotype, occupation, faction, credits, and cyberware load.
8. Open `GeneFunk Placeholder PC`. The actor should already have Gunfighter, a pistol, armor, one hack, and one cyberware item.
9. Open the pistol item sheet and click **Spend Ammo**. The magazine count and `system.uses.value` should decrease by 1.
10. Click **Reload** after spending ammo. The magazine should refill from reserve ammo.
11. Open a placeholder hack item such as `Placeholder Signal Spike`. It should remain a normal dnd5e spell item while showing the GeneFunk `hack` category note.
12. Use the starter macros to set a profile, tag an item, and print the profile to chat.

## Suggested MVP Content Order

1. Create class items:
   - Biohacker
   - Codehacker
   - Crook
   - Engineer
   - Gunfighter
   - Hardcase
   - Samurai
   - Suit

2. Create subclass/feature items:
   - One sample subclass per class
   - Level 1 features first
   - Automation later

3. Replace placeholder item categories with table-approved mechanics:
   - Hacks
   - Cyberware
   - Bioware
   - Modern weapons
   - Armor
   - Drugs
   - Tools

4. Create hacks:
   - Import hack cards as Items
   - Use dnd5e spell or feat item types depending on the rule behavior
   - Add flags for hack family, action cost, target, range, duration, save/check, and scaling

5. Create pregens:
   - Build level 1 pregens manually from official PDFs
   - Save to Actor compendium
   - Repeat for level 3 pregens

## Design Notes

Prefer compatibility over deep replacement.

Good module choices:
- Add compendia
- Add flags
- Add small sheet badges
- Add optional macros
- Add optional automation

Avoid initially:
- Replacing the dnd5e actor sheet
- Forking the dnd5e system
- Overriding dnd5e roll internals
- Rebuilding the whole rules engine

## Next Build Step

Create the first compendium entries manually in a test world, export them into the module packs, then add automation only after the content model feels stable.

The current starter data imports from source JSON into a development world. Once the data model stabilizes, export real Foundry compendium databases from a test world and add valid pack definitions. See `docs/compendium-workflow.md`.
