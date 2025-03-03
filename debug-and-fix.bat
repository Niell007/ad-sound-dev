@echo off
echo 🔍 Starting comprehensive debugging for AD-Sound...

echo 🔪 Killing any running Node processes...
taskkill /F /IM node.exe 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Node processes terminated successfully.
) else (
    echo ℹ️ No Node processes were running.
)

echo 🔍 Checking for .env file...
if exist .env (
    echo ✅ .env file exists.
) else (
    echo ❌ .env file not found. Creating from example...
    if exist .env.example (
        copy .env.example .env
        echo ✅ Created .env file from example. Please update with your actual credentials.
    ) else (
        echo ❌ .env.example file not found. Creating minimal .env file...
        echo # Supabase Configuration > .env
        echo NEXT_PUBLIC_SUPABASE_URL= >> .env
        echo NEXT_PUBLIC_SUPABASE_ANON_KEY= >> .env
        echo SUPABASE_SERVICE_ROLE_KEY= >> .env
        echo. >> .env
        echo # Next.js Configuration >> .env
        echo NEXT_PUBLIC_SITE_URL=http://localhost:3000 >> .env
        echo ✅ Created minimal .env file. Please update with your actual credentials.
    )
)

echo 🗑️ Clearing Next.js cache...
if exist .next (
    rmdir /S /Q .next
    echo ✅ Next.js cache cleared successfully.
) else (
    echo ℹ️ No Next.js cache found.
)

echo 🗑️ Clearing npm cache...
call npm cache clean --force
echo ✅ npm cache cleared successfully.

echo 📦 Checking for missing dependencies...
call npm install
echo ✅ Dependencies updated successfully.

echo 🔄 Verifying Supabase configuration...
if exist scripts\verify-supabase.js (
    node scripts\verify-supabase.js
    if %ERRORLEVEL% NEQ 0 (
        echo ⚠️ Supabase verification failed. Please check your .env file and update the Supabase credentials.
    )
) else (
    echo ℹ️ Supabase verification script not found. Skipping verification.
)

echo 🚀 Starting development server on port 3000...
echo 🌐 Access your application at http://localhost:3000
echo ⚠️ Press Ctrl+C to stop the server

set NODE_ENV=development
set NEXT_TELEMETRY_DISABLED=1
set PORT=3000
set NEXT_PUBLIC_PORT=3000
set NEXT_PUBLIC_DISABLE_CACHE=true
set DISABLE_CACHE=true

call npx next dev -p 3000
