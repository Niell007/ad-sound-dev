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
          updated_at: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
          user_id: string
        }
        Insert: {
          id: string
          updated_at?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          user_id: string
        }
        Update: {
          id?: string
          updated_at?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          phone: string | null
          website: string | null
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          phone?: string | null
          website?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          phone?: string | null
          website?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      bookings: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          client_id: string
          service_id: string
          date: string
          start_time: string
          end_time: string
          status: string
          payment_status: string
          amount: number
          deposit_amount: number
          deposit_paid: boolean
          notes: string | null
          equipment: string | null
          location: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          client_id: string
          service_id: string
          date: string
          start_time: string
          end_time: string
          status: string
          payment_status: string
          amount: number
          deposit_amount: number
          deposit_paid: boolean
          notes?: string | null
          equipment?: string | null
          location?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          client_id?: string
          service_id?: string
          date?: string
          start_time?: string
          end_time?: string
          status?: string
          payment_status?: string
          amount?: number
          deposit_amount?: number
          deposit_paid?: boolean
          notes?: string | null
          equipment?: string | null
          location?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_client_id_fkey"
            columns: ["client_id"]
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            referencedRelation: "services"
            referencedColumns: ["id"]
          }
        ]
      }
      clients: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          email: string
          phone: string | null
          avatar_url: string | null
          type: string
          notes: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          email: string
          phone?: string | null
          avatar_url?: string | null
          type: string
          notes?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          email?: string
          phone?: string | null
          avatar_url?: string | null
          type?: string
          notes?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      services: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          description: string
          duration: string
          price: number
          price_per_hour: number
          category: string
          status: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          description: string
          duration: string
          price: number
          price_per_hour: number
          category: string
          status: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          description?: string
          duration?: string
          price?: number
          price_per_hour?: number
          category?: string
          status?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          booking_id: string
          amount: number
          status: string
          payment_method: string
          transaction_id: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          booking_id: string
          amount: number
          status: string
          payment_method: string
          transaction_id?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          booking_id?: string
          amount?: number
          status?: string
          payment_method?: string
          transaction_id?: string | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          id: string
          created_at: string
          booking_id: string
          sender_id: string
          content: string
          is_read: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          booking_id: string
          sender_id: string
          content: string
          is_read?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          booking_id?: string
          sender_id?: string
          content?: string
          is_read?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "messages_booking_id_fkey"
            columns: ["booking_id"]
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_roles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          role: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          role: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      booking_status: "pending" | "confirmed" | "cancelled" | "completed"
      payment_status: "unpaid" | "partial" | "paid" | "refunded"
      client_type: "regular" | "premium"
      service_status: "active" | "inactive"
      user_role: "user" | "staff" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
