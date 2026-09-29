/* ============================================================
   DATA LAYER — Bongo Curated / Curated Bangladesh for Australia
   Structured data for dynamic rendering across Fashion, Home, Jute,
   Handicrafts, Lifestyle & Heritage.
   ============================================================ */

const SITE = {
  brandName: 'Bongo Curated',
  tagline: 'Premium Bangladesh-Made Lifestyle & Fashion for Australia',
  announcementMessage: 'Free Australia-wide delivery on orders over A$99 · Pre-order Batch 04 Now Open',
  announcementLink: '#preorder',
  currency: 'A$',
  countryCode: 'AU',
};

const NAV_CATEGORIES = [
  {
    name: 'New Drops',
    slug: 'new-drops',
    filterCategory: 'all',
    megaMenu: null,
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    filterCategory: 'fashion',
    megaMenu: [
      {
        heading: 'Men’s Apparel',
        links: [
          { label: 'Heavyweight T-Shirts', slug: 'fashion' },
          { label: 'Pure Linen Shirts', slug: 'fashion' },
          { label: 'Piqué Polos', slug: 'fashion' },
          { label: 'Everyday Chinos & Trousers', slug: 'fashion' },
        ],
      },
      {
        heading: 'Women’s Apparel',
        links: [
          { label: 'Linen Tunics & Tops', slug: 'fashion' },
          { label: 'Flowing Midi Dresses', slug: 'fashion' },
          { label: 'Relaxed Trousers', slug: 'fashion' },
        ],
      },
      {
        heading: 'Curated Edits',
        links: [
          { label: 'Pre-order Drop 04', slug: 'fashion' },
          { label: 'South Asian Fits Guide', slug: 'fashion' },
          { label: '100% Organic Cotton', slug: 'fashion' },
        ],
      },
    ],
  },
  {
    name: 'Home Decor',
    slug: 'home-decor',
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
    name: 'Handicrafts',
    slug: 'handicrafts',
    filterCategory: 'handicrafts',
    megaMenu: [
      {
        heading: 'Artisan Treasures',
        links: [
          { label: 'Heirloom Nakshi Kantha Quilts', slug: 'heritage' },
          { label: 'Handspun Jamdani Weaves', slug: 'heritage' },
          { label: 'Vintage Brass Collectibles', slug: 'handicrafts' },
          { label: 'Meet the Artisans', slug: 'handicrafts' },
        ],
      },
    ],
  },
  {
    name: 'Gifts',
    slug: 'lifestyle',
    filterCategory: 'lifestyle',
    megaMenu: null,
  },
  {
    name: 'Pre-Order',
    slug: 'preorder',
    filterCategory: 'all',
    megaMenu: null,
  },
];

const HERO_SLIDES = [
  {
    id: 1,
    label: 'Bangladesh Curated for Australia',
    headline: 'Authentic Craftsmanship. Modern Australian Living.',
    subtext: 'Discover a curated collection of premium fashion, handcrafted home decor, sustainable jute, and heirloom heritage pieces sourced directly from Bangladesh.',
    cta: 'Explore All Categories',
    ctaLink: '#categories-section',
    image: 'assets/images/hero/hero-home.jpg',
  },
  {
    id: 2,
    label: 'Home & Living Edit',
    headline: 'Warm Textures & Handcrafted Details for Your Home.',
    subtext: 'Elevate your spaces with hand-embroidered Nakshi Kantha cushions, terracotta ceramics, and golden jute accents built for modern Australian homes.',
    cta: 'Shop Home Decor',
    ctaLink: '#home-living-section',
    image: 'assets/images/lifestyle/jute-showcase.jpg',
  },
  {
    id: 3,
    label: 'Limited Pre-Order Batch 04',
    headline: 'Direct From Bangladesh Makers. Transparent Australian Pricing.',
    subtext: 'Pre-order from our limited quarterly batch and access exclusive artisan direct pricing with zero overproduction waste.',
    cta: 'View Pre-Order Drop',
    ctaLink: '#preorder-section',
    image: 'assets/images/hero/hero-1.png',
  },
];

const TRUST_ITEMS = [
  {
    icon: 'flag',
    title: 'Authentic Bangladesh Origin',
    desc: 'Direct ethical partnerships with master artisans & verified workshops',
  },
  {
    icon: 'truck',
    title: 'Fast Australia-Wide Delivery',
    desc: 'Dispatched from Melbourne hub with free delivery over A$99',
  },
  {
    icon: 'ruler',
    title: 'Tailored Fits & Finishes',
    desc: 'Clothing cut for South Asian fits + AU standard home aesthetics',
  },
  {
    icon: 'shield',
    title: 'Direct-to-Consumer Value',
    desc: 'No middleman markup — transparent pricing backed by 30-day returns',
  },
];

// Pre-order countdown target — 4 days from page load
const DROP_END_DATE = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 4);
  d.setHours(d.getHours() + 18);
  d.setMinutes(d.getMinutes() + 45);
  return d;
})();

const CATEGORIES = [
  {
    name: 'Fashion & Apparel',
    slug: 'fashion',
    itemCount: '24 Styles',
    desc: 'Premium tees, linen shirts, tailored chinos & tunics',
    image: 'assets/images/products/shirt-white.png',
    gradient: 'linear-gradient(135deg, #7A5C43, #4A3322)',
  },
  {
    name: 'Home Decor',
    slug: 'home-decor',
    itemCount: '18 Pieces',
    desc: 'Embroidered cushions, terracotta pottery & wood bowls',
    image: 'assets/images/products/nakshi-kantha.jpg',
    gradient: 'linear-gradient(135deg, #9C6644, #5E3821)',
  },
  {
    name: 'Jute & Natural',
    slug: 'jute',
    itemCount: '16 Items',
    desc: 'Sustainable golden fiber totes, floor mats & baskets',
    image: 'assets/images/lifestyle/jute-showcase.jpg',
    gradient: 'linear-gradient(135deg, #B58A55, #6E4D25)',
  },
  {
    name: 'Handicrafts',
    slug: 'handicrafts',
    itemCount: '14 Crafts',
    desc: 'Hammered brass vessels, wood carvings & bamboo lights',
    image: 'assets/images/products/artisan-brass.jpg',
    gradient: 'linear-gradient(135deg, #7D6B58, #473B2F)',
  },
  {
    name: 'Lifestyle & Gifts',
    slug: 'lifestyle',
    itemCount: '12 Gifts',
    desc: 'Leather journals, scented brass candles & stoneware',
    image: 'assets/images/products/leather-journal.jpg',
    gradient: 'linear-gradient(135deg, #606C38, #283618)',
  },
  {
    name: 'Traditional / Heritage',
    slug: 'heritage',
    itemCount: '8 Heirlooms',
    desc: 'Authentic Nakshi Kantha quilts & Jamdani wraps',
    image: 'assets/images/products/nakshi-kantha.jpg',
    gradient: 'linear-gradient(135deg, #A24857, #5C1D27)',
  },
];

const PRODUCTS = [
  // Fashion
  {
    id: 1,
    name: 'Essential Heavyweight 240GSM Tee',
    desc: '100% Organic Combed Cotton · Relaxed South Asian Fit',
    price: 26.00,
    originalPrice: 38.00,
    image: 'assets/images/products/tshirt-olive.png',
    badge: 'bestseller',
    category: 'fashion',
    colors: ['#5C6B4F', '#1A1A1A', '#F5F0E8'],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    outOfStockSizes: [],
    rating: 4.9,
    reviewsCount: 42,
    preorderProgress: 88,
    slug: 'essential-heavyweight-tee',
  },
  {
    id: 2,
    name: 'Pure Flax Linen Casual Shirt',
    desc: 'Breathable Pure Linen · Relaxed Collar · Dhaka Crafted',
    price: 39.00,
    originalPrice: 55.00,
    image: 'assets/images/products/shirt-white.png',
    badge: 'new',
    category: 'fashion',
    colors: ['#FFFFFF', '#E8DDD0', '#8BA5B5'],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    outOfStockSizes: ['S'],
    rating: 4.8,
    reviewsCount: 31,
    preorderProgress: 65,
    slug: 'pure-linen-casual-shirt',
  },
  {
    id: 3,
    name: 'Tailored Everyday Chinos',
    desc: 'Stretch Twill Cotton · Clean Tapered Cut',
    price: 38.00,
    originalPrice: 52.00,
    image: 'assets/images/products/trousers-khaki.png',
    badge: 'sale',
    category: 'fashion',
    colors: ['#C4A882', '#1A1A1A', '#3A3A3A'],
    sizes: ['30', '32', '34', '36', '38'],
    outOfStockSizes: [],
    rating: 4.7,
    reviewsCount: 28,
    preorderProgress: 92,
    slug: 'tailored-everyday-chinos',
  },
  {
    id: 4,
    name: 'Piqué Cotton Pima Polo',
    desc: 'Refined Collar · Breathable Double Piqué Weave',
    price: 32.00,
    originalPrice: 45.00,
    image: 'assets/images/products/polo-navy.png',
    badge: 'preorder',
    category: 'fashion',
    colors: ['#1B2A4A', '#1A1A1A', '#5C6B4F'],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    outOfStockSizes: [],
    rating: 4.9,
    reviewsCount: 19,
    preorderProgress: 74,
    slug: 'pique-cotton-polo',
  },
  {
    id: 5,
    name: 'Modern Flowing Midi Tunic Dress',
    desc: 'Lightweight Breathable Cotton-Linen · Contemporary Silhouette',
    price: 44.00,
    originalPrice: 62.00,
    image: 'assets/images/products/dress-teal.png',
    badge: 'new',
    category: 'fashion',
    colors: ['#3D7A8A', '#722F37', '#1A1A1A'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    outOfStockSizes: ['XS'],
    rating: 5.0,
    reviewsCount: 23,
    preorderProgress: 80,
    slug: 'modern-flowing-midi-dress',
  },

  // Home Decor
  {
    id: 6,
    name: 'Hand-Embroidered Nakshi Kantha Cushion',
    desc: 'Artisan Needlework on Sand Linen · 45x45cm Cover',
    price: 34.00,
    originalPrice: 48.00,
    image: 'assets/images/products/nakshi-kantha.jpg',
    badge: 'bestseller',
    category: 'home-decor',
    colors: ['#D6C2A8', '#8C4F3B', '#384D48'],
    sizes: ['45x45 cm', '50x50 cm'],
    outOfStockSizes: [],
    rating: 5.0,
    reviewsCount: 54,
    preorderProgress: 95,
    slug: 'nakshi-kantha-cushion',
  },
  {
    id: 7,
    name: 'Hand-Carved Mango Wood Decorative Bowl',
    desc: 'Sustainably Reclaimed Mango Wood · Natural Matte Wax Finish',
    price: 42.00,
    originalPrice: 58.00,
    image: 'assets/images/products/artisan-brass.jpg',
    badge: 'new',
    category: 'home-decor',
    colors: ['#A06F43', '#5E3A1C'],
    sizes: ['25 cm', '32 cm'],
    outOfStockSizes: [],
    rating: 4.8,
    reviewsCount: 17,
    preorderProgress: 60,
    slug: 'mango-wood-bowl',
  },

  // Jute Products
  {
    id: 8,
    name: 'Handwoven Golden Jute Round Tote',
    desc: '100% Bangladesh Golden Jute · Reinforced Handles & Cotton Lining',
    price: 36.00,
    originalPrice: 49.00,
    image: 'assets/images/lifestyle/jute-showcase.jpg',
    badge: 'bestseller',
    category: 'jute',
    colors: ['#C8A870', '#3D342A'],
    sizes: ['Medium', 'Large'],
    outOfStockSizes: [],
    rating: 4.9,
    reviewsCount: 68,
    preorderProgress: 94,
    slug: 'golden-jute-round-tote',
  },
  {
    id: 9,
    name: 'Braided Jute Nesting Storage Baskets (Set of 3)',
    desc: 'Natural Eco-Fiber · Handcrafted Home Organization',
    price: 54.00,
    originalPrice: 75.00,
    image: 'assets/images/hero/hero-home.jpg',
    badge: 'limited',
    category: 'jute',
    colors: ['#D3B382', '#967850'],
    sizes: ['Set of 3 (S/M/L)'],
    outOfStockSizes: [],
    rating: 4.9,
    reviewsCount: 39,
    preorderProgress: 86,
    slug: 'braided-jute-nesting-baskets',
  },

  // Handicrafts
  {
    id: 10,
    name: 'Hammered Brass Vessel & Tea Light Set',
    desc: 'Solid Brass · Traditional Metal Smithing in Dhamrai',
    price: 38.00,
    originalPrice: 52.00,
    image: 'assets/images/products/artisan-brass.jpg',
    badge: 'new',
    category: 'handicrafts',
    colors: ['#C5A059', '#7D6331'],
    sizes: ['Standard Duo'],
    outOfStockSizes: [],
    rating: 5.0,
    reviewsCount: 22,
    preorderProgress: 70,
    slug: 'hammered-brass-tea-light-set',
  },

  // Lifestyle & Gifts
  {
    id: 11,
    name: 'Handcrafted Vegetable-Tanned Leather Journal Set',
    desc: 'Full-Grain Leather · Recycled Jute Paper & Brass Stylus Pen',
    price: 46.00,
    originalPrice: 65.00,
    image: 'assets/images/products/leather-journal.jpg',
    badge: 'bestseller',
    category: 'lifestyle',
    colors: ['#6B3E26', '#2B1E16'],
    sizes: ['A5 Journal + Pen'],
    outOfStockSizes: [],
    rating: 5.0,
    reviewsCount: 47,
    preorderProgress: 91,
    slug: 'handcrafted-leather-journal-set',
  },

  // Traditional / Heritage
  {
    id: 12,
    name: 'Heirloom Masterpiece Nakshi Kantha Quilt',
    desc: 'Hand-Stitched Silk-Cotton Throw (Takes 6 Weeks per Piece)',
    price: 135.00,
    originalPrice: 185.00,
    image: 'assets/images/products/nakshi-kantha.jpg',
    badge: 'limited',
    category: 'heritage',
    colors: ['#EFE6D8 with Heritage Thread'],
    sizes: ['Queen Throw (150x220cm)'],
    outOfStockSizes: [],
    rating: 5.0,
    reviewsCount: 15,
    preorderProgress: 98,
    slug: 'heirloom-nakshi-kantha-quilt',
  },
];

const REVIEWS = [
  {
    id: 1,
    stars: 5,
    categoryBought: 'Home Decor & Jute',
    text: "The Nakshi Kantha cushion and jute tote look stunning in our Melbourne home. The quality and natural texture feel like high-end luxury homeware, but at such an honest price.",
    name: 'Sarah & Tariq',
    location: 'Melbourne, VIC',
    initial: 'S',
    verified: true,
  },
  {
    id: 2,
    stars: 5,
    categoryBought: 'Fashion & Shirts',
    text: "Finally, linen shirts and tees that actually fit South Asian body structures comfortably without having to get sleeves tailored in Sydney. The pre-order batch arrived right on time.",
    name: 'Fahim K.',
    location: 'Sydney, NSW',
    initial: 'F',
    verified: true,
  },
  {
    id: 3,
    stars: 5,
    categoryBought: 'Lifestyle Gifts',
    text: "I bought the leather journal and hammered brass tea light as a housewarming gift. Everyone asked where I got them! It feels amazing to support authentic Bangladeshi artisans from Australia.",
    name: 'Nusrat Jahan',
    location: 'Brisbane, QLD',
    initial: 'N',
    verified: true,
  },
  {
    id: 4,
    stars: 5,
    categoryBought: 'Jute Planters & Mats',
    text: "The golden jute braided baskets are durable, eco-friendly, and complement Australian coastal aesthetics perfectly. Top notch packaging and customer service.",
    name: 'Liam & Priya',
    location: 'Perth, WA',
    initial: 'L',
    verified: true,
  },
];

const BANGLADESH_MADE_PILLARS = [
  {
    number: '01',
    title: 'World-Class Craft & RMG',
    desc: 'Bangladesh is globally renowned for top-tier apparel manufacturing and centuries-old artisan traditions — now curated directly for Australian standards.',
  },
  {
    number: '02',
    title: 'Sustainable Golden Fiber',
    desc: 'Our jute products use 100% biodegradable natural golden jute sourced ethically from river delta farming communities in Faridpur and Rangpur.',
  },
  {
    number: '03',
    title: 'Fair Artisan Wages',
    desc: 'Every home decor and handicraft piece directly supports rural master weavers and women craft collectives with above-standard living wages.',
  },
  {
    number: '04',
    title: 'Zero-Waste Pre-Order Model',
    desc: 'By producing strictly in curated batches based on Australian pre-orders, we eliminate excess warehouse overstock and pass 30–40% savings to you.',
  },
];

const PREORDER_STEPS = [
  {
    step: '01',
    title: 'Select & Reserve',
    desc: 'Choose your curated fashion, home, or jute items during our limited drop window with exclusive launch pricing.',
  },
  {
    step: '02',
    title: 'Artisan Crafted in Bangladesh',
    desc: 'Our partnered master craftspeople and certified workshops hand-craft and stitch your pieces to order.',
  },
  {
    step: '03',
    title: 'Quality Inspected',
    desc: 'Each batch goes through rigorous inspection for fabric density, stitching precision, and export finishing.',
  },
  {
    step: '04',
    title: 'Express Australian Delivery',
    desc: 'Batch orders arrive at our Melbourne fulfillment hub and are dispatched tracked to your Australian address.',
  },
];

const FOOTER_LINKS = {
  shop: [
    { label: 'All Categories', href: '#categories-section' },
    { label: 'Fashion & Apparel', href: '#products-section' },
    { label: 'Home Decor & Living', href: '#home-living-section' },
    { label: 'Jute & Eco Products', href: '#jute-section' },
    { label: 'Handicrafts & Heritage', href: '#products-section' },
    { label: 'Lifestyle & Gifts', href: '#products-section' },
    { label: 'Pre-Order Drop 04', href: '#preorder-section' },
  ],
  help: [
    { label: 'Shipping & AU Delivery', href: '#' },
    { label: 'How Pre-Order Works', href: '#preorder-steps-section' },
    { label: 'Returns & 30-Day Guarantee', href: '#' },
    { label: 'Apparel Size & Fit Guide', href: '#' },
    { label: 'Contact Melbourne Support', href: '#' },
    { label: 'Track My Order', href: '#' },
  ],
  company: [
    { label: 'Our Story & Purpose', href: '#community-section' },
    { label: 'The Bangladesh Craft Story', href: '#community-section' },
    { label: 'Artisan Collectives', href: '#community-section' },
    { label: 'Sustainability & Golden Jute', href: '#jute-section' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
};
