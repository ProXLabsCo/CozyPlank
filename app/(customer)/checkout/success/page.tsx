'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'Unknown';

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="bg-white rounded-lg p-8 shadow-sm border border-neutral-200 text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
            <p className="text-neutral-600 mb-6">
              Thank you for your order. We've received your order and will process it shortly.
            </p>
            <div className="bg-neutral-50 rounded-lg p-4 inline-block">
              <p className="text-sm text-neutral-600 mb-1">Order ID</p>
              <p className="text-2xl font-bold text-amber-700">{orderId}</p>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200 mb-8">
            <h2 className="text-xl font-bold mb-4">What's Next?</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Order Confirmation</h3>
                  <p className="text-sm text-neutral-600">
                    You'll receive an order confirmation email with details of your order shortly.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Order Processing</h3>
                  <p className="text-sm text-neutral-600">
                    We'll start preparing your order and will notify you when it's ready to ship.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Need Help?</h3>
                  <p className="text-sm text-neutral-600">
                    Contact us if you have any questions about your order.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/products" className="flex-1">
              <Button variant="outline" size="lg" className="w-full">
                Continue Shopping
              </Button>
            </Link>
            <Link href="/contact" className="flex-1">
              <Button size="lg" className="w-full">
                Contact Support
              </Button>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-6 bg-amber-50 rounded-lg border border-amber-200">
            <h3 className="font-semibold mb-2 text-amber-900">Important Information</h3>
            <ul className="text-sm text-amber-800 space-y-2">
              <li>• Delivery typically takes 5-7 business days</li>
              <li>• You'll receive tracking information via email</li>
              <li>• Free returns within 30 days of delivery</li>
              <li>• For order inquiries, please quote your order ID</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-50 py-12">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}