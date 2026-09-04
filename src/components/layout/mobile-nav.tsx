'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Menu as MenuIcon, ShoppingBag, CalendarDays, User, Gamepad2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/providers/cart-provider';

export function MobileNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Menu', href: '/menu', icon: MenuIcon },
    { name: 'Game', href: '/game', icon: Gamepad2 },
    { name: 'Cart', href: '/cart', icon: ShoppingBag, badge: itemCount },
    { name: 'Book', href: '/reservations', icon: CalendarDays },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/40 pb-safe">
      <nav className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full space-y-1 text-xs relative',
                isActive ? 'text-primary font-medium' : 'text-muted-foreground hover:text-primary transition-colors'
              )}
            >
              <div className="relative">
                <Icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {item.badge}
                  </span>
                )}
              </div>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
