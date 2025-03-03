import { supabase } from '@/lib/supabase'
import { Tables } from '@/types/database.types'

export type Service = Tables<'services'>
export type ServiceWithBookingCount = Service & {
  booking_count: number
}

export const ServiceService = {
  /**
   * Get all services
   */
  async getAll(): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching services:', error)
      throw error
    }

    return data || []
  },

  /**
   * Get all active services
   */
  async getAllActive(): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('status', 'active')
      .order('name')

    if (error) {
      console.error('Error fetching active services:', error)
      throw error
    }

    return data || []
  },

  /**
   * Get all services with booking count
   */
  async getAllWithBookingCount(): Promise<ServiceWithBookingCount[]> {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        booking_count:bookings(count)
      `)
      .order('name')

    if (error) {
      console.error('Error fetching services with booking count:', error)
      throw error
    }

    // Transform the data to get the count value
    return (data || []).map(service => ({
      ...service,
      booking_count: service.booking_count?.[0]?.count || 0
    }))
  },

  /**
   * Get a service by ID
   */
  async getById(id: string): Promise<Service | null> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error(`Error fetching service with ID ${id}:`, error)
      throw error
    }

    return data
  },

  /**
   * Create a new service
   */
  async create(service: Omit<Tables<'services'>, 'id' | 'created_at' | 'updated_at'>): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .insert(service)
      .select()
      .single()

    if (error) {
      console.error('Error creating service:', error)
      throw error
    }

    return data
  },

  /**
   * Update a service
   */
  async update(id: string, service: Partial<Omit<Tables<'services'>, 'id' | 'created_at' | 'updated_at'>>): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .update(service)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error(`Error updating service with ID ${id}:`, error)
      throw error
    }

    return data
  },

  /**
   * Delete a service
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(`Error deleting service with ID ${id}:`, error)
      throw error
    }
  },

  /**
   * Update service status
   */
  async updateStatus(id: string, status: string): Promise<Service> {
    return this.update(id, { status })
  }
} 