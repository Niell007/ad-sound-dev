# Reviews System Documentation

## Overview

The AD Sound Reviews System allows clients to submit testimonials and reviews about their experiences with the audio services provided. The system includes features for submitting, managing, and displaying reviews, as well as a reaction system that allows users to mark reviews as helpful or not helpful.

## Database Schema

The reviews system uses two main tables in the Supabase database:

### Reviews Table

```sql
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
```

### Review Reactions Table

```sql
CREATE TABLE review_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('helpful', 'not_helpful')),
  UNIQUE(review_id, user_id)
);
```

## Row-Level Security Policies

The following RLS policies are implemented to secure the reviews system:

### Reviews Policies

```sql
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
```

### Review Reactions Policies

```sql
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

## API Endpoints

The reviews system includes the following API endpoints:

### Reviews Endpoints

- `GET /api/reviews` - Get all reviews (with optional filtering)
- `GET /api/reviews/:id` - Get a specific review by ID
- `POST /api/reviews` - Create a new review
- `PATCH /api/reviews/:id` - Update an existing review
- `DELETE /api/reviews/:id` - Delete a review

### Review Reactions Endpoints

- `GET /api/reviews/reactions/:reviewId` - Get reactions for a specific review
- `POST /api/reviews/reactions` - Add a reaction to a review
- `DELETE /api/reviews/reactions/:id` - Remove a reaction from a review

## Frontend Components

### Public-Facing Components

- `ReviewCard` - Displays a single review with author information, rating, content, and reaction buttons
- `ReviewGrid` - Displays a grid of review cards with filtering and pagination
- `ReviewForm` - Allows users to submit new reviews with validation

### Dashboard Components

- `DashboardReviewsPage` - Displays a list of the user's reviews with status indicators and action buttons
- `NewReviewPage` - Provides a form for creating new reviews
- `EditReviewPage` - Allows users to edit their pending reviews

## User Workflows

### Submitting a Review

1. User navigates to the reviews page
2. User clicks "Write a Review" button
3. User fills out the review form with their name, rating, and feedback
4. User submits the form
5. The review is saved with a "pending" status
6. Admin receives notification of new review for moderation

### Managing Reviews (User)

1. User logs in to their dashboard
2. User navigates to the "Reviews" section
3. User can view all their submitted reviews with status indicators
4. User can edit pending reviews
5. User can delete any of their reviews

### Reacting to Reviews

1. User views a review on the public reviews page
2. User clicks "Helpful" or "Not Helpful" button
3. The reaction is recorded and the count is updated
4. If the user has already reacted, their previous reaction is replaced

## Admin Workflows

### Moderating Reviews

1. Admin logs in to the admin dashboard
2. Admin navigates to the "Reviews" section
3. Admin can view all reviews with filtering by status
4. Admin can approve or reject pending reviews
5. Admin can edit or delete any review

## Implementation Details

### Review Status Workflow

Reviews follow a simple workflow:

1. **Pending** - Initial state when a review is submitted
2. **Approved** - Review has been approved by an admin and is publicly visible
3. **Rejected** - Review has been rejected by an admin and is not publicly visible

### Review Reactions

The reaction system allows for:

- Users can mark a review as "helpful" or "not helpful"
- Users can only have one reaction per review (changing reaction replaces the previous one)
- Reaction counts are displayed on the review card
- Users can remove their reaction

## Future Enhancements

- **Admin Review Queue** - Dedicated interface for admins to process pending reviews
- **Bulk Actions** - Ability to approve or reject multiple reviews at once
- **Review Analytics** - Dashboard with statistics about review ratings, trends, and user engagement
- **Review Responses** - Allow business owners to respond to reviews
- **Review Verification** - Verify that reviewers were actual customers
- **Review Images** - Allow users to upload images with their reviews
- **Review Sorting** - Sort reviews by rating, date, or helpfulness
- **Review Filtering** - Filter reviews by rating, date, or keywords

## Troubleshooting

### Common Issues

1. **Review Not Appearing** - Check that the review status is "approved"
2. **Cannot Edit Review** - Only pending reviews can be edited
3. **Reaction Not Registering** - Ensure user is logged in before reacting

### Error Handling

All API endpoints include proper error handling with appropriate status codes and error messages. Client-side components display toast notifications for success and error states. 