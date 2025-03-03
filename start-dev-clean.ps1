#!/usr/bin/env pwsh
# start-dev-clean.ps1
# Script to properly start the development server with clean environment

Write-Host "🧹 Cleaning up environment before starting development server..." -ForegroundColor Cyan

# 1. Kill any running Node processes
Write-Host "🔪 Killing any running Node processes..." -ForegroundColor Yellow
taskkill /F /IM node.exe 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Node processes terminated successfully." -ForegroundColor Green
} 
else {
    Write-Host "ℹ️ No Node processes were running." -ForegroundColor Blue
}

# 2. Clear Next.js cache
Write-Host "🗑️ Clearing Next.js cache..." -ForegroundColor Yellow
if (Test-Path -Path ".next") {
    Remove-Item -Recurse -Force .next
    Write-Host "✅ Next.js cache cleared successfully." -ForegroundColor Green
} 
else {
    Write-Host "ℹ️ No Next.js cache found." -ForegroundColor Blue
}

# 3. Clear npm cache
Write-Host "🗑️ Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force
Write-Host "✅ npm cache cleared successfully." -ForegroundColor Green

# 4. Set environment variables for development
$env:NODE_ENV = 'development'
$env:NEXT_TELEMETRY_DISABLED = 1
$env:PORT = 3000  # Explicitly set port to 3000
$env:NEXT_PUBLIC_PORT = 3000

# 5. Disable caching for development
$env:NEXT_PUBLIC_DISABLE_CACHE = 'true'
$env:DISABLE_CACHE = 'true'

# 6. Start development server with explicit port
Write-Host "🚀 Starting development server on port 3000..." -ForegroundColor Cyan
Write-Host "🌐 Access your application at http://localhost:3000" -ForegroundColor Green
Write-Host "⚠️ Press Ctrl+C to stop the server" -ForegroundColor Yellow

# Start the development server with the port explicitly set to 3000
npx next dev -p 3000
