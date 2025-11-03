@echo off
REM Docker Stop Script for Slack Clone

echo ========================================
echo   Slack Clone - Docker Shutdown
echo ========================================
echo.

echo Stopping all containers...
docker-compose down

if errorlevel 1 (
    echo [ERROR] Failed to stop containers!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   All containers stopped successfully
echo ========================================
echo.
echo To start again, run: start-docker.bat
echo.
pause
