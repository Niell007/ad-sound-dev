"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { useRouter, usePathname } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database.types'
import { useToast } from '@/components/ui/custom-toast-provider'
import { getSupabase } from '@/lib/supabase'

interface AuthContextType {
  session: Session | null
  user: User | null
  isLoading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: any }>
  signInWithProvider: (provider: 'google' | 'github') => Promise<{ success: boolean; error?: any }>
  signOut: () => Promise<{ success: boolean; error?: any }>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (updates: { full_name?: string; avatar_url?: string }) => Promise<void>
  verifyOtp: (token: string, type: 'email' | 'recovery') => Promise<void>
  updatePassword: (password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
  signUp: async () => {},
  signIn: async () => ({ success: false }),
  signInWithProvider: async () => ({ success: false }),
  signOut: async () => ({ success: false }),
  resetPassword: async () => {},
  updateProfile: async () => {},
  verifyOtp: async () => {},
  updatePassword: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const supabase = getSupabase()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        setIsLoading(true)
        
        // Check for existing session
        const { data: { session: initialSession } } = await supabase.auth.getSession()
        
        console.log('Initial session check:', initialSession ? 'Session found' : 'No session found')
        
        setSession(initialSession)
        setUser(initialSession?.user ?? null)
        
        // Set up auth state change listener
        const { data: { subscription } } = await supabase.auth.onAuthStateChange(
          (event, newSession) => {
            console.log('Auth state change event:', event)
            
            // Only update if the session actually changed to avoid unnecessary rerenders
            if (JSON.stringify(newSession) !== JSON.stringify(session)) {
              console.log('Session updated:', newSession ? 'New session' : 'Session cleared')
              setSession(newSession)
              setUser(newSession?.user ?? null)
            }
          }
        )
        
        return () => {
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error('Error setting up auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const cleanup = getInitialSession()
    
    return () => {
      // Cleanup subscription when component unmounts
      cleanup.then(unsubscribe => unsubscribe && unsubscribe())
    }
  }, [])

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })
      if (error) throw error
      
      toast({
        title: 'Account Created',
        description: 'Please check your email to verify your account.',
      })
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in with email:', email)
      
      // First, check if we already have a session
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      if (currentSession) {
        console.log('User already has an active session')
        setSession(currentSession)
        setUser(currentSession.user)
        return { success: true }
      }
      
      // No existing session, attempt to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        console.error('Sign in error:', error.message)
        throw error
      }
      
      console.log('Sign in successful, session established')
      
      // Update state with new session
      setSession(data.session)
      setUser(data.user)
      
      // Store session in localStorage for persistence
      if (typeof window !== 'undefined' && data.session) {
        localStorage.setItem('supabase.auth.token', JSON.stringify(data.session))
      }
      
      console.log('User signed in, navigating to dashboard')
      // Navigate to dashboard
      router.push('/dashboard')
      
      return { success: true }
    } catch (error) {
      console.error('Sign in error:', error)
      return { success: false, error }
    }
  }

  const signInWithProvider = async (provider: 'google' | 'github') => {
    try {
      console.log(`Attempting to sign in with ${provider}`)
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) {
        console.error(`Sign in with ${provider} error:`, error.message)
        throw error
      }
      
      return { success: true }
    } catch (error) {
      console.error(`Sign in with ${provider} error:`, error)
      return { success: false, error }
    }
  }

  const signOut = async () => {
    try {
      console.log('Signing out user...')
      await supabase.auth.signOut()
      
      // Clear local state
      setUser(null)
      setSession(null)
      
      // Clear any local storage items related to auth
      if (typeof window !== 'undefined') {
        // Keep this minimal to avoid removing non-auth related items
        localStorage.removeItem('supabase.auth.token')
      }
      
      console.log('User signed out, redirecting to home page')
      // Navigate to home page
      router.push('/')
      
      return { success: true }
    } catch (error) {
      console.error('Error signing out:', error)
      return { success: false, error }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      if (error) throw error
      
      toast({
        title: 'Password Reset Email Sent',
        description: 'Check your email for a link to reset your password.',
      })
    } catch (error) {
      console.error('Reset password error:', error)
      throw error
    }
  }

  const updateProfile = async (data: { full_name?: string; avatar_url?: string }) => {
    try {
      if (!user) throw new Error('No user logged in')

      const { error } = await supabase.auth.updateUser({
        data,
      })
      if (error) throw error
      
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      })
    } catch (error) {
      console.error('Update profile error:', error)
      throw error
    }
  }

  const verifyOtp = async (token: string, type: 'email' | 'recovery') => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type,
      })
      if (error) throw error
      
      if (type === 'email') {
        toast({
          title: 'Email Verified',
          description: 'Your email has been successfully verified.',
        })
      }
    } catch (error) {
      console.error('Verify OTP error:', error)
      throw error
    }
  }

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })
      if (error) throw error
      
      toast({
        title: 'Password Updated',
        description: 'Your password has been successfully updated.',
      })
    } catch (error) {
      console.error('Update password error:', error)
      throw error
    }
  }

  const value = {
    session,
    user,
    isLoading,
    signUp,
    signIn,
    signInWithProvider,
    signOut,
    resetPassword,
    updateProfile,
    verifyOtp,
    updatePassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}