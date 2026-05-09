# GeneFunk 2090 Foundry MVP Roadmap

## Phase 1: Content-First Module

Goal: Make the game playable in Foundry with minimal automation.

Deliverables:
- Module installs and activates in D&D 5e worlds
- Compendia for classes, features, equipment, hacks, actors, and journals
- GeneFunk profile badge appears on character sheets
- Helper macros for assigning genotype and occupation

Success criteria:
- A GM can create a GeneFunk character using dnd5e sheets
- The character can use GeneFunk items/features as normal dnd5e Items
- Nothing breaks normal D&D 5e rolls

## Phase 2: Data Model Conventions

Goal: Standardize how GeneFunk data is stored.

Recommended actor flag:

```js
flags["genefunk2090-dnd5e"].profile = {
  genotype: "",
  occupation: "",
  faction: "",
  wealthTier: "",
  notes: ""
}
```

Recommended item flag:

```js
flags["genefunk2090-dnd5e"].geneFunk = {
  category: "class | feature | hack | cyberware | bioware | weapon | armor | drug | tool",
  sourceBook: "",
  page: "",
  automation: {},
  tags: []
}
```

## Phase 3: Automation Candidates

Prioritize automation that saves the most time:

1. Ammunition tracking
2. Reload and magazine tracking
3. Burst fire / autofire support
4. Cyberware and bioware capacity warnings
5. Hack card resource usage
6. Drug duration and side effect reminders
7. NPC action setup

## Phase 4: Polish

- Custom icons
- Journal reference pages
- Prebuilt scenes/maps
- Token art assignments
- Import macros
- GM configuration panel

## Open Design Questions

- Should hacks be represented as dnd5e spells, feats, consumables, or a mix?
- Should cyberware/bioware be equipment items or feats?
- Should ammo be tracked through dnd5e consumables or a custom flag?
- Should GeneFunk classes replace fantasy classes entirely in a world?
- How much automation is worth the maintenance burden?
