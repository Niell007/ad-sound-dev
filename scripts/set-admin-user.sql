-- This script sets a user as an admin for testing purposes
-- Usage: Replace 'user-id-here' with the actual user ID you want to make an admin

-- Update the user's role to admin
UPDATE profiles
SET role = 'admin'
WHERE id = 'user-id-here';

-- Verify the change
SELECT id, email, role FROM profiles WHERE id = 'user-id-here';

-- Note: In production, you should implement a proper admin user management system
-- This script is for development and testing purposes only 