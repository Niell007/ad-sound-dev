-- Create stream_logs table for tracking live streams
CREATE TABLE IF NOT EXISTS stream_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'ended',
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  duration INTEGER DEFAULT 0,
  viewer_peak INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for stream_logs
ALTER TABLE stream_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own stream logs
CREATE POLICY "Users can view their own stream logs"
  ON stream_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own stream logs
CREATE POLICY "Users can insert their own stream logs"
  ON stream_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own stream logs
CREATE POLICY "Users can update their own stream logs"
  ON stream_logs
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Admins can view all stream logs
CREATE POLICY "Admins can view all stream logs"
  ON stream_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Admins can update all stream logs
CREATE POLICY "Admins can update all stream logs"
  ON stream_logs
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create function to update updated_at on stream_logs
CREATE OR REPLACE FUNCTION update_stream_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at on stream_logs
CREATE TRIGGER update_stream_logs_updated_at
BEFORE UPDATE ON stream_logs
FOR EACH ROW
EXECUTE FUNCTION update_stream_logs_updated_at();

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS stream_logs_user_id_idx ON stream_logs(user_id);

-- Create index on status for filtering active streams
CREATE INDEX IF NOT EXISTS stream_logs_status_idx ON stream_logs(status);

-- Create index on started_at for sorting by recency
CREATE INDEX IF NOT EXISTS stream_logs_started_at_idx ON stream_logs(started_at DESC); 