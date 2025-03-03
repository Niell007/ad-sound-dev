# 1. Kill any running Node processes (if needed)
taskkill /F /IM node.exe

# 2. Clear Next.js cache
Remove-Item -Recurse -Force .next

# 3. Clear npm cache
npm cache clean --force

# 4. Start development server
$env:NODE_ENV='development'
$env:NEXT_TELEMETRY_DISABLED=1
npm run dev