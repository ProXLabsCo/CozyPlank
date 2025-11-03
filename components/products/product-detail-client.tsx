"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "./product-card";
import { useCart } from "@/lib/context/cart-context";
import {
  ShoppingCart,
  Heart,
  Truck,
  Shield,
  RefreshCcw,
  Plus,
  Minus,
  ImageIcon,
  Check,
} from "lucide-react";

interface ProductDetailClientProps {
  product: Product & { categories?: any };
  relatedProducts: Product[];
  reviews: any[];
}

export function ProductDetailClient({
  product,
  relatedProducts,
  reviews,
}: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(
    product.featured_image || product.images[0] || ""
  );
  const [imageError, setImageError] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const { addItem } = useCart();

  const hasDiscount =
    product.compare_at_price && product.compare_at_price > product.price;
  const discountPercent = hasDiscount
    ? calculateDiscount(product.compare_at_price!, product.price)
    : 0;

  const allImages = product.featured_image
    ? [product.featured_image, ...product.images]
    : product.images;

  const handleQuantityChange = (type: "increase" | "decrease") => {
    if (type === "increase" && quantity < product.stock) {
      setQuantity(quantity + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-foreground">
          Products
        </Link>
        {product.categories && (
          <>
            <span>/</span>
            <Link
              href={`/products?category=${product.categories.slug}`}
              className="hover:text-foreground"
            >
              {product.categories.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      {/* Product Details */}
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16">
        {/* Images */}
        <div>
          {/* Main Image */}
          <div className="relative aspect-square mb-4 rounded-lg overflow-hidden bg-muted">
            {selectedImage && !imageError ? (
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                className="object-cover"
                priority
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-muted text-muted-foreground">
                <ImageIcon className="w-24 h-24 mb-4" />
                <span>No Image Available</span>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.is_featured && <Badge variant="warning">Featured</Badge>}
              {hasDiscount && (
                <Badge variant="error">{discountPercent}% OFF</Badge>
              )}
              {product.stock === 0 && <Badge>Out of Stock</Badge>}
            </div>
          </div>

          {/* Thumbnail Images */}
          {allImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {allImages.slice(0, 4).map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedImage(image);
                    setImageError(false);
                  }}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${
                    selectedImage === image
                      ? "border-primary"
                      : "border-transparent hover:border-border"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {product.name}
          </h1>

          {product.short_description && (
            <p className="text-lg text-muted-foreground mb-4">
              {product.short_description}
            </p>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.compare_at_price!)}
                </span>
                <Badge variant="error">Save {discountPercent}%</Badge>
              </>
            )}
          </div>

          {/* Stock Status */}
          {product.stock > 0 ? (
            <p className="text-success mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-success rounded-full"></span>
              In Stock ({product.stock} available)
            </p>
          ) : (
            <p className="text-error mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-error rounded-full"></span>
              Out of Stock
            </p>
          )}

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange("decrease")}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-md border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val >= 1 && val <= product.stock) {
                      setQuantity(val);
                    }
                  }}
                  className="w-16 h-10 text-center border border-border rounded-md"
                  min={1}
                  max={product.stock}
                />
                <button
                  onClick={() => handleQuantityChange("increase")}
                  disabled={quantity >= product.stock}
                  className="w-10 h-10 rounded-md border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mb-8">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {addedToCart ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
            <Button size="lg" variant="outline">
              <Heart className="w-5 h-5" />
            </Button>
          </div>

          {/* Product Details */}
          <div className="border-t border-border pt-6 space-y-3">
            {product.sku && (
              <div className="flex gap-2">
                <span className="text-muted-foreground">SKU:</span>
                <span className="font-medium">{product.sku}</span>
              </div>
            )}
            {product.material && (
              <div className="flex gap-2">
                <span className="text-muted-foreground">Material:</span>
                <span className="font-medium">{product.material}</span>
              </div>
            )}
            {product.finish && (
              <div className="flex gap-2">
                <span className="text-muted-foreground">Finish:</span>
                <span className="font-medium">{product.finish}</span>
              </div>
            )}
            {product.dimensions_cm && (
              <div className="flex gap-2">
                <span className="text-muted-foreground">Dimensions:</span>
                <span className="font-medium">{product.dimensions_cm} cm</span>
              </div>
            )}
            {product.categories && (
              <div className="flex gap-2">
                <span className="text-muted-foreground">Category:</span>
                <Link
                  href={`/products?category=${product.categories.slug}`}
                  className="font-medium hover:text-primary"
                >
                  {product.categories.name}
                </Link>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-border">
            <div className="flex items-center gap-3">
              <Truck className="w-6 h-6 text-primary" />
              <div>
                <p className="font-medium text-sm">Free Shipping</p>
                <p className="text-xs text-muted-foreground">Delhi NCR</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              <div>
                <p className="font-medium text-sm">Quality Assured</p>
                <p className="text-xs text-muted-foreground">Handcrafted</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RefreshCcw className="w-6 h-6 text-primary" />
              <div>
                <p className="font-medium text-sm">7 Day Returns</p>
                <p className="text-xs text-muted-foreground">Easy process</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Care Instructions */}
      <div className="mb-16">
        <div className="border-b border-border mb-6">
          <button className="px-6 py-3 border-b-2 border-primary font-medium">
            Description
          </button>
        </div>
        <div className="prose prose-slate max-w-none">
          <p className="text-muted-foreground leading-relaxed">
            {product.description || product.short_description}
          </p>
          {product.care_instructions && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Care Instructions</h3>
              <p className="text-muted-foreground">{product.care_instructions}</p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}