import { supabase } from '@/lib/supabase'
import { Tables } from '@/types/database.types'

export type Payment = Tables<'payments'>
export type PaymentWithBooking = Payment & {
  booking: Tables<'bookings'>
}

export const PaymentService = {
  /**
   * Get all payments
   */
  async getAll(): Promise<PaymentWithBooking[]> {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        booking:bookings(*)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching payments:', error)
      throw error
    }

    return data || []
  },

  /**
   * Get a payment by ID
   */
  async getById(id: string): Promise<PaymentWithBooking | null> {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        booking:bookings(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error(`Error fetching payment with ID ${id}:`, error)
      throw error
    }

    return data
  },

  /**
   * Get payments by booking ID
   */
  async getByBookingId(bookingId: string): Promise<Payment[]> {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error(`Error fetching payments for booking ${bookingId}:`, error)
      throw error
    }

    return data || []
  },

  /**
   * Create a new payment
   */
  async create(payment: Omit<Tables<'payments'>, 'id' | 'created_at' | 'updated_at'>): Promise<Payment> {
    const { data, error } = await supabase
      .from('payments')
      .insert(payment)
      .select()
      .single()

    if (error) {
      console.error('Error creating payment:', error)
      throw error
    }

    return data
  },

  /**
   * Update a payment
   */
  async update(id: string, payment: Partial<Omit<Tables<'payments'>, 'id' | 'created_at' | 'updated_at'>>): Promise<Payment> {
    const { data, error } = await supabase
      .from('payments')
      .update(payment)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error(`Error updating payment with ID ${id}:`, error)
      throw error
    }

    return data
  },

  /**
   * Delete a payment
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(`Error deleting payment with ID ${id}:`, error)
      throw error
    }
  },

  /**
   * Get total revenue
   */
  async getTotalRevenue(): Promise<number> {
    const { data, error } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'paid')

    if (error) {
      console.error('Error calculating total revenue:', error)
      throw error
    }

    return data.reduce((total, payment) => total + payment.amount, 0)
  },

  /**
   * Get revenue by period
   */
  async getRevenueByPeriod(startDate: string, endDate: string): Promise<number> {
    const { data, error } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'paid')
      .gte('created_at', startDate)
      .lte('created_at', endDate)

    if (error) {
      console.error(`Error calculating revenue from ${startDate} to ${endDate}:`, error)
      throw error
    }

    return data.reduce((total, payment) => total + payment.amount, 0)
  }
} 