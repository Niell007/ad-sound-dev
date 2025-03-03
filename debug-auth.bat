@echo off
echo 🔍 Starting authentication debugging...

echo 🧹 Cleaning up environment...
taskkill /F /IM node.exe 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Node processes terminated successfully.
) else (
    echo ℹ️ No Node processes were running.
)

echo 🗑️ Clearing Next.js cache...
if exist .next (
    rmdir /S /Q .next
    echo ✅ Next.js cache cleared successfully.
) else (
    echo ℹ️ No Next.js cache found.
)

echo 🔄 Checking Supabase configuration...
node fix-auth.js

echo 🚀 Starting development server with authentication debugging enabled...
echo 🌐 Access your application at http://localhost:3000
echo ⚠️ Press Ctrl+C to stop the server

set NODE_ENV=development
set NEXT_TELEMETRY_DISABLED=1
set PORT=3000
set NEXT_PUBLIC_PORT=3000
set NEXT_PUBLIC_DISABLE_CACHE=true
set DISABLE_CACHE=true
set DEBUG=auth:*

call npx next dev -p 3000
