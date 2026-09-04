# 🍽️ SAVOR — Taste Beyond Ordinary

A premium, full-stack restaurant ordering and management platform built with modern web technologies. Features a stunning dark luxury UI, complete backend with PostgreSQL database, authentication, ordering system, table reservations, and a comprehensive admin dashboard.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC)

---

## ✨ Features

### Customer Features
- 🏠 **Beautiful Landing Page** — Hero section, featured dishes, chef's specials, customer reviews
- 🍕 **Interactive Menu** — Browse, search, filter by category/price/veg, sort by rating/price
- 🔍 **Food Details** — Ingredients, allergens, prep time, reviews, related dishes
- 🛒 **Shopping Cart** — Add/remove items, quantity management, coupon codes
- 💳 **Checkout** — Multi-step checkout with address management, order type selection
- 📦 **Order Tracking** — Real-time-ready status timeline with visual stepper
- 📅 **Table Reservations** — Date/time/guest selection with availability checking
- 👤 **User Profile** — Order history, reservations, favorites, addresses, reviews
- ⭐ **Reviews & Ratings** — Rate and review food items after ordering
- ❤️ **Favorites** — Save favorite dishes for quick reordering
- 🔔 **Notifications** — Order updates, reservation confirmations, offers
- 🎫 **Coupons** — Apply discount codes with server-side validation

### Admin Dashboard
- 📊 **Analytics Dashboard** — Revenue, orders, customers, popular dishes with charts
- 🍽️ **Menu Management** — Full CRUD with image upload, availability, featured/popular toggles
- 📋 **Order Management** — Status updates, order details, filtering
- 📅 **Reservation Management** — Confirm, cancel, complete reservations
- 👥 **User Management** — View all users and their details
- 🎫 **Coupon Management** — Create, edit, deactivate discount codes
- 💬 **Review Moderation** — Approve or reject customer reviews

### Technical Features
- 🔐 **Secure Authentication** — NextAuth.js with credentials, JWT sessions, bcrypt hashing
- 🛡️ **Role-Based Access** — Customer and Admin roles with middleware protection
- 💰 **Server-Side Price Calculation** — Never trusts client-side totals
- 📱 **Fully Responsive** — Mobile, tablet, desktop with bottom navigation
- 🌙 **Dark/Light Theme** — Premium dark luxury default with light mode
- ✨ **Modern UI** — Glassmorphism, gradients, Framer Motion animations
- 🗄️ **Relational Database** — Full PostgreSQL schema with Prisma ORM
- 💳 **Payment Ready** — Razorpay integration with development mock mode
- 📸 **Image Management** — Cloudinary integration with development mock mode

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **UI Library** | React 19 |
| **Styling** | Tailwind CSS 4 |
| **Components** | shadcn/ui + Radix UI |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **Database** | PostgreSQL |
| **ORM** | Prisma 7 |
| **Authentication** | NextAuth.js v5 (Auth.js) |
| **Validation** | Zod |
| **Payments** | Razorpay (with mock mode) |
| **Images** | Cloudinary (with mock mode) |

---

## 🚀 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ (local or cloud)
- npm or yarn

### 1. Clone & Install

```bash
cd savor
npm install
```

### 2. Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Database (REQUIRED)
DATABASE_URL="postgresql://user:password@localhost:5432/savor?schema=public"

# Auth (REQUIRED)
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
AUTH_TRUST_HOST=true

# Cloudinary (OPTIONAL - app works without these)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Razorpay (OPTIONAL - app works without these using mock mode)
NEXT_PUBLIC_RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
```

### 3. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE savor;
```

Push the Prisma schema to your database:

```bash
npm run db:push
```

### 4. Seed Database

Populate with sample data (20+ menu items, users, orders, etc.):

```bash
npm run db:seed
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🔑 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@savor.com | admin123 |
| **Customer** | priya@example.com | customer123 |
| **Customer** | rahul@example.com | customer123 |

---

## 📁 Project Architecture

```
savor/
├── prisma/
│   ├── schema.prisma          # Database schema (16 models)
│   └── seed.ts                # Seed data
├── src/
│   ├── app/
│   │   ├── (auth)/            # Login & Register pages
│   │   ├── admin/             # Admin dashboard (8 pages)
│   │   ├── api/               # API routes (28+ endpoints)
│   │   ├── cart/              # Shopping cart
│   │   ├── checkout/          # Checkout flow
│   │   ├── menu/              # Menu & food details
│   │   ├── orders/            # Order history & tracking
│   │   ├── profile/           # User profile
│   │   ├── reservations/      # Table reservations
│   │   ├── layout.tsx         # Root layout with providers
│   │   └── page.tsx           # Home page
│   ├── components/
│   │   ├── ui/                # shadcn/ui components (20)
│   │   ├── layout/            # Header, Footer, Sidebar, Mobile Nav
│   │   ├── menu/              # Food card, Add to cart button
│   │   └── shared/            # Empty state, Skeleton, Confirm dialog, etc.
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Core utilities, auth, Prisma, integrations
│   ├── providers/             # React context providers
│   ├── types/                 # TypeScript type definitions
│   └── validations/           # Zod validation schemas
├── .env.example
├── next.config.ts
└── package.json
```

---

## 🔌 API Overview

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/api/auth/[...nextauth]` | GET, POST | Authentication (NextAuth) |
| `/api/auth/register` | POST | User registration |
| `/api/menu` | GET | List menu items (with filtering) |
| `/api/menu/[id]` | GET | Single menu item details |
| `/api/categories` | GET | All food categories |
| `/api/cart` | GET, DELETE | User's cart |
| `/api/cart/items` | POST | Add item to cart |
| `/api/cart/items/[id]` | PATCH, DELETE | Update/remove cart item |
| `/api/orders` | GET, POST | Orders (list / create) |
| `/api/orders/[id]` | GET | Order details |
| `/api/reservations` | GET, POST | Reservations (list / create) |
| `/api/reservations/[id]` | PATCH | Cancel reservation |
| `/api/tables` | GET | Available tables |
| `/api/reviews` | GET, POST | Reviews |
| `/api/favorites` | GET, POST | Toggle favorites |
| `/api/coupons/validate` | POST | Validate coupon code |
| `/api/notifications` | GET, PATCH | User notifications |
| `/api/users/profile` | GET, PATCH | User profile |
| `/api/users/addresses` | GET, POST | User addresses |
| `/api/users/addresses/[id]` | PATCH, DELETE | Manage address |
| `/api/payments/create-order` | POST | Razorpay order creation |
| `/api/payments/verify` | POST | Payment verification |
| `/api/admin/analytics` | GET | Dashboard analytics |
| `/api/admin/menu` | POST | Create menu item |
| `/api/admin/menu/[id]` | PATCH, DELETE | Update/delete menu item |
| `/api/admin/orders/[id]` | PATCH | Update order status |
| `/api/admin/reservations/[id]` | PATCH | Update reservation status |
| `/api/admin/users` | GET | List all users |
| `/api/admin/coupons` | GET, POST | List/create coupons |
| `/api/admin/coupons/[id]` | PATCH, DELETE | Update/deactivate coupon |
| `/api/admin/reviews` | GET | List all reviews |
| `/api/admin/reviews/[id]` | PATCH | Approve/reject review |

---

## 🗄️ Database Models

- **User** — Customers and admins with hashed passwords
- **Address** — User delivery addresses
- **Category** — Menu categories (8 default)
- **MenuItem** — Food items with pricing, ingredients, allergens
- **Cart / CartItem** — Shopping cart per user
- **Order / OrderItem** — Orders with item snapshots
- **Payment** — Payment records (COD / Online)
- **Table** — Restaurant tables with capacity/location
- **Reservation** — Table reservations with status workflow
- **Review** — Customer reviews with moderation
- **Favorite** — User's favorite menu items
- **Coupon** — Discount codes with validation rules
- **Notification** — User notifications

---

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema to database
npm run db:migrate   # Run Prisma migrations
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio
npm run db:reset     # Reset database and re-seed
```

---

## 🏗️ Build for Production

```bash
npm run build
npm run start
```

---

## 📋 Seed Data Included

- **22 menu items** across 8 categories with realistic Indian pricing (₹)
- **3 users** (1 admin, 2 customers)
- **10 tables** (indoor, outdoor, balcony)
- **4 coupons** (including expired one for testing)
- **3 sample orders** with different statuses
- **2 reservations**
- **5 reviews**
- **5 favorites**
- **5 notifications**

---

## 🔒 Security Measures

- ✅ Password hashing with bcrypt (12 rounds)
- ✅ JWT-based session management
- ✅ Role-based access control (middleware + API)
- ✅ Server-side input validation (Zod)
- ✅ Server-side price/total calculation
- ✅ Protected admin routes (middleware)
- ✅ Safe database queries through Prisma
- ✅ Environment variables for secrets
- ✅ No hardcoded credentials
- ✅ CSRF protection via NextAuth

---

## 📄 License

This project is built for educational purposes as a full-stack portfolio/university project.
