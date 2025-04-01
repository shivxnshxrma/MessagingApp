# PowerShell script to start the messaging server
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting messaging app backend server..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "If server doesn't start, check for error messages below." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server." -ForegroundColor Yellow
Write-Host ""

# Change to the script's directory
cd $PSScriptRoot

# Start the server
node server.js 