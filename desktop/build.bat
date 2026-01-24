@echo off
echo ============================================
echo Building Bill Generate Desktop Application
echo ============================================
echo.

REM Step 1: Build the React Frontend
echo [1/3] Building React Frontend...
cd ..\bill-generate-frontend
call npm install
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Frontend build failed!
    pause
    exit /b 1
)
echo Frontend built successfully!
echo.

REM Step 2: Build the Python Backend
echo [2/3] Building Python Backend...
cd ..\bill-generate-backend
pip install pyinstaller
pyinstaller --onefile --noconsole app.py
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Backend build failed!
    pause
    exit /b 1
)
echo Backend built successfully!
echo.

REM Step 3: Install Electron dependencies and build
echo [3/3] Building Electron App...
cd ..\desktop
call npm install
call npm run build:win
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Electron build failed!
    pause
    exit /b 1
)

echo.
echo ============================================
echo Build Complete!
echo The installer is in: desktop\dist
echo ============================================
pause
