-- Add role column to profiles table
ALTER TABLE IF EXISTS profiles 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';

-- Create an enum type for roles if you want stricter validation
CREATE TYPE IF NOT EXISTS app_role AS ENUM ('user', 'staff', 'manager', 'admin');

-- Comment on the role column
COMMENT ON COLUMN profiles.role IS 'The role of the user which determines their permissions';

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles"
ON profiles FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Managers can view staff and user profiles
CREATE POLICY "Managers can view staff and user profiles"
ON profiles FOR SELECT
USING (
  (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'manager'
    )
  ) AND (
    role IN ('user', 'staff') OR id = auth.uid()
  )
);

-- Managers can update staff profiles
CREATE POLICY "Managers can update staff profiles"
ON profiles FOR UPDATE
USING (
  (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'manager'
    )
  ) AND (
    role = 'staff' OR id = auth.uid()
  )
); 