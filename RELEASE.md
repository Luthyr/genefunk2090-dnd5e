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

Create a public, non-draft GitHub release, for example `v0.1.0`, then attach exactly these two files:

```text
dist/module.json
dist/genefunk2090-dnd5e.zip
```

After upload, this URL must open raw JSON in a browser:

```text
https://github.com/Luthyr/genefunk2090-dnd5e/releases/latest/download/module.json
```

Foundry install URL:

```text
https://github.com/Luthyr/genefunk2090-dnd5e/releases/latest/download/module.json
```

If Foundry reports `Failed to fetch package manifest`, the release asset is missing, private, draft-only, or the URL is not reachable.

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
- `docs/`
- `source-import/`

Do not declare placeholder `packs/*` folders in `module.json` until they contain real Foundry compendium databases exported by Foundry.
