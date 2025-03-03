import { supabase } from '@/lib/supabase'
import { Tables } from '@/types/database.types'

export type Booking = Tables<'bookings'>
export type BookingWithDetails = Booking & {
  client: Tables<'clients'>
  service: Tables<'services'>
}

export const BookingService = {
  /**
   * Get all bookings
   */
  async getAll(): Promise<BookingWithDetails[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        client:clients(*),
        service:services(*)
      `)
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching bookings:', error)
      throw error
    }

    return data || []
  },

  /**
   * Get a booking by ID
   */
  async getById(id: string): Promise<BookingWithDetails | null> {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        client:clients(*),
        service:services(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error(`Error fetching booking with ID ${id}:`, error)
      throw error
    }

    return data
  },

  /**
   * Get bookings by client ID
   */
  async getByClientId(clientId: string): Promise<BookingWithDetails[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        client:clients(*),
        service:services(*)
      `)
      .eq('client_id', clientId)
      .order('date', { ascending: true })

    if (error) {
      console.error(`Error fetching bookings for client ${clientId}:`, error)
      throw error
    }

    return data || []
  },

  /**
   * Create a new booking
   */
  async create(booking: Omit<Tables<'bookings'>, 'id' | 'created_at' | 'updated_at'>): Promise<Booking> {
    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .select()
      .single()

    if (error) {
      console.error('Error creating booking:', error)
      throw error
    }

    return data
  },

  /**
   * Update a booking
   */
  async update(id: string, booking: Partial<Omit<Tables<'bookings'>, 'id' | 'created_at' | 'updated_at'>>): Promise<Booking> {
    const { data, error } = await supabase
      .from('bookings')
      .update(booking)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error(`Error updating booking with ID ${id}:`, error)
      throw error
    }

    return data
  },

  /**
   * Delete a booking
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(`Error deleting booking with ID ${id}:`, error)
      throw error
    }
  },

  /**
   * Update booking status
   */
  async updateStatus(id: string, status: string): Promise<Booking> {
    return this.update(id, { status })
  },

  /**
   * Update payment status
   */
  async updatePaymentStatus(id: string, paymentStatus: string): Promise<Booking> {
    return this.update(id, { payment_status: paymentStatus })
  }
} 