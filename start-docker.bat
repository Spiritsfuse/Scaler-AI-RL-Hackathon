@echo off
REM Docker Start Script for Slack Clone
REM This script helps you quickly start the Docker containers

echo ========================================
echo   Slack Clone - Docker Startup
echo ========================================
echo.

REM Check if .env exists
if not exist .env (
    echo [WARNING] .env file not found!
    echo Please create .env file from .env.example
    echo.
    echo Run: copy .env.example .env
    echo Then edit .env with your API keys
    echo.
    pause
    exit /b 1
)

echo [1/3] Checking Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not installed or not running!
    echo Please install Docker Desktop and start it.
    pause
    exit /b 1
)
echo     Docker is available!

echo.
echo [2/3] Building Docker images...
echo     This may take a few minutes on first run...
docker-compose build

if errorlevel 1 (
    echo [ERROR] Docker build failed!
    pause
    exit /b 1
)

echo.
echo [3/3] Starting containers...
docker-compose up -d

if errorlevel 1 (
    echo [ERROR] Failed to start containers!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUCCESS! Your application is running
echo ========================================
echo.
echo   Frontend:  http://localhost:3000
echo   Backend:   http://localhost:5001
echo   MongoDB:   localhost:27017
echo.
echo Commands:
echo   - View logs:       docker-compose logs -f
echo   - Stop services:   docker-compose down
echo   - Restart:         docker-compose restart
echo.
echo Press any key to view logs (Ctrl+C to exit)...
pause >nul

docker-compose logs -f
