// SAVOR RUSH — Game Definitions, Recipes, Ingredients & Progression

export interface GameIngredient {
  id: string;
  name: string;
  category: 'base' | 'protein' | 'veggie' | 'sauce' | 'garnish' | 'beverage';
  icon: string;
  color: string;
  key?: string; // Hotkey (e.g. '1', '2', 'q', 'w')
}

export interface GameRecipe {
  id: string;
  name: string;
  category: string;
  icon: string;
  image?: string;
  description: string;
  basePoints: number;
  baseCoins: number;
  baseTime: number; // in seconds
  ingredients: string[]; // sequence of ingredient IDs
  unlockLevel: number;
  unlockCost?: number;
  isSecret?: boolean;
}

export interface GameLevel {
  level: number;
  title: string;
  subtitle: string;
  targetScore: number;
  ordersToComplete: number;
  maxActiveOrders: number;
  timeMultiplier: number;
  availableRecipes: string[];
  eventChance: number; // 0 to 1
  rewardCoins: number;
}

export interface GameUpgrade {
  id: string;
  name: string;
  description: string;
  icon: string;
  cost: number;
  category: 'equipment' | 'booster' | 'theme' | 'recipe';
  effect: {
    type: 'score_boost' | 'extra_time' | 'extra_life' | 'coin_multiplier' | 'prep_speed' | 'theme_unlock';
    value: number;
  };
}

export interface CustomerType {
  id: string;
  name: string;
  avatar: string;
  patienceMultiplier: number;
  coinMultiplier: number;
  scoreMultiplier: number;
  isVip?: boolean;
  isSpeed?: boolean;
  dialogues: {
    enter: string;
    waiting: string;
    happy: string;
    angry: string;
  };
}

// ─── INGREDIENTS CATALOG ────────────────────────────────────

export const INGREDIENTS: Record<string, GameIngredient> = {
  // Bases & Breads
  bun_bottom: { id: 'bun_bottom', name: 'Burger Bun (Bottom)', category: 'base', icon: '🍞', color: '#D97706', key: '1' },
  bun_top: { id: 'bun_top', name: 'Toasted Top Bun', category: 'base', icon: '🍔', color: '#B45309', key: '2' },
  pizza_dough: { id: 'pizza_dough', name: 'Fresh Pizza Crust', category: 'base', icon: '🫓', color: '#FBBF24', key: '3' },
  basmati_rice: { id: 'basmati_rice', name: 'Basmati Rice', category: 'base', icon: '🍚', color: '#F3F4F6', key: '4' },
  boiled_noodles: { id: 'boiled_noodles', name: 'Wok Noodles', category: 'base', icon: '🍜', color: '#FDE047', key: '5' },
  naan_bread: { id: 'naan_bread', name: 'Butter Naan', category: 'base', icon: '🫓', color: '#F59E0B', key: '6' },
  crushed_ice: { id: 'crushed_ice', name: 'Crushed Ice Glass', category: 'base', icon: '🧊', color: '#67E8F9', key: '7' },
  lava_cake_sponge: { id: 'lava_cake_sponge', name: 'Warm Chocolate Sponge', category: 'base', icon: '🟫', color: '#451A03', key: '8' },
  milk_dumplings: { id: 'milk_dumplings', name: 'Golden Dumplings', category: 'base', icon: '🧆', color: '#D97706', key: '9' },

  // Proteins & Fillings
  paneer_patty: { id: 'paneer_patty', name: 'Crispy Paneer Patty', category: 'protein', icon: '🧀', color: '#F59E0B', key: 'q' },
  beef_patty: { id: 'beef_patty', name: 'Smashed Beef Patty', category: 'protein', icon: '🥩', color: '#78350F', key: 'w' },
  paneer_cubes: { id: 'paneer_cubes', name: 'Tandoori Paneer Cubes', category: 'protein', icon: '🧈', color: '#FCD34D', key: 'e' },
  tandoori_chicken: { id: 'tandoori_chicken', name: 'Smoky Tandoori Chicken', category: 'protein', icon: '🍗', color: '#EA580C', key: 'r' },
  chicken_mince: { id: 'chicken_mince', name: 'Spiced Chicken Skewer', category: 'protein', icon: '🍢', color: '#C2410C', key: 't' },
  black_lentils: { id: 'black_lentils', name: 'Slow-Cooked Black Dal', category: 'protein', icon: '🍲', color: '#1F2937', key: 'y' },
  crispy_chicken: { id: 'crispy_chicken', name: 'Wok Fried Chicken', category: 'protein', icon: '🍗', color: '#D97706', key: 'u' },
  sweet_corn: { id: 'sweet_corn', name: 'Crispy Golden Corn', category: 'protein', icon: '🌽', color: '#EAB308', key: 'i' },

  // Veggies & Toppings
  lettuce: { id: 'lettuce', name: 'Fresh Lettuce', category: 'veggie', icon: '🥬', color: '#22C55E', key: 'a' },
  tomato: { id: 'tomato', name: 'Sliced Tomatoes', category: 'veggie', icon: '🍅', color: '#EF4444', key: 's' },
  onion: { id: 'onion', name: 'Red Onions', category: 'veggie', icon: '🧅', color: '#A855F7', key: 'd' },
  bell_peppers: { id: 'bell_peppers', name: 'Bell Peppers', category: 'veggie', icon: '🫑', color: '#16A34A', key: 'f' },
  pickles: { id: 'pickles', name: 'Tangy Pickles', category: 'veggie', icon: '🥒', color: '#84CC16', key: 'g' },
  wok_veggies: { id: 'wok_veggies', name: 'Crunchy Wok Veggies', category: 'veggie', icon: '🥗', color: '#10B981', key: 'h' },
  fresh_mint: { id: 'fresh_mint', name: 'Fresh Mint Leaves', category: 'veggie', icon: '🌿', color: '#10B981', key: 'j' },
  spinach_puree: { id: 'spinach_puree', name: 'Spiced Palak Puree', category: 'veggie', icon: '🥬', color: '#15803D', key: 'k' },

  // Sauces, Cheeses & Gravies
  spicy_sauce: { id: 'spicy_sauce', name: 'Spicy Secret Mayo', category: 'sauce', icon: '🌶️', color: '#DC2626', key: 'z' },
  cheese: { id: 'cheese', name: 'Melted Cheddar', category: 'sauce', icon: '🧀', color: '#FBBF24', key: 'x' },
  mozzarella: { id: 'mozzarella', name: 'Buffalo Mozzarella', category: 'sauce', icon: '🧀', color: '#FEF08A', key: 'c' },
  tomato_sauce: { id: 'tomato_sauce', name: 'San Marzano Sauce', category: 'sauce', icon: '🥫', color: '#B91C1C', key: 'v' },
  makhani_gravy: { id: 'makhani_gravy', name: 'Rich Makhani Gravy', category: 'sauce', icon: '🥘', color: '#EA580C', key: 'b' },
  butter_cream: { id: 'butter_cream', name: 'Fresh Butter & Cream', category: 'sauce', icon: '🥛', color: '#FFFBEB', key: 'n' },
  soy_sauce: { id: 'soy_sauce', name: 'Dark Wok Soy Sauce', category: 'sauce', icon: '🫙', color: '#374151', key: 'm' },
  chilli_garlic_sauce: { id: 'chilli_garlic_sauce', name: 'Chilli Garlic Glaze', category: 'sauce', icon: '🔥', color: '#E11D48', key: ',' },

  // Garnishes & Sweets
  fresh_basil: { id: 'fresh_basil', name: 'Fresh Sweet Basil', category: 'garnish', icon: '🌱', color: '#22C55E' },
  olive_oil: { id: 'olive_oil', name: 'EVOO Drizzle', category: 'garnish', icon: '🫒', color: '#84CC16' },
  mint_chutney: { id: 'mint_chutney', name: 'Mint Coriander Dip', category: 'garnish', icon: '🟢', color: '#16A34A' },
  lemon_garnish: { id: 'lemon_garnish', name: 'Fresh Lime Wedge', category: 'garnish', icon: '🍋', color: '#FACC15' },
  saffron: { id: 'saffron', name: 'Royal Saffron Strands', category: 'garnish', icon: '✨', color: '#F59E0B' },
  caramelized_onions: { id: 'caramelized_onions', name: 'Crispy Birista Onions', category: 'garnish', icon: '🧅', color: '#78350F' },
  raita: { id: 'raita', name: 'Chilled Spiced Raita', category: 'garnish', icon: '🥣', color: '#F9FAFB' },
  spring_onions: { id: 'spring_onions', name: 'Chopped Spring Onions', category: 'garnish', icon: '🌱', color: '#4ADE80' },
  lime_juice: { id: 'lime_juice', name: 'Fresh Lime Squeeze', category: 'beverage', icon: '🍋', color: '#A3E635' },
  sugar_syrup: { id: 'sugar_syrup', name: 'Mint Infused Syrup', category: 'beverage', icon: '🍯', color: '#FDE047' },
  soda_water: { id: 'soda_water', name: 'Sparkling Soda Water', category: 'beverage', icon: '🫧', color: '#93C5FD' },
  yogurt: { id: 'yogurt', name: 'Thick Creamy Curd', category: 'beverage', icon: '🥣', color: '#F9FAFB' },
  alphonso_mango: { id: 'alphonso_mango', name: 'Alphonso Mango Pulp', category: 'beverage', icon: '🥭', color: '#FB923C' },
  cardamom_honey: { id: 'cardamom_honey', name: 'Cardamom Honey Drizzle', category: 'beverage', icon: '🍯', color: '#FBBF24' },
  molten_chocolate: { id: 'molten_chocolate', name: 'Belgian Molten Ganache', category: 'garnish', icon: '🍫', color: '#3E2723' },
  vanilla_ice_cream: { id: 'vanilla_ice_cream', name: 'Artisan Vanilla Scoop', category: 'garnish', icon: '🍨', color: '#FFFDD0' },
  rose_syrup: { id: 'rose_syrup', name: 'Warm Rose Cardamom Syrup', category: 'garnish', icon: '🌹', color: '#F43F5E' },
  saffron_pistachio: { id: 'saffron_pistachio', name: 'Pistachio Flakes', category: 'garnish', icon: '🌰', color: '#84CC16' },
};

// ─── RECIPES CATALOG ────────────────────────────────────────

export const RECIPES: Record<string, GameRecipe> = {
  // Starters & Drinks (Level 1)
  'virgin-mojito': {
    id: 'virgin-mojito',
    name: 'Virgin Mojito',
    category: 'Beverages',
    icon: '🍹',
    image: '/images/virgin-mojito.jpg',
    description: 'Refreshing blend of muddled mint, lime juice, syrup and sparkling soda.',
    basePoints: 120,
    baseCoins: 25,
    baseTime: 20,
    ingredients: ['crushed_ice', 'fresh_mint', 'lime_juice', 'sugar_syrup', 'soda_water'],
    unlockLevel: 1,
  },
  'crispy-corn': {
    id: 'crispy-corn',
    name: 'Crispy Golden Corn',
    category: 'Starters',
    icon: '🌽',
    image: '/images/crispy-corn.jpg',
    description: 'Golden fried corn tossed with lime and herbs.',
    basePoints: 130,
    baseCoins: 28,
    baseTime: 22,
    ingredients: ['sweet_corn', 'bell_peppers', 'onion', 'lemon_garnish'],
    unlockLevel: 1,
  },
  'paneer-tikka': {
    id: 'paneer-tikka',
    name: 'Tandoori Paneer Tikka',
    category: 'Starters',
    icon: '🍢',
    image: '/images/paneer-tikka.jpg',
    description: 'Chargrilled cottage cheese with bell peppers and onions.',
    basePoints: 160,
    baseCoins: 35,
    baseTime: 24,
    ingredients: ['paneer_cubes', 'bell_peppers', 'onion', 'lemon_garnish'],
    unlockLevel: 1,
  },
  'mango-lassi': {
    id: 'mango-lassi',
    name: 'Alphonso Mango Lassi',
    category: 'Beverages',
    icon: '🥭',
    image: '/images/mango-lassi.jpg',
    description: 'Chilled yogurt smoothie with luscious Alphonso mango pulp.',
    basePoints: 140,
    baseCoins: 30,
    baseTime: 20,
    ingredients: ['crushed_ice', 'yogurt', 'alphonso_mango', 'cardamom_honey'],
    unlockLevel: 1,
  },

  // Level 2: Burgers & Chinese
  'spicy-paneer-burger': {
    id: 'spicy-paneer-burger',
    name: 'Spicy Paneer Burger',
    category: 'Burgers',
    icon: '🍔',
    image: '/images/paneer-burger.jpg',
    description: 'Crispy spiced paneer with crunchy lettuce, tomato and secret mayo.',
    basePoints: 180,
    baseCoins: 40,
    baseTime: 25,
    ingredients: ['bun_bottom', 'paneer_patty', 'lettuce', 'tomato', 'spicy_sauce', 'bun_top'],
    unlockLevel: 2,
  },
  'classic-smash-burger': {
    id: 'classic-smash-burger',
    name: 'Classic Smash Burger',
    category: 'Burgers',
    icon: '🍔',
    image: '/images/smash-burger.jpg',
    description: 'Double smashed patty with cheddar cheese, caramelized onions and pickles.',
    basePoints: 200,
    baseCoins: 45,
    baseTime: 26,
    ingredients: ['bun_bottom', 'beef_patty', 'cheese', 'onion', 'pickles', 'bun_top'],
    unlockLevel: 2,
  },
  'hakka-noodles': {
    id: 'hakka-noodles',
    name: 'Smoky Hakka Noodles',
    category: 'Chinese',
    icon: '🍜',
    image: '/images/hakka-noodles.jpg',
    description: 'Stir-fried noodles with crunchy wok vegetables and savory soy sauce.',
    basePoints: 170,
    baseCoins: 38,
    baseTime: 22,
    ingredients: ['boiled_noodles', 'wok_veggies', 'soy_sauce', 'spring_onions'],
    unlockLevel: 2,
  },

  // Level 3: Pizzas & Starters
  'margherita-supreme': {
    id: 'margherita-supreme',
    name: 'Margherita Supreme Pizza',
    category: 'Pizza',
    icon: '🍕',
    image: '/images/margherita.jpg',
    description: 'Handcrafted pizza with San Marzano sauce, fresh mozzarella and sweet basil.',
    basePoints: 220,
    baseCoins: 50,
    baseTime: 26,
    ingredients: ['pizza_dough', 'tomato_sauce', 'mozzarella', 'fresh_basil', 'olive_oil'],
    unlockLevel: 3,
  },
  'tandoori-chicken-pizza': {
    id: 'tandoori-chicken-pizza',
    name: 'Tandoori Chicken Pizza',
    category: 'Pizza',
    icon: '🍕',
    image: '/images/tandoori-pizza.jpg',
    description: 'Fusion pizza with tandoori chicken, peppers and mint chutney drizzle.',
    basePoints: 250,
    baseCoins: 55,
    baseTime: 28,
    ingredients: ['pizza_dough', 'tomato_sauce', 'mozzarella', 'tandoori_chicken', 'bell_peppers', 'mint_chutney'],
    unlockLevel: 3,
  },
  'chilli-chicken': {
    id: 'chilli-chicken',
    name: 'Wok Chilli Chicken',
    category: 'Chinese',
    icon: '🥡',
    image: '/images/chilli-chicken.jpg',
    description: 'Crispy fried chicken tossed in hot chilli garlic glaze.',
    basePoints: 210,
    baseCoins: 46,
    baseTime: 24,
    ingredients: ['crispy_chicken', 'bell_peppers', 'onion', 'chilli_garlic_sauce', 'spring_onions'],
    unlockLevel: 3,
  },

  // Level 4: Royal Indian Mains & Curries
  'butter-chicken': {
    id: 'butter-chicken',
    name: 'Savor Butter Chicken',
    category: 'Indian',
    icon: '🍛',
    image: '/images/butter-chicken.jpg',
    description: 'Smoky chicken pieces in velvety makhani gravy with butter naan.',
    basePoints: 270,
    baseCoins: 60,
    baseTime: 28,
    ingredients: ['tandoori_chicken', 'makhani_gravy', 'butter_cream', 'naan_bread'],
    unlockLevel: 4,
  },
  'dal-makhani': {
    id: 'dal-makhani',
    name: 'Royal Dal Makhani',
    category: 'Indian',
    icon: '🍲',
    image: '/images/dal-makhani.jpg',
    description: 'Overnight simmered black lentils finished with cream and warm naan.',
    basePoints: 240,
    baseCoins: 52,
    baseTime: 25,
    ingredients: ['black_lentils', 'makhani_gravy', 'butter_cream', 'naan_bread'],
    unlockLevel: 4,
  },
  'biryani-hyderabadi': {
    id: 'biryani-hyderabadi',
    name: 'Hyderabadi Dum Biryani',
    category: 'Indian',
    icon: '🍚',
    image: '/images/biryani.jpg',
    description: 'Saffron fragrant basmati rice layered with spiced chicken, caramelized onions & raita.',
    basePoints: 300,
    baseCoins: 70,
    baseTime: 30,
    ingredients: ['basmati_rice', 'tandoori_chicken', 'saffron', 'caramelized_onions', 'raita'],
    unlockLevel: 4,
  },

  // Level 5+: Desserts & Grand Feasts
  'chocolate-lava-cake': {
    id: 'chocolate-lava-cake',
    name: 'Belgian Molten Lava Cake',
    category: 'Desserts',
    icon: '🍰',
    image: '/images/lava-cake.jpg',
    description: 'Warm chocolate cake with molten ganache and artisan vanilla ice cream.',
    basePoints: 220,
    baseCoins: 50,
    baseTime: 22,
    ingredients: ['lava_cake_sponge', 'molten_chocolate', 'vanilla_ice_cream'],
    unlockLevel: 5,
  },
  'gulab-jamun': {
    id: 'gulab-jamun',
    name: 'Royal Gulab Jamun',
    category: 'Desserts',
    icon: '🍯',
    image: '/images/gulab-jamun.jpg',
    description: 'Golden dumplings soaked in warm rose cardamom syrup topped with pistachios.',
    basePoints: 190,
    baseCoins: 42,
    baseTime: 20,
    ingredients: ['milk_dumplings', 'rose_syrup', 'saffron_pistachio'],
    unlockLevel: 5,
  },
};

// ─── LEVELS CONFIGURATION ───────────────────────────────────

export const GAME_LEVELS: GameLevel[] = [
  {
    level: 1,
    title: 'Level 1: The New Apprentice',
    subtitle: 'Learn the basics with fresh drinks & quick starters.',
    targetScore: 600,
    ordersToComplete: 4,
    maxActiveOrders: 2,
    timeMultiplier: 1.3,
    availableRecipes: ['virgin-mojito', 'mango-lassi', 'crispy-corn', 'paneer-tikka'],
    eventChance: 0.1,
    rewardCoins: 100,
  },
  {
    level: 2,
    title: 'Level 2: Fast Food Frenzy',
    subtitle: 'Burgers and sizzling noodles enter the queue. Pick up the pace!',
    targetScore: 1400,
    ordersToComplete: 6,
    maxActiveOrders: 2,
    timeMultiplier: 1.15,
    availableRecipes: ['virgin-mojito', 'paneer-tikka', 'spicy-paneer-burger', 'classic-smash-burger', 'hakka-noodles'],
    eventChance: 0.25,
    rewardCoins: 200,
  },
  {
    level: 3,
    title: 'Level 3: Pizza Station Surge',
    subtitle: '3 orders at once! Craft artisan pizzas and fiery wok chicken.',
    targetScore: 2400,
    ordersToComplete: 8,
    maxActiveOrders: 3,
    timeMultiplier: 1.0,
    availableRecipes: ['spicy-paneer-burger', 'classic-smash-burger', 'margherita-supreme', 'tandoori-chicken-pizza', 'chilli-chicken'],
    eventChance: 0.4,
    rewardCoins: 350,
  },
  {
    level: 4,
    title: 'Level 4: Royal Feast Rush',
    subtitle: 'Hyderabadi Biryani & Butter Chicken! Demanding guests with high stakes.',
    targetScore: 3600,
    ordersToComplete: 10,
    maxActiveOrders: 3,
    timeMultiplier: 0.88,
    availableRecipes: ['margherita-supreme', 'tandoori-chicken-pizza', 'butter-chicken', 'dal-makhani', 'biryani-hyderabadi'],
    eventChance: 0.55,
    rewardCoins: 500,
  },
  {
    level: 5,
    title: 'Level 5: Grand Master Chef',
    subtitle: 'Full menu open! Speed orders, VIP critiques, and sweet desserts.',
    targetScore: 5000,
    ordersToComplete: 12,
    maxActiveOrders: 4,
    timeMultiplier: 0.78,
    availableRecipes: [
      'spicy-paneer-burger',
      'margherita-supreme',
      'butter-chicken',
      'biryani-hyderabadi',
      'chocolate-lava-cake',
      'gulab-jamun',
      'mango-lassi'
    ],
    eventChance: 0.7,
    rewardCoins: 750,
  },
  {
    level: 6,
    title: 'Level 6: Endless Dinner Rush (Infinite)',
    subtitle: 'Test your maximum endurance and climb to the top of the global leaderboard!',
    targetScore: 999999,
    ordersToComplete: 9999,
    maxActiveOrders: 4,
    timeMultiplier: 0.7,
    availableRecipes: Object.keys(RECIPES),
    eventChance: 0.8,
    rewardCoins: 1000,
  },
];

// ─── CUSTOMER PERSONAS ──────────────────────────────────────

export const CUSTOMERS: CustomerType[] = [
  {
    id: 'regular',
    name: 'Foodie Arjun',
    avatar: '👨‍💼',
    patienceMultiplier: 1.0,
    coinMultiplier: 1.0,
    scoreMultiplier: 1.0,
    dialogues: {
      enter: 'Hey Chef! Can I get something delicious?',
      waiting: 'Smells wonderful, can’t wait!',
      happy: 'Perfection! SAVOR never disappoints!',
      angry: 'Too slow... I am leaving!',
    },
  },
  {
    id: 'critic',
    name: 'Chef Priya (Food Critic)',
    avatar: '👩‍🍳',
    patienceMultiplier: 0.85,
    coinMultiplier: 1.5,
    scoreMultiplier: 1.5,
    dialogues: {
      enter: 'Let’s see if your kitchen lives up to the Michelin hype.',
      waiting: 'Precision matters, chef.',
      happy: 'Exquisite technique. Five stars!',
      angry: 'Disastrous service. My review will reflect this.',
    },
  },
  {
    id: 'vip',
    name: 'Billionaire Vikram (VIP)',
    avatar: '🤵‍♂️',
    patienceMultiplier: 0.9,
    coinMultiplier: 3.0,
    scoreMultiplier: 2.5,
    isVip: true,
    dialogues: {
      enter: 'Money is no object, give me your finest dish!',
      waiting: 'Time is money, my friend.',
      happy: 'Sensational! Keep the change!',
      angry: 'Unacceptable. I am cancelling my reservation.',
    },
  },
  {
    id: 'student',
    name: 'Hungry Rahul',
    avatar: '🧢',
    patienceMultiplier: 1.15,
    coinMultiplier: 0.9,
    scoreMultiplier: 1.1,
    dialogues: {
      enter: 'Hey! Need some quick fuel for my exams!',
      waiting: 'Almost ready? My stomach is growling!',
      happy: 'Bro this hits the spot! Thank you!',
      angry: 'Man, I gotta run to class...',
    },
  },
  {
    id: 'speedster',
    name: 'Courier Aisha (Express)',
    avatar: '⚡',
    patienceMultiplier: 0.65,
    coinMultiplier: 2.0,
    scoreMultiplier: 2.0,
    isSpeed: true,
    dialogues: {
      enter: 'Express order! Need it in seconds!',
      waiting: 'Tick tock tick tock!',
      happy: 'Lightning fast! You rock!',
      angry: 'Missed delivery window! Argh!',
    },
  },
];

// ─── UPGRADES & SHOP ITEMS ──────────────────────────────────

export const UPGRADES: GameUpgrade[] = [
  {
    id: 'golden_spatula',
    name: 'Golden Master Spatula',
    description: 'Increases all base recipe scores by +25% permanently.',
    icon: '✨',
    cost: 300,
    category: 'equipment',
    effect: { type: 'score_boost', value: 0.25 },
  },
  {
    id: 'turbo_stove',
    name: 'Turbo Induction Range',
    description: 'Increases preparation speed and combo timer duration by +20%.',
    icon: '⚡',
    cost: 450,
    category: 'equipment',
    effect: { type: 'prep_speed', value: 0.2 },
  },
  {
    id: 'ice_clock',
    name: 'Cryo Kitchen Clock',
    description: 'Freezes customer patience decay, giving you +20% more time per ticket.',
    icon: '⏳',
    cost: 400,
    category: 'equipment',
    effect: { type: 'extra_time', value: 0.2 },
  },
  {
    id: 'master_apron',
    name: 'Master Chef Golden Apron',
    description: 'Start every run with +1 extra life (4 lives instead of 3).',
    icon: '🥼',
    cost: 600,
    category: 'equipment',
    effect: { type: 'extra_life', value: 1 },
  },
  {
    id: 'theme_cyberpunk',
    name: 'Cyberpunk Neon Kitchen',
    description: 'Electrify your kitchen with futuristic neon glow and synth vibes.',
    icon: '🌆',
    cost: 500,
    category: 'theme',
    effect: { type: 'theme_unlock', value: 1 },
  },
  {
    id: 'theme_royal',
    name: 'Royal Palace Bistro',
    description: 'Gilded gold counters and velvet dining room atmosphere.',
    icon: '👑',
    cost: 750,
    category: 'theme',
    effect: { type: 'theme_unlock', value: 1 },
  },
];
