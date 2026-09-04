'use client';
import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CartPage() {
  // Hardcoded empty state for now until cart context is wired up
  const cartItems: any[] = [];
  
  return (
    <div className="container mx-auto px-4 py-8 mt-24 max-w-7xl min-h-screen">
      <h1 className="text-4xl font-bold gradient-text mb-8">Your Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="premium-card rounded-3xl p-16 text-center max-w-2xl mx-auto border border-white/5 mt-12">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner shadow-primary/20">
            <ShoppingBag className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Your cart feels a bit light</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
            Explore our menu and add some exquisite dishes to your order.
          </p>
          <Link href="/menu">
            <Button size="lg" className="rounded-xl h-14 px-8 text-base">Browse Menu <ArrowRight className="w-5 h-5 ml-2" /></Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {/* Cart Items Mapping */}
          </div>
          <div className="premium-card p-8 rounded-3xl h-fit sticky top-28 border border-white/5 shadow-xl">
            <h3 className="text-2xl font-bold mb-6">Order Summary</h3>
            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>$0.00</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Tax (5%)</span><span>$0.00</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Delivery</span><span>$0.00</span></div>
              <div className="border-t border-white/10 pt-4 flex justify-between font-bold text-lg text-white">
                <span>Total</span><span className="text-primary">$0.00</span>
              </div>
            </div>
            <Link href="/checkout" className="block w-full">
              <Button className="w-full rounded-xl h-14 text-lg">Proceed to Checkout</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
