#!/usr/bin/env pwsh
# deploy-clean.ps1
# Script to properly deploy the application to any environment with clean setup

param (
    [string]$Environment = "development",
    [int]$Port = 3000
)

Write-Host "🚀 Deploying to $Environment environment on port $Port..." -ForegroundColor Cyan
Write-Host "🧹 Cleaning up environment before deployment..." -ForegroundColor Cyan

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

# 4. Set environment variables
$env:NODE_ENV = $Environment
$env:NEXT_TELEMETRY_DISABLED = 1
$env:PORT = $Port
$env:NEXT_PUBLIC_PORT = $Port

# 5. Disable caching if in development mode
if ($Environment -eq "development") {
    $env:NEXT_PUBLIC_DISABLE_CACHE = 'true'
    $env:DISABLE_CACHE = 'true'
    Write-Host "🛡️ Caching disabled for development." -ForegroundColor Yellow
}

# 6. Build the application
if ($Environment -ne "development") {
    Write-Host "🏗️ Building application..." -ForegroundColor Cyan
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Build failed. Exiting." -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Build completed successfully." -ForegroundColor Green
    
    # 7. Start the production server
    Write-Host "🚀 Starting $Environment server on port $Port..." -ForegroundColor Cyan
    Write-Host "🌐 Access your application at http://localhost:$Port" -ForegroundColor Green
    Write-Host "⚠️ Press Ctrl+C to stop the server" -ForegroundColor Yellow
    
    npx next start -p $Port
} 
else {
    # Start the development server
    Write-Host "🚀 Starting development server on port $Port..." -ForegroundColor Cyan
    Write-Host "🌐 Access your application at http://localhost:$Port" -ForegroundColor Green
    Write-Host "⚠️ Press Ctrl+C to stop the server" -ForegroundColor Yellow
    
    npx next dev -p $Port
}
