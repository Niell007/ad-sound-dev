-- Master script to set up the entire database

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create tables
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

-- 3. Add foreign key relationships
-- Add relationship between bookings and clients
ALTER TABLE bookings
ADD CONSTRAINT bookings_client_id_fkey
FOREIGN KEY (client_id) REFERENCES clients(id)
ON DELETE CASCADE;

-- Add relationship between bookings and services
ALTER TABLE bookings
ADD CONSTRAINT bookings_service_id_fkey
FOREIGN KEY (service_id) REFERENCES services(id)
ON DELETE CASCADE;

-- Add relationship between payments and bookings
ALTER TABLE payments
ADD CONSTRAINT payments_booking_id_fkey
FOREIGN KEY (booking_id) REFERENCES bookings(id)
ON DELETE CASCADE;

-- Add relationship between messages and bookings
ALTER TABLE messages
ADD CONSTRAINT messages_booking_id_fkey
FOREIGN KEY (booking_id) REFERENCES bookings(id)
ON DELETE CASCADE;

-- Add relationship between messages and users (sender)
ALTER TABLE messages
ADD CONSTRAINT messages_sender_id_fkey
FOREIGN KEY (sender_id) REFERENCES auth.users(id)
ON DELETE CASCADE;

-- 4. Set up user roles management
-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);

-- Set up RLS (Row Level Security)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to read their own role
CREATE POLICY "Users can view own role"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Only admins can create/update/delete roles
CREATE POLICY "Admins can manage all roles"
  ON public.user_roles
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to set default role for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically assign role to new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 5. Create sample data (optional)
-- Insert a sample admin user role (you'll need to replace with an actual user ID)
-- INSERT INTO public.user_roles (user_id, role) VALUES ('your-user-id-here', 'admin');

-- Insert sample services
INSERT INTO public.services (name, description, duration, price, price_per_hour, category, status)
VALUES 
  ('Recording Session', 'Professional recording session with engineer', '2 hours', 1030.00, 515.00, 'recording', 'active'),
  ('Mixing & Mastering', 'Professional mixing and mastering of tracks', '3 hours', 1720.00, 573.33, 'post-production', 'active'),
  ('Podcast Recording', 'Professional podcast recording with engineer', '2 hours', 860.00, 430.00, 'recording', 'active'),
  ('Voice Over', 'Professional voice over recording with engineer', '1 hour', 515.00, 515.00, 'recording', 'active'),
  ('Live Sound', 'Live sound engineering for events', '4 hours', 3440.00, 860.00, 'live', 'active')
ON CONFLICT (id) DO NOTHING; 