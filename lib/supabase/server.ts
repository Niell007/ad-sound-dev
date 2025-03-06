import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

export function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          return (await cookies()).get(name)?.value
        },
        async set(name: string, value: string, options: { [key: string]: any }) {
          (await cookies()).set(name, value, options)
        },
        async remove(name: string, options: { [key: string]: any }) {
          (await cookies()).set(name, '', { ...options, maxAge: 0 })
        }
      }
    }
  )
}

// Helper function to get authenticated user from server component
export async function getAuthenticatedUser() {
  const supabase = createClient()
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  } catch (error) {
    console.error('Error getting authenticated user:', error)
    return null
  }
}

// Helper function to get user profile from server component
export async function getServerSideProfile(userId: string) {
  const supabase = createClient()
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error getting user profile:', error)
    return null
  }
}

// Helper function to check if user is admin from server component
export async function isAdminServerSide(userId: string) {
  const supabase = createClient()
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data?.role === 'admin'
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

// Helper function to handle auth state change in middleware
export async function updateAuthState(request: NextRequest) {
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = request.cookies.get(name)
          return cookie?.value
        },
        set(name: string, value: string, options: { [key: string]: any }) {
          response.cookies.set({
            name,
            value,
            ...options,
            sameSite: 'lax' as const,
            httpOnly: true
          })
        },
        remove(name: string, options: { [key: string]: any }) {
          response.cookies.set({
            name,
            value: '',
            ...options,
            maxAge: 0,
            sameSite: 'lax' as const,
            httpOnly: true
          })
        }
      }
    }
  )

  // Refresh session if exists
  const { data: { session }, error } = await supabase.auth.getSession()

  return { supabase, session, error, response }
} 