@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"
title Bab Al Prince - Launcher

echo ================================================
echo        BAB AL PRINCE - LOCAL WEBSITE
echo ================================================
echo.

REM Reuse an already running project server when possible.
if exist "server.pid" if exist "server.port" (
    set /p OLD_PID=<"server.pid"
    set /p OLD_PORT=<"server.port"
    powershell.exe -NoProfile -Command "if (Get-Process -Id !OLD_PID! -ErrorAction SilentlyContinue) { exit 0 } else { exit 1 }" >nul 2>nul
    if not errorlevel 1 (
        powershell.exe -NoProfile -Command "try { $c=New-Object Net.Sockets.TcpClient; $c.Connect('127.0.0.1',!OLD_PORT!); $c.Close(); exit 0 } catch { exit 1 }" >nul 2>nul
        if not errorlevel 1 (
            echo Server already running on port !OLD_PORT!.
            start "" "http://127.0.0.1:!OLD_PORT!/index.html"
            exit /b 0
        )
    )
    del /q "server.pid" "server.port" >nul 2>nul
)

REM Find a free local port.
set "PORT="
for /L %%P in (8765,1,8795) do (
    powershell.exe -NoProfile -Command "$c=New-Object Net.Sockets.TcpClient; try { $c.Connect('127.0.0.1',%%P); $c.Close(); exit 1 } catch { exit 0 }" >nul 2>nul
    if not errorlevel 1 (
        set "PORT=%%P"
        goto :PORT_FOUND
    )
)

:PORT_FOUND
if not defined PORT (
    echo ERROR: Could not find a free port from 8765 to 8795.
    echo Close any local servers and run this file again.
    pause
    exit /b 1
)

echo Starting built-in Windows server on port %PORT%...
start "Bab Al Prince Local Server" /min powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1" -Port %PORT%

REM Wait until the server actually accepts connections before opening Chrome/Edge.
set "READY="
for /L %%I in (1,1,20) do (
    powershell.exe -NoProfile -Command "try { $c=New-Object Net.Sockets.TcpClient; $c.Connect('127.0.0.1',%PORT%); $c.Close(); exit 0 } catch { exit 1 }" >nul 2>nul
    if not errorlevel 1 (
        set "READY=1"
        goto :SERVER_READY
    )
    timeout /t 1 /nobreak >nul
)

:SERVER_READY
if not defined READY (
    echo.
    echo ERROR: The local server did not start.
    echo Try right-clicking START_SITE.bat and choosing "Run as administrator" once.
    echo If Windows blocked PowerShell, open README_AR.txt for the fallback steps.
    echo.
    pause
    exit /b 1
)

echo Server is ready.
echo Website: http://127.0.0.1:%PORT%/index.html
echo Admin:   http://127.0.0.1:%PORT%/admin.html
echo.
start "" "http://127.0.0.1:%PORT%/index.html"
exit /b 0
