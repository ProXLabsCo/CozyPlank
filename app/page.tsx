import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Package, Sparkles, Truck, Shield, Heart } from "lucide-react";

export default async function HomePage() {
  const supabase = await createClient();
  
  // Get featured products
  const { data: featuredProducts } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("is_featured", true)
    .limit(8);

  // Get categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order")
    .limit(6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-secondary via-background to-secondary/30 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 animate-fadeIn">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Premium Handcrafted Furniture</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance leading-tight animate-slideUp">
              Bring <span className="text-primary">Warmth</span> & <br />
              <span className="text-accent">Character</span> to Your Home
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto text-balance leading-relaxed animate-slideUp" style={{ animationDelay: "0.1s" }}>
              Discover exquisite wooden furniture and decor, handcrafted with passion by skilled artisans in Delhi
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slideUp" style={{ animationDelay: "0.2s" }}>
              <Button asChild size="lg" className="text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <Link href="/products" className="flex items-center gap-2">
                  Shop Collection
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300">
                <Link href="/about">Our Story</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-12 text-sm text-muted-foreground animate-fadeIn" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent" />
                <span>100% Authentic</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-accent" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-accent" />
                <span>Handcrafted with Care</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16 fill-background" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
          </svg>
        </div>
      </section>

      {/* Categories Section */}
      {categories && categories.length > 0 && (
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Shop by Category</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our curated collections of handcrafted wooden furniture and decor
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-muted to-muted/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {category.image_url && (
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-white/80 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="bg-muted/30 py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-3">Featured Collection</h2>
                <p className="text-lg text-muted-foreground">
                  Our handpicked bestsellers, loved by customers
                </p>
              </div>
              <Button asChild variant="outline" size="lg" className="border-2">
                <Link href="/products" className="flex items-center gap-2">
                  View All Products
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose CozyPlank</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Quality craftsmanship meets exceptional service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center group hover:-translate-y-2 transition-transform duration-300">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-shadow">
              <Package className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Premium Materials</h3>
            <p className="text-muted-foreground leading-relaxed">
              Only the finest wood sourced from sustainable forests, ensuring durability and beauty
            </p>
          </div>

          <div className="text-center group hover:-translate-y-2 transition-transform duration-300">
            <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-shadow">
              <Sparkles className="w-10 h-10 text-accent" />
            </div>
            <h3 className="text-xl font-bold mb-3">Handcrafted</h3>
            <p className="text-muted-foreground leading-relaxed">
              Each piece is lovingly crafted by skilled artisans with decades of experience
            </p>
          </div>

          <div className="text-center group hover:-translate-y-2 transition-transform duration-300">
            <div className="w-20 h-20 bg-gradient-to-br from-info/20 to-info/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-shadow">
              <Truck className="w-10 h-10 text-info" />
            </div>
            <h3 className="text-xl font-bold mb-3">Fast Delivery</h3>
            <p className="text-muted-foreground leading-relaxed">
              Free shipping across Delhi NCR, delivered within 3-5 days pan-India
            </p>
          </div>

          <div className="text-center group hover:-translate-y-2 transition-transform duration-300">
            <div className="w-20 h-20 bg-gradient-to-br from-success/20 to-success/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-shadow">
              <Shield className="w-10 h-10 text-success" />
            </div>
            <h3 className="text-xl font-bold mb-3">Quality Guarantee</h3>
            <p className="text-muted-foreground leading-relaxed">
              Every product comes with our quality guarantee and dedicated customer support
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
            Discover the perfect piece to add warmth and character to your home
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-10 py-6 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1">
            <Link href="/products" className="flex items-center gap-2">
              Explore Collection
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
