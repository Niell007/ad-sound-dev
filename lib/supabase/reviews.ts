import { createClient } from "@/lib/supabase/client";
import type { PostgrestError } from "@supabase/supabase-js";
import type { Database } from "./types";

export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type ReviewInsert = Database["public"]["Tables"]["reviews"]["Insert"];
export type ReviewUpdate = Database["public"]["Tables"]["reviews"]["Update"];
export type ReviewReaction =
  Database["public"]["Tables"]["review_reactions"]["Row"];
export type ReviewReactionInsert =
  Database["public"]["Tables"]["review_reactions"]["Insert"];

// Custom error handler for Supabase errors
function handleDatabaseError(error: PostgrestError) {
  console.error("Database error:", error);
  return new Error(error.message);
}

/**
 * Fetch all reviews with optional filtering
 */
export async function getReviews({
  status = "approved",
  featured,
  limit = 10,
  offset = 0,
  orderBy = "created_at",
  ascending = false,
}: {
  status?: "pending" | "approved" | "rejected" | string;
  featured?: boolean;
  limit?: number;
  offset?: number;
  orderBy?: keyof Review;
  ascending?: boolean;
} = {}) {
  try {
    let query = createClient()
      .from("reviews")
      .select("*");

    if (status) {
      query = query.eq("status", status);
    }

    if (featured !== undefined) {
      query = query.eq("featured", featured);
    }

    query = query.order(orderBy, { ascending });

    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      throw handleDatabaseError(error);
    }

    return data as Review[];
  } catch (error) {
    console.error("Error getting reviews:", error);
    throw error;
  }
}

/**
 * Fetch a single review by ID
 */
export async function getReviewById(id: string) {
  try {
    const { data, error } = await createClient()
      .from("reviews")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw handleDatabaseError(error);
    }

    return data;
  } catch (error) {
    console.error(`Error getting review with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new review
 */
export async function createReview(review: ReviewInsert) {
  try {
    const { data, error } = await createClient()
      .from("reviews")
      .insert(review)
      .select()
      .single();

    if (error) {
      throw handleDatabaseError(error);
    }

    return data;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
}

/**
 * Update an existing review
 */
export async function updateReview(id: string, updates: ReviewUpdate) {
  try {
    const { data, error } = await createClient()
      .from("reviews")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw handleDatabaseError(error);
    }

    return data;
  } catch (error) {
    console.error(`Error updating review with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a review
 */
export async function deleteReview(id: string) {
  try {
    const { error } = await createClient()
      .from("reviews")
      .delete()
      .eq("id", id);

    if (error) {
      throw handleDatabaseError(error);
    }

    return true;
  } catch (error) {
    console.error(`Error deleting review with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Approve a review
 */
export async function approveReview(id: string) {
  return updateReview(id, { status: "approved" });
}

/**
 * Reject a review
 */
export async function rejectReview(id: string) {
  return updateReview(id, { status: "rejected" });
}

/**
 * Feature or unfeature a review
 */
export async function toggleFeatureReview(id: string, featured: boolean) {
  return updateReview(id, { is_featured: featured });
}

/**
 * Add a response to a review
 */
export async function respondToReview(id: string, response: string) {
  return updateReview(id, {
    response,
    response_date: new Date().toISOString(),
  });
}

/**
 * Get reactions for a specific review
 */
export async function getReviewReactions(reviewId: string) {
  try {
    const { data, error } = await createClient()
      .from("review_reactions")
      .select("*")
      .eq("review_id", reviewId);

    if (error) {
      throw handleDatabaseError(error);
    }

    const helpfulCount = data.filter((r: ReviewReaction) =>
      r.reaction_type === "helpful"
    ).length;
    const notHelpfulCount = data.filter((r: ReviewReaction) =>
      r.reaction_type === "not_helpful"
    ).length;

    return {
      reactions: data,
      counts: {
        helpful: helpfulCount,
        not_helpful: notHelpfulCount,
        total: data.length,
      },
    };
  } catch (error) {
    console.error(`Error getting reactions for review ${reviewId}:`, error);
    throw error;
  }
}

/**
 * Add a reaction to a review
 */
export async function addReviewReaction(reaction: ReviewReactionInsert) {
  try {
    const { data, error } = await createClient()
      .from("review_reactions")
      .insert(reaction)
      .select()
      .single();

    if (error) {
      throw handleDatabaseError(error);
    }

    return data;
  } catch (error) {
    console.error("Error adding review reaction:", error);
    throw error;
  }
}

/**
 * Remove a reaction from a review
 */
export async function removeReviewReaction(id: string) {
  try {
    const { error } = await createClient()
      .from("review_reactions")
      .delete()
      .eq("id", id);

    if (error) {
      throw handleDatabaseError(error);
    }

    return true;
  } catch (error) {
    console.error(`Error removing review reaction with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Get featured reviews for public display
 */
export async function getFeaturedReviews(limit = 6) {
  return getReviews({
    status: "approved",
    featured: true,
    limit,
    orderBy: "created_at",
    ascending: false,
  });
}

/**
 * Get recent approved reviews
 */
export async function getRecentReviews(limit = 10) {
  return getReviews({
    status: "approved",
    limit,
    orderBy: "created_at",
    ascending: false,
  });
}

/**
 * Get average rating from all approved reviews
 */
export async function getAverageRating() {
  const { data, error } = await createClient()
    .from("reviews")
    .select("rating")
    .eq("status", "approved");

  if (error) {
    throw handleDatabaseError(error);
  }

  if (!data || data.length === 0) {
    return 0;
  }

  const sum = data.reduce(
    (acc: number, review: { rating: number }) => acc + review.rating,
    0,
  );
  return sum / data.length;
}

/**
 * Get rating distribution (count of 1-5 star reviews)
 */
export async function getRatingDistribution() {
  const { data, error } = await createClient()
    .from("reviews")
    .select("rating")
    .eq("status", "approved");

  if (error) {
    throw handleDatabaseError(error);
  }

  const distribution: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  data?.forEach((review: { rating: 1 | 2 | 3 | 4 | 5 }) => {
    if (review.rating >= 1 && review.rating <= 5) {
      distribution[review.rating]++;
    }
  });

  return distribution;
}
