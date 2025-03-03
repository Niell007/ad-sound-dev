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
      users: {
        Row: {
          id: string
          role: 'user' | 'admin' | 'staff'
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: 'user' | 'admin' | 'staff'
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: 'user' | 'admin' | 'staff'
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number | null
          duration: number | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price?: number | null
          duration?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number | null
          duration?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string | null
          service_id: string | null
          event_type: 'party' | 'wedding' | 'corporate' | 'concert' | 'other'
          event_date: string
          location: string | null
          attendees: number | null
          special_requests: string | null
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          payment_status: 'pending' | 'paid' | 'refunded' | 'failed'
          total_amount: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          service_id?: string | null
          event_type: 'party' | 'wedding' | 'corporate' | 'concert' | 'other'
          event_date: string
          location?: string | null
          attendees?: number | null
          special_requests?: string | null
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          payment_status?: 'pending' | 'paid' | 'refunded' | 'failed'
          total_amount?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          service_id?: string | null
          event_type?: 'party' | 'wedding' | 'corporate' | 'concert' | 'other'
          event_date?: string
          location?: string | null
          attendees?: number | null
          special_requests?: string | null
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          payment_status?: 'pending' | 'paid' | 'refunded' | 'failed'
          total_amount?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string | null
          author_name: string
          author_email: string | null
          rating: number
          content: string
          status: string
          featured: boolean
          source: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          author_name: string
          author_email?: string | null
          rating: number
          content: string
          status?: string
          featured?: boolean
          source?: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          author_name?: string
          author_email?: string | null
          rating?: number
          content?: string
          status?: string
          featured?: boolean
          source?: string
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      review_reactions: {
        Row: {
          id: string
          review_id: string
          user_id: string | null
          reaction_type: string
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          review_id: string
          user_id?: string | null
          reaction_type: string
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          review_id?: string
          user_id?: string | null
          reaction_type?: string
          ip_address?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_reactions_review_id_fkey"
            columns: ["review_id"]
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_reactions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      equipment: {
        Row: {
          id: string
          name: string
          description: string | null
          quantity: number
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          quantity?: number
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          quantity?: number
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      booking_equipment: {
        Row: {
          booking_id: string
          equipment_id: string
          quantity: number
        }
        Insert: {
          booking_id: string
          equipment_id: string
          quantity?: number
        }
        Update: {
          booking_id?: string
          equipment_id?: string
          quantity?: number
        }
      }
      payments: {
        Row: {
          id: string
          booking_id: string
          amount: number
          status: 'pending' | 'paid' | 'refunded' | 'failed'
          provider: string | null
          provider_payment_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          amount: number
          status?: 'pending' | 'paid' | 'refunded' | 'failed'
          provider?: string | null
          provider_payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          amount?: number
          status?: 'pending' | 'paid' | 'refunded' | 'failed'
          provider?: string | null
          provider_payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          is_read?: boolean
          created_at?: string
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
      user_role: 'user' | 'admin' | 'staff'
      event_type: 'party' | 'wedding' | 'corporate' | 'concert' | 'other'
      booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
      payment_status: 'pending' | 'paid' | 'refunded' | 'failed'
    }
  }
}
