$ErrorActionPreference = "Stop"
$ProjectRoot = $env:SEO_PROJECT_ROOT
$InstallerRoot = $env:SEO_INSTALLER_ROOT
$LogPath = $env:SEO_LOG_PATH
if ([string]::IsNullOrWhiteSpace($ProjectRoot)) { throw "SEO_PROJECT_ROOT vacio" }
if ([string]::IsNullOrWhiteSpace($InstallerRoot)) { throw "SEO_INSTALLER_ROOT vacio" }
if ([string]::IsNullOrWhiteSpace($LogPath)) { $LogPath = Join-Path ([Environment]::GetFolderPath('Desktop')) 'seo_local_v5_26_0_dashboard.log' }
function Log($t){ Add-Content -Path $LogPath -Value $t -Encoding UTF8 }
function WriteUtf8NoBom($path, $content){ $enc = New-Object System.Text.UTF8Encoding($false); [System.IO.File]::WriteAllText($path, $content, $enc) }

$appPath = Join-Path $ProjectRoot 'src\App.tsx'
$headerPath = Join-Path $ProjectRoot 'src\components\Header.tsx'
$serverPath = Join-Path $ProjectRoot 'backend\src\server.js'

if (!(Test-Path $appPath)) { throw "No existe $appPath" }
if (!(Test-Path $headerPath)) { throw "No existe $headerPath" }
if (!(Test-Path $serverPath)) { throw "No existe $serverPath" }

$app = Get-Content -Raw -Path $appPath -Encoding UTF8
if ($app -notmatch "DashboardPage") {
  $app = $app -replace "import Header, \{ AppPage \} from './components/Header';", "import Header, { AppPage } from './components/Header';`r`nimport DashboardPage from './components/DashboardPage';"
}
if ($app -notmatch "#/dashboard") {
  $app = $app -replace "const getPageFromHash = \(\): AppPage => \{", "const getPageFromHash = (): AppPage => {`r`n    if (window.location.hash.startsWith('#/dashboard')) return 'dashboard';"
}
if ($app -notmatch "currentPage === 'dashboard'") {
  $marker = "<main className=\"flex-1\">"
  $replacement = "<main className=\"flex-1\">`r`n        {currentPage === 'dashboard' && (`r`n          <DashboardPage />`r`n        )}"
  $app = $app.Replace($marker, $replacement)
  $app = $app -replace "\{currentPage === 'home' && \(", "{currentPage === 'home' && ("
}
if ($app -notmatch "Dashboard interno") {
  $app = $app -replace "document.title = currentPage === 'agencyProfile'", "document.title = currentPage === 'dashboard'`r`n      ? 'Dashboard interno | SEOLOCAL'`r`n      : currentPage === 'agencyProfile'"
}
WriteUtf8NoBom $appPath $app
Log "App.tsx parcheado"

$header = Get-Content -Raw -Path $headerPath -Encoding UTF8
if ($header -notmatch "'dashboard'") {
  $header = $header -replace "\| 'serviceDetail';", "| 'serviceDetail' | 'dashboard';"
}
if ($header -notmatch "window.location.hash = '/dashboard'") {
  $insert = @'
            <button
              type="button"
              onClick={() => { window.location.hash = '/dashboard'; }}
              className={navClass(currentPage === 'dashboard')}
              aria-current={currentPage === 'dashboard' ? 'page' : undefined}
            >
              Dashboard
            </button>
'@
  $header = $header -replace "\s*<button\s+type=\"button\"\s+onClick=\{\(\) => onNavigateHome\('offers'\)\}", "`r`n$insert`r`n            <button`r`n              type=\"button\"`r`n              onClick={() => onNavigateHome('offers')}"
}
if ($header -notmatch "Dashboard interno") {
  $mobile = @'
          <button
            type="button"
            onClick={() => {
              window.location.hash = '/dashboard';
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold text-[#333] hover:bg-gray-50 hover:text-[#D32323]"
          >
            Dashboard interno
          </button>
'@
  $header = $header -replace "\s*<button\s+type=\"button\"\s+onClick=\{\(\) => \{\s*onNavigateHome\('offers'\);", "`r`n$mobile`r`n          <button`r`n            type=\"button\"`r`n            onClick={() => {`r`n              onNavigateHome('offers');"
}
WriteUtf8NoBom $headerPath $header
Log "Header.tsx parcheado"

$server = Get-Content -Raw -Path $serverPath -Encoding UTF8
if ($server -notmatch "import crypto from 'node:crypto';") {
  $server = $server -replace "import express from 'express';", "import crypto from 'node:crypto';`r`nimport express from 'express';"
}
if ($server -notmatch "DASHBOARD_MANAGEMENT_API_V5_26_0_MARKER") {
  $routes = Get-Content -Raw -Path (Join-Path $InstallerRoot 'tools\admin_routes_v5260.txt') -Encoding UTF8
  $server = $server -replace "app.use\(\(_request, response\) => \{", ($routes + "`r`n`r`napp.use((_request, response) => {")
}
WriteUtf8NoBom $serverPath $server
Log "server.js parcheado"
