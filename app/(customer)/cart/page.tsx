'use client';

import { useCart } from '@/lib/context/cart-context';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Format price helper
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

export default function CartPage() {
  const { items, updateQuantity, removeItem, total, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-16">
            <ShoppingBag className="w-24 h-24 mx-auto text-neutral-300 mb-6" />
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-neutral-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link href="/products">
              <Button size="lg" className="gap-2">
                Start Shopping
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Shopping Cart</h1>
            <p className="text-neutral-600">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="relative w-32 h-32 flex-shrink-0 bg-neutral-100 rounded-lg overflow-hidden">
                      <Image
                        src={item.product.images?.[0] || '/placeholder.jpg'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-4 mb-2">
                        <div>
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="font-semibold text-lg hover:text-amber-700 transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          {item.product.category && (
                            <p className="text-sm text-neutral-500 mt-1">
                              Category: {item.product.category}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-neutral-400 hover:text-red-600 transition-colors p-2 -mt-2 -mr-2"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {item.product.description && (
                        <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                          {item.product.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-neutral-600">Quantity:</span>
                          <div className="flex items-center border border-neutral-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="p-2 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                              className="p-2 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="text-2xl font-bold text-amber-700">
                            {formatPrice(item.product.price * item.quantity)}
                          </div>
                          <div className="text-sm text-neutral-500">
                            {formatPrice(item.product.price)} each
                          </div>
                        </div>
                      </div>

                      {/* Stock Warning */}
                      {item.product.stock <= 5 && (
                        <div className="mt-3 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded">
                          Only {item.product.stock} left in stock
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200 sticky top-24">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal ({itemCount} items)</span>
                    <span className="font-medium">{formatPrice(total)}</span>
                  </div>
                  
                  <div className="flex justify-between text-neutral-600">
                    <span>Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>

                  <div className="flex justify-between text-neutral-600">
                    <span>Tax</span>
                    <span className="font-medium">Calculated at checkout</span>
                  </div>

                  <div className="border-t border-neutral-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-2xl font-bold text-amber-700">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>

                <Link href="/checkout">
                  <Button size="lg" className="w-full mb-4 gap-2">
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>

                <Link href="/products">
                  <Button variant="outline" size="lg" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>

                {/* Benefits */}
                <div className="mt-6 pt-6 border-t border-neutral-200 space-y-3">
                  <div className="flex items-start gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <span className="text-neutral-600">Free shipping on all orders</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <span className="text-neutral-600">30-day return policy</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <span className="text-neutral-600">Secure checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}