import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of protected routes that require authentication
const protectedRoutes: string[] = [
  // Add protected routes here
  // '/admin',
  // '/dashboard',
]

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))

  // If it's not a protected route, continue as normal
  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Add your authentication logic here for protected routes
  // For example, check for session token
  const token = request.cookies.get('session')?.value

  // If no token and trying to access protected route, redirect to login
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
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