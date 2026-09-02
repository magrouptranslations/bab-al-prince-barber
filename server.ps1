param(
    [int]$Port = 8765,
    [string]$Root = $PSScriptRoot
)

$ErrorActionPreference = 'Stop'
$Root = [System.IO.Path]::GetFullPath($Root)
if (-not $Root.EndsWith([System.IO.Path]::DirectorySeparatorChar)) {
    $Root += [System.IO.Path]::DirectorySeparatorChar
}

$pidFile = Join-Path $Root 'server.pid'
$portFile = Join-Path $Root 'server.port'
Set-Content -LiteralPath $pidFile -Value $PID -Encoding ASCII
Set-Content -LiteralPath $portFile -Value $Port -Encoding ASCII

function Write-Response {
    param(
        [System.Net.Sockets.NetworkStream]$Stream,
        [int]$StatusCode,
        [string]$StatusText,
        [byte[]]$Body,
        [string]$ContentType = 'text/plain; charset=utf-8'
    )
    $header = "HTTP/1.1 $StatusCode $StatusText`r`nContent-Type: $ContentType`r`nContent-Length: $($Body.Length)`r`nCache-Control: no-store`r`nConnection: close`r`n`r`n"
    $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
    $Stream.Write($headerBytes, 0, $headerBytes.Length)
    if ($Body.Length -gt 0) {
        $Stream.Write($Body, 0, $Body.Length)
    }
    $Stream.Flush()
}

function Get-MimeType([string]$Path) {
    switch ([System.IO.Path]::GetExtension($Path).ToLowerInvariant()) {
        '.html' { 'text/html; charset=utf-8' }
        '.css'  { 'text/css; charset=utf-8' }
        '.js'   { 'application/javascript; charset=utf-8' }
        '.json' { 'application/json; charset=utf-8' }
        '.svg'  { 'image/svg+xml' }
        '.png'  { 'image/png' }
        '.jpg'  { 'image/jpeg' }
        '.jpeg' { 'image/jpeg' }
        '.webp' { 'image/webp' }
        '.ico'  { 'image/x-icon' }
        '.txt'  { 'text/plain; charset=utf-8' }
        default { 'application/octet-stream' }
    }
}

$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Port)

try {
    $listener.Start()
    while ($true) {
        $client = $listener.AcceptTcpClient()
        try {
            $stream = $client.GetStream()
            $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::ASCII, $false, 4096, $true)
            $requestLine = $reader.ReadLine()
            if ([string]::IsNullOrWhiteSpace($requestLine)) { continue }

            # Consume request headers.
            while ($true) {
                $line = $reader.ReadLine()
                if ([string]::IsNullOrEmpty($line)) { break }
            }

            $parts = $requestLine.Split(' ')
            if ($parts.Length -lt 2 -or $parts[0] -notin @('GET','HEAD')) {
                $body = [System.Text.Encoding]::UTF8.GetBytes('Unsupported request')
                Write-Response -Stream $stream -StatusCode 405 -StatusText 'Method Not Allowed' -Body $body
                continue
            }

            $requestPath = $parts[1].Split('?')[0]
            $requestPath = [System.Uri]::UnescapeDataString($requestPath)
            if ($requestPath -eq '/') { $requestPath = '/index.html' }

            $relative = $requestPath.TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar)
            $fullPath = [System.IO.Path]::GetFullPath((Join-Path $Root $relative))

            if (-not $fullPath.StartsWith($Root, [System.StringComparison]::OrdinalIgnoreCase)) {
                $body = [System.Text.Encoding]::UTF8.GetBytes('Forbidden')
                Write-Response -Stream $stream -StatusCode 403 -StatusText 'Forbidden' -Body $body
                continue
            }

            if ([System.IO.Directory]::Exists($fullPath)) {
                $fullPath = Join-Path $fullPath 'index.html'
            }

            if ([System.IO.File]::Exists($fullPath)) {
                $body = if ($parts[0] -eq 'HEAD') { [byte[]]::new(0) } else { [System.IO.File]::ReadAllBytes($fullPath) }
                Write-Response -Stream $stream -StatusCode 200 -StatusText 'OK' -Body $body -ContentType (Get-MimeType $fullPath)
            } else {
                $body = [System.Text.Encoding]::UTF8.GetBytes('404 - File not found')
                Write-Response -Stream $stream -StatusCode 404 -StatusText 'Not Found' -Body $body
            }
        }
        catch {
            try {
                if ($stream) {
                    $body = [System.Text.Encoding]::UTF8.GetBytes('500 - Local server error')
                    Write-Response -Stream $stream -StatusCode 500 -StatusText 'Internal Server Error' -Body $body
                }
            } catch {}
        }
        finally {
            if ($reader) { $reader.Dispose() }
            if ($client) { $client.Close() }
        }
    }
}
finally {
    try { $listener.Stop() } catch {}
    Remove-Item -LiteralPath $pidFile -Force -ErrorAction SilentlyContinue
    Remove-Item -LiteralPath $portFile -Force -ErrorAction SilentlyContinue
}
