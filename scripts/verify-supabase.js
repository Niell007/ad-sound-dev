// verify-supabase.js
// Script to verify Supabase connection and environment variables

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function verifySupabase() {
  console.log('🔍 Verifying Supabase configuration...');
  
  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL is missing or empty');
    return false;
  }
  
  if (!supabaseKey) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing or empty');
    return false;
  }
  
  console.log('✅ Environment variables are set');
  
  // Create Supabase client
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test connection with a simple query
    console.log('🔄 Testing connection to Supabase...');
    const { data, error } = await supabase.from('profiles').select('id').limit(1);
    
    if (error) {
      console.error('❌ Connection test failed:', error.message);
      return false;
    }
    
    console.log('✅ Successfully connected to Supabase!');
    return true;
  } catch (err) {
    console.error('❌ Failed to initialize Supabase client:', err.message);
    return false;
  }
}

// Run the verification
verifySupabase()
  .then(success => {
    if (success) {
      console.log('🎉 Supabase verification completed successfully');
      process.exit(0);
    } else {
      console.error('❌ Supabase verification failed');
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('❌ Unexpected error during verification:', err);
    process.exit(1);
  });
