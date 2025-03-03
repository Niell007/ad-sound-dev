import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { error } = await supabase.auth.signOut()

    if (error) throw error

    return NextResponse.json({ message: 'Successfully signed out' })
  } catch (error) {
    console.error('Sign out error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
} 