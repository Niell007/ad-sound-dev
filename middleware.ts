import { createServerClient } from '@supabase/ssr'
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
    
    // Create a Supabase client using the new ssr package
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name) => request.cookies.get(name)?.value,
          set: (name, value, options) => {
            res.cookies.set({ name, value, ...options })
          },
          remove: (name, options) => {
            res.cookies.set({ name, value: '', ...options })
          },
        },
      }
    )
    
    // Refresh the session if it exists
    const { data: { session } } = await supabase.auth.getSession()
    
    const { pathname } = request.nextUrl
    
    // Debug logging
    console.log(`Middleware running for path: ${pathname}`);
    console.log(`Session exists: ${!!session}`);
    
    // Check if the path is protected and user is not authenticated
    if (!session && isProtectedRoute(pathname)) {
      console.log(`Redirecting unauthenticated user from ${pathname} to /auth/signin`);
      // Store the original URL to redirect back after login
      const redirectUrl = new URL('/auth/signin', request.url)
      redirectUrl.searchParams.set('redirectedFrom', pathname)
      return NextResponse.redirect(redirectUrl)
    }
    
    // Check if user is trying to access auth pages while already authenticated
    if (session && isAuthRoute(pathname)) {
      console.log(`Redirecting authenticated user from ${pathname} to /dashboard`);
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    
    // Add user info to headers for server components
    if (session) {
      console.log(`Setting user headers for ${session.user.email}`);
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
  const isProtected = protectedPaths.some(path => pathname === path || pathname.startsWith(`${path}/`));
  console.log(`Path ${pathname} is protected: ${isProtected}`);
  return isProtected;
}

// Check if the path is an auth route
function isAuthRoute(pathname: string): boolean {
  const isAuth = authPaths.some(path => pathname === path || pathname.startsWith(`${path}/`));
  console.log(`Path ${pathname} is auth route: ${isAuth}`);
  return isAuth;
}

// Define which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}