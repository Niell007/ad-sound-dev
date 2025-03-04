import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of protected routes that require authentication
const protectedRoutes: string[] = [
  // Add protected routes here
  // '/admin',
  // '/dashboard',
]

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })
  const { pathname } = request.nextUrl

  // Handle auth redirects
  if (pathname === '/auth/login' || pathname === '/auth/register') {
    const newPath = pathname === '/auth/login' ? '/auth/signin' : '/auth/signup'
    return NextResponse.redirect(new URL(newPath, request.url))
  }

  // Check auth session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Log session state for debugging
  console.log('Middleware running for path:', pathname)
  console.log('Session exists:', !!session)

  // Define protected routes
  const isProtectedRoute = pathname.startsWith('/dashboard') || 
                          pathname.startsWith('/admin') || 
                          pathname.startsWith('/settings')

  console.log('Path', pathname, 'is protected:', isProtectedRoute)

  // Handle protected routes
  if (isProtectedRoute && !session) {
    // Store the attempted URL to redirect back after login
    const redirectUrl = new URL('/auth/signin', request.url)
    redirectUrl.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}