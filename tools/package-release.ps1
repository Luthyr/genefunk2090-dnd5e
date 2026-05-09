$ErrorActionPreference = "Stop"

$moduleId = "genefunk2090-dnd5e"
$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$dist = Join-Path $root "dist"
$zipPath = Join-Path $dist "$moduleId.zip"
$manifestPath = Join-Path $dist "module.json"

$required = @(
  "module.json",
  "README.md",
  "LICENSE",
  "docs",
  "lang",
  "macros",
  "scripts",
  "source-import",
  "styles"
)

New-Item -ItemType Directory -Force -Path $dist | Out-Null

foreach ($path in $required) {
  $fullPath = Join-Path $root $path
  if (-not (Test-Path $fullPath)) {
    throw "Required release path is missing: $path"
  }
}

Get-Content (Join-Path $root "module.json") | ConvertFrom-Json | Out-Null
Get-Content (Join-Path $root "lang/en.json") | ConvertFrom-Json | Out-Null
Get-Content (Join-Path $root "source-import/starter-items.json") | ConvertFrom-Json | Out-Null

$pathsToZip = $required | ForEach-Object { Join-Path $root $_ }
Compress-Archive -Path $pathsToZip -DestinationPath $zipPath -Force
Copy-Item -Path (Join-Path $root "module.json") -Destination $manifestPath -Force

Write-Host "Created $zipPath"
Write-Host "Created $manifestPath"
