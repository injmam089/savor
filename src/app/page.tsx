import Link from 'next/link';
import { APP_NAME, APP_TAGLINE } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { FoodCard } from '@/components/menu/food-card';
import prisma from '@/lib/prisma';

export default async function HomePage() {
  // Fetching data safely in case tables are empty
  const featuredDishes = await prisma.menuItem.findMany({ where: { isFeatured: true }, take: 4 }).catch(() => []);
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* Hero Section */}
      <section className="relative w-full min-h-[90svh] flex items-center justify-center overflow-hidden">
        {/* Abstract dark gradients instead of heavy boxes */}
        <div className="absolute inset-0 bg-background z-0" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 z-0" />
        
        <div className="relative z-10 text-center space-y-8 px-4 max-w-5xl mt-12">
          <div className="inline-block border border-white/10 bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full text-sm text-muted-foreground mb-4 uppercase tracking-widest font-medium">
            Elevated Dining Experience
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold pb-2 tracking-tighter text-foreground">
            Taste Beyond <span className="text-primary italic font-serif">Ordinary.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
            {APP_TAGLINE || 'Discover flavors crafted with passion, fresh ingredients, and unforgettable experiences.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center pt-8">
            <Link href="/menu">
              <Button size="lg" className="rounded-full w-full sm:w-auto h-14 px-10 text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform duration-300">
                Explore Menu
              </Button>
            </Link>
            <Link href="/reservations">
              <Button size="lg" variant="outline" className="rounded-full w-full sm:w-auto h-14 px-10 text-lg border-white/15 bg-transparent hover:bg-white/5 transition-colors">
                Reserve a Table
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Featured Dishes */}
      <section className="w-full py-32 px-4 md:px-8 max-w-[1400px]">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Chef's Signatures</h2>
            <p className="text-muted-foreground text-lg font-light leading-relaxed">
              Hand-picked favorites crafted to perfection. A symphony of flavors waiting to be explored.
            </p>
          </div>
          <Link href="/menu">
            <Button variant="ghost" className="rounded-full font-medium text-primary hover:bg-primary/10 hover:text-primary">
              View full menu &rarr;
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredDishes.length > 0 ? featuredDishes.map((dish: any) => (
            <FoodCard key={dish.id} item={dish} />
          )) : (
            <div className="col-span-full text-center py-20 premium-card text-muted-foreground">
              Our menu is being updated. Please check back later!
            </div>
          )}
        </div>
      </section>

      {/* SAVOR RUSH Game Showcase Banner */}
      <section className="w-full py-16 px-4 md:px-8 max-w-[1400px]">
        <div className="relative rounded-3xl p-8 md:p-12 overflow-hidden bg-gradient-to-r from-zinc-950 via-zinc-900 to-black border-2 border-primary/40 shadow-[0_0_50px_rgba(230,81,0,0.2)]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/15 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider text-amber-400">
                <span>🔥 New Arcade Feature</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white">
                SAVOR RUSH — Kitchen Dash
              </h2>
              <p className="text-muted-foreground text-base md:text-lg font-light leading-relaxed">
                Think you have what it takes to run a 5-star kitchen during rush hour? Play our fast-paced real browser game, assemble signature burgers, pizzas & curries, earn coins, and top the global leaderboard!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <Link href="/game">
                <Button size="lg" className="rounded-full h-14 px-8 text-base font-black uppercase tracking-wider bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 text-zinc-950 shadow-xl shadow-primary/30 hover:scale-105 transition-transform">
                  🎮 Play SAVOR RUSH Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="w-full py-32 px-4 relative overflow-hidden bg-muted/30 border-y border-white/5">
        <div className="max-w-5xl mx-auto text-center space-y-10 relative z-10 px-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">The Culinary Journey</h2>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light">
            At SAVOR, we believe in crafting experiences, not just meals. Every dish tells a story of passion, premium ingredients, and culinary artistry. Our journey began with a simple idea: to bring extraordinary flavors to those who appreciate the art of dining.
          </p>
        </div>
      </section>

      {/* Location & Contact */}
      <section className="w-full py-32 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10 lg:pr-12">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Visit Us</h2>
              <p className="text-lg text-muted-foreground font-light leading-relaxed">Experience luxury dining with your loved ones in an unforgettable ambiance.</p>
            </div>
            
            <div className="space-y-8 text-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="text-primary w-5 h-5"/>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Location</h4>
                  <p className="text-muted-foreground font-light">123 Luxury Avenue, Culinary District<br/>FC 12345</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="text-primary w-5 h-5"/>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Hours</h4>
                  <p className="text-muted-foreground font-light">Open Daily<br/>11:00 AM - 10:00 PM</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="text-primary w-5 h-5"/>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Contact</h4>
                  <p className="text-muted-foreground font-light">+1 (234) 567-8900<br/>contact@savor-restaurant.com</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="premium-card p-12 md:p-16 rounded-[2rem] text-center space-y-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 space-y-4">
              <h3 className="text-3xl font-bold">Book Your Table</h3>
              <p className="text-muted-foreground text-lg font-light">Secure your spot for an evening of culinary excellence.</p>
            </div>
            <Link href="/reservations" className="block relative z-10">
              <Button className="w-full rounded-full h-14 text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform duration-300">
                Make a Reservation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
