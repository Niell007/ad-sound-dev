import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of paths that require authentication
const protectedPaths = [
  '/dashboard',
  '/dashboard/bookings',
  '/dashboard/clients',
  '/dashboard/services',
  '/dashboard/analytics',
  '/dashboard/calendar',
  '/dashboard/settings',
  '/dashboard/profile',
  '/dashboard/media',
  '/dashboard/payments',
  '/dashboard/reviews',
]

// List of paths that should redirect to dashboard if user is already authenticated
const authPaths = [
  '/auth/signin',
  '/auth/signup',
  '/auth/login',
  '/auth/register',
  '/auth/reset-password',
]

export async function middleware(request: NextRequest) {
  try {
    // Create a response object that we'll modify and return
    const res = NextResponse.next()
    
    // Create a Supabase client
    const supabase = createMiddlewareClient({ req: request, res })
    
    // Refresh the session if it exists
    const { data: { session } } = await supabase.auth.getSession()
    
    const { pathname } = request.nextUrl
    
    // Check if the path is protected and user is not authenticated
    if (!session && isProtectedRoute(pathname)) {
      // Store the original URL to redirect back after login
      const redirectUrl = new URL('/auth/signin', request.url)
      redirectUrl.searchParams.set('redirectedFrom', pathname)
      return NextResponse.redirect(redirectUrl)
    }
    
    // Check if user is trying to access auth pages while already authenticated
    if (session && isAuthRoute(pathname)) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    
    // Add user info to headers for server components
    if (session) {
      res.headers.set('x-user-id', session.user.id)
      res.headers.set('x-user-email', session.user.email || '')
      res.headers.set('x-user-role', session.user.user_metadata?.role || 'user')
    }
    
    return res
  } catch (error) {
    console.error('Middleware error:', error)
    // If there's an error, just continue to the page
    // This prevents authentication errors from blocking the entire site
    return NextResponse.next()
  }
}

// Check if the path is a protected route
function isProtectedRoute(pathname: string): boolean {
  return protectedPaths.some(path => pathname === path || pathname.startsWith(`${path}/`))
}

// Check if the path is an auth route
function isAuthRoute(pathname: string): boolean {
  return authPaths.some(path => pathname === path || pathname.startsWith(`${path}/`))
}

// Define which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api (API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
} 