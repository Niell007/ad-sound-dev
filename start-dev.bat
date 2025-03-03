@echo off
echo Cleaning up environment before starting development server...

echo Killing any running Node processes...
taskkill /F /IM node.exe 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Node processes terminated successfully.
) else (
    echo No Node processes were running.
)

echo Clearing Next.js cache...
if exist .next (
    rmdir /S /Q .next
    echo Next.js cache cleared successfully.
) else (
    echo No Next.js cache found.
)

echo Clearing npm cache...
call npm cache clean --force
echo npm cache cleared successfully.

echo Setting environment variables...
set NODE_ENV=development
set NEXT_TELEMETRY_DISABLED=1
set PORT=3000
set NEXT_PUBLIC_PORT=3000
set NEXT_PUBLIC_DISABLE_CACHE=true
set DISABLE_CACHE=true

echo Starting development server on port 3000...
echo Access your application at http://localhost:3000
echo Press Ctrl+C to stop the server

call npx next dev -p 3000
