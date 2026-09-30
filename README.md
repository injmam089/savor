# 🍽️ SAVOR --- Taste Beyond Ordinary

> A premium full-stack restaurant ordering and management platform built
> with Next.js, TypeScript, PostgreSQL, and Prisma.

SAVOR is a modern restaurant platform that combines a customer-facing
food ordering experience with table reservations, online payments,
reviews, favorites, notifications, and a complete admin management
dashboard.

The project focuses on a polished user experience, secure application
architecture, responsive design, and practical restaurant management
workflows.

------------------------------------------------------------------------

## ✨ Features

### 👤 Customer Experience

-   🏠 Premium restaurant landing page
-   🍽️ Browse and search menu items
-   🔎 Filter menu items by category and preferences
-   📋 Detailed food item pages
-   🛒 Shopping cart with quantity management
-   🎟️ Coupon and discount support
-   💳 Checkout and payment flow
-   📦 Order placement and tracking
-   🚚 Delivery, pickup, and dine-in order types
-   📅 Table reservations
-   ⭐ Food reviews and ratings
-   ❤️ Favorite dishes
-   🔔 Notifications
-   👤 Profile and account management
-   📍 Saved delivery addresses
-   📜 Order and reservation history

------------------------------------------------------------------------

## 🛠️ Admin Dashboard

SAVOR provides a dedicated administration dashboard for managing the
restaurant platform.

### 📊 Dashboard

-   Revenue statistics
-   Order statistics
-   Customer statistics
-   Popular menu items
-   Visual analytics
-   Restaurant activity overview

### 🍔 Menu Management

-   Create menu items
-   Edit menu items
-   Delete menu items
-   Upload food images
-   Manage categories
-   Control item availability
-   Mark items as featured
-   Mark items as popular

### 📦 Order Management

-   View customer orders
-   View order details
-   Update order status
-   Track order progress
-   Manage fulfillment type

### 📅 Reservation Management

-   View reservations
-   Confirm reservations
-   Cancel reservations
-   Complete reservations
-   Manage table availability

### 👥 User Management

-   View registered users
-   Manage customer information
-   Role-based access control
-   Admin account management

### 🎟️ Coupon Management

-   Create discount coupons
-   Percentage-based discounts
-   Fixed-amount discounts
-   Minimum order requirements
-   Maximum discount limits
-   Usage limits
-   Activate or deactivate coupons

### ⭐ Review Management

-   View customer reviews
-   Approve reviews
-   Reject reviews
-   Monitor ratings

------------------------------------------------------------------------

## 🔐 Authentication & Security

-   NextAuth.js authentication
-   JWT-based sessions
-   Password hashing with bcrypt
-   Customer/Admin role separation
-   Protected admin routes
-   Protected API routes
-   Server-side validation
-   Zod validation schemas
-   Server-side order calculations
-   Database relationships and constraints

> Never commit real production credentials or secrets to the repository.

------------------------------------------------------------------------

## 💳 Payment System

SAVOR includes a payment architecture designed to support online and
offline payments.

Supported payment methods include:

-   💵 Cash on Delivery
-   💳 Online Payment
-   💰 Razorpay integration
-   🧪 Development mock payment mode

------------------------------------------------------------------------

## 📅 Reservation System

Customers can reserve restaurant tables by selecting:

-   Date
-   Time
-   Number of guests
-   Seating preference
-   Special requests

### Seating Locations

-   Indoor
-   Outdoor
-   Balcony

### Reservation Status

``` text
PENDING
CONFIRMED
CANCELLED
COMPLETED
```

------------------------------------------------------------------------

## 🍔 Order Management

SAVOR supports:

``` text
DELIVERY
PICKUP
DINE_IN
```

### Order Lifecycle

``` text
PLACED
   ↓
CONFIRMED
   ↓
PREPARING
   ↓
READY
   ↓
OUT_FOR_DELIVERY
   ↓
DELIVERED
```

------------------------------------------------------------------------

## 🎮 SAVOR RUSH

SAVOR includes a restaurant-themed gamification system called **SAVOR
RUSH**.

The game system supports:

-   Player scores
-   Levels
-   Orders served
-   Combo tracking
-   Coins
-   High scores
-   Game progress
-   Unlockable items
-   Player themes

------------------------------------------------------------------------

## 🎨 UI / UX

SAVOR uses a modern restaurant-focused interface designed for a premium
digital dining experience.

-   Premium visual design
-   Responsive layouts
-   Dark and light themes
-   Mobile navigation
-   Glassmorphism elements
-   Gradients
-   Smooth animations
-   Framer Motion transitions
-   Lucide icons
-   Accessible UI components

Designed for mobile, laptop, desktop, and large screens.

------------------------------------------------------------------------

## 🧰 Technology Stack

  Category            Technology
  ------------------- ----------------
  Framework           Next.js 16
  Language            TypeScript
  Frontend            React 19
  Styling             Tailwind CSS 4
  UI Components       Radix UI
  Animations          Framer Motion
  Icons               Lucide React
  Charts              Recharts
  Database            PostgreSQL
  ORM                 Prisma 7
  Authentication      NextAuth.js
  Validation          Zod
  Password Security   bcrypt
  Payments            Razorpay
  Image Management    Cloudinary

------------------------------------------------------------------------

## 🏗️ Application Architecture

``` text
                         SAVOR
                           │
                           ▼
              ┌────────────────────────┐
              │      Next.js App       │
              │    React + TypeScript  │
              └────────────┬───────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │       API Routes       │
              ├────────────────────────┤
              │ Authentication         │
              │ Menu & Categories      │
              │ Cart & Orders          │
              │ Payments               │
              │ Reservations           │
              │ Reviews & Favorites    │
              │ Notifications          │
              │ Admin Management       │
              └────────────┬───────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │       Prisma ORM       │
              └────────────┬───────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │      PostgreSQL        │
              └────────────────────────┘
```

------------------------------------------------------------------------

## 📂 Project Structure

``` text
savor/
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── public/
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── admin/
│   │   ├── api/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── menu/
│   │   ├── orders/
│   │   ├── profile/
│   │   └── reservations/
│   │
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── providers/
│   ├── types/
│   └── validations/
│
├── .env.example
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── prisma.config.ts
├── tsconfig.json
└── README.md
```

------------------------------------------------------------------------

## 🗄️ Database Architecture

SAVOR uses **PostgreSQL** with **Prisma ORM**.

The database includes entities for:

-   Users
-   Addresses
-   Categories
-   Menu Items
-   Cart
-   Cart Items
-   Orders
-   Order Items
-   Payments
-   Tables
-   Reservations
-   Reviews
-   Favorites
-   Coupons
-   Notifications
-   Game Scores
-   Game Progress

------------------------------------------------------------------------

## 🚀 Getting Started

### Prerequisites

-   Node.js 18 or newer
-   PostgreSQL 14 or newer
-   npm

### 1. Clone the Repository

``` bash
git clone https://github.com/injmam089/savor.git
cd savor
```

### 2. Install Dependencies

``` bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file:

``` env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/savor"

AUTH_SECRET="your-auth-secret"
AUTH_TRUST_HOST=true

NEXTAUTH_URL="http://localhost:3000"

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

NEXT_PUBLIC_RAZORPAY_KEY_ID="your-razorpay-key"
RAZORPAY_KEY_SECRET="your-razorpay-secret"
```

### 4. Create the Database

Create a PostgreSQL database named:

``` text
savor
```

### 5. Push the Prisma Schema

``` bash
npm run db:push
```

### 6. Seed Sample Data

``` bash
npm run db:seed
```

### 7. Start the Development Server

``` bash
npm run dev
```

Open `http://localhost:3000`.

------------------------------------------------------------------------

## 📜 Available Scripts

  Command                Description
  ---------------------- -------------------------------------
  `npm run dev`          Start the development server
  `npm run build`        Build the production application
  `npm run start`        Start the production server
  `npm run lint`         Run ESLint
  `npm run db:push`      Push Prisma schema to the database
  `npm run db:migrate`   Create and run a database migration
  `npm run db:seed`      Seed sample database data
  `npm run db:studio`    Open Prisma Studio
  `npm run db:reset`     Reset and reseed the database

------------------------------------------------------------------------

## 🧪 Demo Accounts

If the seed script creates the demo users:

  Role       Email                 Password
  ---------- --------------------- ---------------
  Admin      `admin@savor.com`     `admin123`
  Customer   `priya@example.com`   `customer123`
  Customer   `rahul@example.com`   `customer123`

> These credentials are intended only for local/demo environments.

------------------------------------------------------------------------

## 📸 Screenshots

Recommended screenshot structure:

``` text
docs/
├── home.png
├── menu.png
├── food-details.png
├── cart.png
├── checkout.png
├── reservations.png
├── orders.png
└── admin-dashboard.png
```

Example:

``` markdown
![SAVOR Home](docs/home.png)
```

------------------------------------------------------------------------

## 🔮 Future Improvements

-   Real-time order tracking
-   Advanced restaurant analytics
-   Multi-restaurant support
-   Delivery partner management
-   Push notifications
-   Personalized food recommendations
-   Loyalty and rewards program
-   Expanded SAVOR RUSH gameplay
-   Production payment configuration
-   Automated testing
-   CI/CD integration
-   Performance optimization

------------------------------------------------------------------------

## 🎯 Project Goals

SAVOR demonstrates practical full-stack development through:

-   Full-stack Next.js development
-   REST API development
-   Database design
-   Prisma ORM
-   Authentication and authorization
-   Role-based access control
-   Payment integration
-   Form validation
-   Order management
-   Reservation management
-   Admin dashboard development
-   Responsive UI development
-   Modern React architecture

------------------------------------------------------------------------

## 👨‍💻 Author

**Injmam**

BCA Student \| Cybersecurity & Software Development

GitHub: https://github.com/injmam089

------------------------------------------------------------------------

## 📄 License

This project is licensed under the MIT License.

------------------------------------------------------------------------

⭐ If you find SAVOR interesting, consider giving the repository a star.
