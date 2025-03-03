-- Safe master script to set up or update the database
-- This script can be run multiple times without errors

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create tables if they don't exist
-- Create clients table
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  type TEXT NOT NULL DEFAULT 'regular' CHECK (type IN ('regular', 'premium', 'one-time')),
  notes TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create services table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  duration TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  price_per_hour DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive'))
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  client_id UUID NOT NULL,
  service_id UUID NOT NULL,
  date DATE NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid', 'refunded')),
  amount DECIMAL(10, 2) NOT NULL,
  deposit_amount DECIMAL(10, 2) NOT NULL,
  deposit_paid BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT,
  equipment TEXT,
  location TEXT
);

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  booking_id UUID NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'refunded')),
  payment_method TEXT NOT NULL,
  transaction_id TEXT,
  notes TEXT
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  booking_id UUID NOT NULL,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'staff', 'admin'))
);

-- 3. Add foreign key relationships if they don't exist
-- Function to check if a constraint exists
CREATE OR REPLACE FUNCTION constraint_exists(constraint_name text) RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = constraint_name
  );
END;
$$ LANGUAGE plpgsql;

-- Add relationship between bookings and clients
DO $$ 
BEGIN
  IF NOT constraint_exists('bookings_client_id_fkey') THEN
    ALTER TABLE bookings
    ADD CONSTRAINT bookings_client_id_fkey
    FOREIGN KEY (client_id) REFERENCES clients(id)
    ON DELETE CASCADE;
  END IF;
END $$;

-- Add relationship between bookings and services
DO $$ 
BEGIN
  IF NOT constraint_exists('bookings_service_id_fkey') THEN
    ALTER TABLE bookings
    ADD CONSTRAINT bookings_service_id_fkey
    FOREIGN KEY (service_id) REFERENCES services(id)
    ON DELETE CASCADE;
  END IF;
END $$;

-- Add relationship between payments and bookings
DO $$ 
BEGIN
  IF NOT constraint_exists('payments_booking_id_fkey') THEN
    ALTER TABLE payments
    ADD CONSTRAINT payments_booking_id_fkey
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
    ON DELETE CASCADE;
  END IF;
END $$;

-- Add relationship between messages and bookings
DO $$ 
BEGIN
  IF NOT constraint_exists('messages_booking_id_fkey') THEN
    ALTER TABLE messages
    ADD CONSTRAINT messages_booking_id_fkey
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
    ON DELETE CASCADE;
  END IF;
END $$;

-- Add relationship between messages and users (sender)
DO $$ 
BEGIN
  IF NOT constraint_exists('messages_sender_id_fkey') THEN
    ALTER TABLE messages
    ADD CONSTRAINT messages_sender_id_fkey
    FOREIGN KEY (sender_id) REFERENCES auth.users(id)
    ON DELETE CASCADE;
  END IF;
END $$;

-- 4. Set up user roles management
-- Create index for faster lookups if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_roles_user_id'
  ) THEN
    CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
  END IF;
END $$;

-- Set up RLS (Row Level Security)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Function to check if a policy exists
CREATE OR REPLACE FUNCTION policy_exists(policy_name text, table_name text) RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = policy_name AND tablename = table_name
  );
END;
$$ LANGUAGE plpgsql;

-- Create policies if they don't exist
DO $$ 
BEGIN
  IF NOT policy_exists('Users can view own role', 'user_roles') THEN
    CREATE POLICY "Users can view own role"
      ON public.user_roles
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT policy_exists('Admins can manage all roles', 'user_roles') THEN
    CREATE POLICY "Admins can manage all roles"
      ON public.user_roles
      USING (
        EXISTS (
          SELECT 1 FROM public.user_roles
          WHERE user_id = auth.uid() AND role = 'admin'
        )
      );
  END IF;
END $$;

-- Create function to set default role for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically assign role to new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 5. Insert sample data if it doesn't exist
-- Insert sample services
INSERT INTO public.services (name, description, duration, price, price_per_hour, category, status)
VALUES 
  ('Recording Session', 'Professional recording session with engineer', '2 hours', 1030.00, 515.00, 'recording', 'active'),
  ('Mixing & Mastering', 'Professional mixing and mastering of tracks', '3 hours', 1720.00, 573.33, 'post-production', 'active'),
  ('Podcast Recording', 'Professional podcast recording with engineer', '2 hours', 860.00, 430.00, 'recording', 'active'),
  ('Voice Over', 'Professional voice over recording with engineer', '1 hour', 515.00, 515.00, 'recording', 'active'),
  ('Live Sound', 'Live sound engineering for events', '4 hours', 3440.00, 860.00, 'live', 'active')
ON CONFLICT (id) DO NOTHING;

-- 6. Add a unique constraint to user_roles to prevent duplicate user roles
DO $$ 
BEGIN
  IF NOT constraint_exists('user_roles_user_id_key') THEN
    ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_key UNIQUE (user_id);
  END IF;
END $$; 