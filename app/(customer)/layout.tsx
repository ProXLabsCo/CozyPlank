import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-primary">
              CozyPlank
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="hover:text-primary transition">
                Home
              </Link>
              <Link href="/products" className="hover:text-primary transition">
                Products
              </Link>
              <Link href="/about" className="hover:text-primary transition">
                About
              </Link>
              <Link href="/contact" className="hover:text-primary transition">
                Contact
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Link href="/cart" className="hover:text-primary transition">
                Cart (0)
              </Link>
            </div>
          </div>

          {/* Category Bar */}
          {categories && categories.length > 0 && (
            <div className="flex gap-4 overflow-x-auto py-3 scrollbar-hide">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className="text-sm whitespace-nowrap px-4 py-2 rounded-full border border-border hover:bg-primary hover:text-primary-foreground transition"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">CozyPlank</h3>
              <p className="text-sm text-muted-foreground">
                Handcrafted wooden home decor made with love in Delhi.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="hover:text-primary transition">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary transition">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Contact</h3>
              <p className="text-sm text-muted-foreground">
                Email: hello@cozyplank.com<br />
                Phone: +91 98765 43210
              </p>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} CozyPlank. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}