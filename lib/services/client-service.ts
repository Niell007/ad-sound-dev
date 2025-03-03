import { supabase } from '@/lib/supabase'
import { Tables } from '@/types/database.types'

export type Client = Tables<'clients'>
export type ClientWithBookingCount = Client & {
  booking_count: number
}

export const ClientService = {
  /**
   * Get all clients
   */
  async getAll(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching clients:', error)
      throw error
    }

    return data || []
  },

  /**
   * Get all clients with booking count
   */
  async getAllWithBookingCount(): Promise<ClientWithBookingCount[]> {
    const { data, error } = await supabase
      .from('clients')
      .select(`
        *,
        booking_count:bookings(count)
      `)
      .order('name')

    if (error) {
      console.error('Error fetching clients with booking count:', error)
      throw error
    }

    // Transform the data to get the count value
    return (data || []).map(client => ({
      ...client,
      booking_count: client.booking_count?.[0]?.count || 0
    }))
  },

  /**
   * Get a client by ID
   */
  async getById(id: string): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error(`Error fetching client with ID ${id}:`, error)
      throw error
    }

    return data
  },

  /**
   * Get a client by user ID
   */
  async getByUserId(userId: string): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
      console.error(`Error fetching client with user ID ${userId}:`, error)
      throw error
    }

    return data
  },

  /**
   * Create a new client
   */
  async create(client: Omit<Tables<'clients'>, 'id' | 'created_at' | 'updated_at'>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .insert(client)
      .select()
      .single()

    if (error) {
      console.error('Error creating client:', error)
      throw error
    }

    return data
  },

  /**
   * Update a client
   */
  async update(id: string, client: Partial<Omit<Tables<'clients'>, 'id' | 'created_at' | 'updated_at'>>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .update(client)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error(`Error updating client with ID ${id}:`, error)
      throw error
    }

    return data
  },

  /**
   * Delete a client
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(`Error deleting client with ID ${id}:`, error)
      throw error
    }
  }
} 