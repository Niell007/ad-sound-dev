import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Set the runtime to edge for better performance
export const runtime = 'edge'

export async function PUT(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Safely parse JSON with error handling
    let body;
    try {
      body = await request.json()
    } catch (e) {
      console.error('Error parsing JSON:', e)
      return new NextResponse('Invalid JSON in request body', { status: 400 })
    }
    
    const { phone, website, role } = body

    // Try to create the table if it doesn't exist
    try {
      await supabase.rpc('create_user_settings_if_not_exists')
    } catch (error) {
      console.log('Table creation RPC not available, continuing with upsert')
    }

    // Update user metadata in your database
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: session.user.id,
          phone: phone || '',
          website: website || '',
          role: role || 'user',
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        console.error('Error updating user settings:', error)
        // If table doesn't exist, return success anyway with the provided values
        if (error.code === '42P01') {
          return NextResponse.json({
            phone: phone || '',
            website: website || '',
            role: role || 'user',
          })
        }
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json(data)
    } catch (error) {
      console.error('Database operation error:', error)
      // Return the values we tried to save even if the database operation failed
      return NextResponse.json({
        phone: phone || '',
        website: website || '',
        role: role || 'user',
      })
    }
  } catch (error) {
    console.error('Error in user settings route:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Try to create the table if it doesn't exist
    try {
      await supabase.rpc('create_user_settings_if_not_exists')
    } catch (error) {
      console.log('Table creation RPC not available, continuing with select')
    }

    // Get user settings from your database
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      if (error) {
        // If no settings exist yet or table doesn't exist, return default values
        if (error.code === 'PGRST116' || error.code === '42P01') {
          console.log('No settings found or table does not exist, returning defaults')
          return NextResponse.json({
            phone: '',
            website: '',
            role: 'user',
          })
        }
        console.error('Error fetching user settings:', error)
      }

      // If we have data, return it, otherwise return default values
      if (data) {
        return NextResponse.json(data)
      }
    } catch (error) {
      console.error('Database operation error:', error)
    }

    // Default fallback for any error case
    return NextResponse.json({
      phone: '',
      website: '',
      role: 'user',
    })
  } catch (error) {
    console.error('Error in user settings route:', error)
    // Return default values even on error
    return NextResponse.json({
      phone: '',
      website: '',
      role: 'user',
    })
  }
} 