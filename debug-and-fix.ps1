#!/usr/bin/env pwsh
# debug-and-fix.ps1
# Comprehensive debugging and fixing script for AD-Sound development environment

Write-Host "🔍 Starting comprehensive debugging for AD-Sound..." -ForegroundColor Cyan

# 1. Kill any running Node processes
Write-Host "🔪 Killing any running Node processes..." -ForegroundColor Yellow
taskkill /F /IM node.exe 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Node processes terminated successfully." -ForegroundColor Green
} else {
    Write-Host "ℹ️ No Node processes were running." -ForegroundColor Blue
}

# 2. Check for .env file
Write-Host "🔍 Checking for .env file..." -ForegroundColor Yellow
if (Test-Path -Path ".env") {
    Write-Host "✅ .env file exists." -ForegroundColor Green
} else {
    Write-Host "❌ .env file not found. Creating from example..." -ForegroundColor Red
    if (Test-Path -Path ".env.example") {
        Copy-Item -Path ".env.example" -Destination ".env"
        Write-Host "✅ Created .env file from example. Please update with your actual credentials." -ForegroundColor Green
    } else {
        Write-Host "❌ .env.example file not found. Creating minimal .env file..." -ForegroundColor Red
        @"
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Next.js Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
"@ | Out-File -FilePath ".env"
        Write-Host "✅ Created minimal .env file. Please update with your actual credentials." -ForegroundColor Green
    }
}

# 3. Clear Next.js cache
Write-Host "🗑️ Clearing Next.js cache..." -ForegroundColor Yellow
if (Test-Path -Path ".next") {
    Remove-Item -Recurse -Force .next
    Write-Host "✅ Next.js cache cleared successfully." -ForegroundColor Green
} else {
    Write-Host "ℹ️ No Next.js cache found." -ForegroundColor Blue
}

# 4. Clear npm cache
Write-Host "🗑️ Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force
Write-Host "✅ npm cache cleared successfully." -ForegroundColor Green

# 5. Install/update dependencies
Write-Host "📦 Checking for missing dependencies..." -ForegroundColor Yellow
npm install
Write-Host "✅ Dependencies updated successfully." -ForegroundColor Green

# 6. Verify Supabase configuration
Write-Host "🔄 Verifying Supabase configuration..." -ForegroundColor Yellow
if (Test-Path -Path "scripts/verify-supabase.js") {
    node scripts/verify-supabase.js
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️ Supabase verification failed. Please check your .env file and update the Supabase credentials." -ForegroundColor Yellow
    }
} else {
    Write-Host "ℹ️ Supabase verification script not found. Skipping verification." -ForegroundColor Blue
}

# 7. Set environment variables for development
$env:NODE_ENV = 'development'
$env:NEXT_TELEMETRY_DISABLED = 1
$env:PORT = 3000
$env:NEXT_PUBLIC_PORT = 3000
$env:NEXT_PUBLIC_DISABLE_CACHE = 'true'
$env:DISABLE_CACHE = 'true'

# 8. Start development server with explicit port
Write-Host "🚀 Starting development server on port 3000..." -ForegroundColor Cyan
Write-Host "🌐 Access your application at http://localhost:3000" -ForegroundColor Green
Write-Host "⚠️ Press Ctrl+C to stop the server" -ForegroundColor Yellow

# Start the development server with the port explicitly set to 3000
npx next dev -p 3000
