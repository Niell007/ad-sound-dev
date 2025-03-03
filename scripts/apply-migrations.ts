import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials')
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function applyMigrations() {
  try {
    // Read all migration files
    const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations')
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort()

    // Apply each migration
    for (const file of migrationFiles) {
      console.log(`Applying migration ${file}...`)
      const migrationPath = path.join(migrationsDir, file)
      const migration = fs.readFileSync(migrationPath, 'utf8')

      const { error } = await supabase.rpc('exec_sql', { sql: migration })

      if (error) {
        console.error(`Error applying migration ${file}:`, error)
        return
      }

      console.log(`✅ Migration ${file} applied successfully!`)
    }

    console.log('✅ All migrations applied successfully!')
  } catch (error) {
    console.error('Migration failed:', error)
  }
}

applyMigrations() 