"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Eye, ImageIcon, Star } from "lucide-react";
import { useState, useTransition } from "react";
import { addToCart } from "@/lib/actions/cart";
import { toggleWishlist } from "@/lib/actions/wishlist";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  inWishlist?: boolean;
  showQuickView?: boolean;
}

export function ProductCard({ product, inWishlist = false, showQuickView = true }: ProductCardProps) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(inWishlist);
  const [isPending, startTransition] = useTransition();
  
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const discountPercent = hasDiscount
    ? calculateDiscount(product.compare_at_price!, product.price)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock === 0) {
      toast.error("Product is out of stock");
      return;
    }

    startTransition(async () => {
      const result = await addToCart(product.id, 1);
      if (result.success) {
        toast.success(result.message || "Added to cart");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to add to cart");
      }
    });
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      const result = await toggleWishlist(product.id);
      if (result.success) {
        setIsInWishlist(result.inWishlist || false);
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update wishlist");
      }
    });
  };

  const averageRating = 4.5; // TODO: Calculate from reviews
  const reviewCount = 12; // TODO: Get from reviews

  return (
    <div className="group relative bg-background border border-border rounded-xl overflow-hidden hover:shadow-2xl hover:border-primary/30 transition-all duration-500 flex flex-col">
      {/* Image Container */}
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.featured_image && !imageError ? (
            <Image
              src={product.featured_image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-muted to-muted/50 text-muted-foreground">
              <ImageIcon className="w-16 h-16 mb-2 opacity-40" />
              <span className="text-sm font-medium">No Image</span>
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {product.is_featured && (
              <Badge className="bg-accent text-accent-foreground shadow-lg border-0">
                ⭐ Featured
              </Badge>
            )}
            {hasDiscount && (
              <Badge className="bg-error text-white shadow-lg border-0">
                {discountPercent}% OFF
              </Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="default" className="bg-foreground/90 text-background shadow-lg">
                Out of Stock
              </Badge>
            )}
            {product.stock > 0 && product.stock <= product.low_stock_threshold && (
              <Badge className="bg-warning text-white shadow-lg border-0">
                Low Stock
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
            <button
              onClick={handleToggleWishlist}
              disabled={isPending}
              className={`p-2.5 rounded-full backdrop-blur-sm border transition-all duration-300 shadow-lg hover:scale-110 ${
                isInWishlist
                  ? "bg-error text-white border-error hover:bg-error/90"
                  : "bg-white/90 text-foreground border-white/20 hover:bg-white hover:text-error"
              }`}
              aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`w-5 h-5 ${isInWishlist ? "fill-current" : ""}`} />
            </button>

            {showQuickView && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // TODO: Implement quick view modal
                  router.push(`/products/${product.slug}`);
                }}
                className="p-2.5 rounded-full bg-white/90 backdrop-blur-sm text-foreground border border-white/20 transition-all duration-300 shadow-lg hover:scale-110 hover:bg-white"
                aria-label="Quick view"
              >
                <Eye className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Quick Add to Cart (bottom) */}
          {product.stock > 0 && (
            <div className="absolute bottom-4 left-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
              <button
                onClick={handleAddToCart}
                disabled={isPending}
                className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
              >
                <ShoppingCart className="w-5 h-5" />
                {isPending ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-5 flex-1 flex flex-col">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {reviewCount > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(averageRating)
                      ? "fill-warning text-warning"
                      : "fill-muted text-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {averageRating} ({reviewCount})
            </span>
          </div>
        )}

        {product.short_description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">
            {product.short_description}
          </p>
        )}

        {/* Material Badge */}
        {product.material && (
          <div className="mb-3">
            <span className="inline-block text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-md">
              {product.material}
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-base text-muted-foreground line-through">
                {formatPrice(product.compare_at_price!)}
              </span>
            )}
          </div>

          {/* Stock indicator */}
          {product.stock > 0 && product.stock <= product.low_stock_threshold && (
            <p className="text-xs text-warning font-medium flex items-center gap-1">
              <span className="w-2 h-2 bg-warning rounded-full animate-pulse" />
              Only {product.stock} left in stock
            </p>
          )}

          {product.stock === 0 && (
            <p className="text-xs text-error font-medium">Out of Stock</p>
          )}
        </div>
      </div>
    </div>
  );
}
