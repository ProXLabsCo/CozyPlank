import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/products/product-card";
import { Suspense } from "react";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  // Build query
  let query = supabase
    .from("products")
    .select("*, categories(*)")
    .eq("is_active", true);

  // Filter by category if provided
  if (params.category) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", params.category)
      .single();

    if (category) {
      query = query.eq("category_id", category.id);
    }
  }

  // Sort
  if (params.sort === "price-asc") {
    query = query.order("price", { ascending: true });
  } else if (params.sort === "price-desc") {
    query = query.order("price", { ascending: false });
  } else if (params.sort === "newest") {
    query = query.order("created_at", { ascending: false });
  } else {
    query = query.order("is_featured", { ascending: false }).order("created_at", { ascending: false });
  }

  const { data: products, error } = await query;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Our Products</h1>
        <p className="text-muted-foreground">
          Handcrafted wooden items for your home
        </p>
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center mb-8">
        <p className="text-sm text-muted-foreground">
          {products?.length || 0} products found
        </p>
        
        <select
          className="input w-auto"
          defaultValue={params.sort || ""}
        >
          <option value="">Sort by: Featured</option>
          <option value="newest">Sort by: Newest</option>
          <option value="price-asc">Sort by: Price (Low to High)</option>
          <option value="price-desc">Sort by: Price (High to Low)</option>
        </select>
      </div>

      {/* Products Grid */}
      {error ? (
        <div className="text-center py-12">
          <p className="text-error">Error loading products: {error.message}</p>
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found</p>
        </div>
      )}
    </div>
  );
}