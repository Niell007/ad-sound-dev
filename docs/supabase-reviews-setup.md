# Setting Up Reviews Tables in Supabase

To set up the reviews system in your Supabase project, you need to create the necessary tables and set up Row Level Security (RLS) policies. Follow these steps:

## 1. Access the SQL Editor

1. Log in to your Supabase dashboard at [https://app.supabase.com/](https://app.supabase.com/)
2. Select your project (`ad-sound`)
3. Navigate to the SQL Editor in the left sidebar
4. Click "New Query" to create a new SQL query

## 2. Create the Reviews Tables

Copy and paste the following SQL code into the SQL Editor:

```sql
-- Create reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id),
  author_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  content TEXT NOT NULL,
  event_type TEXT,
  event_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Create review reactions table
CREATE TABLE review_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('helpful', 'not_helpful')),
  UNIQUE(review_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_reactions ENABLE ROW LEVEL SECURITY;

-- Reviews policies
CREATE POLICY "Approved reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (status = 'approved' OR auth.uid() = user_id);

CREATE POLICY "Users can create their own reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending');

-- Review reactions policies
CREATE POLICY "Users can view all review reactions"
  ON review_reactions FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own reactions"
  ON review_reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions"
  ON review_reactions FOR DELETE
  USING (auth.uid() = user_id);
```

5. Click "Run" to execute the SQL query

## 3. Verify the Tables

After running the SQL query, you should see the following tables in your Supabase dashboard:

1. Navigate to the "Table Editor" in the left sidebar
2. You should see the `reviews` and `review_reactions` tables in the list of tables

## 4. Test the API

Once the tables are created, you can test the API by:

1. Restarting your Next.js application
2. Navigating to the reviews dashboard at `http://localhost:3000/dashboard/reviews`
3. Creating a new review using the "New Review" button

## Troubleshooting

If you encounter any issues:

1. Check the browser console for error messages
2. Verify that the tables were created correctly in the Supabase dashboard
3. Ensure that the RLS policies are set up correctly
 