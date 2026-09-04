'use client';
import { PackageCheck, Clock, MapPin } from 'lucide-react';

export default function OrderTrackingPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8 mt-24 max-w-4xl min-h-screen">
      <div className="flex items-center gap-4 mb-10">
        <h1 className="text-3xl font-bold gradient-text">Order #{params.id}</h1>
        <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">Preparing</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="premium-card p-8 rounded-3xl border border-white/5 space-y-8">
            <h3 className="font-semibold text-xl border-b border-white/10 pb-4">Tracking Timeline</h3>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-muted before:to-muted">
              {/* Step 1 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg shadow-primary/40 z-10">
                  <PackageCheck className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] premium-card p-4 rounded-xl border border-primary/20">
                  <h4 className="font-semibold text-primary">Order Confirmed</h4>
                  <p className="text-sm text-muted-foreground mt-1">We have received your order.</p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-muted text-muted-foreground shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] premium-card p-4 rounded-xl border border-white/5 opacity-60">
                  <h4 className="font-semibold">Preparing Meal</h4>
                  <p className="text-sm text-muted-foreground mt-1">Our chefs are preparing your delicious food.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="premium-card p-6 rounded-3xl border border-white/5">
            <h3 className="font-semibold text-lg mb-4">Delivery Details</h3>
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <MapPin className="w-5 h-5 text-primary shrink-0" />
              <p>Will be updated when tracking is fully integrated.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
