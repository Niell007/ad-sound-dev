export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          full_name: string | null
          avatar_url: string | null
          email: string
          role: 'user' | 'admin'
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
          email: string
          role?: 'user' | 'admin'
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
          email?: string
          role?: 'user' | 'admin'
        }
      }
      reviews: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string | null
          author_name: string
          author_email: string | null
          rating: number
          content: string
          event_type: string | null
          event_date: string | null
          status: 'pending' | 'approved' | 'rejected'
          is_featured: boolean
          source: 'website' | 'social' | 'email' | 'admin' | 'other'
          source_url: string | null
          admin_notes: string | null
          response: string | null
          response_date: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string | null
          author_name: string
          author_email?: string | null
          rating: number
          content: string
          event_type?: string | null
          event_date?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          is_featured?: boolean
          source?: 'website' | 'social' | 'email' | 'admin' | 'other'
          source_url?: string | null
          admin_notes?: string | null
          response?: string | null
          response_date?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string | null
          author_name?: string
          author_email?: string | null
          rating?: number
          content?: string
          event_type?: string | null
          event_date?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          is_featured?: boolean
          source?: 'website' | 'social' | 'email' | 'admin' | 'other'
          source_url?: string | null
          admin_notes?: string | null
          response?: string | null
          response_date?: string | null
        }
      }
      review_reactions: {
        Row: {
          id: string
          created_at: string
          review_id: string
          user_id: string | null
          reaction_type: 'helpful' | 'not_helpful'
          ip_address: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          review_id: string
          user_id?: string | null
          reaction_type: 'helpful' | 'not_helpful'
          ip_address?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          review_id?: string
          user_id?: string | null
          reaction_type?: 'helpful' | 'not_helpful'
          ip_address?: string | null
        }
      }
      bookings: {
        Row: {
          id: string
          created_at: string
          user_id: string
          event_type: string
          event_date: string
          location: string
          attendees: number
          notes: string | null
          amount: number
          status: 'pending' | 'confirmed' | 'cancelled'
          payment_status: 'pending' | 'paid' | 'refunded'
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          event_type: string
          event_date: string
          location: string
          attendees: number
          notes?: string | null
          amount: number
          status?: 'pending' | 'confirmed' | 'cancelled'
          payment_status?: 'pending' | 'paid' | 'refunded'
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          event_type?: string
          event_date?: string
          location?: string
          attendees?: number
          notes?: string | null
          amount?: number
          status?: 'pending' | 'confirmed' | 'cancelled'
          payment_status?: 'pending' | 'paid' | 'refunded'
        }
      }
      tracks: {
        Row: {
          id: string
          created_at: string
          title: string
          artist: string
          duration: number
          audio_url: string
          cover_url: string | null
          category: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          artist: string
          duration: number
          audio_url: string
          cover_url?: string | null
          category: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          artist?: string
          duration?: number
          audio_url?: string
          cover_url?: string | null
          category?: string
        }
      }
      gallery: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string | null
          image_url: string
          category: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description?: string | null
          image_url: string
          category: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string | null
          image_url?: string
          category?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          created_at: string
          user_id: string
          content: string
          read: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          content: string
          read?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          content?: string
          read?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 