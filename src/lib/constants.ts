export const APP_NAME = 'SAVOR';
export const APP_TAGLINE = 'Taste Beyond Ordinary.';
export const APP_DESCRIPTION = 'Discover flavors crafted with passion, fresh ingredients, and unforgettable experiences.';

export const TAX_RATE = 0.05; // 5% GST
export const FREE_DELIVERY_THRESHOLD = 500;
export const DELIVERY_FEE = 40;

export const ORDER_STATUSES = [
  { value: 'PLACED', label: 'Order Placed', icon: 'clipboard-check' },
  { value: 'CONFIRMED', label: 'Confirmed', icon: 'check-circle' },
  { value: 'PREPARING', label: 'Preparing', icon: 'chef-hat' },
  { value: 'READY', label: 'Ready', icon: 'package-check' },
  { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: 'truck' },
  { value: 'DELIVERED', label: 'Delivered', icon: 'circle-check-big' },
  { value: 'CANCELLED', label: 'Cancelled', icon: 'x-circle' },
] as const;

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/reservations', label: 'Reservations' },
] as const;

export const ADMIN_NAV_LINKS = [
  { href: '/admin', label: 'Dashboard', icon: 'layout-dashboard' },
  { href: '/admin/menu', label: 'Menu', icon: 'utensils' },
  { href: '/admin/orders', label: 'Orders', icon: 'shopping-bag' },
  { href: '/admin/reservations', label: 'Reservations', icon: 'calendar-days' },
  { href: '/admin/users', label: 'Users', icon: 'users' },
  { href: '/admin/coupons', label: 'Coupons', icon: 'ticket' },
  { href: '/admin/reviews', label: 'Reviews', icon: 'message-square' },
] as const;
