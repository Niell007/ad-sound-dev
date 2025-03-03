import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { Client } from 'pg'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY
const databaseUrl = process.env.DATABASE_URL

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials')
}

if (!databaseUrl) {
  throw new Error('Missing database URL. Please set the DATABASE_URL environment variable.')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  const client = new Client({
    connectionString: databaseUrl,
  })

  try {
    await client.connect()

    await client.query(`
      CREATE TABLE IF NOT EXISTS public.profiles (
          id UUID REFERENCES auth.users(id) PRIMARY KEY,
          full_name TEXT,
          avatar_url TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

      CREATE POLICY "Public profiles are viewable by everyone" 
      ON public.profiles FOR SELECT 
      USING (true);

      CREATE POLICY "Users can insert their own profile" 
      ON public.profiles FOR INSERT 
      WITH CHECK (auth.uid() = id);

      CREATE POLICY "Users can update their own profile" 
      ON public.profiles FOR UPDATE 
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);

      CREATE OR REPLACE FUNCTION handle_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER handle_profiles_updated_at
          BEFORE UPDATE ON public.profiles
          FOR EACH ROW
          EXECUTE FUNCTION handle_updated_at();

      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS TRIGGER AS $$
      BEGIN
          INSERT INTO public.profiles (id)
          VALUES (NEW.id);
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW
          EXECUTE FUNCTION public.handle_new_user();
    `)

    console.log('✅ Database setup completed successfully')
  } catch (error) {
    console.error('Error setting up database:', error)
  } finally {
    await client.end()
  }
}

setupDatabase() 