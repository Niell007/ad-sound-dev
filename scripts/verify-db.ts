import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  }
})

async function verifySetup() {
  try {
    // Check if profiles table exists
    const { data: tableExists, error: tableError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)

    if (tableError) {
      console.error('Error checking profiles table:', tableError)
      return
    }

    console.log('✅ Profiles table exists and is accessible')

    // Test user creation flow
    const testEmail = `test_${Date.now()}@gmail.com`
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: 'password123',
      options: {
        data: {
          full_name: 'Test User',
        },
      },
    })

    if (authError) {
      console.error('Error testing user creation:', authError)
      return
    }

    console.log('✅ User creation flow works')

    // Check if profile was automatically created
    if (authData.user) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      if (profileError) {
        console.error('Error checking profile creation:', profileError)
        return
      }

      if (profile) {
        console.log('✅ Profile auto-creation works')
      }
    }

    console.log('✅ All checks passed!')
  } catch (error) {
    console.error('Verification failed:', error)
  }
}

verifySetup() 