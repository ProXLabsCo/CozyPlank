import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function HomePage() {
  const supabase = await createClient();
  
  // Get featured products
  const { data: featuredProducts } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("is_featured", true)
    .limit(4);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-linear-to-b from-muted to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
            Handcrafted Wooden <span className="text-primary">Artistry</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
            Premium wooden home decor crafted with passion in Delhi. Each piece tells a story of tradition and quality.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/products">Shop Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground">Our handpicked bestsellers</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/products">View All</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Features */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🪵</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Premium Materials</h3>
              <p className="text-muted-foreground">
                Only the finest wood sourced from sustainable forests
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✋</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Handcrafted</h3>
              <p className="text-muted-foreground">
                Each piece is lovingly crafted by skilled artisans
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Free shipping across Delhi NCR, 3-5 days pan-India
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}