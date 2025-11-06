"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  order_id?: string;
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
  is_verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  user?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface ReviewInput {
  product_id: string;
  order_id?: string;
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
}

/**
 * Get reviews for a product
 */
export async function getProductReviews(productId: string, includeUnapproved: boolean = false) {
  const supabase = await createClient();

  let query = supabase
    .from("reviews")
    .select(
      `
      *,
      user:profiles!reviews_user_id_fkey (
        full_name,
        avatar_url
      )
    `
    )
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (!includeUnapproved) {
    query = query.eq("is_approved", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }

  return (data as any[]) || [];
}

/**
 * Get review statistics for a product
 */
export async function getProductReviewStats(productId: string) {
  const supabase = await createClient();

  const { data: reviews } = await supabase
    .from("reviews")
    .select("rating")
    .eq("product_id", productId)
    .eq("is_approved", true);

  if (!reviews || reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }

  const totalReviews = reviews.length;
  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

  const ratingDistribution = reviews.reduce(
    (dist, review) => {
      dist[review.rating] = (dist[review.rating] || 0) + 1;
      return dist;
    },
    { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>
  );

  return {
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews,
    ratingDistribution,
  };
}

/**
 * Create a new review
 */
export async function createReview(reviewData: ReviewInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Please sign in to write a review" };
  }

  // Validate rating
  if (reviewData.rating < 1 || reviewData.rating > 5) {
    return { success: false, error: "Rating must be between 1 and 5" };
  }

  // Check if user already reviewed this product
  const { data: existingReview } = await supabase
    .from("reviews")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", reviewData.product_id)
    .single();

  if (existingReview) {
    return { success: false, error: "You have already reviewed this product" };
  }

  // Check if this is a verified purchase
  let isVerifiedPurchase = false;
  if (reviewData.order_id) {
    const { data: orderItem } = await supabase
      .from("order_items")
      .select("id, order:orders!inner(user_id, order_status)")
      .eq("order_id", reviewData.order_id)
      .eq("product_id", reviewData.product_id)
      .single();

    if (orderItem) {
      const order = (orderItem as any).order;
      isVerifiedPurchase =
        order.user_id === user.id &&
        (order.order_status === "delivered" || order.order_status === "completed");
    }
  }

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      user_id: user.id,
      product_id: reviewData.product_id,
      order_id: reviewData.order_id,
      rating: reviewData.rating,
      title: reviewData.title,
      comment: reviewData.comment,
      images: reviewData.images || [],
      is_verified_purchase: isVerifiedPurchase,
      is_approved: false, // Reviews need admin approval
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating review:", error);
    return { success: false, error: "Failed to submit review" };
  }

  revalidatePath(`/products/[slug]`, "page");
  return {
    success: true,
    data,
    message: "Review submitted successfully. It will be published after approval.",
  };
}

/**
 * Update a review
 */
export async function updateReview(reviewId: string, reviewData: Partial<ReviewInput>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Validate rating if provided
  if (reviewData.rating && (reviewData.rating < 1 || reviewData.rating > 5)) {
    return { success: false, error: "Rating must be between 1 and 5" };
  }

  const { data, error } = await supabase
    .from("reviews")
    .update({
      ...reviewData,
      updated_at: new Date().toISOString(),
      is_approved: false, // Reset approval status after edit
    })
    .eq("id", reviewId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating review:", error);
    return { success: false, error: "Failed to update review" };
  }

  revalidatePath(`/products/[slug]`, "page");
  return { success: true, data, message: "Review updated successfully" };
}

/**
 * Delete a review
 */
export async function deleteReview(reviewId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting review:", error);
    return { success: false, error: "Failed to delete review" };
  }

  revalidatePath(`/products/[slug]`, "page");
  return { success: true, message: "Review deleted successfully" };
}

/**
 * Get user's reviews
 */
export async function getUserReviews() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("reviews")
    .select(
      `
      *,
      product:products (
        id,
        name,
        slug,
        featured_image
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user reviews:", error);
    return [];
  }

  return (data as any[]) || [];
}

/**
 * Check if user can review a product (has purchased it)
 */
export async function canReviewProduct(productId: string): Promise<{
  canReview: boolean;
  orderId?: string;
  reason?: string;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { canReview: false, reason: "Please sign in to write a review" };
  }

  // Check if already reviewed
  const { data: existingReview } = await supabase
    .from("reviews")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single();

  if (existingReview) {
    return { canReview: false, reason: "You have already reviewed this product" };
  }

  // Check if purchased
  const { data: orderItem } = await supabase
    .from("order_items")
    .select("order_id, order:orders!inner(user_id, order_status)")
    .eq("product_id", productId)
    .single();

  if (!orderItem) {
    return { canReview: true, reason: "You can write a review for this product" };
  }

  const order = (orderItem as any).order;
  if (
    order.user_id === user.id &&
    (order.order_status === "delivered" || order.order_status === "completed")
  ) {
    return { canReview: true, orderId: orderItem.order_id };
  }

  return { canReview: true };
}

/**
 * Admin: Approve a review
 */
export async function approveReview(reviewId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("reviews")
    .update({
      is_approved: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", reviewId);

  if (error) {
    return { success: false, error: "Failed to approve review" };
  }

  revalidatePath("/admin/reviews");
  revalidatePath(`/products/[slug]`, "page");
  return { success: true, message: "Review approved" };
}
