'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, ChefHat } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FoodCard } from '@/components/menu/food-card';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8 mt-24 text-center">Loading menu...</div>}>
      <MenuContent />
    </Suspense>
  )
}

function MenuContent() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const category = searchParams.get('category') || 'all';
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [isVeg, setIsVeg] = useState<boolean | null>(null);
  const [sort, setSort] = useState('recommended');
  
  const debouncedSearch = useDebounce(search, 500);

  const setCategory = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === 'all') params.delete('category');
    else params.set('category', cat);
    router.push(`?${params.toString()}`);
  }

  useEffect(() => {
    // Fetch categories
    fetch('/api/menu/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCategories(data.data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const fetchMenu = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (debouncedSearch) queryParams.set('search', debouncedSearch);
        if (category && category !== 'all') queryParams.set('category', category);
        if (isVeg !== null) queryParams.set('isVeg', 'true');
        if (sort !== 'recommended') queryParams.set('sort', sort);
        
        const res = await fetch(`/api/menu?${queryParams.toString()}`);
        const data = await res.json();
        if (data.success) {
          setItems(data.data.items);
        }
      } catch (error) {
        console.error('Failed to fetch menu', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenu();
  }, [debouncedSearch, category, isVeg, sort]);

  return (
    <div className="container mx-auto px-4 pt-10 pb-24 max-w-[1400px] min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-14">
        <div className="space-y-5 max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">Our Menu</h1>
          <p className="text-muted-foreground text-lg font-light leading-relaxed">
            Explore our curated selection of culinary masterpieces, crafted with the finest ingredients and boundless passion.
          </p>
        </div>
        
        {/* Search */}
        <div className="w-full md:w-[22rem] relative shrink-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 bg-muted/20 border-white/10 rounded-full h-14 focus-visible:ring-primary shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Filters Sidebar */}
        <div className="lg:col-span-3 space-y-8">
          <div className="premium-card p-6 space-y-8 sticky top-24">
            {/* Categories */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-primary" /> Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCategory('all')}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors border",
                    category === 'all' 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "bg-transparent border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  All
                </button>
                {categories.map((c: any) => (
                  <button
                    key={c.id}
                    onClick={() => setCategory(c.slug)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-colors border",
                      category === c.slug 
                        ? "bg-primary text-primary-foreground border-primary" 
                        : "bg-transparent border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary Preferences */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Dietary</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <Checkbox 
                    checked={isVeg === true}
                    onCheckedChange={(c) => setIsVeg(c ? true : null)}
                    className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                  />
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">Vegetarian Only</span>
                </label>
              </div>
            </div>

            {/* Sort */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-primary" /> Sort By
              </h3>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-full bg-muted/30 border-white/10 rounded-xl h-11">
                  <SelectValue placeholder="Recommended" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-card/95 backdrop-blur-xl">
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="lg:col-span-9">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="premium-card h-80 rounded-2xl image-loading" />
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {items.map((item: any) => (
                <FoodCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="premium-card p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
              <ChefHat className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-2xl font-bold mb-2">No dishes found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters.</p>
              <Button 
                variant="outline" 
                className="mt-6 rounded-full border-white/10"
                onClick={() => { setSearch(''); setCategory('all'); setIsVeg(null); }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
