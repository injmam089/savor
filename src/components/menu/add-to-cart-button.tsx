'use client';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AddToCartButton({ item }: { item: any }) {
  const { toast } = useToast();
  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Intended to connect to cart provider/store
    toast({ title: 'Added to cart', description: `${item.name} has been added to your cart.` });
  };
  
  return (
    <Button size="sm" onClick={handleAdd} className="rounded-xl hover:scale-105 transition-transform">
      <Plus className="w-4 h-4 mr-1" /> Add
    </Button>
  );
}
