import { NextRequest, NextResponse } from 'next/server';
import { getReviewById, updateReview, deleteReview, respondToReview, approveReview, rejectReview, toggleFeatureReview } from '@/lib/supabase/reviews';
import { supabase } from '@/lib/supabase/client';

// GET /api/reviews/[id] - Get a specific review
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const review = await getReviewById(params.id);
    return NextResponse.json(review);
  } catch (error) {
    console.error(`Error in GET /api/reviews/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch review' },
      { status: 500 }
    );
  }
}

// PATCH /api/reviews/[id] - Update a review
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Get the user from Supabase auth
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    
    // Check if user is admin (you'll need to implement this check based on your auth setup)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user?.id)
      .single();
    
    const isAdmin = profile?.role === 'admin';
    
    // Handle special actions
    if (body.action) {
      switch (body.action) {
        case 'approve':
          if (!isAdmin) {
            return NextResponse.json(
              { error: 'Unauthorized' },
              { status: 403 }
            );
          }
          const approvedReview = await approveReview(params.id);
          return NextResponse.json(approvedReview);
        
        case 'reject':
          if (!isAdmin) {
            return NextResponse.json(
              { error: 'Unauthorized' },
              { status: 403 }
            );
          }
          const rejectedReview = await rejectReview(params.id);
          return NextResponse.json(rejectedReview);
        
        case 'feature':
          if (!isAdmin) {
            return NextResponse.json(
              { error: 'Unauthorized' },
              { status: 403 }
            );
          }
          const featured = body.featured === true;
          const featuredReview = await toggleFeatureReview(params.id, featured);
          return NextResponse.json(featuredReview);
        
        case 'respond':
          if (!isAdmin) {
            return NextResponse.json(
              { error: 'Unauthorized' },
              { status: 403 }
            );
          }
          if (!body.response) {
            return NextResponse.json(
              { error: 'Response text is required' },
              { status: 400 }
            );
          }
          const reviewWithResponse = await respondToReview(params.id, body.response);
          return NextResponse.json(reviewWithResponse);
      }
    }
    
    // Regular update
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    const updatedReview = await updateReview(params.id, body);
    return NextResponse.json(updatedReview);
  } catch (error) {
    console.error(`Error in PATCH /api/reviews/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    );
  }
}

// DELETE /api/reviews/[id] - Delete a review
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the user from Supabase auth
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    
    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user?.id)
      .single();
    
    const isAdmin = profile?.role === 'admin';
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    await deleteReview(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error in DELETE /api/reviews/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    );
  }
} 