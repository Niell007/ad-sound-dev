import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { Database } from '@/types/database.types'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'
  
  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
    
    try {
      // Exchange code for session
      await supabase.auth.exchangeCodeForSession(code)
      
      // Redirect to the next URL or dashboard
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    } catch (error) {
      console.error('Auth callback error:', error)
      // Redirect to sign in page with error
      return NextResponse.redirect(
        new URL(`/auth/signin?error=Authentication failed`, requestUrl.origin)
      )
    }
  }

  // If no code is provided, redirect to sign in page
  return NextResponse.redirect(
    new URL('/auth/signin?error=No authentication code provided', requestUrl.origin)
  )
} 