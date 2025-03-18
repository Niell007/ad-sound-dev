import { NextRequest, NextResponse } from "next/server";
import {
  deleteReview,
  getReviewById,
  updateReview,
} from "@/lib/supabase/reviews";
import { supabase } from "@/lib/supabase/client";
import type { Review } from "@/lib/types/reviews";

// GET /api/reviews/[id] - Get a specific review
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const review = await getReviewById(params.id);
    return NextResponse.json(review);
  } catch (error) {
    console.error(`Error in GET /api/reviews/${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch review" },
      { status: 500 },
    );
  }
}

// PATCH /api/reviews/[id] - Update a review
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const { data: { session } } = await supabase.auth.getSession();

    // Verify review exists and belongs to user
    const existingReview = await getReviewById(params.id);
    if (!existingReview) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 },
      );
    }

    if (existingReview.user_id !== session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 },
      );
    }

    if (existingReview.status === "approved") {
      return NextResponse.json(
        { error: "Cannot edit approved reviews" },
        { status: 400 },
      );
    }

    const review = await updateReview(params.id, body);
    return NextResponse.json(review);
  } catch (error) {
    console.error(`Error in PATCH /api/reviews/${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 },
    );
  }
}

// DELETE /api/reviews/[id] - Delete a review
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Get user session
    const { data: { session } } = await supabase.auth.getSession();

    // Verify review exists and belongs to user
    const review = await getReviewById(params.id);
    if (!review) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 },
      );
    }

    if (review.user_id !== session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 },
      );
    }

    await deleteReview(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error in DELETE /api/reviews/${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 },
    );
  }
}
