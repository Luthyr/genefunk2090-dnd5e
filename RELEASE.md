# Release Workflow

GitHub Actions publishes Foundry release assets when you push a version tag.

## Tag-Based Release

1. Update `module.json`.

   The version and URLs must all use the same tag:

   ```json
   {
     "version": "0.1.5",
     "manifest": "https://github.com/Luthyr/genefunk2090-dnd5e/releases/download/v0.1.5/module.json",
     "download": "https://github.com/Luthyr/genefunk2090-dnd5e/releases/download/v0.1.5/genefunk2090-dnd5e.zip"
   }
   ```

2. Commit and push the source files.

3. Create and push the matching tag:

   ```powershell
   git tag v0.1.5
   git push origin v0.1.5
   ```

4. GitHub Actions will build and upload:

   ```text
   module.json
   genefunk2090-dnd5e.zip
   ```

The workflow fails if the pushed tag does not match `module.json` version or release URLs.

## Manual Local Build

You can still build assets locally for testing:

```powershell
.\tools\package-release.ps1
```

This creates:

```text
dist/module.json
dist/genefunk2090-dnd5e.zip
```

The `dist/` folder is intentionally ignored by Git.

## Foundry Install URL

For a specific release:

```text
https://github.com/Luthyr/genefunk2090-dnd5e/releases/download/v0.1.5/module.json
```

For the latest normal release:

```text
https://github.com/Luthyr/genefunk2090-dnd5e/releases/latest/download/module.json
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
- `docs/`
- `source-import/`

Starter data is stored as source JSON and imported into a development world with console helpers. Do not add `packs` to `module.json` until real Foundry-generated compendium data exists. See `docs/compendium-workflow.md`.
