import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star, Clock, ChevronRight, Leaf, Drumstick, AlertCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { AddToCartButton } from '@/components/menu/add-to-cart-button';
import prisma from '@/lib/prisma';

export default async function FoodDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const item = await prisma.menuItem.findUnique({
    where: { id: resolvedParams.id },
    include: { category: true }
  }).catch(() => null);

  if (!item) {
    // If running without proper DB seeding yet, mock data to prevent errors
    return (
      <div className="container mx-auto px-4 py-8 mt-24 min-h-screen text-center flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Dish not found</h1>
        <Link href="/menu" className="text-primary hover:underline">Return to Menu</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-10 pb-24 max-w-6xl min-h-screen">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/menu" className="hover:text-primary transition-colors">Menu</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground font-medium">{item.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        {/* Image Section */}
        <div className="relative h-[400px] md:h-[550px] w-full rounded-[2rem] overflow-hidden bg-muted/20 premium-card">
          {item.image ? (
          <img src={item.image} alt={item.name} className="object-cover w-full h-full hover:scale-105 transition-transform duration-700 ease-out" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">No Image Available</div>
          )}
          <div className="absolute top-6 left-6 bg-background/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-lg border border-white/5">
            {item.isVeg ? (
              <><Leaf className="w-4 h-4 text-green-500" /> <span className="text-sm font-medium">Vegetarian</span></>
            ) : (
              <><Drumstick className="w-4 h-4 text-red-500" /> <span className="text-sm font-medium">Non-Vegetarian</span></>
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-8 flex flex-col justify-center">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 bg-muted/50 rounded-md text-sm font-medium text-muted-foreground uppercase tracking-widest">
              {item.category?.name || 'Dish'}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">{item.name}</h1>
            <div className="flex items-center gap-6 text-sm">
              <span className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full font-semibold">
                <Star className="w-4 h-4 fill-primary" /> {item.rating || '4.5'}
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                <Clock className="w-4 h-4" /> {item.prepTime || 15} mins prep time
              </span>
            </div>
          </div>

          <div className="text-5xl font-bold py-2 text-foreground">
            {formatPrice(item.price)}
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed">
            {item.description}
          </p>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-4 items-center">
            <div className="w-full sm:w-auto flex-1">
              <AddToCartButton item={item} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
