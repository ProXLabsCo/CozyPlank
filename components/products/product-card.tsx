"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, ImageIcon } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const discountPercent = hasDiscount
    ? calculateDiscount(product.compare_at_price!, product.price)
    : 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-background border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.featured_image && !imageError ? (
          <Image
            src={product.featured_image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-muted text-muted-foreground">
            <ImageIcon className="w-16 h-16 mb-2" />
            <span className="text-sm">No Image</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {product.is_featured && (
            <Badge variant="warning">Featured</Badge>
          )}
          {hasDiscount && (
            <Badge variant="error">{discountPercent}% OFF</Badge>
          )}
          {product.stock === 0 && (
            <Badge variant="default">Out of Stock</Badge>
          )}
        </div>

        {/* Quick Add to Cart (shown on hover) */}
        {product.stock > 0 && (
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.preventDefault();
                // We'll implement this later
                console.log("Add to cart:", product.id);
              }}
              className="bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 transition"
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-2">
          {product.name}
        </h3>
        
        {product.short_description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.short_description}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.compare_at_price!)}
            </span>
          )}
        </div>

        {/* Stock indicator */}
        {product.stock > 0 && product.stock <= product.low_stock_threshold && (
          <p className="text-xs text-warning mt-2">
            Only {product.stock} left in stock
          </p>
        )}
      </div>
    </Link>
  );
}