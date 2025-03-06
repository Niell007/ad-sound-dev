import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'
import Error from 'next/error'

export function createClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

// Helper function to handle Supabase errors
export function handleSupabaseError(error: Error) {
  console.error('Supabase error:', error.message)
  throw new Error('An error occurred while accessing the database')
}

// Helper function to check if user has admin role
export async function isAdmin(userId: string) {
  const client = createClient()
  try {
    const { data, error } = await client
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data?.role === 'admin'
  } catch (error) {
    handleSupabaseError(error as Error)
    return false
  }
}

// Helper function to get user profile
export async function getUserProfile(userId: string) {
  const client = createClient()
  try {
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    handleSupabaseError(error as Error)
    return null
  }
}

// Helper function to update user profile
export async function updateUserProfile(userId: string, updates: Partial<Database['public']['Tables']['profiles']['Update']>) {
  const client = createClient()
  try {
    const { data, error } = await client
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    handleSupabaseError(error as Error)
    return null
  }
} 