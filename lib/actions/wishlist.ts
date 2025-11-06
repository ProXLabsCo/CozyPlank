"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface WishlistItem {
  id: string;
  product_id: string;
  created_at: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compare_at_price?: number;
    featured_image?: string;
    stock: number;
    is_active: boolean;
  };
}

/**
 * Get user's wishlist items
 */
export async function getWishlist(): Promise<WishlistItem[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("wishlists")
    .select(
      `
      id,
      product_id,
      created_at,
      product:products (
        id,
        name,
        slug,
        price,
        compare_at_price,
        featured_image,
        stock,
        is_active
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching wishlist:", error);
    return [];
  }

  return (data as any[]) || [];
}

/**
 * Add product to wishlist
 */
export async function addToWishlist(productId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Please sign in to add to wishlist" };
  }

  // Check if already in wishlist
  const { data: existing } = await supabase
    .from("wishlists")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single();

  if (existing) {
    return { success: false, error: "Already in wishlist" };
  }

  // Check if product exists
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, name")
    .eq("id", productId)
    .eq("is_active", true)
    .single();

  if (productError || !product) {
    return { success: false, error: "Product not found" };
  }

  const { error } = await supabase.from("wishlists").insert({
    user_id: user.id,
    product_id: productId,
  });

  if (error) {
    return { success: false, error: "Failed to add to wishlist" };
  }

  revalidatePath("/");
  return { success: true, message: `${product.name} added to wishlist` };
}

/**
 * Remove product from wishlist
 */
export async function removeFromWishlist(wishlistItemId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("wishlists")
    .delete()
    .eq("id", wishlistItemId)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: "Failed to remove from wishlist" };
  }

  revalidatePath("/");
  return { success: true, message: "Removed from wishlist" };
}

/**
 * Check if product is in wishlist
 */
export async function isInWishlist(productId: string): Promise<boolean> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { data } = await supabase
    .from("wishlists")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single();

  return !!data;
}

/**
 * Toggle product in wishlist
 */
export async function toggleWishlist(productId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Please sign in to add to wishlist" };
  }

  // Check if already in wishlist
  const { data: existing } = await supabase
    .from("wishlists")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single();

  if (existing) {
    // Remove from wishlist
    const { error } = await supabase
      .from("wishlists")
      .delete()
      .eq("id", existing.id);

    if (error) {
      return { success: false, error: "Failed to remove from wishlist" };
    }

    revalidatePath("/");
    return { success: true, message: "Removed from wishlist", inWishlist: false };
  } else {
    // Add to wishlist
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, name")
      .eq("id", productId)
      .eq("is_active", true)
      .single();

    if (productError || !product) {
      return { success: false, error: "Product not found" };
    }

    const { error } = await supabase.from("wishlists").insert({
      user_id: user.id,
      product_id: productId,
    });

    if (error) {
      return { success: false, error: "Failed to add to wishlist" };
    }

    revalidatePath("/");
    return { success: true, message: `${product.name} added to wishlist`, inWishlist: true };
  }
}

/**
 * Get wishlist count
 */
export async function getWishlistCount(): Promise<number> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return 0;
  }

  const { count, error } = await supabase
    .from("wishlists")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (error) {
    console.error("Error getting wishlist count:", error);
    return 0;
  }

  return count || 0;
}
