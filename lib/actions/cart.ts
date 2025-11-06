"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  customization?: Record<string, any>;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compare_at_price?: number;
    featured_image?: string;
    stock: number;
    sku?: string;
  };
}

/**
 * Get user's cart items from database
 */
export async function getCartItems(): Promise<CartItem[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("cart_items")
    .select(
      `
      id,
      product_id,
      quantity,
      customization,
      product:products (
        id,
        name,
        slug,
        price,
        compare_at_price,
        featured_image,
        stock,
        sku
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching cart:", error);
    return [];
  }

  return (data as any[]) || [];
}

/**
 * Add item to cart
 */
export async function addToCart(
  productId: string,
  quantity: number = 1,
  customization?: Record<string, any>
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Please sign in to add items to cart" };
  }

  // Check if product exists and has stock
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, stock, name")
    .eq("id", productId)
    .single();

  if (productError || !product) {
    return { success: false, error: "Product not found" };
  }

  if (product.stock < quantity) {
    return { success: false, error: "Insufficient stock" };
  }

  // Check if item already exists in cart
  const { data: existingItem } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single();

  if (existingItem) {
    // Update quantity
    const newQuantity = existingItem.quantity + quantity;

    if (newQuantity > product.stock) {
      return { success: false, error: "Cannot exceed available stock" };
    }

    const { error: updateError } = await supabase
      .from("cart_items")
      .update({
        quantity: newQuantity,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingItem.id);

    if (updateError) {
      return { success: false, error: "Failed to update cart" };
    }
  } else {
    // Insert new item
    const { error: insertError } = await supabase.from("cart_items").insert({
      user_id: user.id,
      product_id: productId,
      quantity,
      customization,
    });

    if (insertError) {
      return { success: false, error: "Failed to add to cart" };
    }
  }

  revalidatePath("/cart");
  return { success: true, message: `${product.name} added to cart` };
}

/**
 * Update cart item quantity
 */
export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  if (quantity <= 0) {
    return removeFromCart(cartItemId);
  }

  // Get cart item with product info
  const { data: cartItem, error: fetchError } = await supabase
    .from("cart_items")
    .select("product:products(stock)")
    .eq("id", cartItemId)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !cartItem) {
    return { success: false, error: "Cart item not found" };
  }

  const product = (cartItem as any).product;
  if (quantity > product.stock) {
    return { success: false, error: "Insufficient stock" };
  }

  const { error: updateError } = await supabase
    .from("cart_items")
    .update({
      quantity,
      updated_at: new Date().toISOString(),
    })
    .eq("id", cartItemId)
    .eq("user_id", user.id);

  if (updateError) {
    return { success: false, error: "Failed to update quantity" };
  }

  revalidatePath("/cart");
  return { success: true, message: "Cart updated" };
}

/**
 * Remove item from cart
 */
export async function removeFromCart(cartItemId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", cartItemId)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: "Failed to remove item" };
  }

  revalidatePath("/cart");
  return { success: true, message: "Item removed from cart" };
}

/**
 * Clear entire cart
 */
export async function clearCart() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: "Failed to clear cart" };
  }

  revalidatePath("/cart");
  return { success: true, message: "Cart cleared" };
}

/**
 * Get cart summary (total, item count)
 */
export async function getCartSummary() {
  const items = await getCartItems();

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    subtotal,
    itemCount,
  };
}

/**
 * Merge local cart with database cart (for when user logs in)
 */
export async function mergeCart(localCartItems: Array<{
  productId: string;
  quantity: number;
  customization?: Record<string, any>;
}>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || localCartItems.length === 0) {
    return { success: false, error: "No items to merge" };
  }

  try {
    for (const item of localCartItems) {
      await addToCart(item.productId, item.quantity, item.customization);
    }

    return { success: true, message: "Cart merged successfully" };
  } catch (error) {
    console.error("Error merging cart:", error);
    return { success: false, error: "Failed to merge cart" };
  }
}
