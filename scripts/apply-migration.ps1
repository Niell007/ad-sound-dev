$env:PGPASSWORD = "rBk8sqc0aT7y38A0"
$dbHost = "db.voejpsvzfmbnlvutkgsb.supabase.co"
$port = "5432"
$database = "postgres"
$user = "postgres"
$sqlFile = "supabase/migrations/20240301_reviews.sql"

Write-Host "Applying migration from $sqlFile to $database on $dbHost..."

# Check if psql is installed
try {
    $psqlVersion = & psql --version
    Write-Host "Found psql: $psqlVersion"
} catch {
    Write-Host "psql is not installed or not in the PATH. Please install PostgreSQL client tools."
    exit 1
}

# Apply the migration
try {
    & psql -h $dbHost -p $port -d $database -U $user -f $sqlFile
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Migration applied successfully!"
    } else {
        Write-Host "Failed to apply migration. Exit code: $LASTEXITCODE"
    }
} catch {
    Write-Host "Error applying migration: $_"
    exit 1
} 