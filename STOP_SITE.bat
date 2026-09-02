@echo off
setlocal
cd /d "%~dp0"
if not exist "server.pid" (
  echo No Bab Al Prince local server is currently recorded as running.
  pause
  exit /b 0
)
set /p PID_TO_STOP=<"server.pid"
powershell.exe -NoProfile -Command "Stop-Process -Id %PID_TO_STOP% -Force -ErrorAction SilentlyContinue" >nul 2>nul
del /q "server.pid" "server.port" >nul 2>nul
echo Bab Al Prince local server stopped.
timeout /t 2 /nobreak >nul
