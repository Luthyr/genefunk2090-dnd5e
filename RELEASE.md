# Release Workflow

GitHub Actions publishes Foundry release assets when you push a version tag.

## Tag-Based Release

1. Commit and push your source changes.

2. Create a GitHub release or push a tag such as:

   ```text
   v0.1.5
   ```

3. GitHub Actions rewrites the release copy of `module.json` so its `version`, `manifest`, and `download` values match the release tag. It then builds and uploads:

   ```text
   module.json
   genefunk2090-dnd5e.zip
   ```

You do not need to manually edit the source `module.json` version and release URLs for every release. The generated release asset gets the tag-specific values.

The tag must look like `v0.1.5`. The generated manifest will use `0.1.5`.

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
