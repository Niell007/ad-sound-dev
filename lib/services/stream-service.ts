import { supabase } from "@/lib/supabase/client";

export interface StreamLog {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status: 'live' | 'ended' | 'scheduled';
  started_at?: string;
  ended_at?: string;
  duration?: number;
  viewer_peak?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateStreamLogParams {
  title: string;
  description?: string;
  status?: 'live' | 'ended' | 'scheduled';
  started_at?: string;
}

export interface UpdateStreamLogParams {
  title?: string;
  description?: string;
  status?: 'live' | 'ended' | 'scheduled';
  ended_at?: string;
  duration?: number;
  viewer_peak?: number;
}

export interface StreamLogFilters {
  status?: 'live' | 'ended' | 'scheduled';
  user_id?: string;
  from_date?: string;
  to_date?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

/**
 * Service for managing stream logs
 */
export const streamService = {
  /**
   * Get all stream logs with optional filtering and pagination
   */
  async getStreamLogs(
    filters?: StreamLogFilters,
    pagination?: PaginationParams
  ): Promise<{ data: StreamLog[]; count: number }> {
    try {
      let query = supabase
        .from('stream_logs')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters) {
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        if (filters.user_id) {
          query = query.eq('user_id', filters.user_id);
        }
        if (filters.from_date) {
          query = query.gte('started_at', filters.from_date);
        }
        if (filters.to_date) {
          query = query.lte('started_at', filters.to_date);
        }
      }

      // Apply pagination
      if (pagination) {
        const { page, pageSize } = pagination;
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);
      }

      // Order by started_at descending (most recent first)
      query = query.order('started_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      return { data: data as StreamLog[], count: count || 0 };
    } catch (error) {
      console.error('Error fetching stream logs:', error);
      throw error;
    }
  },

  /**
   * Get active (live) streams
   */
  async getLiveStreams(): Promise<StreamLog[]> {
    try {
      const { data, error } = await supabase
        .from('stream_logs')
        .select('*')
        .eq('status', 'live')
        .order('started_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data as StreamLog[];
    } catch (error) {
      console.error('Error fetching live streams:', error);
      throw error;
    }
  },

  /**
   * Get a stream log by ID
   */
  async getStreamLogById(id: string): Promise<StreamLog | null> {
    try {
      const { data, error } = await supabase
        .from('stream_logs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data as StreamLog;
    } catch (error) {
      console.error(`Error fetching stream log with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new stream log
   */
  async createStreamLog(params: CreateStreamLogParams): Promise<StreamLog> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw userError;
      }
      
      const userId = userData.user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('stream_logs')
        .insert({
          user_id: userId,
          title: params.title,
          description: params.description,
          status: params.status || 'live',
          started_at: params.started_at || new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as StreamLog;
    } catch (error) {
      console.error('Error creating stream log:', error);
      throw error;
    }
  },

  /**
   * Update a stream log
   */
  async updateStreamLog(id: string, params: UpdateStreamLogParams): Promise<StreamLog> {
    try {
      const { data, error } = await supabase
        .from('stream_logs')
        .update(params)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as StreamLog;
    } catch (error) {
      console.error(`Error updating stream log with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * End a stream (update status to 'ended' and set ended_at)
   */
  async endStream(id: string, viewerPeak?: number, duration?: number): Promise<StreamLog> {
    try {
      const endedAt = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('stream_logs')
        .update({
          status: 'ended',
          ended_at: endedAt,
          viewer_peak: viewerPeak,
          duration: duration,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as StreamLog;
    } catch (error) {
      console.error(`Error ending stream with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a stream log
   */
  async deleteStreamLog(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('stream_logs')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(`Error deleting stream log with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get stream statistics for a user
   */
  async getUserStreamStats(userId?: string): Promise<{
    totalStreams: number;
    totalDuration: number;
    averageViewers: number;
    peakViewers: number;
  }> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw userError;
      }
      
      const targetUserId = userId || userData.user?.id;
      
      if (!targetUserId) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('stream_logs')
        .select('*')
        .eq('user_id', targetUserId);

      if (error) {
        throw error;
      }

      const streams = data as StreamLog[];
      const totalStreams = streams.length;
      const totalDuration = streams.reduce((sum, stream) => sum + (stream.duration || 0), 0);
      
      let totalViewers = 0;
      let peakViewers = 0;
      
      streams.forEach(stream => {
        totalViewers += stream.viewer_peak || 0;
        peakViewers = Math.max(peakViewers, stream.viewer_peak || 0);
      });
      
      const averageViewers = totalStreams > 0 ? totalViewers / totalStreams : 0;

      return {
        totalStreams,
        totalDuration,
        averageViewers,
        peakViewers
      };
    } catch (error) {
      console.error('Error fetching user stream stats:', error);
      throw error;
    }
  }
}; 