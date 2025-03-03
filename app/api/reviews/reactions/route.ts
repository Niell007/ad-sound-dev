import { NextRequest, NextResponse } from 'next/server';
import { addReviewReaction, getReviewReactions } from '@/lib/supabase/reviews';
import { supabase } from '@/lib/supabase/client';

// GET /api/reviews/reactions?reviewId=123 - Get reactions for a review
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reviewId = searchParams.get('reviewId');
    
    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }
    
    const reactions = await getReviewReactions(reviewId);
    return NextResponse.json(reactions);
  } catch (error) {
    console.error('Error in GET /api/reviews/reactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch review reactions' },
      { status: 500 }
    );
  }
}

// POST /api/reviews/reactions - Add a reaction to a review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.review_id || !body.reaction_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate reaction type
    if (!['helpful', 'not_helpful'].includes(body.reaction_type)) {
      return NextResponse.json(
        { error: 'Invalid reaction type' },
        { status: 400 }
      );
    }
    
    // Get user from Supabase auth if available
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    // Get IP address for anonymous users
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    
    // Create reaction data
    const reactionData = {
      review_id: body.review_id,
      user_id: userId || null,
      reaction_type: body.reaction_type,
      ip_address: userId ? null : ipAddress, // Only store IP if no user ID
    };
    
    const reaction = await addReviewReaction(reactionData);
    
    return NextResponse.json(reaction, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/reviews/reactions:', error);
    
    // Handle duplicate reactions
    if (error.code === '23505') { // PostgreSQL unique violation code
      return NextResponse.json(
        { error: 'You have already reacted to this review' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to add review reaction' },
      { status: 500 }
    );
  }
} 