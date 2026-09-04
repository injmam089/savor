import { PrismaClient, Role, OrderStatus, OrderType, PaymentMethod, PaymentStatus, ReservationStatus, TableLocation, NotificationType, DiscountType } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'bcryptjs';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/savor?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding SAVOR database...\n');

  // ─── Clean existing data ───────────────────────────────
  await prisma.notification.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.table.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.address.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleaned existing data\n');

  // ─── Users ─────────────────────────────────────────────
  const adminPassword = await hash('admin123', 12);
  const customerPassword = await hash('customer123', 12);

  const admin = await prisma.user.create({
    data: {
      name: 'Arjun Mehta',
      email: 'admin@savor.com',
      password: adminPassword,
      phone: '+91 98765 43210',
      role: Role.ADMIN,
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      name: 'Priya Sharma',
      email: 'priya@example.com',
      password: customerPassword,
      phone: '+91 87654 32109',
      role: Role.CUSTOMER,
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      name: 'Rahul Verma',
      email: 'rahul@example.com',
      password: customerPassword,
      phone: '+91 76543 21098',
      role: Role.CUSTOMER,
    },
  });

  console.log('✅ Created users (admin + 2 customers)\n');

  // ─── Addresses ─────────────────────────────────────────
  const address1 = await prisma.address.create({
    data: {
      userId: customer1.id,
      house: 'Flat 402, Sunrise Apartments',
      street: 'MG Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      landmark: 'Near Gateway of India',
      isDefault: true,
    },
  });

  await prisma.address.create({
    data: {
      userId: customer2.id,
      house: '12, Green Villa',
      street: 'Connaught Place',
      city: 'New Delhi',
      state: 'Delhi',
      postalCode: '110001',
      landmark: 'Opposite Central Park',
      isDefault: true,
    },
  });

  console.log('✅ Created addresses\n');

  // ─── Categories ────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: 'Starters', slug: 'starters', description: 'Begin your culinary journey with our exquisite appetizers', sortOrder: 1 },
    }),
    prisma.category.create({
      data: { name: 'Indian', slug: 'indian', description: 'Authentic flavors from across the Indian subcontinent', sortOrder: 2 },
    }),
    prisma.category.create({
      data: { name: 'Chinese', slug: 'chinese', description: 'Indo-Chinese favorites with a fiery twist', sortOrder: 3 },
    }),
    prisma.category.create({
      data: { name: 'Pizza', slug: 'pizza', description: 'Handcrafted pizzas with premium toppings', sortOrder: 4 },
    }),
    prisma.category.create({
      data: { name: 'Burgers', slug: 'burgers', description: 'Gourmet burgers stacked with flavor', sortOrder: 5 },
    }),
    prisma.category.create({
      data: { name: 'Main Course', slug: 'main-course', description: 'Hearty and satisfying main course dishes', sortOrder: 6 },
    }),
    prisma.category.create({
      data: { name: 'Desserts', slug: 'desserts', description: 'Sweet endings to a perfect meal', sortOrder: 7 },
    }),
    prisma.category.create({
      data: { name: 'Beverages', slug: 'beverages', description: 'Refreshing drinks and signature mocktails', sortOrder: 8 },
    }),
  ]);

  const [starters, indian, chinese, pizza, burgers, mainCourse, desserts, beverages] = categories;

  console.log('✅ Created 8 categories\n');

  // ─── Menu Items ────────────────────────────────────────
  const menuItems = await Promise.all([
    // Starters
    prisma.menuItem.create({
      data: {
        name: 'Paneer Tikka',
        slug: 'paneer-tikka',
        description: 'Succulent cubes of cottage cheese marinated in spiced yogurt, chargrilled to perfection in a tandoor oven.',
        price: 329,
        categoryId: starters.id,
        isVeg: true,
        rating: 4.7,
        ratingCount: 142,
        prepTime: 18,
        isFeatured: true,
        isPopular: true,
        ingredients: ['Paneer', 'Yogurt', 'Bell Peppers', 'Onions', 'Tandoori Masala', 'Lemon Juice'],
        allergens: ['Dairy'],
        image: '/images/paneer-tikka.jpg',
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Chicken Seekh Kebab',
        slug: 'chicken-seekh-kebab',
        description: 'Minced chicken mixed with aromatic spices and fresh herbs, grilled on skewers over charcoal.',
        price: 379,
        categoryId: starters.id,
        isVeg: false,
        rating: 4.8,
        ratingCount: 198,
        prepTime: 22,
        isFeatured: true,
        isPopular: true,
        ingredients: ['Chicken Mince', 'Onions', 'Ginger', 'Garlic', 'Green Chillies', 'Coriander', 'Garam Masala'],
        allergens: [],
        image: '/images/seekh-kebab.jpg',
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Crispy Corn',
        slug: 'crispy-corn',
        description: 'Golden fried corn kernels tossed with curry leaves, green chillies, and a hint of lime.',
        price: 249,
        categoryId: starters.id,
        isVeg: true,
        rating: 4.4,
        ratingCount: 89,
        prepTime: 12,
        ingredients: ['Sweet Corn', 'Corn Flour', 'Curry Leaves', 'Green Chillies', 'Lime'],
        allergens: ['Gluten'],
        image: '/images/crispy-corn.jpg',
      },
    }),

    // Indian
    prisma.menuItem.create({
      data: {
        name: 'Butter Chicken',
        slug: 'butter-chicken',
        description: 'Tender chicken pieces simmered in a rich, creamy tomato-based gravy with a perfect balance of spices.',
        price: 449,
        categoryId: indian.id,
        isVeg: false,
        rating: 4.9,
        ratingCount: 312,
        prepTime: 25,
        isFeatured: true,
        isPopular: true,
        ingredients: ['Chicken', 'Tomatoes', 'Butter', 'Cream', 'Cashews', 'Fenugreek', 'Garam Masala'],
        allergens: ['Dairy', 'Nuts'],
        image: '/images/butter-chicken.jpg',
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Dal Makhani',
        slug: 'dal-makhani',
        description: 'Black lentils slow-cooked overnight with butter, cream, and aromatic spices. A North Indian classic.',
        price: 329,
        categoryId: indian.id,
        isVeg: true,
        rating: 4.6,
        ratingCount: 178,
        prepTime: 20,
        isPopular: true,
        ingredients: ['Black Lentils', 'Kidney Beans', 'Butter', 'Cream', 'Tomatoes', 'Ginger', 'Garlic'],
        allergens: ['Dairy'],
        image: '/images/dal-makhani.jpg',
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Biryani Hyderabadi',
        slug: 'biryani-hyderabadi',
        description: 'Fragrant basmati rice layered with spiced chicken, caramelized onions, and saffron. Served with raita.',
        price: 499,
        categoryId: indian.id,
        isVeg: false,
        rating: 4.8,
        ratingCount: 267,
        prepTime: 35,
        isFeatured: true,
        isPopular: true,
        ingredients: ['Basmati Rice', 'Chicken', 'Saffron', 'Onions', 'Yogurt', 'Mint', 'Biryani Masala'],
        allergens: ['Dairy'],
        image: '/images/biryani.jpg',
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Palak Paneer',
        slug: 'palak-paneer',
        description: 'Fresh spinach puree with soft paneer cubes, seasoned with cumin, garlic, and a touch of cream.',
        price: 349,
        categoryId: indian.id,
        isVeg: true,
        rating: 4.5,
        ratingCount: 145,
        prepTime: 20,
        ingredients: ['Spinach', 'Paneer', 'Cream', 'Cumin', 'Garlic', 'Onions', 'Green Chillies'],
        allergens: ['Dairy'],
        image: '/images/palak-paneer.jpg',
      },
    }),

    // Chinese
    prisma.menuItem.create({
      data: {
        name: 'Hakka Noodles',
        slug: 'hakka-noodles',
        description: 'Stir-fried noodles with crunchy vegetables, soy sauce, and a smoky wok flavor.',
        price: 279,
        categoryId: chinese.id,
        isVeg: true,
        rating: 4.3,
        ratingCount: 156,
        prepTime: 15,
        isPopular: true,
        ingredients: ['Noodles', 'Cabbage', 'Carrots', 'Bell Peppers', 'Spring Onions', 'Soy Sauce'],
        allergens: ['Gluten', 'Soy'],
        image: '/images/hakka-noodles.jpg',
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Chilli Chicken',
        slug: 'chilli-chicken',
        description: 'Crispy fried chicken tossed in a spicy chilli-garlic sauce with peppers and onions.',
        price: 359,
        categoryId: chinese.id,
        isVeg: false,
        rating: 4.6,
        ratingCount: 203,
        prepTime: 20,
        isFeatured: true,
        ingredients: ['Chicken', 'Bell Peppers', 'Onions', 'Garlic', 'Soy Sauce', 'Chilli Sauce', 'Vinegar'],
        allergens: ['Gluten', 'Soy'],
        image: '/images/chilli-chicken.jpg',
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Manchurian Gravy',
        slug: 'manchurian-gravy',
        description: 'Deep-fried vegetable balls swimming in a tangy, spicy Manchurian gravy. An Indo-Chinese classic.',
        price: 289,
        categoryId: chinese.id,
        isVeg: true,
        rating: 4.4,
        ratingCount: 134,
        prepTime: 18,
        ingredients: ['Cabbage', 'Carrots', 'Corn Flour', 'Soy Sauce', 'Chilli Sauce', 'Garlic', 'Ginger'],
        allergens: ['Gluten', 'Soy'],
        image: '/images/manchurian.jpg',
      },
    }),

    // Pizza
    prisma.menuItem.create({
      data: {
        name: 'Margherita Supreme',
        slug: 'margherita-supreme',
        description: 'Classic Margherita elevated with fresh buffalo mozzarella, San Marzano tomatoes, and fragrant basil.',
        price: 399,
        categoryId: pizza.id,
        isVeg: true,
        rating: 4.5,
        ratingCount: 189,
        prepTime: 20,
        isPopular: true,
        ingredients: ['Pizza Dough', 'Mozzarella', 'Tomato Sauce', 'Fresh Basil', 'Olive Oil'],
        allergens: ['Gluten', 'Dairy'],
        image: '/images/margherita.jpg',
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Tandoori Chicken Pizza',
        slug: 'tandoori-chicken-pizza',
        description: 'Fusion pizza topped with tandoori chicken, red onions, peppers, and a drizzle of mint chutney.',
        price: 499,
        categoryId: pizza.id,
        isVeg: false,
        rating: 4.7,
        ratingCount: 167,
        prepTime: 22,
        isFeatured: true,
        ingredients: ['Pizza Dough', 'Tandoori Chicken', 'Mozzarella', 'Red Onions', 'Bell Peppers', 'Mint Chutney'],
        allergens: ['Gluten', 'Dairy'],
        image: '/images/tandoori-pizza.jpg',
      },
    }),

    // Burgers
    prisma.menuItem.create({
      data: {
        name: 'Classic Smash Burger',
        slug: 'classic-smash-burger',
        description: 'Double-smashed beef patties with melted cheddar, caramelized onions, pickles, and our secret sauce.',
        price: 349,
        categoryId: burgers.id,
        isVeg: false,
        rating: 4.6,
        ratingCount: 212,
        prepTime: 15,
        isPopular: true,
        ingredients: ['Beef Patty', 'Cheddar Cheese', 'Onions', 'Pickles', 'Lettuce', 'Tomato', 'Special Sauce'],
        allergens: ['Gluten', 'Dairy'],
        image: '/images/smash-burger.jpg',
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Spicy Paneer Burger',
        slug: 'spicy-paneer-burger',
        description: 'Crispy paneer patty with spicy mayo, jalapenos, fresh lettuce, and tangy coleslaw in a toasted bun.',
        price: 299,
        categoryId: burgers.id,
        isVeg: true,
        rating: 4.4,
        ratingCount: 98,
        prepTime: 12,
        ingredients: ['Paneer Patty', 'Jalapenos', 'Lettuce', 'Coleslaw', 'Spicy Mayo', 'Toasted Bun'],
        allergens: ['Gluten', 'Dairy'],
        image: '/images/paneer-burger.jpg',
      },
    }),

    // Main Course
    prisma.menuItem.create({
      data: {
        name: 'Mutton Rogan Josh',
        slug: 'mutton-rogan-josh',
        description: 'Slow-braised mutton in a deeply aromatic Kashmiri gravy with whole spices and a hint of fennel.',
        price: 599,
        categoryId: mainCourse.id,
        isVeg: false,
        rating: 4.8,
        ratingCount: 156,
        prepTime: 40,
        isFeatured: true,
        ingredients: ['Mutton', 'Yogurt', 'Kashmiri Chillies', 'Fennel', 'Ginger', 'Saffron', 'Whole Spices'],
        allergens: ['Dairy'],
        image: '/images/rogan-josh.jpg',
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Paneer Butter Masala',
        slug: 'paneer-butter-masala',
        description: 'Soft paneer cubes in a velvety tomato-cashew gravy, finished with butter and fresh cream.',
        price: 379,
        categoryId: mainCourse.id,
        isVeg: true,
        rating: 4.6,
        ratingCount: 189,
        prepTime: 20,
        isPopular: true,
        ingredients: ['Paneer', 'Tomatoes', 'Cashews', 'Butter', 'Cream', 'Fenugreek', 'Garam Masala'],
        allergens: ['Dairy', 'Nuts'],
        image: '/images/paneer-butter-masala.jpg',
      },
    }),

    // Desserts
    prisma.menuItem.create({
      data: {
        name: 'Gulab Jamun',
        slug: 'gulab-jamun',
        description: 'Soft, golden milk-solid dumplings soaked in warm rose-cardamom sugar syrup. Served warm.',
        price: 179,
        categoryId: desserts.id,
        isVeg: true,
        rating: 4.7,
        ratingCount: 234,
        prepTime: 10,
        isPopular: true,
        ingredients: ['Milk Solids', 'Sugar', 'Rose Water', 'Cardamom', 'Saffron'],
        allergens: ['Dairy'],
        image: '/images/gulab-jamun.jpg',
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Belgian Chocolate Lava Cake',
        slug: 'chocolate-lava-cake',
        description: 'Warm, gooey chocolate cake with a molten center, served with vanilla ice cream and berry compote.',
        price: 349,
        categoryId: desserts.id,
        isVeg: true,
        rating: 4.9,
        ratingCount: 178,
        prepTime: 15,
        isFeatured: true,
        ingredients: ['Dark Chocolate', 'Butter', 'Eggs', 'Flour', 'Sugar', 'Vanilla Ice Cream'],
        allergens: ['Dairy', 'Eggs', 'Gluten'],
        image: '/images/lava-cake.jpg',
      },
    }),

    // Beverages
    prisma.menuItem.create({
      data: {
        name: 'Mango Lassi',
        slug: 'mango-lassi',
        description: 'Chilled yogurt smoothie blended with ripe Alphonso mangoes, a touch of cardamom, and honey.',
        price: 179,
        categoryId: beverages.id,
        isVeg: true,
        rating: 4.5,
        ratingCount: 167,
        prepTime: 5,
        isPopular: true,
        ingredients: ['Yogurt', 'Alphonso Mango', 'Cardamom', 'Honey', 'Ice'],
        allergens: ['Dairy'],
        image: '/images/mango-lassi.jpg',
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Masala Chai',
        slug: 'masala-chai',
        description: 'Traditional Indian tea brewed with ginger, cardamom, cinnamon, and cloves. Rich and comforting.',
        price: 99,
        categoryId: beverages.id,
        isVeg: true,
        rating: 4.6,
        ratingCount: 289,
        prepTime: 5,
        ingredients: ['Black Tea', 'Milk', 'Ginger', 'Cardamom', 'Cinnamon', 'Cloves', 'Sugar'],
        allergens: ['Dairy'],
        image: '/images/masala-chai.jpg',
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Virgin Mojito',
        slug: 'virgin-mojito',
        description: 'Refreshing blend of muddled mint, lime juice, sugar syrup, and sparkling soda over crushed ice.',
        price: 199,
        categoryId: beverages.id,
        isVeg: true,
        rating: 4.3,
        ratingCount: 112,
        prepTime: 5,
        ingredients: ['Fresh Mint', 'Lime', 'Sugar Syrup', 'Soda Water', 'Crushed Ice'],
        allergens: [],
        image: '/images/virgin-mojito.jpg',
      },
    }),
  ]);

  console.log(`✅ Created ${menuItems.length} menu items\n`);

  // ─── Tables ────────────────────────────────────────────
  const tables = await Promise.all([
    prisma.table.create({ data: { number: 1, capacity: 2, location: TableLocation.INDOOR } }),
    prisma.table.create({ data: { number: 2, capacity: 2, location: TableLocation.INDOOR } }),
    prisma.table.create({ data: { number: 3, capacity: 4, location: TableLocation.INDOOR } }),
    prisma.table.create({ data: { number: 4, capacity: 4, location: TableLocation.INDOOR } }),
    prisma.table.create({ data: { number: 5, capacity: 6, location: TableLocation.INDOOR } }),
    prisma.table.create({ data: { number: 6, capacity: 4, location: TableLocation.OUTDOOR } }),
    prisma.table.create({ data: { number: 7, capacity: 6, location: TableLocation.OUTDOOR } }),
    prisma.table.create({ data: { number: 8, capacity: 8, location: TableLocation.OUTDOOR } }),
    prisma.table.create({ data: { number: 9, capacity: 4, location: TableLocation.BALCONY } }),
    prisma.table.create({ data: { number: 10, capacity: 2, location: TableLocation.BALCONY } }),
  ]);

  console.log(`✅ Created ${tables.length} tables\n`);

  // ─── Coupons ───────────────────────────────────────────
  await Promise.all([
    prisma.coupon.create({
      data: {
        code: 'WELCOME20',
        description: '20% off on your first order',
        discountType: DiscountType.PERCENTAGE,
        discountValue: 20,
        minOrder: 499,
        maxDiscount: 200,
        usageLimit: 100,
        isActive: true,
        expiresAt: new Date('2027-12-31'),
      },
    }),
    prisma.coupon.create({
      data: {
        code: 'SAVOR50',
        description: 'Flat ₹50 off on orders above ₹299',
        discountType: DiscountType.FIXED,
        discountValue: 50,
        minOrder: 299,
        usageLimit: 200,
        isActive: true,
        expiresAt: new Date('2027-06-30'),
      },
    }),
    prisma.coupon.create({
      data: {
        code: 'FEAST100',
        description: 'Flat ₹100 off on orders above ₹799',
        discountType: DiscountType.FIXED,
        discountValue: 100,
        minOrder: 799,
        usageLimit: 50,
        isActive: true,
        expiresAt: new Date('2027-03-31'),
      },
    }),
    prisma.coupon.create({
      data: {
        code: 'EXPIRED10',
        description: '10% off — expired coupon for testing',
        discountType: DiscountType.PERCENTAGE,
        discountValue: 10,
        minOrder: 199,
        maxDiscount: 100,
        usageLimit: 10,
        usedCount: 10,
        isActive: false,
        expiresAt: new Date('2024-01-01'),
      },
    }),
  ]);

  console.log('✅ Created 4 coupons\n');

  // ─── Sample Orders ─────────────────────────────────────
  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'SAV-2026-0001',
      userId: customer1.id,
      status: OrderStatus.DELIVERED,
      orderType: OrderType.DELIVERY,
      subtotal: 828,
      tax: 41.4,
      deliveryFee: 40,
      discount: 0,
      total: 909.4,
      addressId: address1.id,
      estimatedTime: 45,
      createdAt: new Date('2026-08-15T12:30:00'),
      items: {
        create: [
          { menuItemId: menuItems[3].id, name: 'Butter Chicken', price: 449, quantity: 1 },
          { menuItemId: menuItems[4].id, name: 'Dal Makhani', price: 329, quantity: 1 },
          { menuItemId: menuItems[20].id, name: 'Masala Chai', price: 99, quantity: 2 },
        ],
      },
      payment: {
        create: {
          method: PaymentMethod.ONLINE,
          status: PaymentStatus.COMPLETED,
          transactionId: 'pay_mock_001',
          amount: 909.4,
          paidAt: new Date('2026-08-15T12:31:00'),
        },
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'SAV-2026-0002',
      userId: customer1.id,
      status: OrderStatus.PREPARING,
      orderType: OrderType.DELIVERY,
      subtotal: 778,
      tax: 38.9,
      deliveryFee: 40,
      discount: 50,
      total: 806.9,
      addressId: address1.id,
      estimatedTime: 35,
      createdAt: new Date('2026-08-17T18:00:00'),
      items: {
        create: [
          { menuItemId: menuItems[5].id, name: 'Biryani Hyderabadi', price: 499, quantity: 1 },
          { menuItemId: menuItems[7].id, name: 'Hakka Noodles', price: 279, quantity: 1 },
        ],
      },
      payment: {
        create: {
          method: PaymentMethod.CASH_ON_DELIVERY,
          status: PaymentStatus.PENDING,
          amount: 806.9,
        },
      },
    },
  });

  const order3 = await prisma.order.create({
    data: {
      orderNumber: 'SAV-2026-0003',
      userId: customer2.id,
      status: OrderStatus.DELIVERED,
      orderType: OrderType.DINE_IN,
      subtotal: 1047,
      tax: 52.35,
      deliveryFee: 0,
      discount: 0,
      total: 1099.35,
      estimatedTime: 30,
      createdAt: new Date('2026-08-16T20:00:00'),
      items: {
        create: [
          { menuItemId: menuItems[0].id, name: 'Paneer Tikka', price: 329, quantity: 1 },
          { menuItemId: menuItems[15].id, name: 'Mutton Rogan Josh', price: 599, quantity: 1 },
          { menuItemId: menuItems[19].id, name: 'Mango Lassi', price: 179, quantity: 1 },
        ],
      },
      payment: {
        create: {
          method: PaymentMethod.ONLINE,
          status: PaymentStatus.COMPLETED,
          transactionId: 'pay_mock_003',
          amount: 1099.35,
          paidAt: new Date('2026-08-16T20:01:00'),
        },
      },
    },
  });

  console.log('✅ Created 3 sample orders\n');

  // ─── Sample Reservations ───────────────────────────────
  await prisma.reservation.create({
    data: {
      userId: customer1.id,
      tableId: tables[4].id, // Table 5, 6-seater indoor
      date: new Date('2026-08-20'),
      time: '19:30',
      guests: 4,
      seatingPreference: TableLocation.INDOOR,
      specialRequest: 'Birthday celebration, please arrange a small cake if possible.',
      status: ReservationStatus.CONFIRMED,
    },
  });

  await prisma.reservation.create({
    data: {
      userId: customer2.id,
      tableId: tables[8].id, // Table 9, balcony
      date: new Date('2026-08-22'),
      time: '20:00',
      guests: 2,
      seatingPreference: TableLocation.BALCONY,
      status: ReservationStatus.PENDING,
    },
  });

  console.log('✅ Created 2 reservations\n');

  // ─── Sample Reviews ────────────────────────────────────
  await Promise.all([
    prisma.review.create({
      data: {
        userId: customer1.id,
        menuItemId: menuItems[3].id, // Butter Chicken
        orderId: order1.id,
        rating: 5,
        comment: 'Absolutely divine! The butter chicken here is the best I have ever had. Creamy, rich, and perfectly spiced. Will definitely order again.',
        isApproved: true,
        helpful: 12,
      },
    }),
    prisma.review.create({
      data: {
        userId: customer1.id,
        menuItemId: menuItems[4].id, // Dal Makhani
        orderId: order1.id,
        rating: 4,
        comment: 'Rich and flavorful. The slow-cooking really makes a difference. Could use a tad more cream but otherwise excellent.',
        isApproved: true,
        helpful: 8,
      },
    }),
    prisma.review.create({
      data: {
        userId: customer2.id,
        menuItemId: menuItems[0].id, // Paneer Tikka
        orderId: order3.id,
        rating: 5,
        comment: 'Perfectly charred and smoky. The marinade is spot on. Came with amazing green chutney. Must try!',
        isApproved: true,
        helpful: 15,
      },
    }),
    prisma.review.create({
      data: {
        userId: customer2.id,
        menuItemId: menuItems[15].id, // Mutton Rogan Josh
        orderId: order3.id,
        rating: 5,
        comment: 'The mutton was fall-off-the-bone tender. The Kashmiri spices give it an incredible depth of flavor. Premium quality!',
        isApproved: true,
        helpful: 20,
      },
    }),
    prisma.review.create({
      data: {
        userId: customer2.id,
        menuItemId: menuItems[18].id, // Chocolate Lava Cake
        rating: 4,
        comment: 'Warm, gooey, and decadent. The vanilla ice cream pairing is perfect. Only wish the portion was slightly bigger.',
        isApproved: false, // Pending moderation
        helpful: 0,
      },
    }),
  ]);

  console.log('✅ Created 5 reviews\n');

  // ─── Sample Favorites ──────────────────────────────────
  await Promise.all([
    prisma.favorite.create({ data: { userId: customer1.id, menuItemId: menuItems[3].id } }),
    prisma.favorite.create({ data: { userId: customer1.id, menuItemId: menuItems[5].id } }),
    prisma.favorite.create({ data: { userId: customer1.id, menuItemId: menuItems[18].id } }),
    prisma.favorite.create({ data: { userId: customer2.id, menuItemId: menuItems[0].id } }),
    prisma.favorite.create({ data: { userId: customer2.id, menuItemId: menuItems[15].id } }),
  ]);

  console.log('✅ Created 5 favorites\n');

  // ─── Sample Notifications ──────────────────────────────
  await Promise.all([
    prisma.notification.create({
      data: {
        userId: customer1.id,
        title: 'Order Delivered! 🎉',
        message: 'Your order SAV-2026-0001 has been delivered. Enjoy your meal!',
        type: NotificationType.ORDER_STATUS,
        isRead: true,
        createdAt: new Date('2026-08-15T13:15:00'),
      },
    }),
    prisma.notification.create({
      data: {
        userId: customer1.id,
        title: 'Your order is being prepared 👨‍🍳',
        message: 'Your order SAV-2026-0002 is now being prepared by our chefs.',
        type: NotificationType.ORDER_STATUS,
        isRead: false,
        createdAt: new Date('2026-08-17T18:10:00'),
      },
    }),
    prisma.notification.create({
      data: {
        userId: customer1.id,
        title: 'Reservation Confirmed ✅',
        message: 'Your table reservation for Aug 20, 7:30 PM (4 guests) has been confirmed.',
        type: NotificationType.RESERVATION,
        isRead: false,
        createdAt: new Date('2026-08-17T10:00:00'),
      },
    }),
    prisma.notification.create({
      data: {
        userId: customer1.id,
        title: 'Special Offer! 🎁',
        message: 'Use code WELCOME20 to get 20% off on your next order. Minimum order ₹499.',
        type: NotificationType.OFFER,
        isRead: false,
        createdAt: new Date('2026-08-16T09:00:00'),
      },
    }),
    prisma.notification.create({
      data: {
        userId: customer2.id,
        title: 'Order Delivered! 🎉',
        message: 'Your order SAV-2026-0003 has been delivered. We hope you enjoyed dining with us!',
        type: NotificationType.ORDER_STATUS,
        isRead: true,
        createdAt: new Date('2026-08-16T21:00:00'),
      },
    }),
  ]);

  console.log('✅ Created 5 notifications\n');

  // ─── Summary ───────────────────────────────────────────
  console.log('═══════════════════════════════════════════');
  console.log('   🍽️  SAVOR Database Seeded Successfully!');
  console.log('═══════════════════════════════════════════');
  console.log('');
  console.log('  Users:          3 (1 admin, 2 customers)');
  console.log('  Categories:     8');
  console.log(`  Menu Items:     ${menuItems.length}`);
  console.log(`  Tables:         ${tables.length}`);
  console.log('  Coupons:        4');
  console.log('  Orders:         3');
  console.log('  Reservations:   2');
  console.log('  Reviews:        5');
  console.log('  Favorites:      5');
  console.log('  Notifications:  5');
  console.log('');
  console.log('  Admin Login:');
  console.log('    Email:    admin@savor.com');
  console.log('    Password: admin123');
  console.log('');
  console.log('  Customer Login:');
  console.log('    Email:    priya@example.com');
  console.log('    Password: customer123');
  console.log('');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
