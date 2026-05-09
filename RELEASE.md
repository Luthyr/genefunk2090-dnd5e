# Release Upload Checklist

Use this when publishing a GitHub release for Foundry's **Install Module** URL flow.

## Build Assets

From the repository root:

```powershell
.\tools\package-release.ps1
```

This creates:

```text
dist/module.json
dist/genefunk2090-dnd5e.zip
```

The `dist/` folder is intentionally ignored by Git. Upload these files as GitHub release assets instead of committing them.

## GitHub Release

Create a public, non-draft GitHub release matching the `version` in `module.json`, for example `v0.1.2`, then attach exactly these two files:

```text
dist/module.json
dist/genefunk2090-dnd5e.zip
```

After upload, this URL must open or download JSON in a browser:

```text
https://github.com/Luthyr/genefunk2090-dnd5e/releases/download/v0.1.2/module.json
```

Foundry install URL:

```text
https://github.com/Luthyr/genefunk2090-dnd5e/releases/download/v0.1.2/module.json
```

If Foundry reports `Failed to fetch package manifest`, the release asset is missing, private, draft-only, or the URL is not reachable. The `releases/latest` URL only works for normal releases, not prereleases.

## Source Files To Push

Commit and push the repository source files normally. The important release-support files are:

- `module.json`
- `tools/package-release.ps1`
- `RELEASE.md`
- `README.md`
- `scripts/main.js`
- `styles/genefunk.css`
- `lang/en.json`
- `macros/`
- `packs/`
- `docs/`
- `source-import/`

The starter compendia are seeded from `source-import/starter-items.json` on first GM activation. After editing entries in Foundry, export real compendium databases before replacing the source-driven placeholders.
