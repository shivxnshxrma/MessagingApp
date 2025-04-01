@echo off
:start
echo ========================================
echo Starting messaging app backend server...
echo ========================================
echo.
echo If server doesn't start, check for error messages below.
echo Press Ctrl+C to stop the server.
echo.
cd /d %~dp0
node server.js

echo.
echo Server stopped or crashed. Press any key to restart or Ctrl+C to exit...
pause >nul
cls
echo Restarting server...
goto :start 