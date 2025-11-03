import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/products/product-detail-client";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("slug", slug)
    .single();

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.name,
    description: product.short_description || product.description,
    openGraph: {
      title: product.name,
      description: product.short_description || product.description || "",
      images: product.featured_image ? [product.featured_image] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Get product details
  const { data: product, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !product) {
    notFound();
  }

  // Get related products (same category)
  const { data: relatedProducts } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", product.category_id)
    .eq("is_active", true)
    .neq("id", product.id)
    .limit(4);

  // Get reviews (we'll implement this later)
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, profiles(*)")
    .eq("product_id", product.id)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts || []}
      reviews={reviews || []}
    />
  );
}