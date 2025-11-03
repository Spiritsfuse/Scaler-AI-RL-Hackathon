@echo off
REM Docker Configuration Verification Script

echo ========================================
echo   Docker Configuration Verification
echo ========================================
echo.

REM Check if .env exists
echo [1/5] Checking .env file...
if exist .env (
    echo     ✓ .env file found
) else (
    echo     ✗ ERROR: .env file not found!
    echo     Please ensure .env exists in the root directory
    exit /b 1
)

REM Check if Docker is running
echo.
echo [2/5] Checking Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo     ✗ ERROR: Docker is not running!
    echo     Please start Docker Desktop
    exit /b 1
) else (
    echo     ✓ Docker is available
)

REM Verify Dockerfile existence
echo.
echo [3/5] Checking Dockerfiles...
if exist backend\Dockerfile (
    echo     ✓ Backend Dockerfile found
) else (
    echo     ✗ ERROR: backend\Dockerfile not found!
    exit /b 1
)

if exist frontend\Dockerfile (
    echo     ✓ Frontend Dockerfile found
) else (
    echo     ✗ ERROR: frontend\Dockerfile not found!
    exit /b 1
)

REM Check docker-compose.yml
echo.
echo [4/5] Checking docker-compose.yml...
if exist docker-compose.yml (
    echo     ✓ docker-compose.yml found
) else (
    echo     ✗ ERROR: docker-compose.yml not found!
    exit /b 1
)

REM Parse .env for required variables
echo.
echo [5/5] Checking environment variables...
findstr /C:"CLERK_PUBLISHABLE_KEY" .env >nul
if errorlevel 1 (
    echo     ✗ WARNING: CLERK_PUBLISHABLE_KEY not found in .env
) else (
    echo     ✓ CLERK_PUBLISHABLE_KEY configured
)

findstr /C:"STREAM_API_KEY" .env >nul
if errorlevel 1 (
    echo     ✗ WARNING: STREAM_API_KEY not found in .env
) else (
    echo     ✓ STREAM_API_KEY configured
)

findstr /C:"port=5001" .env >nul
if errorlevel 1 (
    echo     ✗ WARNING: Backend port not set to 5001
) else (
    echo     ✓ Backend port set to 5001
)

echo.
echo ========================================
echo   Configuration Status: READY
echo ========================================
echo.
echo Port Configuration:
echo   - Frontend: http://localhost:3000
echo   - Backend:  http://localhost:5001
echo   - MongoDB:  localhost:27017
echo.
echo To start your application:
echo   1. Run: start-docker.bat
echo   2. Or:  docker-compose up --build
echo.
pause
