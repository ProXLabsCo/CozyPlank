import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, Award, Users, Leaf } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 to-neutral-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">About CozyPlank</h1>
            <p className="text-xl text-neutral-700 leading-relaxed">
              Crafting premium wooden home decor and furniture with passion, 
              precision, and a commitment to sustainable practices.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <div className="space-y-4 text-neutral-700 leading-relaxed">
                  <p>
                    CozyPlank was born from a simple belief: every home deserves beautiful, 
                    handcrafted wooden pieces that tell a story. What started as a small 
                    family workshop has grown into a passionate team dedicated to bringing 
                    warmth and character to homes across India.
                  </p>
                  <p>
                    With decades of woodworking expertise passed down through generations, 
                    we combine traditional craftsmanship with modern design sensibilities. 
                    Each piece we create is more than just furniture—it's a work of art 
                    meant to be cherished for years to come.
                  </p>
                  <p>
                    Based in Delhi, we work closely with local artisans and source our 
                    materials responsibly, ensuring that every product not only looks 
                    beautiful but also supports sustainable practices and local communities.
                  </p>
                </div>
              </div>
              <div className="relative h-96 lg:h-full min-h-[400px] rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800"
                  alt="Woodworking craftsmanship"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                These principles guide everything we do, from sourcing materials 
                to delivering the final product to your doorstep.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-amber-700" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Craftsmanship</h3>
                <p className="text-neutral-600">
                  Every piece is handcrafted with attention to detail and a passion 
                  for quality that shows in the final product.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-amber-700" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Sustainability</h3>
                <p className="text-neutral-600">
                  We source responsibly and minimize waste, ensuring our beautiful 
                  products don't come at the cost of the environment.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-amber-700" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Quality</h3>
                <p className="text-neutral-600">
                  Premium materials and expert craftsmanship combine to create 
                  products that stand the test of time.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-amber-700" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Community</h3>
                <p className="text-neutral-600">
                  We support local artisans and believe in building lasting 
                  relationships with our customers and partners.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How We Work</h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                From raw wood to finished masterpiece, every step is carefully 
                executed to ensure the highest quality.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200">
                <div className="text-4xl font-bold text-amber-700 mb-4">01</div>
                <h3 className="text-xl font-semibold mb-3">Design & Planning</h3>
                <p className="text-neutral-600">
                  We carefully design each piece, considering both aesthetics and 
                  functionality to create products that enhance your living space.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200">
                <div className="text-4xl font-bold text-amber-700 mb-4">02</div>
                <h3 className="text-xl font-semibold mb-3">Crafting</h3>
                <p className="text-neutral-600">
                  Skilled artisans handcraft each piece using traditional techniques 
                  combined with modern tools for precision and quality.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200">
                <div className="text-4xl font-bold text-amber-700 mb-4">03</div>
                <h3 className="text-xl font-semibold mb-3">Quality Check</h3>
                <p className="text-neutral-600">
                  Every product undergoes rigorous quality inspection before it's 
                  carefully packaged and shipped to your home.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-amber-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">1000+</div>
                <div className="text-amber-100">Happy Customers</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-amber-100">Products Crafted</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">15+</div>
                <div className="text-amber-100">Years Experience</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="text-amber-100">Handmade Quality</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Space?</h2>
            <p className="text-neutral-600 mb-8 text-lg">
              Explore our collection of handcrafted wooden furniture and decor pieces, 
              each designed to bring warmth and character to your home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="gap-2">
                  Browse Products
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}