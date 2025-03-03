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
  },

  /**
   * Get booking statistics by status
   */
  async getBookingStatsByStatus(): Promise<{ total: number; confirmed: number; pending: number; canceled: number; completed: number }> {
    const { data, error } = await supabase
      .from('bookings')
      .select('status');
      
    if (error) {
      console.error('Error fetching booking statistics:', error);
      throw error;
    }
    
    const stats = {
      total: data.length,
      confirmed: 0,
      pending: 0,
      canceled: 0,
      completed: 0
    };
    
    data.forEach(booking => {
      switch (booking.status) {
        case 'confirmed':
          stats.confirmed++;
          break;
        case 'pending':
          stats.pending++;
          break;
        case 'canceled':
          stats.canceled++;
          break;
        case 'completed':
          stats.completed++;
          break;
      }
    });
    
    return stats;
  },
  
  /**
   * Get bookings by date range
   */
  async getBookingsByDateRange(startDate: string, endDate: string): Promise<BookingWithDetails[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        client:clients(*),
        service:services(*)
      `)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });
      
    if (error) {
      console.error(`Error fetching bookings from ${startDate} to ${endDate}:`, error);
      throw error;
    }
    
    return data || [];
  },
  
  /**
   * Get booking counts by month for a specific year
   */
  async getMonthlyBookingsForYear(year: number): Promise<{ month: string; count: number }[]> {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    
    const { data, error } = await supabase
      .from('bookings')
      .select('date')
      .gte('date', startDate)
      .lte('date', endDate);
      
    if (error) {
      console.error(`Error fetching monthly bookings for ${year}:`, error);
      throw error;
    }
    
    // Initialize monthly booking data
    const monthlyBookings = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(year, i, 1).toLocaleString('default', { month: 'short' }),
      count: 0
    }));
    
    // Aggregate bookings by month
    data.forEach(booking => {
      const bookingDate = new Date(booking.date);
      const monthIndex = bookingDate.getMonth();
      monthlyBookings[monthIndex].count++;
    });
    
    return monthlyBookings;
  }
} 