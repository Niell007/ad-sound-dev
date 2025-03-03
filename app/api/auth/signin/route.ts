import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const requestBody = await request.json()
    const { email, password } = requestBody
    
    console.log(`API: Sign-in attempt for email: ${email}`)
    
    if (!email || !password) {
      console.log('API: Missing email or password')
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Create a Supabase client with the cookies
    const supabase = createRouteHandlerClient({ cookies })
    
    // Attempt to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('API: Supabase auth error:', error.message)
      
      // Return specific error messages based on the error code
      if (error.message.includes('Invalid login credentials')) {
        return NextResponse.json(
          { error: 'Invalid email or password. Please check your credentials and try again.' },
          { status: 401 }
        )
      }
      
      // Rate limiting error
      if (error.message.includes('Too many requests')) {
        return NextResponse.json(
          { error: 'Too many login attempts. Please try again later.' },
          { status: 429 }
        )
      }
      
      throw error
    }

    console.log('API: Sign-in successful')
    
    // Set cookies for the session
    const { session } = data
    
    if (session) {
      // Set any additional cookies if needed
      cookies().set('supabase-auth-token', session.access_token, {
        path: '/',
        maxAge: session.expires_in,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      })
    }

    return NextResponse.json({ 
      message: 'Successfully signed in',
      user: {
        id: data.user?.id,
        email: data.user?.email,
        name: data.user?.user_metadata?.full_name || '',
      }
    })
  } catch (error) {
    console.error('API: Sign in error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}