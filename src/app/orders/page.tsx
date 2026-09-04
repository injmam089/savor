'use client';
import Link from 'next/link';
import { Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-8 mt-24 max-w-5xl min-h-screen">
      <h1 className="text-4xl font-bold gradient-text mb-8">Order History</h1>
      
      {/* Empty State Mock */}
      <div className="premium-card rounded-3xl p-16 text-center border border-white/5 shadow-xl mt-8">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-3">No orders found</h2>
        <p className="text-muted-foreground mb-8">You haven't placed any orders with us yet.</p>
        <Link href="/menu">
          <Button className="rounded-xl h-12 px-6">Explore Menu <ArrowRight className="w-4 h-4 ml-2" /></Button>
        </Link>
      </div>
    </div>
  );
}
