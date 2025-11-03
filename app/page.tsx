import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  
  // Test database connection
  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .limit(5);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center animate-fadeIn">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
          Welcome to <span className="text-primary">CozyPlank</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 text-balance">
          Handcrafted Wooden Home Decor | Artisan Quality Made in Delhi
        </p>
        
        {/* Test database connection */}
        <div className="mt-12 p-6 bg-muted rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Categories</h2>
          {error ? (
            <p className="text-error">Error: {error.message}</p>
          ) : (
            <ul className="space-y-2">
              {categories?.map((category) => (
                <li key={category.id} className="text-lg">
                  {category.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}