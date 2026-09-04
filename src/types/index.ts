import type { 
  User, MenuItem, Category, Order, OrderItem, 
  Reservation, Review, Cart, CartItem, Coupon, 
  Notification, Address, Table, Payment,
  OrderStatus, OrderType, PaymentMethod, ReservationStatus, 
  TableLocation, Role, NotificationType
} from '@prisma/client';

// Re-export Prisma types
export type { 
  User, MenuItem, Category, Order, OrderItem, 
  Reservation, Review, Cart, CartItem, Coupon, 
  Notification, Address, Table, Payment 
};

export type { 
  OrderStatus, OrderType, PaymentMethod, ReservationStatus, 
  TableLocation, Role, NotificationType 
};

// Extended types with relations
export type MenuItemWithCategory = MenuItem & {
  category: Category;
};

export type MenuItemFull = MenuItem & {
  category: Category;
  reviews: Review[];
  _count?: {
    favorites: number;
    reviews: number;
  };
};

export type CartWithItems = Cart & {
  items: (CartItem & {
    menuItem: MenuItem;
  })[];
};

export type OrderWithItems = Order & {
  items: (OrderItem & {
    menuItem: MenuItem;
  })[];
  payment: Payment | null;
  address: Address | null;
  user?: Pick<User, 'name' | 'email' | 'phone'>;
};

export type ReservationWithDetails = Reservation & {
  table: Table;
  user?: Pick<User, 'name' | 'email' | 'phone'>;
};

export type ReviewWithUser = Review & {
  user: Pick<User, 'name' | 'avatar'>;
  menuItem: Pick<MenuItem, 'name' | 'image'>;
};

export type UserProfile = Pick<User, 'id' | 'name' | 'email' | 'phone' | 'avatar' | 'role' | 'createdAt'> & {
  addresses: Address[];
};

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth types
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  image?: string | null;
}
