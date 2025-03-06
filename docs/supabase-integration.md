# Supabase Integration with Next.js App Router

## Overview

This project uses Supabase with Next.js App Router following the official best practices for authentication, data fetching, and type safety.

## Configuration

### Environment Variables

Required environment variables in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
```

### Client Setup

The project uses the `@supabase/ssr` package for proper cookie-based authentication handling.

#### Browser Client (`lib/supabase/client.ts`)
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

#### Server Client (`lib/supabase/server.ts`)
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        }
      }
    }
  )
}
```

### Middleware Configuration

The middleware (`middleware.ts`) handles authentication session refresh and cookie management:
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  await supabase.auth.getSession()
  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

## Usage Examples

### In Server Components
```typescript
import { createClient } from '@/lib/supabase/server'

export default async function ServerComponent() {
  const supabase = await createClient()
  const { data } = await supabase.from('your_table').select()
  
  return <div>{/* Use your data */}</div>
}
```

### In Client Components
```typescript
'use client'

import { createClient } from '@/lib/supabase/client'

export default function ClientComponent() {
  const supabase = createClient()
  
  async function handleAction() {
    const { data } = await supabase.from('your_table').select()
    // Handle data
  }
  
  return <button onClick={handleAction}>Fetch Data</button>
}
```

## Type Safety

The project uses generated types from your Supabase database schema. Types are automatically generated during project initialization.

## Authentication Flow

1. User authentication is handled through cookie-based sessions
2. Middleware automatically refreshes expired sessions
3. Server components can access the session securely
4. Client components can trigger auth actions

## Best Practices

1. Always use `createClient()` instead of a global client
2. Use server components by default for data fetching
3. Only use client components when interactivity is needed
4. Never trust client-side session data for authorization
5. Always verify sessions server-side for protected routes

## Useful Commands

```bash
# Verify Supabase connection
npm run verify

# Generate updated types
npm run db:types

# Development server
npm run dev
``` 