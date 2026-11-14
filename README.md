# 🍽️ SAVOR — Taste Beyond Ordinary

<p align="center">
  <strong>A Premium Restaurant Ordering & Management Platform</strong>
</p>

<p align="center">
  Discover dishes, place orders, reserve tables, and experience a smarter way to dine.
</p>

<p align="center">
  <a href="https://savor-lime.vercel.app">🌐 Live Demo</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#-features">Features</a> •
  <a href="#-getting-started">Getting Started</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma" alt="Prisma">
</p>

---

## ✨ Overview

**SAVOR** is a full-stack restaurant ordering and management platform that brings the complete dining experience into one application.

It combines a customer-facing restaurant experience with a comprehensive administration dashboard, enabling users to explore menus, place food orders, make table reservations, manage payments, and interact with restaurant services.

The platform also introduces **SAVOR RUSH**, a restaurant-themed gamification experience featuring scores, levels, combos, coins, and unlockable rewards.

Built with modern web technologies, SAVOR focuses on responsive design, secure workflows, database-driven functionality, and an engaging user experience.

## 🚀 Features

### 👤 Customer Experience

- 🏠 Premium restaurant landing page
- 🍽️ Browse and search menu items
- 🔎 Filter menu items by category and preferences
- 📋 Detailed food item pages
- 🛒 Shopping cart with quantity management
- 🎟️ Coupon and discount support
- 💳 Checkout and payment workflows
- 📦 Food ordering and order tracking
- 🚚 Delivery, pickup, and dine-in options
- 📅 Table reservations
- ⭐ Food reviews and ratings
- ❤️ Favorite dishes
- 🔔 Notifications
- 👤 Profile and account management
- 📍 Saved delivery addresses
- 📜 Order and reservation history

### 🛠️ Admin Dashboard

A dedicated administration dashboard provides centralized restaurant management.

| Module | Capabilities |
|---|---|
| Dashboard | Revenue, orders, customers, popular items and analytics |
| Menu Management | Create, edit, delete and manage food items and categories |
| Order Management | View orders, update statuses and manage fulfillment |
| Reservations | View, confirm, cancel and complete reservations |
| User Management | Manage registered users and account roles |
| Coupon Management | Create and manage percentage-based and fixed discounts |
| Review Management | Moderate customer reviews and ratings |

### 🎮 SAVOR RUSH

SAVOR includes a restaurant-themed gamification system designed to make the experience more engaging.

- Player scores and high scores
- Levels and progression
- Orders served
- Combo tracking
- Coins and rewards
- Game progress
- Unlockable items
- Player themes

### 🔐 Authentication & Security

- NextAuth.js authentication
- JWT-based sessions
- Password hashing with bcrypt
- Customer and Admin role separation
- Protected admin routes
- Protected API routes
- Server-side validation
- Zod validation schemas
- Server-side order calculations
- Database relationships and constraints

### 💳 Payment System

SAVOR supports multiple payment workflows:

- 💵 Cash on Delivery
- 💳 Online payments
- 💰 Razorpay integration
- 🧪 Development mock payment mode

### 📅 Table Reservation System

Customers can make reservations by selecting:

- Reservation date and time
- Number of guests
- Seating preference
- Special requests

**Available seating locations:**

- Indoor
- Outdoor
- Balcony

**Reservation statuses:**

- `PENDING`
- `CONFIRMED`
- `CANCELLED`
- `COMPLETED`

### 📦 Order Management

SAVOR supports three fulfillment types:

- `DELIVERY`
- `PICKUP`
- `DINE_IN`

**Delivery order lifecycle:**

```text
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

Pickup and dine-in orders follow their applicable fulfillment workflow.

## 📸 Screenshots

Explore the SAVOR interface and its major features.

### 🏠 Homepage

<p align="center">
  <img src="docs/screenshots/01-homepage.png" alt="SAVOR Homepage" width="100%">
</p>

### 🎮 SAVOR RUSH Feature

<p align="center">
  <img src="docs/screenshots/02-savor-rush-feature.png" alt="SAVOR RUSH Feature" width="100%">
</p>

### 📅 Table Reservations

<p align="center">
  <img src="docs/screenshots/03-reservations.png" alt="SAVOR Reservations" width="100%">
</p>

### 🕹️ SAVOR RUSH Gameplay

<p align="center">
  <img src="docs/screenshots/04-savor-rush-game.png" alt="SAVOR RUSH Game" width="100%">
</p>

### 🏆 Leaderboard

<p align="center">
  <img src="docs/screenshots/05-leaderboard.png" alt="SAVOR Leaderboard" width="100%">
</p>

### 🍔 Menu Experience

<p align="center">
  <img src="docs/screenshots/06-menu.png" alt="SAVOR Menu" width="100%">
</p>

## 🧰 Technology Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 |
| Frontend | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| UI Components | Radix UI |
| Animations | Framer Motion |
| Icons | Lucide React |
| Charts | Recharts |
| Database | PostgreSQL |
| ORM | Prisma 7 |
| Authentication | NextAuth.js |
| Validation | Zod |
| Password Security | bcryptjs |
| Payments | Razorpay |
| Image Management | Cloudinary |

## 🏗️ Application Architecture

SAVOR follows a structured application architecture with Next.js handling the frontend and server-side application workflows.

```mermaid
flowchart TD
    A["Customer / Admin"] --> B["Next.js Application"]
    B --> C["React + TypeScript UI"]
    B --> D["API Routes"]
    D --> E["Authentication & Authorization"]
    D --> F["Business Logic"]
    F --> G["Prisma ORM"]
    G --> H[("PostgreSQL Database")]
    F --> I["External Integrations"]
    I --> J["Razorpay / Cloudinary"]
```

## 🗄️ Database Architecture

SAVOR uses PostgreSQL with Prisma ORM for structured data management.

The database includes models for:

- Users and Addresses
- Menu Categories and Menu Items
- Cart and Cart Items
- Orders and Order Items
- Payments
- Tables and Reservations
- Reviews and Favorites
- Coupons
- Notifications
- Game Scores and Game Progress

## 📂 Project Structure

```text
savor/
│
├── docs/
│   └── screenshots/
│       ├── 01-homepage.png
│       ├── 02-savor-rush-feature.png
│       ├── 03-reservations.png
│       ├── 04-savor-rush-game.png
│       ├── 05-leaderboard.png
│       └── 06-menu.png
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
├── next.config.ts
├── package.json
├── package-lock.json
├── prisma.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

## ⚙️ Getting Started

Follow these steps to run SAVOR locally.

### Prerequisites

- Node.js 20.9 or newer
- PostgreSQL
- npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/injmam089/savor.git
cd savor
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root.

```env
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

Replace the placeholder values with your own configuration. Never commit real credentials, API keys, or production secrets.

### 4. Create the Database

Create a PostgreSQL database named:

```sql
CREATE DATABASE savor;
```

### 5. Push the Prisma Schema

```bash
npm run db:push
```

### 6. Seed Sample Data

```bash
npm run db:seed
```

### 7. Start the Development Server

```bash
npm run dev
```

Open your browser:

```text
http://localhost:3000
```

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Generate Prisma client and build the application |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push Prisma schema to the database |
| `npm run db:migrate` | Create and run database migrations |
| `npm run db:seed` | Seed sample database data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:reset` | Reset and reseed the database |

## 🎨 UI / UX

SAVOR is designed around a modern restaurant-focused visual experience.

- Premium interface design
- Responsive layouts
- Dark and light themes
- Mobile-friendly navigation
- Glassmorphism elements
- Gradient-based visual elements
- Smooth animations and transitions
- Framer Motion interactions
- Lucide icon system
- Accessible UI components

Designed to work across mobile devices, laptops, desktops, and larger screens.

## 🔮 Future Improvements

Potential areas for future development:

- Real-time order tracking
- Advanced restaurant analytics
- Multi-restaurant support
- Delivery partner management
- Push notifications
- Personalized food recommendations
- Loyalty and rewards program
- Expanded SAVOR RUSH gameplay
- Automated testing
- CI/CD integration
- Performance optimization

## 🎯 Project Highlights

SAVOR demonstrates practical full-stack application development through:

- Modern Next.js application architecture
- React and TypeScript development
- Database design and Prisma ORM
- Authentication and authorization
- Role-based access control
- Payment integration
- Form validation
- Restaurant order management
- Table reservation workflows
- Admin dashboard development
- Responsive UI development
- Gamification features

## 👨‍💻 Author

**Injmam Ansari**

BCA Student | Cybersecurity & Software Development

<p>
  <a href="https://github.com/injmam089">
    <img src="https://img.shields.io/badge/GitHub-injmam089-181717?style=for-the-badge&logo=github" alt="GitHub Profile">
  </a>
</p>

---

<p align="center">
  <strong>🍽️ SAVOR — Taste Beyond Ordinary</strong>
  <br>
  If you find this project interesting, consider giving the repository a ⭐
</p>
