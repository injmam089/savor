'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, Users, MessageSquare } from 'lucide-react';

export default function ReservationsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      toast({ title: 'Reservation Confirmed', description: 'We look forward to hosting you. Details sent to your email.' });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-24 max-w-3xl min-h-screen">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text">Reserve a Table</h1>
        <p className="text-lg text-muted-foreground">Secure your spot for an exquisite dining experience.</p>
      </div>
      
      <div className="premium-card p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground"><Calendar className="w-4 h-4"/> Date</label>
              <Input type="date" required className="bg-background/50 rounded-xl h-12" min={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground"><Clock className="w-4 h-4"/> Time</label>
              <Input type="time" required className="bg-background/50 rounded-xl h-12" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground"><Users className="w-4 h-4"/> Guests</label>
              <Input type="number" min="1" max="20" placeholder="Number of guests" required className="bg-background/50 rounded-xl h-12" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">Seating Preference</label>
              <select className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <option value="indoor">Indoor Dining</option>
                <option value="outdoor">Outdoor Patio</option>
                <option value="balcony">Balcony View</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground"><MessageSquare className="w-4 h-4"/> Special Requests (Optional)</label>
            <textarea className="flex min-h-[120px] w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="Any dietary requirements, allergies, or special occasions we should know about?"></textarea>
          </div>
          
          <Button type="submit" disabled={isLoading} className="w-full rounded-xl h-14 text-lg">
            {isLoading ? 'Confirming Availability...' : 'Book Reservation'}
          </Button>
        </form>
      </div>
    </div>
  );
}
