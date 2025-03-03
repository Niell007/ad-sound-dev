-- Check if our tables exist
SELECT table_name, column_name, data_type 
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles';

-- Check if our policies exist
SELECT *
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'profiles';

-- Check if our triggers exist
SELECT trigger_name, event_manipulation, event_object_schema, event_object_table
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND event_object_table = 'profiles'; 