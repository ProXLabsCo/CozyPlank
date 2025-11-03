"use client";

import { useCart } from "@/lib/context/cart-context";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export function CartButton() {
  const { itemCount } = useCart();

  return (
    <Link
      href="/cart"
      className="relative hover:text-primary transition flex items-center gap-2"
    >
      <ShoppingCart className="w-5 h-5" />
      <span className="hidden sm:inline">Cart</span>
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Link>
  );
}