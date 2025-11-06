'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

interface CreateProductInput {
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  category_id?: string;
  price: number;
  compare_at_price?: number;
  sku?: string;
  stock: number;
  images?: string[];
  is_featured?: boolean;
  is_active?: boolean;
  material?: string;
  dimensions_cm?: string;
}

export async function createProduct(input: CreateProductInput) {
  const supabase = await createClient();
  
  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  const { data, error } = await supabase
    .from('products')
    .insert({
      ...input,
      featured_image: input.images?.[0] || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/products');
  revalidatePath('/products');
  revalidatePath('/');

  return { success: true, product: data, error: null };
}

export async function updateProduct(productId: string, input: Partial<CreateProductInput>) {
  const supabase = await createClient();
  
  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  const updateData: any = { ...input };
  if (input.images && input.images.length > 0) {
    updateData.featured_image = input.images[0];
  }

  const { data, error } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', productId)
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath('/products');
  revalidatePath(`/products/${data.slug}`);
  revalidatePath('/');

  return { success: true, product: data, error: null };
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient();
  
  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  // Soft delete - just mark as inactive
  const { error } = await supabase
    .from('products')
    .update({ is_active: false })
    .eq('id', productId);

  if (error) {
    console.error('Error deleting product:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/products');
  revalidatePath('/products');
  revalidatePath('/');

  return { success: true, error: null };
}

export async function getAllProductsAdmin(filters?: {
  search?: string;
  category_id?: string;
  is_active?: boolean;
  limit?: number;
  offset?: number;
}) {
  const supabase = await createClient();

  let query = supabase
    .from('products')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `, { count: 'exact' })
    .order('created_at', { ascending: false });

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`);
  }

  if (filters?.category_id) {
    query = query.eq('category_id', filters.category_id);
  }

  if (filters?.is_active !== undefined) {
    query = query.eq('is_active', filters.is_active);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    return { products: [], count: 0, error: error.message };
  }

  return { products: data, count, error: null };
}

export async function updateProductStock(productId: string, stock: number) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('products')
    .update({ stock })
    .eq('id', productId);

  if (error) {
    console.error('Error updating stock:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/products');
  revalidatePath('/products');

  return { success: true, error: null };
}

export async function getProductStats() {
  const supabase = await createClient();

  // Get total products
  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  // Get low stock products
  const { count: lowStockProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .lte('stock', 5)
    .eq('is_active', true);

  // Get out of stock products
  const { count: outOfStockProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('stock', 0)
    .eq('is_active', true);

  // Get featured products
  const { count: featuredProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_featured', true)
    .eq('is_active', true);

  return {
    totalProducts: totalProducts || 0,
    lowStockProducts: lowStockProducts || 0,
    outOfStockProducts: outOfStockProducts || 0,
    featuredProducts: featuredProducts || 0,
  };
}