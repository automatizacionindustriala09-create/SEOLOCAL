param(
  [Parameter(Mandatory=$true)][string]$Project,
  [Parameter(Mandatory=$true)][string]$Log
)

$ErrorActionPreference = 'Stop'
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

function Write-Step([string]$Message) {
  Write-Host $Message
  Add-Content -Path $Log -Value $Message -Encoding UTF8
}

Write-Step "PowerShell repair started. Project=$Project"

$relativeFiles = @(
  'package.json',
  'package-lock.json',
  'vite.config.ts',
  'vite.config.js',
  'tsconfig.json',
  'tsconfig.app.json',
  'tsconfig.node.json',
  'index.html',
  'src/index.css',
  'postcss.config.js',
  'postcss.config.cjs',
  'postcss.config.mjs',
  '.postcssrc',
  '.postcssrc.json',
  'tailwind.config.js',
  'tailwind.config.ts',
  'docker/frontend/Dockerfile'
)

$fixed = 0
$rewritten = 0
foreach ($rel in $relativeFiles) {
  $path = Join-Path $Project $rel
  if (Test-Path -LiteralPath $path) {
    $bytes = [System.IO.File]::ReadAllBytes($path)
    if ($bytes.Length -ge 3 -and $bytes[0] -eq 239 -and $bytes[1] -eq 187 -and $bytes[2] -eq 191) {
      if ($bytes.Length -eq 3) {
        [System.IO.File]::WriteAllBytes($path, [byte[]]@())
      } else {
        [System.IO.File]::WriteAllBytes($path, $bytes[3..($bytes.Length-1)])
      }
      Write-Step "BOM removido: $rel"
      $fixed++
    }

    if ($rel -in @('package.json','vite.config.ts','src/index.css')) {
      $text = [System.IO.File]::ReadAllText($path)
      if ($text.Length -gt 0 -and [int][char]$text[0] -eq 65279) {
        $text = $text.Substring(1)
      }
      [System.IO.File]::WriteAllText($path, $text, $utf8NoBom)
      Write-Step "UTF8 sin BOM confirmado: $rel"
      $rewritten++
    }
  }
}

$pkg = Join-Path $Project 'package.json'
if (!(Test-Path -LiteralPath $pkg)) {
  throw "No existe package.json en $Project"
}

$pkgRaw = [System.IO.File]::ReadAllText($pkg)
if ($pkgRaw.Length -gt 0 -and [int][char]$pkgRaw[0] -eq 65279) {
  $pkgRaw = $pkgRaw.Substring(1)
}
[void]($pkgRaw | ConvertFrom-Json)
$pkgUpdated = [regex]::Replace($pkgRaw, '"version"\s*:\s*"[^"]+"', '"version": "5.20.7"', 1)
[System.IO.File]::WriteAllText($pkg, $pkgUpdated, $utf8NoBom)
Write-Step "package.json validado y version actualizada a 5.20.7"

$jsonFiles = @('package.json','package-lock.json','tsconfig.json','tsconfig.app.json','tsconfig.node.json','.postcssrc.json')
foreach ($rel in $jsonFiles) {
  $path = Join-Path $Project $rel
  if (Test-Path -LiteralPath $path) {
    $raw = [System.IO.File]::ReadAllText($path)
    if ($raw.Length -gt 0 -and [int][char]$raw[0] -eq 65279) { $raw = $raw.Substring(1) }
    try {
      [void]($raw | ConvertFrom-Json)
      Write-Step "JSON OK: $rel"
    } catch {
      throw "JSON invalido en ${rel}: $($_.Exception.Message)"
    }
  }
}

Write-Step "Total BOM removidos: $fixed"
Write-Step "Archivos criticos reescritos sin BOM: $rewritten"
