function Read-DotEnv {
    param([Parameter(Mandatory = $true)][string]$Path)
    $values = @{}
    if (-not (Test-Path $Path)) { return $values }

    Get-Content $Path | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith('#') -and $line.Contains('=')) {
            $parts = $line.Split('=', 2)
            $values[$parts[0].Trim()] = $parts[1].Trim()
        }
    }
    return $values
}

function Set-DotEnvValue {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][string]$Name,
        [Parameter(Mandatory = $true)][string]$Value
    )

    $lines = @()
    if (Test-Path $Path) { $lines = @(Get-Content $Path) }
    $found = $false
    $updated = foreach ($line in $lines) {
        if ($line -match ('^\s*' + [regex]::Escape($Name) + '\s*=')) {
            $found = $true
            "$Name=$Value"
        } else {
            $line
        }
    }
    if (-not $found) { $updated += "$Name=$Value" }
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllLines($Path, [string[]]$updated, $utf8NoBom)
}

function Get-EnvValue {
    param(
        [hashtable]$Values,
        [string]$Name,
        [string]$Default
    )
    if ($Values.ContainsKey($Name) -and $Values[$Name]) { return $Values[$Name] }
    return $Default
}

function Test-PortAvailable {
    param([Parameter(Mandatory = $true)][int]$Port)
    $listener = $null
    try {
        $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $Port)
        $listener.Start()
        return $true
    } catch {
        return $false
    } finally {
        if ($null -ne $listener) {
            try { $listener.Stop() } catch { }
        }
    }
}

function Find-FreePort {
    param(
        [Parameter(Mandatory = $true)][int]$StartPort,
        [int]$EndPort = 65535
    )
    for ($port = $StartPort; $port -le $EndPort; $port++) {
        if (Test-PortAvailable -Port $port) { return $port }
    }
    throw "No se encontro un puerto libre entre $StartPort y $EndPort."
}

function Wait-HttpEndpoint {
    param(
        [Parameter(Mandatory = $true)][string[]]$Urls,
        [int]$TimeoutSeconds = 120,
        [int]$DelaySeconds = 2
    )

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    while ((Get-Date) -lt $deadline) {
        foreach ($url in $Urls) {
            try {
                $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 5
                if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 400) {
                    return $true
                }
            } catch { }
        }
        Start-Sleep -Seconds $DelaySeconds
    }
    return $false
}

function Get-DockerContainerNames {
    $previousPreference = $ErrorActionPreference
    try {
        $ErrorActionPreference = 'Continue'
        $names = @(& docker ps -a --format '{{.Names}}' 2>$null)
        return @($names | ForEach-Object { $_.ToString().Trim() } | Where-Object { $_ })
    } finally {
        $ErrorActionPreference = $previousPreference
    }
}

function Test-DockerContainerExists {
    param([Parameter(Mandatory = $true)][string]$Name)
    return (Get-DockerContainerNames) -contains $Name
}

function Remove-DockerContainerIfExists {
    param([Parameter(Mandatory = $true)][string]$Name)

    if (-not (Test-DockerContainerExists -Name $Name)) {
        Write-Host "Contenedor $Name no existe; se omite." -ForegroundColor DarkGray
        return
    }

    $previousPreference = $ErrorActionPreference
    try {
        $ErrorActionPreference = 'Continue'
        $output = @(& docker rm -f $Name 2>&1)
        $exitCode = $LASTEXITCODE
    } finally {
        $ErrorActionPreference = $previousPreference
    }

    if ($exitCode -ne 0) {
        throw "No fue posible eliminar el contenedor $Name. Detalle: $($output -join ' ')"
    }
    Write-Host "Contenedor $Name eliminado." -ForegroundColor DarkGray
}

function Get-DockerVolumeNames {
    $previousPreference = $ErrorActionPreference
    try {
        $ErrorActionPreference = 'Continue'
        $names = @(& docker volume ls --format '{{.Name}}' 2>$null)
        return @($names | ForEach-Object { $_.ToString().Trim() } | Where-Object { $_ })
    } finally {
        $ErrorActionPreference = $previousPreference
    }
}

function Test-DockerVolumeExists {
    param([Parameter(Mandatory = $true)][string]$Name)
    return (Get-DockerVolumeNames) -contains $Name
}

function Remove-DockerVolumeIfExists {
    param([Parameter(Mandatory = $true)][string]$Name)

    if (-not (Test-DockerVolumeExists -Name $Name)) {
        Write-Host "Volumen $Name no existe; se omite." -ForegroundColor DarkGray
        return
    }

    $previousPreference = $ErrorActionPreference
    try {
        $ErrorActionPreference = 'Continue'
        $output = @(& docker volume rm $Name 2>&1)
        $exitCode = $LASTEXITCODE
    } finally {
        $ErrorActionPreference = $previousPreference
    }

    if ($exitCode -ne 0) {
        throw "No fue posible eliminar el volumen $Name. Detalle: $($output -join ' ')"
    }
    Write-Host "Volumen $Name eliminado." -ForegroundColor DarkGray
}
