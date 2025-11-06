'use server';

import { createClient } from '@/lib/supabase/server';
import { unstable_cache } from 'next/cache';

export async function getProducts() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return { products: [], error: error.message };
  }

  return { products: data, error: null };
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return { product: null, error: error.message };
  }

  return { product: data, error: null };
}

export async function getFeaturedProducts(limit = 6) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .eq('is_featured', true)
    .eq('is_active', true)
    .limit(limit)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching featured products:', error);
    return { products: [], error: error.message };
  }

  return { products: data, error: null };
}

export async function getProductsByCategory(categoryId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products by category:', error);
    return { products: [], error: error.message };
  }

  return { products: data, error: null };
}

export async function searchProducts(query: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching products:', error);
    return { products: [], error: error.message };
  }

  return { products: data, error: null };
}

export async function getCategories() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return { categories: [], error: error.message };
  }

  return { categories: data, error: null };
}

// Cached version for better performance
export const getCachedProducts = unstable_cache(
  async () => getProducts(),
  ['products'],
  { revalidate: 60 } // Cache for 60 seconds
);

export const getCachedFeaturedProducts = unstable_cache(
  async (limit: number) => getFeaturedProducts(limit),
  ['featured-products'],
  { revalidate: 60 }
);