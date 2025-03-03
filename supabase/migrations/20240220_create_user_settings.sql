-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phone VARCHAR(20),
  website VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- Add RLS policies
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own settings
CREATE POLICY "Users can read their own settings"
  ON user_settings
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy for users to update their own settings
CREATE POLICY "Users can update their own settings"
  ON user_settings
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy for users to insert their own settings
CREATE POLICY "Users can insert their own settings"
  ON user_settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to delete their own settings
CREATE POLICY "Users can delete their own settings"
  ON user_settings
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create a stored procedure to create the user_settings table if it doesn't exist
CREATE OR REPLACE FUNCTION create_user_settings_if_not_exists()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if the table exists
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'user_settings'
  ) THEN
    -- Create the table
    EXECUTE '
      CREATE TABLE public.user_settings (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        phone VARCHAR(20),
        website VARCHAR(255),
        role VARCHAR(50) DEFAULT ''user'',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE(''utc'', NOW()),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE(''utc'', NOW())
      );
      
      -- Create index on user_id for faster lookups
      CREATE INDEX idx_user_settings_user_id ON public.user_settings(user_id);
      
      -- Add RLS policies
      ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
      
      -- Policy for users to read their own settings
      CREATE POLICY "Users can read their own settings"
        ON public.user_settings
        FOR SELECT
        USING (auth.uid() = user_id);
      
      -- Policy for users to update their own settings
      CREATE POLICY "Users can update their own settings"
        ON public.user_settings
        FOR UPDATE
        USING (auth.uid() = user_id);
      
      -- Policy for users to insert their own settings
      CREATE POLICY "Users can insert their own settings"
        ON public.user_settings
        FOR INSERT
        WITH CHECK (auth.uid() = user_id);
      
      -- Policy for users to delete their own settings
      CREATE POLICY "Users can delete their own settings"
        ON public.user_settings
        FOR DELETE
        USING (auth.uid() = user_id);
    ';
  END IF;
END;
$$; 