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
  },

  /**
   * Get service statistics
   */
  async getServiceStats(): Promise<{ total: number; active: number; inactive: number }> {
    const { data, error } = await supabase
      .from('services')
      .select('status');
      
    if (error) {
      console.error('Error fetching service statistics:', error);
      throw error;
    }
    
    const stats = {
      total: data.length,
      active: 0,
      inactive: 0
    };
    
    data.forEach(service => {
      if (service.status === 'active') {
        stats.active++;
      } else {
        stats.inactive++;
      }
    });
    
    return stats;
  },
  
  /**
   * Get services with booking count by category
   */
  async getServicesByCategory(): Promise<{ category: string; services: number; bookings: number }[]> {
    const { data, error } = await supabase
      .from('services')
      .select(`
        category,
        booking_count:bookings(count)
      `);
      
    if (error) {
      console.error('Error fetching services by category:', error);
      throw error;
    }
    
    // Group by category
    const categories: Record<string, { services: number; bookings: number }> = {};
    
    data.forEach(item => {
      const category = item.category || 'Uncategorized';
      
      if (!categories[category]) {
        categories[category] = { services: 0, bookings: 0 };
      }
      
      categories[category].services++;
      categories[category].bookings += item.booking_count || 0;
    });
    
    // Convert to array format
    return Object.entries(categories).map(([category, stats]) => ({
      category,
      services: stats.services,
      bookings: stats.bookings
    }));
  },
  
  /**
   * Get top performing services by revenue
   */
  async getTopServicesByRevenue(limit: number = 5): Promise<{ name: string; revenue: number; bookings: number }[]> {
    const { data, error } = await supabase
      .from('services')
      .select(`
        name,
        price,
        booking_count:bookings(count)
      `)
      .order('booking_count', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error('Error fetching top services by revenue:', error);
      throw error;
    }
    
    return data.map(service => ({
      name: service.name,
      revenue: service.price * (service.booking_count || 0),
      bookings: service.booking_count || 0
    }));
  }
} 