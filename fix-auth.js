// fix-auth.js
// Script to verify and fix Supabase authentication issues

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function fixAuth() {
  console.log('🔍 Starting authentication debugging...');
  
  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables in .env file');
    console.log('🔧 Please make sure your .env file contains:');
    console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
    return false;
  }
  
  console.log('✅ Supabase environment variables found');
  
  // Check if Supabase client can be created
  try {
    console.log('🔄 Testing Supabase client creation...');
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client created successfully');
    
    // Test connection with a simple query
    console.log('🔄 Testing connection to Supabase...');
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Connection test failed:', error.message);
        return false;
      }
      
      console.log('✅ Successfully connected to Supabase!');
      
      // Check if auth helpers are installed
      console.log('🔄 Checking for @supabase/auth-helpers-nextjs...');
      try {
        require('@supabase/auth-helpers-nextjs');
        console.log('✅ @supabase/auth-helpers-nextjs is installed');
      } catch (err) {
        console.error('❌ @supabase/auth-helpers-nextjs is not installed');
        console.log('🔧 Installing @supabase/auth-helpers-nextjs...');
        execSync('npm install @supabase/auth-helpers-nextjs', { stdio: 'inherit' });
        console.log('✅ @supabase/auth-helpers-nextjs installed successfully');
      }
      
      return true;
    } catch (err) {
      console.error('❌ Error testing connection:', err.message);
      return false;
    }
  } catch (err) {
    console.error('❌ Failed to initialize Supabase client:', err.message);
    return false;
  }
}

// Run the fix
fixAuth()
  .then(success => {
    if (success) {
      console.log('🎉 Authentication debugging completed successfully');
      console.log('✅ Your Supabase authentication should now be working correctly');
      console.log('📝 If you are still experiencing issues, please check:');
      console.log('1. Your Supabase project settings in the Supabase dashboard');
      console.log('2. Make sure Email Auth is enabled in Authentication > Providers');
      console.log('3. Check if your site URL is added to the allowed redirect URLs');
      process.exit(0);
    } else {
      console.error('❌ Authentication debugging failed');
      console.log('📝 Please check your Supabase project settings and credentials');
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('❌ Unexpected error during debugging:', err);
    process.exit(1);
  });
