-- Add foreign key relationships between tables

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

-- Add relationship between clients and users
ALTER TABLE clients
ADD CONSTRAINT clients_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id)
ON DELETE SET NULL; 