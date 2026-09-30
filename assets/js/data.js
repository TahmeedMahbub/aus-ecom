/* ============================================================
   DATA LAYER — Bongo Curated
   Clean Launch Phase Data with Strikethrough Original Prices
   ============================================================ */

const SITE = {
  brandName: 'Bongo Curated',
  tagline: 'Bangladesh Made. Curated for Australia.',
  announcementMessage: 'Discover Bangladesh-made products, curated for Australia.',
  announcementLink: '#products-section',
  currency: 'A$',
  countryCode: 'AU',
};

const NAV_CATEGORIES = [
  {
    name: 'New Arrivals',
    slug: 'new-arrivals',
    filterCategory: 'all',
    megaMenu: null,
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    filterCategory: 'fashion',
    megaMenu: [
      {
        heading: "Men's Apparel",
        links: [
          { label: 'Heavyweight T-Shirts', slug: 'fashion' },
          { label: 'Pure Linen Shirts', slug: 'fashion' },
          { label: 'Piqué Polos', slug: 'fashion' },
          { label: 'Everyday Chinos & Trousers', slug: 'fashion' },
        ],
      },
      {
        heading: "Women's Apparel",
        links: [
          { label: 'Linen Tunics & Tops', slug: 'fashion' },
          { label: 'Flowing Midi Dresses', slug: 'fashion' },
          { label: 'Relaxed Trousers', slug: 'fashion' },
        ],
      },
    ],
  },
  {
    name: 'Home & Living',
    slug: 'home-living',
    filterCategory: 'home-decor',
    megaMenu: [
      {
        heading: 'Living & Dining',
        links: [
          { label: 'Nakshi Kantha Cushions', slug: 'home-decor' },
          { label: 'Terracotta & Ceramics', slug: 'home-decor' },
          { label: 'Artisan Wood Bowls', slug: 'home-decor' },
          { label: 'Handwoven Runners', slug: 'home-decor' },
        ],
      },
      {
        heading: 'Decorative Accents',
        links: [
          { label: 'Hammered Brass Vessels', slug: 'home-decor' },
          { label: 'Bamboo Lightware', slug: 'home-decor' },
          { label: 'Wall Decor', slug: 'home-decor' },
        ],
      },
    ],
  },
  {
    name: 'Jute',
    slug: 'jute',
    filterCategory: 'jute',
    megaMenu: [
      {
        heading: 'Golden Fiber Collection',
        links: [
          { label: 'Handwoven Jute Tote Bags', slug: 'jute' },
          { label: 'Braided Storage Baskets', slug: 'jute' },
          { label: 'Round Jute Floor Mats & Rugs', slug: 'jute' },
          { label: 'Eco Planter Covers', slug: 'jute' },
        ],
      },
    ],
  },
  {
    name: 'Handcrafted',
    slug: 'handicrafts',
    filterCategory: 'handicrafts',
    megaMenu: [
      {
        heading: 'Artisan Treasures',
        links: [
          { label: 'Heirloom Nakshi Kantha Quilts', slug: 'heritage' },
          { label: 'Handspun Jamdani Weaves', slug: 'heritage' },
          { label: 'Vintage Brass Collectibles', slug: 'handicrafts' },
        ],
      },
    ],
  },
  {
    name: 'Gifts',
    slug: 'gifts',
    filterCategory: 'lifestyle',
    megaMenu: null,
  },
  {
    name: 'Pre-order',
    slug: 'preorder',
    filterCategory: 'preorder',
    megaMenu: null,
  },
];

const HERO_SLIDES = [
  {
    id: 1,
    label: 'BANGLADESH MADE · CURATED FOR AUSTRALIA',
    headline: 'Bangladesh Made. Curated for Australia.',
    subtext: 'Discover thoughtfully selected fashion, home decor, jute, handcrafted pieces and gifts made in Bangladesh.',
    cta: 'Shop Collection',
    ctaLink: '#products-section',
    secondaryCta: 'Explore Categories',
    secondaryCtaLink: '#categories-section',
    image: 'assets/images/hero/hero-1.png',
  },
];

const CATEGORIES = [
  {
    name: 'Fashion',
    slug: 'fashion',
    desc: 'Everyday clothing, relaxed fits, linen pieces and modern essentials.',
    image: 'assets/images/products/shirt-white.png',
    gradient: 'linear-gradient(135deg, #7A5C43, #4A3322)',
  },
  {
    name: 'Home & Living',
    slug: 'home-decor',
    desc: 'Handcrafted accents, textiles, ceramics and natural materials for modern Australian spaces.',
    image: 'assets/images/products/nakshi-kantha.jpg',
    gradient: 'linear-gradient(135deg, #9C6644, #5E3821)',
  },
  {
    name: 'Jute',
    slug: 'jute',
    desc: 'Practical and beautiful products made from Bangladesh\'s natural golden fiber.',
    image: 'assets/images/lifestyle/jute-showcase.jpg',
    gradient: 'linear-gradient(135deg, #B58A55, #6E4D25)',
  },
  {
    name: 'Handcrafted',
    slug: 'handicrafts',
    desc: 'Distinctive pieces made by skilled Bangladeshi makers and craftspeople.',
    image: 'assets/images/products/artisan-brass.jpg',
    gradient: 'linear-gradient(135deg, #7D6B58, #473B2F)',
  },
  {
    name: 'Gifts',
    slug: 'lifestyle',
    desc: 'Thoughtful products made even more special with gift wrapping and personalised notes.',
    image: 'assets/images/products/leather-journal.jpg',
    gradient: 'linear-gradient(135deg, #606C38, #283618)',
  },
];

const PRODUCTS = [
  // Fashion
  {
    id: 1,
    name: 'Essential Heavyweight 240GSM Tee',
    desc: '100% Organic Combed Cotton · Relaxed Fit',
    price: 26.00,
    originalPrice: 38.00,
    image: 'assets/images/products/tshirt-olive.png',
    badge: 'new',
    category: 'fashion',
    colors: ['#5C6B4F', '#1A1A1A', '#F5F0E8'],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    outOfStockSizes: [],
    slug: 'essential-heavyweight-tee',
    availability: 'instock',
  },
  {
    id: 2,
    name: 'Pure Flax Linen Casual Shirt',
    desc: 'Breathable Pure Linen · Relaxed Collar',
    price: 39.00,
    originalPrice: 55.00,
    image: 'assets/images/products/shirt-white.png',
    badge: 'launch',
    category: 'fashion',
    colors: ['#FFFFFF', '#E8DDD0', '#8BA5B5'],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    outOfStockSizes: ['S'],
    slug: 'pure-linen-casual-shirt',
    availability: 'instock',
  },
  {
    id: 3,
    name: 'Tailored Everyday Chinos',
    desc: 'Stretch Twill Cotton · Clean Tapered Cut',
    price: 38.00,
    originalPrice: 52.00,
    image: 'assets/images/products/trousers-khaki.png',
    badge: 'lowstock',
    category: 'fashion',
    colors: ['#C4A882', '#1A1A1A', '#3A3A3A'],
    sizes: ['30', '32', '34', '36', '38'],
    outOfStockSizes: [],
    slug: 'tailored-everyday-chinos',
    availability: 'lowstock',
  },
  {
    id: 4,
    name: 'Piqué Cotton Pima Polo',
    desc: 'Refined Collar · Breathable Double Piqué Weave',
    price: 40.00,
    originalPrice: 58.00,
    image: 'assets/images/products/polo-navy.png',
    badge: 'preorder',
    category: 'fashion',
    colors: ['#1B2A4A', '#1A1A1A', '#5C6B4F'],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    outOfStockSizes: [],
    slug: 'pique-cotton-polo',
    availability: 'preorder',
  },

  // Home Decor
  {
    id: 6,
    name: 'Hand-Embroidered Nakshi Kantha Cushion',
    desc: 'Artisan Needlework on Sand Linen · 45x45cm Cover',
    price: 34.00,
    originalPrice: 48.00,
    image: 'assets/images/products/nakshi-kantha.jpg',
    badge: 'new',
    category: 'home-decor',
    colors: ['#D6C2A8', '#8C4F3B', '#384D48'],
    sizes: ['45x45 cm', '50x50 cm'],
    outOfStockSizes: [],
    slug: 'nakshi-kantha-cushion',
    availability: 'instock',
  },
  {
    id: 7,
    name: 'Hand-Carved Mango Wood Decorative Bowl',
    desc: 'Mango Wood · Natural Matte Finish',
    price: 42.00,
    originalPrice: 58.00,
    image: 'assets/images/products/artisan-brass.jpg',
    badge: 'launch',
    category: 'home-decor',
    colors: ['#A06F43', '#5E3A1C'],
    sizes: ['25 cm', '32 cm'],
    outOfStockSizes: [],
    slug: 'mango-wood-bowl',
    availability: 'instock',
  },

  // Jute
  {
    id: 8,
    name: 'Handwoven Golden Jute Round Tote',
    desc: '100% Bangladesh Golden Jute · Cotton Lining',
    price: 36.00,
    originalPrice: 49.00,
    image: 'assets/images/lifestyle/jute-showcase.jpg',
    badge: 'launch',
    category: 'jute',
    colors: ['#C8A870', '#3D342A'],
    sizes: ['Medium', 'Large'],
    outOfStockSizes: [],
    slug: 'golden-jute-round-tote',
    availability: 'instock',
  },
  {
    id: 9,
    name: 'Braided Jute Nesting Storage Baskets',
    desc: 'Natural Eco-Fiber · Handcrafted Storage',
    price: 54.00,
    originalPrice: 75.00,
    image: 'assets/images/lifestyle/furnitures.jpg',
    badge: 'lowstock',
    category: 'jute',
    colors: ['#D3B382', '#967850'],
    sizes: ['Set of 3 (S/M/L)'],
    outOfStockSizes: [],
    slug: 'braided-jute-nesting-baskets',
    availability: 'lowstock',
  },

  // Handicrafts
  {
    id: 10,
    name: 'Hammered Brass Vessel Set',
    desc: 'Solid Brass · Traditional Metal Craftsmanship',
    price: 38.00,
    originalPrice: 52.00,
    image: 'assets/images/products/artisan-brass.jpg',
    badge: 'new',
    category: 'handicrafts',
    colors: ['#C5A059', '#7D6331'],
    sizes: ['Standard Duo'],
    outOfStockSizes: [],
    slug: 'hammered-brass-tea-light-set',
    availability: 'instock',
  },

  // Gifts
  {
    id: 11,
    name: 'Handcrafted Leather Journal Set',
    desc: 'Full-Grain Leather · Recycled Jute Paper',
    price: 46.00,
    originalPrice: 65.00,
    image: 'assets/images/products/leather-journal.jpg',
    badge: 'launch',
    category: 'lifestyle',
    colors: ['#6B3E26', '#2B1E16'],
    sizes: ['A5 Journal + Pen'],
    outOfStockSizes: [],
    slug: 'handcrafted-leather-journal-set',
    availability: 'instock',
  },
];

const FOOTER_LINKS = {
  shop: [
    { label: 'All Products', href: '#products-section' },
    { label: 'New Arrivals', href: '#products-section' },
    { label: 'Fashion', href: '#products-section' },
    { label: 'Home & Living', href: '#home-living-section' },
    { label: 'Jute', href: '#jute-section' },
    { label: 'Handcrafted', href: '#products-section' },
    { label: 'Gifts', href: '#gifting-section' },
    { label: 'Pre-order', href: '#preorder-section' },
  ],
  help: [
    { label: 'Shipping & Delivery', href: '#' },
    { label: 'Returns & Exchanges', href: '#' },
    { label: 'Size Guide', href: '#' },
    { label: 'FAQ', href: '#' },
    { label: 'Contact Us', href: '#request-section' },
  ],
  about: [
    { label: 'Our Story', href: '#bangladesh-made-section' },
    { label: 'Made in Bangladesh', href: '#bangladesh-made-section' },
    { label: 'Request From Bangladesh', href: '#request-section' },
  ],
};