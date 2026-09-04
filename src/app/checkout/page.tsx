'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { MapPin, CreditCard, Banknote, Navigation } from 'lucide-react';

export default function CheckoutPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [orderType, setOrderType] = useState('delivery');

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      toast({ title: 'Order Confirmed', description: 'Your delicious meal is being prepared!' });
      router.push('/orders');
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-24 max-w-4xl min-h-screen">
      <h1 className="text-4xl font-bold gradient-text mb-10 text-center">Checkout</h1>
      
      <form onSubmit={handlePlaceOrder} className="premium-card p-8 md:p-10 rounded-3xl space-y-10 border border-white/5 shadow-xl">
        {/* Order Type Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2"><Navigation className="w-5 h-5 text-primary"/> Order Type</h3>
          <div className="grid grid-cols-3 gap-4">
            {['delivery', 'pickup', 'dine-in'].map((type) => (
              <label key={type} className={`premium-card p-4 rounded-xl flex justify-center items-center cursor-pointer transition-all ${orderType === type ? 'border-primary/50 bg-primary/5' : 'border-transparent hover:border-white/10'}`}>
                <input type="radio" name="orderType" value={type} checked={orderType === type} onChange={() => setOrderType(type)} className="sr-only" />
                <span className="capitalize font-medium">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Customer Info Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Contact Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="Full Name" required className="bg-background/50 rounded-xl h-12" />
            <Input placeholder="Phone Number" required className="bg-background/50 rounded-xl h-12" />
          </div>
        </div>

        {/* Address Section */}
        {orderType === 'delivery' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2"><MapPin className="w-5 h-5 text-primary"/> Delivery Address</h3>
            <textarea placeholder="Enter your full address..." required className="w-full min-h-[100px] rounded-xl border border-input bg-background/50 px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
          </div>
        )}

        {/* Payment Method */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Payment Method</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="premium-card p-5 rounded-xl flex items-center gap-3 cursor-pointer hover:border-primary/30 border border-transparent transition-colors">
              <input type="radio" name="payment" defaultChecked /> 
              <Banknote className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">Cash on Delivery</span>
            </label>
            <label className="premium-card p-5 rounded-xl flex items-center gap-3 cursor-pointer hover:border-primary/30 border border-transparent transition-colors">
              <input type="radio" name="payment" /> 
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">Online Payment</span>
            </label>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10">
          <Button type="submit" disabled={isLoading} className="w-full rounded-xl h-14 text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">
            {isLoading ? 'Processing securely...' : 'Confirm & Place Order'}
          </Button>
        </div>
      </form>
    </div>
  );
}
