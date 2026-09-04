'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Clock, Leaf, Drumstick } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { AddToCartButton } from './add-to-cart-button';

export function FoodCard({ item }: { item: any }) {
  return (
    <div className="premium-card overflow-hidden group hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      <Link href={`/menu/${item.id}`} className="shrink-0">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/20">
          {item.image ? (
            <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 bg-muted/10">No Image</div>
          )}
          {item.rating && (
            <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1 text-xs font-semibold shadow-sm border border-white/5">
              <Star className="w-3.5 h-3.5 text-primary fill-primary" /> {item.rating}
            </div>
          )}
          <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-md px-2 py-1 rounded-md shadow-sm border border-white/5">
            {item.isVeg ? <Leaf className="w-4 h-4 text-green-500" /> : <Drumstick className="w-4 h-4 text-red-500" />}
          </div>
        </div>
      </Link>
      <div className="p-6 flex flex-col flex-grow gap-4">
        <div className="flex justify-between items-start gap-3">
          <Link href={`/menu/${item.id}`}>
            <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors tracking-tight leading-tight">{item.name}</h3>
          </Link>
          <span className="font-bold text-lg text-foreground whitespace-nowrap">{formatPrice(item.price)}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 font-light leading-relaxed">{item.description}</p>
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center text-xs text-muted-foreground gap-1.5 font-medium bg-muted/30 border border-white/5 px-2.5 py-1.5 rounded-md">
            <Clock className="w-3.5 h-3.5" /> {item.prepTime || 15} min
          </div>
          <AddToCartButton item={item} />
        </div>
      </div>
    </div>
  );
}
