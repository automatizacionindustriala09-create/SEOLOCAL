$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

$envValues = @{}
Get-Content ".env.docker" | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]*)=(.*)$') {
        $envValues[$matches[1].Trim()] = $matches[2].Trim()
    }
}
$apiPort = if ($envValues.ContainsKey("API_HOST_PORT")) { $envValues["API_HOST_PORT"] } else { "4000" }
$baseUrl = "http://localhost:$apiPort/api/v1"

Write-Host "Health:" -ForegroundColor Cyan
$health = Invoke-RestMethod "$baseUrl/health"
$health | ConvertTo-Json -Depth 6
if ($health.odooConnected -ne $false) {
    throw "La API no reportó correctamente la arquitectura autónoma."
}

Write-Host "`nBootstrap:" -ForegroundColor Cyan
$data = Invoke-RestMethod "$baseUrl/bootstrap"
Write-Host "Categorías: $($data.categories.Count)"
Write-Host "Agencias:   $($data.agencies.Count)"
Write-Host "Servicios:  $($data.services.Count)"
Write-Host "Fuente:     $($data.meta.source)"

Write-Host "`nMódulos:" -ForegroundColor Cyan
$modules = Invoke-RestMethod "$baseUrl/modules"
$modules.modules | Format-Table code, tables
