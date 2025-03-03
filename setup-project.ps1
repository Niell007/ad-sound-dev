# Setup script for AD-Sound project
Write-Host "🎵 Setting up AD-Sound project..." -ForegroundColor Cyan

# Check if .env file exists
if (-not (Test-Path .env)) {
    Write-Host "❌ .env file not found" -ForegroundColor Red
    Write-Host "ℹ️ Please create .env file using .env.example as template" -ForegroundColor Yellow
    exit 1
}

# Check Node.js version
$nodeVersion = node -v
Write-Host "📦 Node.js version: $nodeVersion" -ForegroundColor Green

# Install dependencies
Write-Host "📥 Installing dependencies..." -ForegroundColor Cyan
npm install

# Verify Supabase connection
Write-Host "🔌 Verifying Supabase connection..." -ForegroundColor Cyan
npm run verify-db

# Run database setup
Write-Host "🗄️ Setting up database..." -ForegroundColor Cyan
npm run setup-db

# Apply migrations
Write-Host "🔄 Applying database migrations..." -ForegroundColor Cyan
npm run apply-migrations

# Build the project
Write-Host "🏗️ Building project..." -ForegroundColor Cyan
npm run build

Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host "
Next steps:
1. Start the development server: npm run dev
2. Visit http://localhost:3000
3. Sign up as a new user
4. Use setup-admin-user.sql to grant admin privileges if needed

For more information, check the documentation in /docs folder.
" -ForegroundColor Cyan 