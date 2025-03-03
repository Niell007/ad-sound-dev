import { supabase } from '@/lib/supabase'
import { Tables } from '@/types/database.types'

export type Message = Tables<'messages'>

export const MessageService = {
  /**
   * Get messages by booking ID
   */
  async getByBookingId(bookingId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error(`Error fetching messages for booking ${bookingId}:`, error)
      throw error
    }

    return data || []
  },

  /**
   * Create a new message
   */
  async create(message: Omit<Tables<'messages'>, 'id' | 'created_at'>): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert(message)
      .select()
      .single()

    if (error) {
      console.error('Error creating message:', error)
      throw error
    }

    return data
  },

  /**
   * Mark messages as read
   */
  async markAsRead(bookingId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('booking_id', bookingId)
      .neq('sender_id', userId)
      .eq('is_read', false)

    if (error) {
      console.error(`Error marking messages as read for booking ${bookingId}:`, error)
      throw error
    }
  },

  /**
   * Get unread message count for user
   */
  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .neq('sender_id', userId)
      .eq('is_read', false)

    if (error) {
      console.error(`Error getting unread message count for user ${userId}:`, error)
      throw error
    }

    return count || 0
  }
} 