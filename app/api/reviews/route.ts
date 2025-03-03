import { NextRequest, NextResponse } from 'next/server';
import { createReview, getReviews } from '@/lib/supabase/reviews';
import { supabase } from '@/lib/supabase/client';

// GET /api/reviews - Get all reviews with optional filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') as 'pending' | 'approved' | 'rejected' | undefined;
    const featured = searchParams.has('featured') ? searchParams.get('featured') === 'true' : undefined;
    const limit = searchParams.has('limit') ? parseInt(searchParams.get('limit') as string) : undefined;
    const offset = searchParams.has('offset') ? parseInt(searchParams.get('offset') as string) : undefined;
    const orderBy = searchParams.get('orderBy') as string | undefined;
    const ascending = searchParams.has('ascending') ? searchParams.get('ascending') === 'true' : undefined;

    const reviews = await getReviews({
      status,
      featured,
      limit,
      offset,
      orderBy: orderBy as any,
      ascending,
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error in GET /api/reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.author_name || !body.content || !body.rating) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate rating
    const rating = Number(body.rating);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Get user from Supabase auth if available
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    // Set default values
    const reviewData = {
      ...body,
      user_id: userId || null,
      status: 'pending', // All new reviews start as pending
      is_featured: false,
      source: body.source || 'website',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const review = await createReview(reviewData);

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/reviews:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
} 