import { NextRequest, NextResponse } from "next/server";
import { createReview, deleteReview, getReviews } from "@/lib/supabase/reviews";
import { supabase } from "@/lib/supabase/client";

// GET /api/reviews - Get all reviews with optional filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reviews = await getReviews({
      status: searchParams.get("status") as
        | "pending"
        | "approved"
        | "rejected"
        | undefined,
      featured: searchParams.has("featured")
        ? searchParams.get("featured") === "true"
        : undefined,
      limit: searchParams.has("limit")
        ? parseInt(searchParams.get("limit")!)
        : undefined,
      offset: searchParams.has("offset")
        ? parseInt(searchParams.get("offset")!)
        : undefined,
      orderBy: searchParams.get("orderBy") as keyof Review | undefined,
      ascending: searchParams.has("ascending")
        ? searchParams.get("ascending") === "true"
        : undefined,
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error in GET /api/reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data: { session } } = await supabase.auth.getSession();

    const review = await createReview({
      user_id: session?.user?.id || null,
      author_name: body.author_name,
      rating: body.rating,
      content: body.content,
      event_type: body.event_type || null,
      event_date: body.event_date || null,
      status: "pending",
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
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
    await deleteReview(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 },
    );
  }
}
